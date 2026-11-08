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

// ------------------------------------------
// 3. SAVE GARDEN DATA
// ------------------------------------------

function save() {
  localStorage.setItem(KEY, JSON.stringify(state));
  render();
}

// ------------------------------------------

// 4. CROP CATALOG
// ------------------------------------------

const CROPS = {
  Tomato: {
    emoji: "🍅",
    days: 80
  },

  Pepper: {
    emoji: "🫑",
    days: 85
  },

  Carrot: {
    emoji: "🥕",
    days: 70
  },

  Lettuce: {
    emoji: "🥬",
    days: 45
  },

  Cucumber: {
    emoji: "🥒",
    days: 60
  },

  "Green beans": {
    emoji: "🫘",
    days: 55
  },

  Radish: {
    emoji: "🌱",
    days: 30
  },

  Kale: {
    emoji: "🥬",
    days: 55
  },

  Zucchini: {
    emoji: "🥒",
    days: 55
  },

  Basil: {
    emoji: "🌿",
    days: 60
  },

  Strawberry: {
    emoji: "🍓",
    days: 90
  },

  Other: {
    emoji: "🌱",
    days: 70
  }
};

// ------------------------------------------
// 5. WATERING TRACKER
// ------------------------------------------

function due(plant) {
  return !plant.lastWatered ||
    daysSince(plant.lastWatered) >=
      Number(plant.interval || 3);
}

function water(id) {
  const plant = state.plants.find(
    p => p.id === id
  );

  if (plant) {
    plant.lastWatered = today();
    save();
  }
}

// ------------------------------------------
// 6. DASHBOARD AND PLANT RENDERING
// ------------------------------------------

function render() {

  // Update dashboard numbers

  $("plantCount").textContent =
    state.plants.length;

  $("waterCount").textContent =
    state.plants.filter(due).length;

  $("harvestCount").textContent =
    state.harvests.length;

  $("noteCount").textContent =
    state.notes.length;

  // Watering reminders

  const pending = state.plants.filter(due);

  $("dueList").innerHTML = pending.length
    ? pending.map(p => `
        <div class="entry">
          <strong>${escapeHTML(p.name)}</strong>

          <p>${escapeHTML(p.bed)}</p>

          <button onclick="water('${p.id}')">
            Mark watered
          </button>
        </div>
      `).join("")
    : `<p class="hint">
         No watering reminders right now.
       </p>`;

  // Plant cards

  $("plantCards").innerHTML = state.plants.length
    ? state.plants.map(p => `
        <article class="plant-card">

          <h3>🌱 ${escapeHTML(p.name)}</h3>

          <p>
            ${escapeHTML(p.type)} ·
            ${escapeHTML(p.stage)}
          </p>

          <p>📍 ${escapeHTML(p.bed)}</p>

          <p>📅 Planted ${fmt(p.planted)}</p>

          <p>
            💧 Water every
            ${Number(p.interval)} days
          </p>

          <p>
            ${due(p)
              ? "Watering due"
              : "Watered " + fmt(p.lastWatered)}
          </p>

          <div class="actions">

            <button onclick="water('${p.id}')">
              Watered today
            </button>

            <button
              class="secondary"
              onclick="openForm('plant','${p.id}')">
              Edit
            </button>

            <button
              class="danger"
              onclick="removeEntry('plants','${p.id}')">
              Delete
            </button>

          </div>
        </article>
      `).join("")
    : `<p class="hint">
         No plants yet. Add your first plant.
       </p>`;
