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
