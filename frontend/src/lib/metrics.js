// Lightweight local usage counters for the Impact / KPI dashboard. These are
// device-local (localStorage) tallies that let the demo show *real* in-session
// activity (emergency lookups, directions opened, legends read, quizzes taken)
// alongside seeded aggregate numbers. Best-effort; never throws.
const KEY = "tiewhatyai_metrics_v1";

const DEFAULT = {
  emergencyOpens: 0,   // times the SOS / emergency dial was used
  essentialLookups: 0, // times a Local Living service was opened/dialed
  legendsRead: 0,      // legend stories opened
  quizzesTaken: 0,     // quizzes completed
  directionsOpened: 0, // "open in maps" taps
};

export function readMetrics() {
  try {
    return { ...DEFAULT, ...JSON.parse(localStorage.getItem(KEY) || "{}") };
  } catch {
    return { ...DEFAULT };
  }
}

export function bumpMetric(name, by = 1) {
  try {
    const m = readMetrics();
    m[name] = (m[name] || 0) + by;
    localStorage.setItem(KEY, JSON.stringify(m));
    return m;
  } catch {
    return readMetrics();
  }
}
