#!/usr/bin/env bash
# Builds the hero background loop from the shot clips in ./clips (see shots.json).
#
#   bash scripts/hero-video/build.sh
#
# Current production build (single Veo 3.1 shot, 0.7x interpolated slow motion,
# 9.4 s loop with a focus-breath seam):
#   SPEED=0.7 LEN=7.45 XF1=1.2 bash scripts/hero-video/build.sh
#
# Output (public/videos):
#   hero-1728.mp4 / .webm   desktop, 1728x1126 (Figma hero is 1728x1125)
#   hero-960.mp4  / .webm   mobile, 960x626 (served below 768px)
#   hero-poster.jpg / .webp first frame of the loop (poster + reduced-motion fallback)
#
# Loop trick: shot 01 is split in two. The video starts on its second half and
# ends on its first half, so the wrap-around is continuous footage, not a cut.
set -euo pipefail
cd "$(dirname "$0")"

CLIPS=${CLIPS:-clips}
TMP=${TMP:-.tmp}
OUT=${OUT:-../../public/videos}
W=1728; H=1126; FPS=24
XF=0.8        # crossfade length (s)
SEG=3.6       # visible length of shots 02-04 (s)
HALF=2.6      # each half of shot 01 (s)

# id | in-point (s) | horizontal crop anchor 0..1 (0=left, 1=right; keeps subjects right of centre)
SHOTS=(
  "01-ropes|0.5|0.62"
  "02-grip|0.6|0.55"
  "03-coaching|0.4|0.60"
  "04-strength|0.5|0.60"
)

mkdir -p "$TMP" "$OUT"
calc() { awk "BEGIN { printf \"%.3f\", $1 }"; }

# Natural commercial grade: deep blacks, slightly muted, a hint of the brand cyan in the shadows.
GRADE="eq=contrast=1.07:saturation=0.9:gamma=0.96,colorbalance=rs=-0.03:bs=0.05:rh=0.02:bh=-0.01"

# Playback speed. <1 = calm slow motion, rebuilt with motion-compensated
# interpolation (real in-between frames, no stutter). Durations below are SOURCE seconds.
SPEED=${SPEED:-1}
RETIME=""
if [ "$SPEED" != "1" ]; then
  RETIME="setpts=PTS/$SPEED,minterpolate=fps=$FPS:mi_mode=mci:mc_mode=aobmc:me_mode=bidir:vsbmc=1,"
fi

conform() { # src in dur out anchor
  # -ss/-t before -i limit the SOURCE range, so slow motion can extend it
  ffmpeg -v error -y -ss "$2" -t "$3" -i "$1" -an \
    -vf "${RETIME}fps=$FPS,scale=w='if(gt(a,$W/$H),-2,$W)':h='if(gt(a,$W/$H),$H,-2)':flags=lanczos,crop=$W:$H:'(iw-$W)*$5':'(ih-$H)/2',$GRADE,setsar=1,format=yuv420p" \
    -c:v libx264 -preset veryfast -crf 12 "$4"
}

FINISH="vignette=angle=PI/5:mode=forward,noise=alls=5:allf=t,format=yuv420p"
IFS='|' read -r ID IN ANCHOR <<<"${SHOTS[0]}"

if [ ! -f "$CLIPS/02-grip.mp4" ]; then
  # Single-shot loop: play shot 01 from just after IN to the end, then crossfade
  # into its own opening (IN..). The wrap lands exactly where playback began.
  # The camera framing differs at the two ends, so the crossfade is wrapped in a
  # "focus breath": the image softly defocuses (BLUR) and darkens (DIP), peaking
  # at the 50/50 mix, so it reads as a rack-focus beat instead of a double exposure.
  XF1=${XF1:-1.2}   # crossfade, OUTPUT seconds
  LEN=${LEN:-7.2}   # source seconds used from IN
  DIP=${DIP:-0.15}  # brightness dip at the seam (0 = none)
  BLUR=${BLUR:-14}  # peak defocus sigma at the seam
  HEAD_SRC=$(calc "$XF1 * $SPEED")
  BODY_SRC=$(calc "$LEN - $HEAD_SRC")
  BODY_OUT=$(calc "$BODY_SRC / $SPEED")
  OFF=$(calc "$BODY_OUT - $XF1")
  echo "Single-shot mode ($ID: ${LEN}s from ${IN}s at ${SPEED}x -> ${BODY_OUT}s loop)"
  conform "$CLIPS/$ID.mp4" "$(calc "$IN + $HEAD_SRC")" "$BODY_SRC" "$TMP/body.mp4" "$ANCHOR"
  conform "$CLIPS/$ID.mp4" "$IN" "$HEAD_SRC" "$TMP/head.mp4" "$ANCHOR"
  ffmpeg -v error -y -i "$TMP/body.mp4" -i "$TMP/head.mp4" -filter_complex \
    "[0][1]xfade=transition=fade:duration=$XF1:offset=$OFF,split[sharp][soft];\
[soft]gblur=sigma=$BLUR[blurred];\
[sharp][blurred]blend=all_expr='A+(B-A)*between(T\,$OFF\,$OFF+$XF1)*pow(max(0\,sin(PI*(T-$OFF)/$XF1))\,0.6)',\
eq=eval=frame:brightness='-$DIP*between(t\,$OFF\,$OFF+$XF1)*sin(PI*(t-$OFF)/$XF1)',$FINISH[v]" \
    -map "[v]" -c:v libx264 -preset slow -crf 10 "$TMP/master.mp4"
else
  conform "$CLIPS/$ID.mp4" "$IN" "$HALF" "$TMP/a1.mp4" "$ANCHOR"
  conform "$CLIPS/$ID.mp4" "$(calc "$IN + $HALF")" "$HALF" "$TMP/a2.mp4" "$ANCHOR"
  for i in 1 2 3; do
    IFS='|' read -r ID IN ANCHOR <<<"${SHOTS[$i]}"
    conform "$CLIPS/$ID.mp4" "$IN" "$SEG" "$TMP/s$i.mp4" "$ANCHOR"
  done

  # a2 -> s1 -> s2 -> s3 -> a1, crossfaded
  O1=$(calc "$HALF - $XF")
  O2=$(calc "$O1 + $SEG - $XF")
  O3=$(calc "$O2 + $SEG - $XF")
  O4=$(calc "$O3 + $SEG - $XF")
  ffmpeg -v error -y -i "$TMP/a2.mp4" -i "$TMP/s1.mp4" -i "$TMP/s2.mp4" -i "$TMP/s3.mp4" -i "$TMP/a1.mp4" \
    -filter_complex "\
[0][1]xfade=transition=fade:duration=$XF:offset=$O1[x1];\
[x1][2]xfade=transition=fade:duration=$XF:offset=$O2[x2];\
[x2][3]xfade=transition=fade:duration=$XF:offset=$O3[x3];\
[x3][4]xfade=transition=fade:duration=$XF:offset=$O4,$FINISH[v]" \
    -map "[v]" -c:v libx264 -preset slow -crf 10 "$TMP/master.mp4"
fi

# Web encodes — no audio track, fast-start, sized for quick loading.
enc() { # width out-base crf-h264 crf-vp9
  local SCALE="scale=$1:-2:flags=lanczos"
  ffmpeg -v error -y -i "$TMP/master.mp4" -vf "$SCALE" -an -c:v libx264 -preset slow \
    -profile:v high -pix_fmt yuv420p -crf "$3" -maxrate 3M -bufsize 6M -movflags +faststart "$OUT/$2.mp4"
  ffmpeg -v error -y -i "$TMP/master.mp4" -vf "$SCALE" -an -c:v libvpx-vp9 -b:v 0 -crf "$4" \
    -row-mt 1 -deadline good -cpu-used 2 -pix_fmt yuv420p "$OUT/$2.webm"
}
enc $W hero-1728 25 37
enc 960 hero-960 27 39

# Poster = the exact first frame, so the swap from poster to video is invisible.
ffmpeg -v error -y -i "$TMP/master.mp4" -frames:v 1 -q:v 3 "$OUT/hero-poster.jpg"
ffmpeg -v error -y -i "$TMP/master.mp4" -frames:v 1 -c:v libwebp -quality 80 "$OUT/hero-poster.webp"

echo "Done:"; ls -la "$OUT"
