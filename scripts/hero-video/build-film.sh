#!/usr/bin/env bash
# Hero background film, cut from licensed 4K stock footage.
#
#   bash scripts/hero-video/build-film.sh
#
# Source: Mixkit (mixkit.co) free stock videos — Mixkit Stock Video Free License:
# free for commercial and non-commercial use, no attribution required.
# Clips (downloaded at 2160p into clips/mixkit/, git-ignored):
#   52084  focused man on a training machine     (discipline)
#   52111  woman, dumbbell push press             (effort)
#   52091  man, barbell overhead press, low angle (strength)
#   52094  wide: clean & jerk in the full hall    (power / scale)
#   52102  woman standing tall, hands on hips     (confidence / transformation)
#
# Two cuts are rendered from the same 4K masters:
#   landscape 1728x1126 (Figma hero is 1728x1125) — subjects on the right third,
#                                                  clear of the bottom-left hero copy
#   portrait   720x1280 for phones                — subjects centred in the tall frame
# Output (public/videos):
#   hero-1728.{mp4,webm}  desktop / tablet        hero-960.{mp4,webm}  small landscape
#   hero-portrait.{mp4,webm}  phones              hero-poster*.{jpg,webp}  first frames
#
# Loop: the film starts XF seconds into shot 1 and ends by dissolving back into
# shot 1's opening, on one continuous push-in, so the last frame flows into the first.
set -euo pipefail
cd "$(dirname "$0")"

SRC=${SRC:-clips/mixkit}
TMP=${TMP:-.tmp/film}
OUT=${OUT:-../../public/videos}
FPS=24
XF=${XF:-0.5}      # dissolve between shots (s)
PUSH=0.045         # slow push-in across each shot

# id | in (s) | length (s) | portrait horizontal anchor (0 = left … 1 = right of the source)
SHOTS=(
  "52084|9.0|2.9|0.53"
  "52111|1.5|2.9|0.58"
  "52091|2.2|2.9|0.50"
  "52094|5.6|2.9|0.38"
  "52102|7.0|3.6|0.50"
)

mkdir -p "$TMP" "$OUT"
calc() { awk "BEGIN { printf \"%.3f\", $1 }"; }

# Commercial grade on top of the footage's own cool look: richer blacks, a touch
# more warmth in skin (highlights/mids), the brand's cyan kept in the shadows.
GRADE="eq=contrast=1.06:saturation=0.96:gamma=0.97,colorbalance=rs=-0.02:bs=0.04:rm=0.02:bm=-0.01:rh=0.02:bh=-0.02"

# render_master <tag> <W> <H> <zoom> <landscape|portrait>
render_master() {
  local tag=$1 W=$2 H=$3 ZOOM=$4 mode=$5 dir="$TMP/$1"
  mkdir -p "$dir"

  # conform <id> <in> <dur> <out> <anchor> [t0 total]
  # t0/total place this piece on its shot's push-in curve (split shots stay continuous).
  conform() {
    local t0=${6:-0} total=${7:-$3} cropx
    if [ "$mode" = landscape ]; then cropx=0; else cropx="(iw-$W)*$5"; fi
    ffmpeg -v error -y -ss "$2" -t "$3" -i "$SRC/$1.mp4" -an -vf "\
fps=$FPS,\
scale=w='trunc($H*16/9*($ZOOM+$PUSH*(t+$t0)/$total)/2)*2':h='trunc($H*($ZOOM+$PUSH*(t+$t0)/$total)/2)*2':eval=frame:flags=lanczos,\
crop=$W:$H:'$cropx':'(ih-$H)/2',\
$GRADE,setsar=1,format=yuv420p" \
      -c:v libx264 -preset veryfast -crf 12 "$4"
  }

  local DURS=() i ID IN DUR AX
  for i in "${!SHOTS[@]}"; do
    IFS='|' read -r ID IN DUR AX <<<"${SHOTS[$i]}"
    DURS+=("$DUR")
    if [ "$i" -eq 0 ]; then
      conform "$ID" "$(calc "$IN + $XF")" "$(calc "$DUR - $XF")" "$dir/s0.mp4" "$AX" "$XF" "$DUR"
      conform "$ID" "$IN" "$XF" "$dir/head.mp4" "$AX" 0 "$DUR"
    else
      conform "$ID" "$IN" "$DUR" "$dir/s$i.mp4" "$AX"
    fi
  done

  # s0 -> s1 -> s2 -> s3 -> s4 -> head, dissolves between each
  local T FC="" PREV="0" k OFF NEXT
  T=$(calc "${DURS[0]} - $XF")
  for k in 1 2 3 4 5; do
    OFF=$(calc "$T - $XF")
    NEXT="x$k"; [ "$k" -eq 5 ] && NEXT="joined"
    FC+="[$PREV][$k]xfade=transition=fade:duration=$XF:offset=$OFF[$NEXT];"
    PREV=$NEXT
    [ "$k" -lt 5 ] && T=$(calc "$T + ${DURS[$k]} - $XF")
  done
  FC+="[joined]vignette=angle=PI/5:mode=forward,noise=alls=4:allf=t,format=yuv420p[v]"
  ffmpeg -v error -y -i "$dir/s0.mp4" -i "$dir/s1.mp4" -i "$dir/s2.mp4" -i "$dir/s3.mp4" -i "$dir/s4.mp4" -i "$dir/head.mp4" \
    -filter_complex "$FC" -map "[v]" -c:v libx264 -preset slow -crf 10 "$dir/master.mp4"
  echo "$tag master: $(ffprobe -v error -show_entries format=duration -of csv=p=0 "$dir/master.mp4")s"
}

enc() { # master width out-base crf-h264 crf-vp9 maxrate
  local SCALE="scale=$2:-2:flags=lanczos"
  ffmpeg -v error -y -i "$1" -vf "$SCALE" -an -c:v libx264 -preset slow \
    -profile:v high -pix_fmt yuv420p -crf "$4" -maxrate "$6" -bufsize 8M -movflags +faststart "$OUT/$3.mp4"
  ffmpeg -v error -y -i "$1" -vf "$SCALE" -an -c:v libvpx-vp9 -b:v 0 -crf "$5" \
    -row-mt 1 -deadline good -cpu-used 2 -pix_fmt yuv420p "$OUT/$3.webm"
}
poster() { # master out-base
  ffmpeg -v error -y -i "$1" -frames:v 1 -q:v 2 "$OUT/$2.jpg"
  ffmpeg -v error -y -i "$1" -frames:v 1 -c:v libwebp -quality 82 "$OUT/$2.webp"
}

render_master landscape 1728 1126 1.15 landscape
render_master portrait 720 1280 1.00 portrait

enc "$TMP/landscape/master.mp4" 1728 hero-1728 24 36 4M
enc "$TMP/landscape/master.mp4" 960 hero-960 26 38 2M
enc "$TMP/portrait/master.mp4" 720 hero-portrait 25 37 2.5M
poster "$TMP/landscape/master.mp4" hero-poster
poster "$TMP/portrait/master.mp4" hero-poster-portrait

echo "Done:"; ls -la "$OUT"
