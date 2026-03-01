import { useState, useEffect } from "react";
import {
  CURRENT_PLAN_LABEL, PLAN_SUBTITLE,
  WEEK_PLAN, GYM_EXERCISES, GROIN_ALTERNATIVES,
  MONTHLY_GOALS, FINAL_TARGETS, MEALS, CARB_GUIDE, LOG_TYPES
} from "./data.js";

// ─── HELPERS ─────────────────────────────────────────────────────────────────

const getWeekKey = () => {
  const now = new Date();
  const startOfYear = new Date(now.getFullYear(), 0, 1);
  const week = Math.ceil(((now - startOfYear) / 86400000 + startOfYear.getDay() + 1) / 7);
  return `week-${now.getFullYear()}-${week}`;
};

const getTodayDayIndex = () => {
  const d = new Date().getDay();
  return d === 0 ? 6 : d - 1;
};

const getEnergyColor = (e) => {
  if (e >= 4) return "#00d4aa";
  if (e >= 3) return "#f7c948";
  return "#ff5e3a";
};

const getSorenessColor = (s) => {
  if (s <= 2) return "#00d4aa";
  if (s <= 3) return "#f7c948";
  return "#ff5e3a";
};

// Simple persistent storage with localStorage fallback
const store = {
  async get(key) {
    if (window.storage) {
      try { return await window.storage.get(key); } catch(e) {}
    }
    const v = localStorage.getItem(key);
    return v ? { value: v } : null;
  },
  async set(key, value) {
    if (window.storage) {
      try { return await window.storage.set(key, value); } catch(e) {}
    }
    localStorage.setItem(key, value);
  }
};

// ─── MAIN APP ────────────────────────────────────────────────────────────────

export default function App() {
  const [tab, setTab] = useState("dashboard");
  const [weekKey] = useState(getWeekKey());
  const [completedSessions, setCompletedSessions] = useState({});
  const [groinMode, setGroinMode] = useState(false);
  const [goals, setGoals] = useState({});
  const [logs, setLogs] = useState([]);
  const [checkins, setCheckins] = useState([]);
  const [checkinInput, setCheckinInput] = useState({ energy: 3, soreness: 3, notes: "" });
  const [logInput, setLogInput] = useState({ type: "", value: "", notes: "", date: new Date().toISOString().slice(0, 10) });
  const [goalInputs, setGoalInputs] = useState({});
  const [loaded, setLoaded] = useState(false);
  const [expandedExercise, setExpandedExercise] = useState(null);
  const [toastMsg, setToastMsg] = useState("");

  useEffect(() => {
    async function load() {
      try { const r = await store.get(`sessions-${weekKey}`); if (r) setCompletedSessions(JSON.parse(r.value)); } catch(e) {}
      try { const r = await store.get("groin-mode"); if (r) setGroinMode(JSON.parse(r.value)); } catch(e) {}
      try { const r = await store.get("goals"); if (r) setGoals(JSON.parse(r.value)); } catch(e) {}
      try { const r = await store.get("logs"); if (r) setLogs(JSON.parse(r.value)); } catch(e) {}
      try { const r = await store.get("checkins"); if (r) setCheckins(JSON.parse(r.value)); } catch(e) {}
      setLoaded(true);
    }
    load();
  }, [weekKey]);

  const showToast = (msg) => { setToastMsg(msg); setTimeout(() => setToastMsg(""), 2500); };

  const toggleSession = async (dayIdx) => {
    const next = { ...completedSessions, [dayIdx]: !completedSessions[dayIdx] };
    setCompletedSessions(next);
    await store.set(`sessions-${weekKey}`, JSON.stringify(next));
    if (!completedSessions[dayIdx]) showToast("✅ Session ticked off! Great work.");
  };

  const saveGroinMode = async (val) => {
    setGroinMode(val);
    await store.set("groin-mode", JSON.stringify(val));
    showToast(val ? "🛡️ Groin-friendly mode ON" : "💪 Standard mode ON");
  };

  const saveGoal = async (id, value) => {
    const next = { ...goals, [id]: value };
    setGoals(next);
    await store.set("goals", JSON.stringify(next));
    showToast("🎯 Goal saved!");
  };

  const addLog = async () => {
    if (!logInput.type || !logInput.value) return;
    const entry = { ...logInput, id: Date.now(), timestamp: new Date().toISOString() };
    const next = [entry, ...logs];
    setLogs(next);
    await store.set("logs", JSON.stringify(next));
    setLogInput({ type: "", value: "", notes: "", date: new Date().toISOString().slice(0, 10) });
    showToast("📊 Logged!");
  };

  const addCheckin = async () => {
    const entry = { ...checkinInput, id: Date.now(), date: new Date().toLocaleDateString("en-GB"), timestamp: new Date().toISOString() };
    const next = [entry, ...checkins];
    setCheckins(next);
    await store.set("checkins", JSON.stringify(next));
    setCheckinInput({ energy: 3, soreness: 3, notes: "" });
    showToast("💬 Check-in saved! Keep going 🔥");
  };

  const completedCount = Object.values(completedSessions).filter(Boolean).length;
  const todayIdx = getTodayDayIndex();

  if (!loaded) return (
    <div style={s.loadingScreen}>
      <div style={{ fontSize: "3rem", animation: "spin 1s linear infinite" }}>⚡</div>
      <p style={{ color: "#00d4aa", fontFamily: "'Bebas Neue', cursive", fontSize: "1.5rem", letterSpacing: "0.1em" }}>LOADING YOUR PLAN...</p>
    </div>
  );

  const tabs = [
    { id: "dashboard", label: "Dashboard", icon: "📊" },
    { id: "plan",      label: "Weekly Plan", icon: "📅" },
    { id: "gym",       label: "Gym",         icon: "🏋️" },
    { id: "goals",     label: "Goals",       icon: "🎯" },
    { id: "log",       label: "Log",         icon: "📝" },
    { id: "checkin",   label: "Check-In",    icon: "💬" },
    { id: "nutrition", label: "Nutrition",   icon: "🥗" },
  ];

  return (
    <div style={s.root}>
      <style>{globalCSS}</style>

      {toastMsg && <div style={s.toast}>{toastMsg}</div>}

      <header style={s.header}>
        <div>
          <div style={s.headerTitle}>{CURRENT_PLAN_LABEL}</div>
          <div style={s.headerSub}>{PLAN_SUBTITLE}</div>
        </div>
        <div style={s.headerStats}>
          <div style={s.statPill}>
            <span style={{ color: "#00d4aa", fontFamily: "'Bebas Neue',cursive", fontSize: "1.4rem" }}>{completedCount}</span>
            <span style={{ color: "#5b7a99", fontSize: "0.7rem" }}>/ {WEEK_PLAN.length} DONE</span>
          </div>
          <div style={{ ...s.statPill, background: groinMode ? "#00d4aa22" : "transparent", border: groinMode ? "1px solid #00d4aa" : "1px solid #1e2d42" }}>
            <button onClick={() => saveGroinMode(!groinMode)} className="groin-btn">
              {groinMode ? "🛡️ Groin-Safe" : "🏋️ Standard"}
            </button>
          </div>
        </div>
      </header>

      <nav style={s.nav}>
        {tabs.map(t => (
          <button key={t.id} className="tab-btn" onClick={() => setTab(t.id)}
            style={{ ...s.navBtn, ...(tab === t.id ? s.navBtnActive : {}) }}>
            <span style={{ fontSize: "1rem" }}>{t.icon}</span>
            <span style={{ fontSize: "0.65rem", letterSpacing: "0.04em" }}>{t.label}</span>
          </button>
        ))}
      </nav>

      <main style={s.main} className="fade-in" key={tab}>
        {tab === "dashboard" && <Dashboard completedSessions={completedSessions} toggleSession={toggleSession} todayIdx={todayIdx} goals={goals} logs={logs} checkins={checkins} groinMode={groinMode} completedCount={completedCount} />}
        {tab === "plan"      && <WeeklyPlan completedSessions={completedSessions} toggleSession={toggleSession} todayIdx={todayIdx} />}
        {tab === "gym"       && <GymSection groinMode={groinMode} expandedExercise={expandedExercise} setExpandedExercise={setExpandedExercise} />}
        {tab === "goals"     && <GoalsSection goals={goals} goalInputs={goalInputs} setGoalInputs={setGoalInputs} saveGoal={saveGoal} logs={logs} />}
        {tab === "log"       && <LogSection logs={logs} logInput={logInput} setLogInput={setLogInput} addLog={addLog} />}
        {tab === "checkin"   && <CheckInSection checkins={checkins} checkinInput={checkinInput} setCheckinInput={setCheckinInput} addCheckin={addCheckin} />}
        {tab === "nutrition" && <NutritionSection />}
      </main>
    </div>
  );
}

// ─── DASHBOARD ───────────────────────────────────────────────────────────────

function Dashboard({ completedSessions, toggleSession, todayIdx, goals, logs, checkins, groinMode, completedCount }) {
  const today = WEEK_PLAN[todayIdx];
  const lastCheckin = checkins[0];
  const recentLogs = logs.slice(0, 5);

  return (
    <div style={s.section}>
      <div style={s.card}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "12px" }}>
          <span style={{ fontSize: "1.8rem" }}>{today.icon}</span>
          <div>
            <div style={{ color: "#5b7a99", fontSize: "0.7rem", letterSpacing: "0.1em", textTransform: "uppercase" }}>TODAY · {today.label.toUpperCase()}</div>
            <div style={{ fontFamily: "'Bebas Neue',cursive", fontSize: "1.6rem", color: "#e0e8f8", letterSpacing: "0.05em" }}>{today.type}</div>
          </div>
        </div>
        <p style={{ color: "#8aa4bf", fontSize: "0.9rem", margin: "0 0 12px 0" }}>{today.details}</p>
        <div style={s.nutritionTag}>{today.nutrition}</div>
        <div style={{ background: "#0d1a28", borderRadius: "8px", padding: "10px 14px", margin: "12px 0" }}>
          <span style={{ color: "#f7c948", fontSize: "0.75rem" }}>💡 TIP: </span>
          <span style={{ color: "#8aa4bf", fontSize: "0.82rem" }}>{today.tip}</span>
        </div>
        <button className="tick-btn" onClick={() => toggleSession(todayIdx)}
          style={{ ...s.primaryBtn, background: completedSessions[todayIdx] ? "#0d3d2e" : "#00d4aa", color: completedSessions[todayIdx] ? "#00d4aa" : "#0a0f1e", border: completedSessions[todayIdx] ? "1px solid #00d4aa" : "none", width: "100%" }}>
          {completedSessions[todayIdx] ? "✓ COMPLETED — TAP TO UNDO" : "MARK TODAY AS DONE"}
        </button>
      </div>

      <div style={s.card}>
        <div style={s.sectionLabel}>THIS WEEK</div>
        <div style={{ display: "flex", gap: "8px", marginTop: "12px", flexWrap: "wrap" }}>
          {WEEK_PLAN.map((d, i) => (
            <div key={i} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "4px" }}>
              <div onClick={() => toggleSession(i)} style={{
                width: "42px", height: "42px", borderRadius: "10px", cursor: "pointer",
                background: completedSessions[i] ? "#00d4aa22" : i === todayIdx ? "#1e2d42" : "#0d1220",
                border: completedSessions[i] ? "2px solid #00d4aa" : i === todayIdx ? `2px solid ${d.colour}` : "2px solid #1a2438",
                display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.1rem", transition: "all 0.2s"
              }}>
                {completedSessions[i] ? "✓" : d.icon}
              </div>
              <span style={{ fontSize: "0.6rem", color: i === todayIdx ? d.colour : "#3d5572", letterSpacing: "0.05em" }}>{d.day}</span>
            </div>
          ))}
        </div>
        <div style={{ marginTop: "16px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px" }}>
            <span style={{ color: "#5b7a99", fontSize: "0.75rem" }}>SESSIONS COMPLETE</span>
            <span style={{ color: "#00d4aa", fontFamily: "'Bebas Neue',cursive", fontSize: "1rem" }}>{completedCount} / {WEEK_PLAN.length}</span>
          </div>
          <div style={{ background: "#0d1220", borderRadius: "4px", height: "6px", overflow: "hidden" }}>
            <div style={{ background: "linear-gradient(90deg,#00d4aa,#5b9cf6)", height: "6px", borderRadius: "4px", width: `${(completedCount / WEEK_PLAN.length) * 100}%`, transition: "width 0.5s ease" }} />
          </div>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
        <div style={s.miniCard}>
          <div style={{ color: "#5b7a99", fontSize: "0.65rem", letterSpacing: "0.1em" }}>LAST ENERGY</div>
          <div style={{ fontFamily: "'Bebas Neue',cursive", fontSize: "2rem", color: lastCheckin ? getEnergyColor(lastCheckin.energy) : "#3d5572" }}>
            {lastCheckin ? `${lastCheckin.energy}/5` : "—"}
          </div>
          <div style={{ color: "#3d5572", fontSize: "0.7rem" }}>{lastCheckin ? lastCheckin.date : "No check-ins yet"}</div>
        </div>
        <div style={s.miniCard}>
          <div style={{ color: "#5b7a99", fontSize: "0.65rem", letterSpacing: "0.1em" }}>LOGS RECORDED</div>
          <div style={{ fontFamily: "'Bebas Neue',cursive", fontSize: "2rem", color: "#5b9cf6" }}>{logs.length}</div>
          <div style={{ color: "#3d5572", fontSize: "0.7rem" }}>total entries</div>
        </div>
        <div style={s.miniCard}>
          <div style={{ color: "#5b7a99", fontSize: "0.65rem", letterSpacing: "0.1em" }}>MODE</div>
          <div style={{ fontFamily: "'Bebas Neue',cursive", fontSize: "1.1rem", color: groinMode ? "#00d4aa" : "#f7c948", marginTop: "4px" }}>{groinMode ? "GROIN-SAFE 🛡️" : "STANDARD 💪"}</div>
          <div style={{ color: "#3d5572", fontSize: "0.7rem" }}>gym programme</div>
        </div>
        <div style={s.miniCard}>
          <div style={{ color: "#5b7a99", fontSize: "0.65rem", letterSpacing: "0.1em" }}>CURRENT GOAL</div>
          <div style={{ fontFamily: "'Bebas Neue',cursive", fontSize: "1rem", color: "#ff5e3a", marginTop: "4px" }}>{MONTHLY_GOALS[0]?.target || "Set in Goals"}</div>
          <div style={{ color: "#3d5572", fontSize: "0.7rem" }}>{MONTHLY_GOALS[0]?.label}</div>
        </div>
      </div>

      {recentLogs.length > 0 && (
        <div style={s.card}>
          <div style={s.sectionLabel}>RECENT LOGS</div>
          {recentLogs.map(l => (
            <div key={l.id} style={{ display: "flex", justifyContent: "space-between", padding: "10px 0", borderBottom: "1px solid #0d1a28" }}>
              <div>
                <span style={{ color: "#e0e8f8", fontSize: "0.85rem" }}>{l.type}</span>
                {l.notes && <span style={{ color: "#5b7a99", fontSize: "0.75rem", marginLeft: "8px" }}>— {l.notes}</span>}
              </div>
              <div style={{ textAlign: "right" }}>
                <span style={{ color: "#00d4aa", fontFamily: "'Bebas Neue',cursive", fontSize: "1rem" }}>{l.value}</span>
                <div style={{ color: "#3d5572", fontSize: "0.65rem" }}>{new Date(l.date).toLocaleDateString("en-GB", { day: "2-digit", month: "short" })}</div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── WEEKLY PLAN ─────────────────────────────────────────────────────────────

function WeeklyPlan({ completedSessions, toggleSession, todayIdx }) {
  const [expanded, setExpanded] = useState(todayIdx);

  return (
    <div style={s.section}>
      <div style={s.sectionHeader}>
        <div style={s.sectionTitle}>WEEKLY SCHEDULE</div>
        <div style={s.sectionSubtitle}>Tap a day to expand · Tick to complete</div>
      </div>
      {WEEK_PLAN.map((day, i) => (
        <div key={i} className="session-card" style={{
          ...s.sessionCard,
          borderLeft: `3px solid ${completedSessions[i] ? "#00d4aa" : i === todayIdx ? day.colour : "#1e2d42"}`,
          opacity: completedSessions[i] ? 0.85 : 1
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px", cursor: "pointer" }} onClick={() => setExpanded(expanded === i ? null : i)}>
            <div style={{ fontSize: "1.5rem", width: "36px", textAlign: "center" }}>{day.icon}</div>
            <div style={{ flex: 1 }}>
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <span style={{ fontFamily: "'Bebas Neue',cursive", fontSize: "0.9rem", color: i === todayIdx ? day.colour : "#5b7a99", letterSpacing: "0.1em" }}>{day.day}</span>
                {i === todayIdx && <span style={{ background: day.colour + "22", color: day.colour, fontSize: "0.6rem", padding: "2px 6px", borderRadius: "4px" }}>TODAY</span>}
                {completedSessions[i] && <span style={{ background: "#00d4aa22", color: "#00d4aa", fontSize: "0.6rem", padding: "2px 6px", borderRadius: "4px" }}>✓ DONE</span>}
              </div>
              <div style={{ fontFamily: "'Bebas Neue',cursive", fontSize: "1.2rem", color: "#e0e8f8", letterSpacing: "0.03em" }}>{day.type}</div>
            </div>
            <span style={{ color: "#3d5572", fontSize: "0.8rem" }}>{expanded === i ? "▲" : "▼"}</span>
          </div>
          {expanded === i && (
            <div style={{ marginTop: "14px", paddingTop: "14px", borderTop: "1px solid #0d1a28" }}>
              <p style={{ color: "#8aa4bf", fontSize: "0.88rem", margin: "0 0 12px 0" }}>{day.details}</p>
              <div style={{ ...s.nutritionTag, marginBottom: "12px" }}>🥗 {day.nutrition}</div>
              <div style={{ background: "#0d1a28", borderRadius: "8px", padding: "10px 14px", marginBottom: "14px" }}>
                <span style={{ color: "#f7c948", fontSize: "0.75rem" }}>💡 PRO TIP: </span>
                <span style={{ color: "#8aa4bf", fontSize: "0.82rem" }}>{day.tip}</span>
              </div>
              <button className="tick-btn" onClick={() => toggleSession(i)}
                style={{ ...s.primaryBtn, background: completedSessions[i] ? "#0d3d2e" : day.colour, color: completedSessions[i] ? "#00d4aa" : "#fff", border: completedSessions[i] ? `1px solid #00d4aa` : "none", width: "100%" }}>
                {completedSessions[i] ? "✓ MARKED COMPLETE — TAP TO UNDO" : `MARK ${day.day} AS COMPLETE`}
              </button>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

// ─── GYM SECTION ─────────────────────────────────────────────────────────────

function GymSection({ groinMode, expandedExercise, setExpandedExercise }) {
  const exercises = groinMode ? GROIN_ALTERNATIVES : GYM_EXERCISES;

  return (
    <div style={s.section}>
      <div style={s.sectionHeader}>
        <div style={s.sectionTitle}>{groinMode ? "GROIN-SAFE PROGRAMME 🛡️" : "BULLETPROOF EXERCISES"}</div>
        <div style={s.sectionSubtitle}>{groinMode ? "Groin-friendly alternatives active" : "Heavy Slow Resistance (HSR) · Toggle groin-safe mode in header"}</div>
      </div>

      {!groinMode && (
        <div style={{ ...s.infoBox, marginBottom: "4px" }}>
          <strong style={{ color: "#f7c948" }}>💡 Groin sensitive?</strong>
          <span style={{ color: "#8aa4bf", fontSize: "0.85rem" }}> Toggle "🏋️ Standard" in the header to switch to groin-friendly alternatives.</span>
        </div>
      )}
      {groinMode && (
        <div style={{ ...s.infoBox, marginBottom: "4px", borderColor: "#00d4aa44" }}>
          <strong style={{ color: "#00d4aa" }}>🛡️ Groin-Safe Mode Active</strong>
          <span style={{ color: "#8aa4bf", fontSize: "0.85rem" }}> Copenhagen Plank is included — this will actually FIX the groin long-term.</span>
        </div>
      )}

      {exercises.map((ex, i) => (
        <div key={i} className="ex-card" style={{ ...s.exerciseCard, borderColor: expandedExercise === i ? "#00d4aa" : "#1e2d42" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px", cursor: "pointer" }} onClick={() => setExpandedExercise(expandedExercise === i ? null : i)}>
            <div style={{ width: "36px", height: "36px", borderRadius: "8px", background: "#00d4aa1a", border: "1px solid #00d4aa33", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Bebas Neue',cursive", fontSize: "1rem", color: "#00d4aa", flexShrink: 0 }}>{i + 1}</div>
            <div style={{ flex: 1 }}>
              <div style={{ fontFamily: "'Bebas Neue',cursive", fontSize: "1.2rem", color: "#e0e8f8", letterSpacing: "0.03em" }}>{ex.name}</div>
              <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", marginTop: "3px" }}>
                <span style={s.exPill}>{ex.sets}</span>
                <span style={s.exPill}>{ex.tempo}</span>
                {ex.replaces && <span style={{ ...s.exPill, background: "#00d4aa1a", color: "#00d4aa" }}>↔ {ex.replaces}</span>}
              </div>
            </div>
            <span style={{ color: "#3d5572" }}>{expandedExercise === i ? "▲" : "▼"}</span>
          </div>
          {expandedExercise === i && (
            <div style={{ marginTop: "14px", paddingTop: "14px", borderTop: "1px solid #0d1a28" }}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px", marginBottom: "14px" }}>
                <div style={s.exStat}><div style={{ color: "#5b7a99", fontSize: "0.65rem", letterSpacing: "0.08em" }}>SETS & REPS</div><div style={{ color: "#e0e8f8", fontWeight: 600 }}>{ex.sets}</div></div>
                <div style={s.exStat}><div style={{ color: "#5b7a99", fontSize: "0.65rem", letterSpacing: "0.08em" }}>TEMPO</div><div style={{ color: "#e0e8f8", fontWeight: 600 }}>{ex.tempo}</div></div>
                {ex.weight && <div style={s.exStat}><div style={{ color: "#5b7a99", fontSize: "0.65rem", letterSpacing: "0.08em" }}>WEIGHT</div><div style={{ color: "#e0e8f8", fontWeight: 600 }}>{ex.weight}</div></div>}
                <div style={s.exStat}><div style={{ color: "#5b7a99", fontSize: "0.65rem", letterSpacing: "0.08em" }}>GOAL</div><div style={{ color: "#00d4aa", fontWeight: 600, fontSize: "0.8rem" }}>{ex.goal}</div></div>
              </div>
              <div style={{ background: "#0d1a28", borderRadius: "8px", padding: "10px 14px", marginBottom: "14px" }}>
                <span style={{ color: "#f7c948", fontSize: "0.75rem" }}>💡 FORM TIP: </span>
                <span style={{ color: "#8aa4bf", fontSize: "0.82rem" }}>{ex.tip}</span>
              </div>
              <a href={ex.youtubeSearch} target="_blank" rel="noopener noreferrer" style={s.videoBtn}>
                ▶ WATCH ON YOUTUBE — "{ex.searchTerm}"
              </a>
            </div>
          )}
        </div>
      ))}

      {!groinMode && (
        <div style={{ ...s.card, borderColor: "#c07ef733" }}>
          <div style={{ fontFamily: "'Bebas Neue',cursive", fontSize: "1rem", color: "#c07ef7", letterSpacing: "0.05em", marginBottom: "8px" }}>BONUS: COPENHAGEN PLANK</div>
          <p style={{ color: "#8aa4bf", fontSize: "0.85rem", margin: "0 0 12px 0" }}>Add 20 seconds per side to your gym warm-up. Builds adductor resilience for the 4:15/km marathon pace.</p>
          <a href="https://www.youtube.com/results?search_query=Copenhagen+Plank+regressed+version+adductor" target="_blank" rel="noopener noreferrer" style={s.videoBtn}>
            ▶ WATCH: Copenhagen Plank (Regressed Version)
          </a>
        </div>
      )}
    </div>
  );
}

// ─── GOALS ───────────────────────────────────────────────────────────────────

function GoalsSection({ goals, goalInputs, setGoalInputs, saveGoal, logs }) {
  const latestWeight = logs.find(l => l.type === "Weight")?.value;
  const latestParkrun = logs.find(l => l.type === "5km Time")?.value;

  return (
    <div style={s.section}>
      <div style={s.sectionHeader}>
        <div style={s.sectionTitle}>GOALS 🎯</div>
        <div style={s.sectionSubtitle}>Track your monthly targets</div>
      </div>
      {MONTHLY_GOALS.map(g => {
        const current = goals[g.id];
        const autoValue = g.id === "weight" ? latestWeight : g.id === "parkrun" ? latestParkrun : null;
        const displayValue = current || autoValue;
        return (
          <div key={g.id} style={s.card}>
            <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: "12px" }}>
              <div>
                <div style={{ fontFamily: "'Bebas Neue',cursive", fontSize: "1.3rem", color: "#e0e8f8", letterSpacing: "0.03em" }}>{g.icon} {g.label}</div>
                <div style={{ color: "#5b7a99", fontSize: "0.78rem", marginTop: "2px" }}>{g.description}</div>
              </div>
              <div style={{ textAlign: "right" }}>
                <div style={{ color: "#00d4aa", fontFamily: "'Bebas Neue',cursive", fontSize: "1.6rem" }}>{displayValue || "—"}</div>
                <div style={{ color: "#3d5572", fontSize: "0.65rem" }}>recorded</div>
              </div>
            </div>
            <div style={{ ...s.nutritionTag, marginBottom: "12px" }}>TARGET: {g.target}</div>
            {autoValue && <div style={{ color: "#5b7a99", fontSize: "0.75rem", marginBottom: "10px" }}>📊 Auto-filled from latest log</div>}
            <div style={{ display: "flex", gap: "8px" }}>
              <input type="text" placeholder={`Enter ${g.unit}...`} value={goalInputs[g.id] || ""}
                onChange={e => setGoalInputs({ ...goalInputs, [g.id]: e.target.value })} style={{ flex: 1 }} />
              <button onClick={() => { saveGoal(g.id, goalInputs[g.id] || ""); setGoalInputs({ ...goalInputs, [g.id]: "" }); }}
                style={{ ...s.primaryBtn, width: "auto", padding: "10px 20px", flexShrink: 0 }}>SAVE</button>
            </div>
          </div>
        );
      })}
      <div style={s.card}>
        <div style={{ fontFamily: "'Bebas Neue',cursive", fontSize: "1rem", color: "#5b9cf6", letterSpacing: "0.05em", marginBottom: "12px" }}>MONTH-END TARGETS</div>
        {FINAL_TARGETS.map((item, i) => (
          <div key={i} style={{ display: "flex", alignItems: "center", gap: "10px", background: "#0d1220", padding: "10px 14px", borderRadius: "8px", marginBottom: "8px" }}>
            <span style={{ fontSize: "1.1rem" }}>{item.icon}</span>
            <span style={{ color: "#8aa4bf", fontSize: "0.85rem" }}>{item.text}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── LOG ─────────────────────────────────────────────────────────────────────

function LogSection({ logs, logInput, setLogInput, addLog }) {
  return (
    <div style={s.section}>
      <div style={s.sectionHeader}>
        <div style={s.sectionTitle}>LOG A RESULT 📝</div>
        <div style={s.sectionSubtitle}>Weights · Times · Pain scores · Energy</div>
      </div>
      <div style={s.card}>
        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          <div>
            <label style={s.label}>TYPE</label>
            <select value={logInput.type} onChange={e => setLogInput({ ...logInput, type: e.target.value })}>
              <option value="">Select type...</option>
              {LOG_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>
          <div>
            <label style={s.label}>VALUE</label>
            <input type="text"
              placeholder={logInput.type === "5km Time" ? "e.g. 24:32" : logInput.type === "Weight" ? "e.g. 81.5" : "Enter value..."}
              value={logInput.value} onChange={e => setLogInput({ ...logInput, value: e.target.value })} />
          </div>
          <div>
            <label style={s.label}>DATE</label>
            <input type="date" value={logInput.date} onChange={e => setLogInput({ ...logInput, date: e.target.value })} />
          </div>
          <div>
            <label style={s.label}>NOTES (optional)</label>
            <textarea placeholder="How did it feel? Conditions? Progress?" value={logInput.notes} onChange={e => setLogInput({ ...logInput, notes: e.target.value })} />
          </div>
          <button onClick={addLog} style={{ ...s.primaryBtn, width: "100%" }}>LOG ENTRY</button>
        </div>
      </div>
      {logs.length > 0 && (
        <div style={s.card}>
          <div style={s.sectionLabel}>HISTORY</div>
          {logs.map((l, i) => (
            <div key={l.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", padding: "12px 0", borderBottom: i < logs.length - 1 ? "1px solid #0d1a28" : "none" }}>
              <div>
                <div style={{ color: "#e0e8f8", fontSize: "0.88rem", fontWeight: 500 }}>{l.type}</div>
                {l.notes && <div style={{ color: "#5b7a99", fontSize: "0.75rem", marginTop: "2px" }}>{l.notes}</div>}
              </div>
              <div style={{ textAlign: "right", flexShrink: 0, marginLeft: "16px" }}>
                <div style={{ color: "#00d4aa", fontFamily: "'Bebas Neue',cursive", fontSize: "1.1rem" }}>{l.value}</div>
                <div style={{ color: "#3d5572", fontSize: "0.65rem" }}>{new Date(l.date).toLocaleDateString("en-GB", { day: "2-digit", month: "short" })}</div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── CHECK-IN ────────────────────────────────────────────────────────────────

function CheckInSection({ checkins, checkinInput, setCheckinInput, addCheckin }) {
  const today = new Date().toLocaleDateString("en-GB");
  const todayCheckin = checkins.find(c => c.date === today);

  return (
    <div style={s.section}>
      <div style={s.sectionHeader}>
        <div style={s.sectionTitle}>DAILY CHECK-IN 💬</div>
        <div style={s.sectionSubtitle}>How's the chassis holding up?</div>
      </div>
      {todayCheckin && (
        <div style={{ ...s.infoBox, borderColor: "#00d4aa44" }}>
          <strong style={{ color: "#00d4aa" }}>✓ Already checked in today.</strong>
          <span style={{ color: "#8aa4bf", fontSize: "0.85rem" }}> Energy: {todayCheckin.energy}/5 · Soreness: {todayCheckin.soreness}/5</span>
          {todayCheckin.notes && <p style={{ color: "#5b7a99", margin: "6px 0 0 0", fontSize: "0.82rem" }}>"{todayCheckin.notes}"</p>}
        </div>
      )}
      <div style={s.card}>
        <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          <div>
            <label style={s.label}>ENERGY LEVEL · {checkinInput.energy}/5</label>
            <div style={{ display: "flex", gap: "8px", marginTop: "8px" }}>
              {[1, 2, 3, 4, 5].map(n => (
                <button key={n} onClick={() => setCheckinInput({ ...checkinInput, energy: n })}
                  style={{ flex: 1, height: "40px", borderRadius: "8px", border: "none", cursor: "pointer", fontWeight: 700, background: checkinInput.energy >= n ? getEnergyColor(n) : "#0d1220", color: checkinInput.energy >= n ? "#0a0f1e" : "#3d5572", transition: "all 0.2s" }}>
                  {n}
                </button>
              ))}
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", marginTop: "4px" }}>
              <span style={{ color: "#3d5572", fontSize: "0.65rem" }}>Wrecked</span>
              <span style={{ color: "#3d5572", fontSize: "0.65rem" }}>Flying 🚀</span>
            </div>
          </div>
          <div>
            <label style={s.label}>SORENESS / PAIN · {checkinInput.soreness}/5</label>
            <div style={{ display: "flex", gap: "8px", marginTop: "8px" }}>
              {[1, 2, 3, 4, 5].map(n => (
                <button key={n} onClick={() => setCheckinInput({ ...checkinInput, soreness: n })}
                  style={{ flex: 1, height: "40px", borderRadius: "8px", border: "none", cursor: "pointer", fontWeight: 700, background: checkinInput.soreness >= n ? getSorenessColor(n) : "#0d1220", color: checkinInput.soreness >= n ? "#0a0f1e" : "#3d5572", transition: "all 0.2s" }}>
                  {n}
                </button>
              ))}
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", marginTop: "4px" }}>
              <span style={{ color: "#3d5572", fontSize: "0.65rem" }}>No issues</span>
              <span style={{ color: "#3d5572", fontSize: "0.65rem" }}>World of pain 😬</span>
            </div>
          </div>
          <div>
            <label style={s.label}>HOW'S IT GOING? (optional)</label>
            <textarea placeholder="Shin feeling better? Groin okay? Nailed the intervals? Vent here..."
              value={checkinInput.notes} onChange={e => setCheckinInput({ ...checkinInput, notes: e.target.value })} />
          </div>
          <button onClick={addCheckin} style={{ ...s.primaryBtn, width: "100%" }}>SUBMIT CHECK-IN</button>
        </div>
      </div>
      {checkins.length > 0 && (
        <div style={s.card}>
          <div style={s.sectionLabel}>CHECK-IN HISTORY</div>
          {checkins.slice(0, 10).map((c, i) => (
            <div key={c.id} style={{ display: "flex", alignItems: "center", gap: "12px", padding: "10px 0", borderBottom: i < Math.min(checkins.length, 10) - 1 ? "1px solid #0d1a28" : "none" }}>
              <div style={{ color: "#3d5572", fontSize: "0.75rem", minWidth: "50px" }}>{c.date.slice(0, 5)}</div>
              <div style={{ display: "flex", gap: "8px", flex: 1 }}>
                <span style={{ ...s.exPill, background: getEnergyColor(c.energy) + "22", color: getEnergyColor(c.energy) }}>⚡ {c.energy}/5</span>
                <span style={{ ...s.exPill, background: getSorenessColor(c.soreness) + "22", color: getSorenessColor(c.soreness) }}>🦵 {c.soreness}/5</span>
              </div>
              {c.notes && <div style={{ color: "#5b7a99", fontSize: "0.75rem", flex: 2, fontStyle: "italic" }}>"{c.notes.slice(0, 60)}{c.notes.length > 60 ? "..." : ""}"</div>}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── NUTRITION ───────────────────────────────────────────────────────────────

function NutritionSection() {
  return (
    <div style={s.section}>
      <div style={s.sectionHeader}>
        <div style={s.sectionTitle}>LEAN-POWER MEAL PLAN 🥗</div>
        <div style={s.sectionSubtitle}>Fixed template · Fuel for Valencia</div>
      </div>
      <div style={{ ...s.infoBox, marginBottom: "4px" }}>
        <strong style={{ color: "#f7c948" }}>🎯 The Rule: </strong>
        <span style={{ color: "#8aa4bf", fontSize: "0.85rem" }}>Add 100g carbs to dinner on run days. Keep carbs lower on rest and gym days. 30g+ protein at every meal.</span>
      </div>
      {MEALS.map((m, i) => (
        <div key={i} style={s.card}>
          <div style={{ fontFamily: "'Bebas Neue',cursive", fontSize: "1.1rem", color: "#e0e8f8", letterSpacing: "0.03em", marginBottom: "4px" }}>{m.meal}</div>
          <p style={{ color: "#8aa4bf", fontSize: "0.85rem", margin: "0 0 8px 0" }}>{m.items}</p>
          <div style={s.nutritionTag}>{m.rule}</div>
        </div>
      ))}
      <div style={s.card}>
        <div style={{ fontFamily: "'Bebas Neue',cursive", fontSize: "1rem", color: "#5b9cf6", letterSpacing: "0.05em", marginBottom: "12px" }}>CARB GUIDE BY DAY TYPE</div>
        {CARB_GUIDE.map((d, i) => (
          <div key={i} style={{ display: "flex", justifyContent: "space-between", padding: "10px 0", borderBottom: i < CARB_GUIDE.length - 1 ? "1px solid #0d1a28" : "none", alignItems: "center" }}>
            <span style={{ color: d.color, fontWeight: 600, fontSize: "0.85rem" }}>{d.type}</span>
            <span style={{ color: "#8aa4bf", fontSize: "0.82rem", textAlign: "right", maxWidth: "55%" }}>{d.carbs}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── STYLES ──────────────────────────────────────────────────────────────────

const globalCSS = `
  @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Sans:wght@300;400;500;600;700&display=swap');
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  body { background: #070a12; }
  ::-webkit-scrollbar { width: 4px; }
  ::-webkit-scrollbar-track { background: #0d0d1a; }
  ::-webkit-scrollbar-thumb { background: #00d4aa44; border-radius: 2px; }
  .session-card, .ex-card { transition: transform 0.2s, box-shadow 0.2s; }
  .session-card:hover, .ex-card:hover { transform: translateY(-2px); }
  .ex-card:hover { border-color: #00d4aa !important; }
  .tab-btn:hover { background: #1a2030 !important; }
  .tick-btn { transition: transform 0.15s; }
  .tick-btn:hover { transform: scale(1.02); }
  @keyframes fadeIn { from { opacity:0; transform:translateY(8px); } to { opacity:1; transform:none; } }
  @keyframes toastIn { from { opacity:0; transform:translateX(40px); } to { opacity:1; transform:none; } }
  @keyframes spin { from { transform:rotate(0deg); } to { transform:rotate(360deg); } }
  .fade-in { animation: fadeIn 0.3s ease; }
  input, textarea, select {
    background: #0d1220 !important; border: 1px solid #1e2d42 !important;
    color: #e0e8f8 !important; border-radius: 8px !important;
    padding: 10px 14px !important; font-family: 'DM Sans', sans-serif !important;
    font-size: 0.9rem !important; outline: none !important; width: 100%;
  }
  input:focus, textarea:focus, select:focus { border-color: #00d4aa !important; }
  textarea { resize: vertical; min-height: 80px; }
  select option { background: #0d1220; }
  .groin-btn {
    background: none; border: none; cursor: pointer;
    color: inherit; font-family: 'DM Sans', sans-serif;
    font-size: 0.75rem; padding: 0;
  }
`;

const s = {
  root: { background: "#070a12", minHeight: "100vh", color: "#e0e8f8", fontFamily: "'DM Sans', sans-serif", maxWidth: "680px", margin: "0 auto" },
  loadingScreen: { background: "#070a12", minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "16px" },
  header: { background: "linear-gradient(135deg, #0a0f1e 0%, #0d1528 100%)", borderBottom: "1px solid #0d1a28", padding: "14px 16px", display: "flex", justifyContent: "space-between", alignItems: "center", position: "sticky", top: 0, zIndex: 100 },
  headerTitle: { fontFamily: "'Bebas Neue', cursive", fontSize: "1.5rem", letterSpacing: "0.1em", color: "#e0e8f8", lineHeight: 1 },
  headerSub: { color: "#3d5572", fontSize: "0.68rem", letterSpacing: "0.05em", marginTop: "2px" },
  headerStats: { display: "flex", gap: "8px", alignItems: "center" },
  statPill: { background: "#0d1220", border: "1px solid #1e2d42", borderRadius: "8px", padding: "5px 10px", display: "flex", flexDirection: "column", alignItems: "center", gap: "2px" },
  nav: { display: "flex", overflowX: "auto", background: "#0a0f1e", borderBottom: "1px solid #0d1a28", padding: "0 4px", scrollbarWidth: "none" },
  navBtn: { background: "transparent", border: "none", color: "#3d5572", cursor: "pointer", display: "flex", flexDirection: "column", alignItems: "center", gap: "3px", padding: "9px 11px", borderBottom: "2px solid transparent", whiteSpace: "nowrap", transition: "color 0.2s", fontFamily: "'DM Sans', sans-serif", fontWeight: 500 },
  navBtnActive: { color: "#00d4aa", borderBottomColor: "#00d4aa", background: "#00d4aa08" },
  main: { padding: "16px", paddingBottom: "40px" },
  section: { display: "flex", flexDirection: "column", gap: "12px" },
  sectionHeader: { marginBottom: "4px" },
  sectionTitle: { fontFamily: "'Bebas Neue', cursive", fontSize: "1.5rem", letterSpacing: "0.08em", color: "#e0e8f8" },
  sectionSubtitle: { color: "#3d5572", fontSize: "0.78rem", marginTop: "2px" },
  sectionLabel: { color: "#5b7a99", fontSize: "0.65rem", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: "10px" },
  card: { background: "#0d1220", border: "1px solid #131e30", borderRadius: "12px", padding: "16px" },
  miniCard: { background: "#0d1220", border: "1px solid #131e30", borderRadius: "12px", padding: "14px" },
  sessionCard: { background: "#0d1220", borderRadius: "12px", padding: "16px", border: "1px solid #131e30" },
  exerciseCard: { background: "#0d1220", border: "1px solid #1e2d42", borderRadius: "12px", padding: "16px" },
  infoBox: { background: "#0d1220", border: "1px solid #1e2d42", borderRadius: "10px", padding: "12px 16px" },
  nutritionTag: { background: "#00d4aa12", border: "1px solid #00d4aa22", borderRadius: "6px", padding: "6px 10px", color: "#00d4aa", fontSize: "0.78rem" },
  primaryBtn: { background: "#00d4aa", color: "#0a0f1e", border: "none", borderRadius: "8px", padding: "12px 20px", fontFamily: "'Bebas Neue', cursive", fontSize: "1rem", letterSpacing: "0.08em", cursor: "pointer", display: "block", textAlign: "center" },
  videoBtn: { display: "block", background: "#1a0505", border: "1px solid #ff4444", color: "#ff4444", borderRadius: "8px", padding: "10px 16px", fontSize: "0.78rem", letterSpacing: "0.05em", fontWeight: 600, cursor: "pointer", textDecoration: "none", textAlign: "center" },
  exPill: { background: "#0a0f1e", border: "1px solid #1e2d42", borderRadius: "4px", padding: "2px 8px", color: "#5b7a99", fontSize: "0.72rem" },
  exStat: { background: "#0a0f1e", borderRadius: "8px", padding: "10px 12px" },
  label: { display: "block", color: "#5b7a99", fontSize: "0.65rem", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: "6px" },
  toast: { position: "fixed", top: "80px", right: "16px", background: "#0d3d2e", border: "1px solid #00d4aa", color: "#00d4aa", borderRadius: "10px", padding: "12px 20px", fontSize: "0.88rem", fontWeight: 600, zIndex: 999, animation: "toastIn 0.3s ease", boxShadow: "0 8px 32px rgba(0,212,170,0.2)", maxWidth: "280px" },
};
