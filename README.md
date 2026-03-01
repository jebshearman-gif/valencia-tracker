# ⚡ Valencia Sub-3 Fitness Tracker

A personal training tracker for marathon preparation.

---

## 🚀 Deploying to Vercel (One-Time Setup — ~20 minutes)

### Step 1: Put the code on GitHub

1. Go to **github.com** and create a free account (or sign in)
2. Click the **+** button (top right) → **New repository**
3. Name it `valencia-tracker`, leave it **Public**, click **Create repository**
4. You'll see a page with your empty repo. Click **uploading an existing file**
5. Drag and drop **all the files from this folder** into the upload area
   - Make sure to upload the folders too (`src/`, `public/`)
6. Scroll down, click **Commit changes**

### Step 2: Deploy with Vercel

1. Go to **vercel.com** and sign up with your GitHub account
2. Click **Add New → Project**
3. Find `valencia-tracker` in your repositories list and click **Import**
4. Leave all settings as default — Vercel auto-detects it's a Vite/React app
5. Click **Deploy**
6. In about 60 seconds you'll get a live URL like: `valencia-tracker.vercel.app`

### Step 3: Add to your iPhone Home Screen

1. Open the URL in **Safari** on your iPhone (must be Safari, not Chrome)
2. Tap the **Share button** (the box with an arrow at the bottom)
3. Scroll down and tap **"Add to Home Screen"**
4. Name it "Valencia" and tap **Add**
5. It will now appear on your home screen and open full-screen like a native app ✅

---

## ✏️ Updating the App Each Month (5 minutes)

**You only ever need to edit one file: `src/data.js`**

Everything — the weekly schedule, exercises, goals, meal plan — lives in that one file with clear comments explaining each section.

### To update for a new month:

1. Go to your GitHub repo → click on `src/data.js`
2. Click the **pencil icon** (Edit this file) in the top right
3. Make your changes:
   - Update `CURRENT_PLAN_LABEL` to the new month (e.g. `"April · Half Marathon Build"`)
   - Update `WEEK_PLAN` with the new weekly schedule
   - Update `MONTHLY_GOALS` with new targets
   - Add/remove exercises in `GYM_EXERCISES` as you progress
4. Scroll down and click **Commit changes**
5. Vercel automatically detects the change and redeploys in ~30 seconds
6. Refresh the app on your phone — done ✅

### Examples of monthly changes:

**Adding a new session type (e.g. a Tempo Tuesday in April):**
```js
{
  day: "TUE",
  label: "Tuesday",
  type: "Tempo Run",           // ← change this
  icon: "🔥",                  // ← change this
  colour: "#ff5e3a",
  details: "5km at 4:30/km effort after 2km warmup.",  // ← change this
  nutrition: "High Carb Day: Pre-fuel with pasta",
  tip: "This replaces the rest day as fitness improves."
}
```

**Adding a new gym exercise:**
```js
{
  name: "Hip Thrust",           // ← exercise name
  sets: "3 × 12",
  tempo: "2s up · 1s hold · 2s down",
  weight: "Barbell or bodyweight",
  goal: "Glute power for hills",
  searchTerm: "Hip Thrust for Runners Glute",
  youtubeSearch: "https://www.youtube.com/results?search_query=Hip+Thrust+for+Runners",
  groinFriendly: true,
  tip: "Drive through the heels, squeeze at the top."
}
```

**Updating goals for April:**
```js
export const MONTHLY_GOALS = [
  {
    id: "weight",
    label: "Weight Target",
    target: "79–80kg",          // ← update target
    unit: "kg",
    icon: "⚖️",
    description: "Continuing the drop"
  },
  // ... add new goals like half marathon time
];
```

---

## 📁 File Structure

```
valencia-tracker/
├── index.html              ← App entry point (don't touch)
├── package.json            ← Dependencies (don't touch)
├── vite.config.js          ← Build config (don't touch)
├── public/
│   ├── manifest.json       ← PWA settings (edit app name here if wanted)
│   └── icon.svg            ← App icon
└── src/
    ├── main.jsx            ← React entry (don't touch)
    ├── data.js             ← ✏️ YOUR FILE — edit this every month
    └── App.jsx             ← App code (only touch if adding features)
```

---

## 💡 Tips

- **Data persists** in your browser's localStorage — your logs, check-ins and goals are saved automatically
- **Weekly sessions reset** each Monday (new week = fresh tick-boxes)
- **All logs and check-ins accumulate** across months — you'll build a full history
- If you want to **add a new log type** (e.g. "Half Marathon Time"), just add it to the `LOG_TYPES` array in `data.js`
- The **Groin-Safe toggle** is a persistent setting — it remembers your preference

---

## 🆘 Troubleshooting

**App not updating after a GitHub edit?**
→ Wait 60 seconds and hard-refresh (pull down on mobile)

**Data disappeared?**
→ Data is stored in your browser. Clearing browser data will wipe it. The app doesn't sync across devices — each device has its own data.

**Want it on Android too?**
→ Open in Chrome → tap the three-dot menu → "Add to Home screen"
