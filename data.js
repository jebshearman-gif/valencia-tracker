// ============================================================
//  ✏️  YOUR TRAINING DATA — EDIT THIS FILE TO UPDATE THE APP
// ============================================================
//
//  HOW TO UPDATE EACH MONTH:
//  1. Change CURRENT_PLAN_LABEL to the new month name
//  2. Update WEEK_PLAN with your new weekly schedule
//  3. Update GYM_EXERCISES if you're progressing to new moves
//  4. Update MONTHLY_GOALS with your new targets
//  5. That's it — the whole app updates automatically
//
// ============================================================


// ── PLAN LABEL (shown in the header) ────────────────────────
export const CURRENT_PLAN_LABEL = "March · Valencia Sub-3";
export const PLAN_SUBTITLE = "82kg → 77kg · Master Plan";


// ── WEEKLY SCHEDULE ─────────────────────────────────────────
// Each entry = one day of the week, Mon to Sun.
// Fields:
//   day        Short label (MON, TUE etc.)
//   label      Full name (Monday)
//   type       Session name shown in the card
//   icon       Emoji for the session
//   colour     Accent hex colour for this day's card
//   details    Full description of the session
//   nutrition  What to eat that day
//   tip        A coaching tip shown when the card is expanded

export const WEEK_PLAN = [
  {
    day: "MON",
    label: "Monday",
    type: "Track Session",
    icon: "⚡",
    colour: "#ff5e3a",
    details: "Club Intervals – 800m to 1200m repeats. High intensity. Set the week's tone.",
    nutrition: "High Carb Day: 200g Pasta/Rice at dinner",
    tip: "Warm up with 1km easy jog + dynamic drills before hitting the intervals."
  },
  {
    day: "TUE",
    label: "Tuesday",
    type: "Full Rest",
    icon: "🛌",
    colour: "#8b9eb7",
    details: "Total recovery. No running, no gym. Foam roll & stretch if needed.",
    nutrition: "Rest Day: High Protein / Low Carb",
    tip: "Use this day to prep meals for the week and get 8+ hours sleep."
  },
  {
    day: "WED",
    label: "Wednesday",
    type: "Gym (Structural)",
    icon: "🏋️",
    colour: "#00d4aa",
    details: "5 Bulletproof Exercises (HSR Tempo). Build the chassis.",
    nutrition: "Strength Day: 150g+ Protein",
    tip: "Stick to 3-0-3 tempo strictly. Quality over weight."
  },
  {
    day: "THU",
    label: "Thursday",
    type: "Recovery Run",
    icon: "🐢",
    colour: "#5b9cf6",
    details: "6–8km Very Easy @ 5:30/km. This is NOT a training run – it's a flush.",
    nutrition: "Easy Day: Moderate Carbs (100g Rice)",
    tip: "If it feels too easy, it's probably the right pace. Zone 1 only."
  },
  {
    day: "FRI",
    label: "Friday",
    type: "Gym (Structural)",
    icon: "🏋️",
    colour: "#00d4aa",
    details: "5 Bulletproof Exercises (HSR Tempo). Second structural session.",
    nutrition: "Strength Day: 150g+ Protein",
    tip: "Compare to Wednesday – aim for the same weight or slightly more."
  },
  {
    day: "SAT",
    label: "Saturday",
    type: "Tempo / 5km",
    icon: "🏁",
    colour: "#f7c948",
    details: "2km Warmup → 5km Hard (or Parkrun) → 2km Cool Down. Record your time!",
    nutrition: "High Carb Day: Fuel the speed",
    tip: "Eat 2–3 hours before. Take a gel or banana 30 mins out."
  },
  {
    day: "SUN",
    label: "Sunday",
    type: "The Lollipop",
    icon: "🍭",
    colour: "#c07ef7",
    details: "12–15km Easy @ 5:20/km. Last 2km surge to 4:10/km.",
    nutrition: "Moderate Day: Post-run Recovery Meal",
    tip: "Don't skip the fast finish – this is where the aerobic gains happen."
  }
];


// ── GYM EXERCISES (Standard Mode) ────────────────────────────
// These are the main 5 Bulletproof exercises.
// Fields:
//   name          Exercise name
//   sets          e.g. "3 × 10"
//   tempo         Tempo description
//   weight        Suggested weight/equipment
//   goal          What this builds
//   searchTerm    Text shown on the YouTube button
//   youtubeSearch Full YouTube search URL
//   groinFriendly true = safe in groin mode, false = gets swapped out
//   tip           Form coaching tip

export const GYM_EXERCISES = [
  {
    name: "Goblet Squat",
    sets: "3 × 10",
    tempo: "3s down · 1s pause · 3s up",
    weight: "16–24kg Kettlebell",
    goal: "Quad & glute foundation",
    searchTerm: "Goblet Squat 3-0-3 Tempo HSR",
    youtubeSearch: "https://www.youtube.com/results?search_query=Goblet+Squat+3-0-3+Tempo+heavy+slow+resistance",
    groinFriendly: false,
    tip: "Keep chest tall, elbows inside knees, drive through heels."
  },
  {
    name: "Seated Calf Raise",
    sets: "3 × 15",
    tempo: "Slow & controlled",
    weight: "Use machine or plate on knees",
    goal: "Calf & shin armour",
    searchTerm: "Seated Calf Raise for Runners Soleus",
    youtubeSearch: "https://www.youtube.com/results?search_query=Seated+Calf+Raise+for+Runners+soleus",
    groinFriendly: true,
    tip: "Wait for the burn. Full range – all the way down, pause at top."
  },
  {
    name: "Romanian Deadlift (RDL)",
    sets: "3 × 10",
    tempo: "3s down · pause · 1s up",
    weight: "Light–moderate dumbbells",
    goal: "Hamstring health & hip hinge",
    searchTerm: "RDL for Hamstring Health Runners",
    youtubeSearch: "https://www.youtube.com/results?search_query=Romanian+Deadlift+for+runners+hamstring+health",
    groinFriendly: true,
    tip: "Back flat at all times. Feel the stretch, not the pain."
  },
  {
    name: "Tibialis Raise",
    sets: "3 × 20",
    tempo: "Fast up · 2s down",
    weight: "Bodyweight",
    goal: "Shin splint prevention",
    searchTerm: "Knees Over Toes Tibialis Raise",
    youtubeSearch: "https://www.youtube.com/results?search_query=Knees+Over+Toes+Tibialis+Raise",
    groinFriendly: true,
    tip: "Heels 12 inches from wall, back flat. Toes all the way to ceiling."
  },
  {
    name: "Single-Leg Wall Sit",
    sets: "3 × 45s per leg",
    tempo: "Static hold",
    weight: "Bodyweight",
    goal: "Patellar tendon stiffness",
    searchTerm: "Isometric Wall Sit Patellar Tendon",
    youtubeSearch: "https://www.youtube.com/results?search_query=isometric+wall+sit+patellar+tendon+runner",
    groinFriendly: false,
    tip: "Knee at 90°. No hands on thighs. Breathe steadily."
  }
];


// ── GYM EXERCISES (Groin-Safe Alternatives) ──────────────────
// Shown when the user toggles Groin-Safe Mode ON.
// Same fields as above, plus:
//   replaces    Name of the standard exercise this swaps out

export const GROIN_ALTERNATIVES = [
  {
    name: "Narrow Stance Leg Press",
    sets: "3 × 10",
    tempo: "3s Down / 3s Up",
    goal: "Quad Density (replaces Goblet Squat)",
    searchTerm: "Narrow Leg Press for Runners Quad",
    youtubeSearch: "https://www.youtube.com/results?search_query=Narrow+Stance+Leg+Press+quad+focus+runners",
    tip: "Feet narrow (6 inches apart) and LOW on the platform. Targets quads, zero groin stress.",
    replaces: "Goblet Squat"
  },
  {
    name: "Step-Ups (Box/Bench)",
    sets: "3 × 12 per leg",
    tempo: "Controlled, drive through heel",
    goal: "Unilateral quad strength",
    searchTerm: "Step Ups for Runners Quad",
    youtubeSearch: "https://www.youtube.com/results?search_query=Step+Ups+for+runners+quad+strength",
    tip: "Linear movement – no lateral stress on groin. Knee tracks straight over toe.",
    replaces: "Optional supplement"
  },
  {
    name: "Leg Curl Machine",
    sets: "3 × 12",
    tempo: "2s squeeze",
    goal: "Hamstrings (Groin-Safe)",
    searchTerm: "Leg Curl Machine Hamstring Runners",
    youtubeSearch: "https://www.youtube.com/results?search_query=Leg+Curl+Machine+hamstring+runners",
    tip: "Safe alternative to RDL if bending forward aggravates the groin.",
    replaces: "Romanian Deadlift (if needed)"
  },
  {
    name: "Copenhagen Plank (Regressed)",
    sets: "2 × 20s per side",
    tempo: "Static hold",
    goal: "Adductor strength – FIX the groin",
    searchTerm: "Copenhagen Plank Regressed Adductor",
    youtubeSearch: "https://www.youtube.com/results?search_query=Copenhagen+Plank+regressed+version+adductor",
    tip: "Top knee rests on bench, side-plank position. This FIXES the groin for the long term.",
    replaces: "Gym warm-up addition"
  }
];


// ── MONTHLY GOALS ────────────────────────────────────────────
// These appear on the Goals tab.
// Fields:
//   id          Unique key (used for storage — don't change mid-month)
//   label       Display name
//   target      The target description
//   unit        What unit to log (shown as placeholder)
//   icon        Emoji
//   description Short description

export const MONTHLY_GOALS = [
  {
    id: "weight",
    label: "Weight Target",
    target: "80.5–81kg",
    unit: "kg",
    icon: "⚖️",
    description: "Slow steady drop from 82kg"
  },
  {
    id: "shin",
    label: "Shin/Quad Health",
    target: "Zero pain after 10km",
    unit: "pain score (1–10)",
    icon: "🦵",
    description: "No 'world of pain' after runs"
  },
  {
    id: "parkrun",
    label: "5km Parkrun Time",
    target: "Personal benchmark set",
    unit: "mm:ss",
    icon: "🏁",
    description: "Record a time for summer speed blocks"
  }
];


// ── FINAL MONTH TARGETS (shown at bottom of Goals tab) ───────
export const FINAL_TARGETS = [
  { text: "Weight: 80.5–81kg (slow, steady drop)", icon: "⚖️" },
  { text: "Shins/Quads: Zero 'world of pain' after 10km", icon: "🦵" },
  { text: "Benchmark: Recorded 5km time for summer speed blocks", icon: "🏁" },
];


// ── MEAL PLAN ────────────────────────────────────────────────
// Shown on the Nutrition tab.

export const MEALS = [
  {
    meal: "Breakfast",
    items: "3 Eggs + ½ Avocado + 100g Smoked Salmon OR 200g Skyr/Greek Yogurt + 40g Oats",
    rule: "30g+ Protein to start the day"
  },
  {
    meal: "Lunch",
    items: "150g Chicken/Tuna/Turkey + Large Green Salad + 100g Sweet Potato/Rice",
    rule: "The Fuel Bridge. Keep the salad huge."
  },
  {
    meal: "Snack",
    items: "Protein Shake (Water/Almond Milk) OR 1 Apple + Handful of Almonds",
    rule: "Emergency Brake for afternoon hunger"
  },
  {
    meal: "Dinner",
    items: "200g Steak/Salmon/White Fish + Unlimited Roasted Broccoli/Peppers",
    rule: "The Repair Shop. Add 100g carbs on run days."
  },
  {
    meal: "Hydration",
    items: "2–3L Water + 1 Electrolyte Tab (Precision Hydration)",
    rule: "Cramp Prevention."
  }
];


// ── CARB GUIDE (shown in Nutrition tab) ──────────────────────
export const CARB_GUIDE = [
  { type: "Track (Mon)",          carbs: "High – 200g pasta/rice at dinner",   color: "#ff5e3a" },
  { type: "Rest (Tue)",           carbs: "Low – skip the extra carbs",          color: "#8b9eb7" },
  { type: "Gym (Wed/Fri)",        carbs: "Moderate – 100g sweet potato or rice",color: "#00d4aa" },
  { type: "Recovery Run (Thu)",   carbs: "Moderate – 100g rice at dinner",      color: "#5b9cf6" },
  { type: "Tempo/Parkrun (Sat)",  carbs: "High – fuel the speed",               color: "#f7c948" },
  { type: "Lollipop (Sun)",       carbs: "Moderate + recovery meal after",      color: "#c07ef7" },
];


// ── LOG TYPE OPTIONS ──────────────────────────────────────────
// These appear in the Log tab dropdown.
// Add new types here as you progress (e.g. "Half Marathon Time").

export const LOG_TYPES = [
  "Weight",
  "5km Time",
  "10km Time",
  "Half Marathon Time",
  "Recovery Run Pace",
  "Gym Weight (Goblet Squat)",
  "Gym Weight (Leg Press)",
  "Gym Weight (RDL)",
  "Shin Pain (1–10)",
  "Groin Pain (1–10)",
  "Energy Level (1–10)",
  "Other"
];
