/**
 * Blog articles. Each one becomes a static page at /blog/<slug>/.
 * TODO: have a Byayamshala coach review the advice before launch, and replace
 * the author line with a named coach if they want to sign an article.
 * Images: stills from Mixkit stock footage (free licence, commercial use).
 */

export type BlogBlock =
  | { type: "p"; text: string }
  | { type: "h2"; text: string }
  | { type: "ul"; items: string[] }
  | { type: "tip"; text: string };

export type BlogPost = {
  slug: string;
  title: string;
  excerpt: string;
  category: "Nutrition" | "Training" | "Online Coaching";
  readMinutes: number;
  /** ISO date (YYYY-MM-DD) */
  published: string;
  author: string;
  image: { src: string; alt: string; width: number; height: number };
  body: BlogBlock[];
};

const AUTHOR = "Byayamshala Coaching Team";

export const blogPosts: BlogPost[] = [
  {
    slug: "lose-weight-without-giving-up-dal-bhat",
    title: "How to Lose Weight Without Giving Up Dal Bhat",
    excerpt:
      "You don't need imported superfoods to lose weight. Small, steady changes to the meals you already love work better — and last longer.",
    category: "Nutrition",
    readMinutes: 5,
    published: "2026-11-20",
    author: AUTHOR,
    image: {
      src: "/images/blog/eat-nepali-lose-weight.jpg",
      alt: "Fresh vegetables — peppers, tomatoes, carrots and corn — on a wooden board",
      width: 1600,
      height: 900,
    },
    body: [
      {
        type: "p",
        text: "Many people believe that losing weight means saying goodbye to rice, roti and home cooking. In our experience coaching members in Itahari and abroad, the opposite is true: the plans that work are the ones built around food you already eat every day.",
      },
      { type: "h2", text: "Keep the plate, change the proportions" },
      {
        type: "p",
        text: "Dal bhat tarkari is already a balanced meal — the problem is usually the size of the rice portion and how much oil goes into the tarkari. Try this simple plate:",
      },
      {
        type: "ul",
        items: [
          "Half the plate: saag, tarkari and salad",
          "A quarter: dal, plus egg, chicken, fish, paneer or soybean for protein",
          "A quarter: rice or roti — about one cupped handful of rice",
          "Achar on the side, in a small spoon rather than a scoop",
        ],
      },
      { type: "h2", text: "Protein first, every meal" },
      {
        type: "p",
        text: "Protein keeps you full for longer and protects your muscle while you lose fat. A thicker dal, an extra egg, a bowl of curd, chana or a piece of chicken makes a real difference — and costs far less than supplements.",
      },
      { type: "h2", text: "Watch the hidden extras" },
      {
        type: "ul",
        items: [
          "Oil and ghee: measure with a spoon instead of pouring from the bottle",
          "Sugar in tea: cut it down gradually, half a spoon at a time",
          "Snacks: swap packaged chips and biscuits for roasted chana, fruit or makai",
          "Drinks: soft drinks and juices add up quickly — water and buttermilk don't",
        ],
      },
      {
        type: "tip",
        text: "Coach's tip: eat slowly and stop when you are comfortably full, not stuffed. It takes about 20 minutes for your stomach to tell your brain it has had enough.",
      },
      { type: "h2", text: "Consistency beats perfection" },
      {
        type: "p",
        text: "One festival meal or a family celebration won't undo your progress. What matters is what you eat most days. Aim for steady progress — around half a kilogram to one kilogram a week is a healthy pace for most people.",
      },
      {
        type: "p",
        text: "If you'd like a plan built around your own kitchen, routine and goals, our nutrition coaches can create one with you and adjust it every week.",
      },
    ],
  },
  {
    slug: "strength-training-for-beginners-first-four-weeks",
    title: "Strength Training for Beginners: Your First Four Weeks",
    excerpt:
      "Walking into the weights area for the first time can feel intimidating. Here's a simple, safe way to start — and what to expect each week.",
    category: "Training",
    readMinutes: 6,
    published: "2026-11-12",
    author: AUTHOR,
    image: {
      src: "/images/blog/strength-training-beginners.jpg",
      alt: "Athlete training with dumbbells in a dark, modern gym",
      width: 1600,
      height: 900,
    },
    body: [
      {
        type: "p",
        text: "Strength training is one of the best things you can do for your body at any age. It builds muscle, strengthens bones, supports your joints and makes everyday life easier. The good news: you don't need to lift heavy to start seeing results.",
      },
      { type: "h2", text: "Learn the five basic movements" },
      {
        type: "p",
        text: "Almost every exercise in the gym is a version of these five patterns. Master them with light weights first:",
      },
      {
        type: "ul",
        items: [
          "Squat — sitting back and standing up (goblet squats are a great start)",
          "Hinge — bending at the hips with a flat back (Romanian deadlifts)",
          "Push — pressing away from you (push-ups, dumbbell press)",
          "Pull — rowing towards you (dumbbell or cable rows)",
          "Carry — walking while holding weight (farmer's carries)",
        ],
      },
      { type: "h2", text: "Your four-week plan" },
      {
        type: "ul",
        items: [
          "Week 1 — Technique: two or three full-body sessions, light weights, 2 sets of 10 reps",
          "Week 2 — Rhythm: same exercises, aim for 3 sets and a steady, controlled pace",
          "Week 3 — Progress: add a little weight when the last reps feel easy",
          "Week 4 — Confidence: keep progressing gently and note what you lifted",
        ],
      },
      {
        type: "tip",
        text: "Coach's tip: finish each set feeling you could have done two more good reps. Ending with clean form builds strength faster than grinding out ugly reps.",
      },
      { type: "h2", text: "Rest is part of the training" },
      {
        type: "p",
        text: "Muscles grow while you recover, not while you train. Leave a day between full-body sessions, sleep seven to eight hours where you can, and eat enough protein. Some muscle soreness in the first weeks is normal; sharp pain is not — stop and ask a coach.",
      },
      { type: "h2", text: "Don't guess — get your form checked" },
      {
        type: "p",
        text: "The fastest way to progress safely is to have a coach watch your technique. At Byayamshala every new member starts with a fitness assessment, and our trainers can build your first program and correct your form in person or over a live video session.",
      },
    ],
  },
  {
    slug: "how-live-online-personal-training-works",
    title: "How Live Online Personal Training Works",
    excerpt:
      "Train with a real coach from your living room, hostel or hotel room. Here's what a live session looks like — and who it's best for.",
    category: "Online Coaching",
    readMinutes: 4,
    published: "2026-11-05",
    author: AUTHOR,
    image: {
      src: "/images/blog/live-online-coaching.jpg",
      alt: "Man training at home on a mat, following his coach on a tablet",
      width: 1280,
      height: 720,
    },
    body: [
      {
        type: "p",
        text: "Online personal training isn't a pre-recorded video you follow on your own. It's a live session with a certified coach who can see you, correct your form and adjust the workout in real time — wherever you are in the world.",
      },
      { type: "h2", text: "What you need" },
      {
        type: "ul",
        items: [
          "A phone, tablet or laptop with a camera",
          "A stable internet connection",
          "Enough floor space to lie down and step side to side",
          "Optional: a mat, resistance bands or a pair of dumbbells",
        ],
      },
      { type: "h2", text: "What a session looks like" },
      {
        type: "ul",
        items: [
          "Check-in: how you slept, how you feel, anything sore",
          "Warm-up: mobility and light movement to prepare your body",
          "Main workout: strength and conditioning planned around your goal",
          "Live coaching: your trainer watches every rep and adjusts as you go",
          "Cool-down and next steps: stretches, plus what to do before your next session",
        ],
      },
      {
        type: "tip",
        text: "Coach's tip: place your camera so your whole body is visible from the side. It makes it much easier for your coach to check your posture.",
      },
      { type: "h2", text: "Who it's best for" },
      {
        type: "p",
        text: "Live online coaching works especially well if you are busy, travel for work, live far from a good gym or are part of the Nepali community abroad. You get the accountability of a personal trainer without the commute — and the same coach every week.",
      },
      {
        type: "p",
        text: "Between sessions, you stay in touch with your coach on WhatsApp, track your workouts and meals, and receive an updated plan as you progress.",
      },
    ],
  },
  {
    slug: "simple-stretches-for-desk-job-back-pain",
    title: "5 Simple Stretches for Desk-Job Back Pain",
    excerpt:
      "Long hours at a desk or on your phone can leave your back and neck stiff. These five stretches take ten minutes and need no equipment.",
    category: "Training",
    readMinutes: 4,
    published: "2026-10-28",
    author: AUTHOR,
    image: {
      src: "/images/blog/stretches-desk-back-pain.jpg",
      alt: "Woman doing a seated side stretch on a mat at home",
      width: 1280,
      height: 720,
    },
    body: [
      {
        type: "p",
        text: "Sitting for long periods tightens the hips, rounds the shoulders and puts extra load on the lower back. A few minutes of movement every day can make a big difference to how you feel — at work and in the gym.",
      },
      { type: "h2", text: "The five stretches" },
      {
        type: "ul",
        items: [
          "Seated side stretch — reach one arm overhead and lean gently to the side, 30 seconds each way",
          "Cat–cow — on hands and knees, slowly round and then arch your back, 10 slow reps",
          "Child's pose — sit back on your heels with arms forward and breathe deeply for 45 seconds",
          "Hip flexor stretch — half-kneeling, push the hips forward gently, 30 seconds each side",
          "Chest opener — clasp your hands behind your back and lift the chest, 30 seconds",
        ],
      },
      {
        type: "tip",
        text: "Coach's tip: stretch to the point of gentle tension, never pain, and keep breathing slowly. Doing these every day matters more than doing them for a long time.",
      },
      { type: "h2", text: "Move more during the day" },
      {
        type: "ul",
        items: [
          "Stand up and walk for two minutes every hour",
          "Keep your screen at eye level so your neck stays neutral",
          "Take calls standing or walking when you can",
        ],
      },
      { type: "h2", text: "When to see a professional" },
      {
        type: "p",
        text: "If your pain is sharp, spreads down your leg or doesn't improve after a couple of weeks, see a doctor or physiotherapist. Once you're cleared, our coaches can build a strength plan that supports your back for the long term.",
      },
    ],
  },
];

export const getPost = (slug: string) => blogPosts.find((p) => p.slug === slug);

export const formatDate = (iso: string) =>
  new Date(`${iso}T00:00:00Z`).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  });
