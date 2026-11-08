// ==========================================
// GARDEN GROVE - JAVASCRIPT
// ==========================================

// ------------------------------------------
// 1. APPLICATION DATA
// ------------------------------------------

const KEY = "garden-grove-v2";

const initial = {
  plants: [],
  harvests: [],
  notes: [],
  beds: []
};

let state;

try {
  const saved = JSON.parse(localStorage.getItem(KEY));

  state = saved && Array.isArray(saved.plants)
    ? saved
    : structuredClone(initial);
} catch {
  state = structuredClone(initial);
}

for (const key of Object.keys(initial)) {
  if (!Array.isArray(state[key])) {
    state[key] = [];
  }
}

// ------------------------------------------
// 2. HELPER FUNCTIONS
// ------------------------------------------

const $ = id => document.getElementById(id);

function today() {
  const d = new Date();

  return [
    d.getFullYear(),
    String(d.getMonth() + 1).padStart(2, "0"),
    String(d.getDate()).padStart(2, "0")
  ].join("-");
}

function fmt(date) {
  if (!date) return "—";

  return new Date(date + "T12:00:00")
    .toLocaleDateString(undefined, {
      month: "short",
      day: "numeric",
      year: "numeric"
    });
}

function escapeHTML(value) {
  return String(value ?? "").replace(/[&<>"']/g, c => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;"
  }[c]));
}

function addDays(date, days) {
  const d = new Date(date + "T12:00:00");

  d.setDate(d.getDate() + days);

  return [
    d.getFullYear(),
    String(d.getMonth() + 1).padStart(2, "0"),
    String(d.getDate()).padStart(2, "0")
  ].join("-");
}

function daysSince(date) {
  const now = new Date(today() + "T12:00:00");
  const then = new Date(date + "T12:00:00");

  return Math.floor(
    (now - then) / 86400000
  );
}

