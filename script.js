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
<button
onclick="water('${p.id}')">
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

 // Harvest records
 
 $("harvestList").innerHTML = state.harvests.length
    ? [...state.harvests]
        .sort((a, b) => b.date.localeCompare(a.date))
        .map(h => `
          <div class="entry">

            <strong>
              🥬 ${escapeHTML(h.crop)}
            </strong>

            <p>
              ${escapeHTML(h.amount)} ·
              ${fmt(h.date)}
            </p>

            <button
              class="danger"
              onclick="removeEntry('harvests','${h.id}')">
              Delete
            </button>

          </div>
        `).join("")
    : `<p class="hint">
         No harvests recorded yet.
       </p>`;

 // Journal entries

  $("noteList").innerHTML = state.notes.length
    ? [...state.notes]
        .sort((a, b) => b.date.localeCompare(a.date))
        .map(n => `
          <div class="entry">

            <strong>
              ${escapeHTML(n.title)}
            </strong>

            <p>${fmt(n.date)}</p>

            <p style="white-space:pre-wrap">
              ${escapeHTML(n.body)}
            </p>

            <button
              class="danger"
              onclick="removeEntry('notes','${n.id}')">
              Delete
            </button>

          </div>
        `).join("")
    : `<p class="hint">
         Your journal is empty.
       </p>`;

 // Render raised beds

  renderBeds();
}

// ------------------------------------------
// 7. DELETE ENTRIES
// ------------------------------------------

function removeEntry(collection, id) {
  if (confirm("Delete this entry?")) {
    state[collection] = state[collection].filter(
      item => item.id !== id
    );

    save();
  }
}

// ------------------------------------------
// 8. PLANT, HARVEST, AND JOURNAL FORMS
// ------------------------------------------

let mode;
let editing;

function field(
  label,
  name,
  type = "text",
  value = "",
  extra = ""
) {
  return `
    <label>
      ${label}

      <input
        name="${name}"
        type="${type}"
        value="${escapeHTML(value)}"
        ${extra}
        required>
    </label>
  `;
}

function choose(label, name, options, selected) {
  return `
    <label>
      ${label}

      <select name="${name}">
        ${options.map(option => `
          <option
            value="${escapeHTML(option)}"
            ${option === selected ? "selected" : ""}>
            ${escapeHTML(option)}
          </option>
        `).join("")}
      </select>
    </label>
  `;
}

function openForm(kind, id) {
  mode = kind;
  editing = id || null;

  const p = state.plants.find(
    item => item.id === id
  ) || {};

  $("formTitle").textContent =
    kind === "plant"
      ? (id ? "Edit plant" : "Add plant")
      : kind === "harvest"
        ? "Log a harvest"
        : "New journal entry";

  if (kind === "plant") {

    $("fields").innerHTML =
      field(
        "Plant name",
        "name",
        "text",
        p.name || "",
        'maxlength="80"'
      ) +

      choose(
        "Category",
        "type",
        ["Vegetable", "Herb", "Flower", "Fruit", "Other"],
        p.type
      ) +

      field(
        "Garden bed / location",
        "bed",
        "text",
        p.bed || ""
      ) +

      field(
        "Planting date",
        "planted",
        "date",
        p.planted || today()
      ) +

      choose(
        "Growth stage",
        "stage",
        [
          "Seed",
          "Seedling",
          "Growing",
          "Flowering",
          "Ready to harvest",
          "Finished"
        ],
        p.stage
      ) +

      field(
        "Water every (days)",
        "interval",
        "number",
        p.interval || 3,
        'min="1" max="365"'
      ) +

      `<label>
        Last watered

        <input
          name="lastWatered"
          type="date"
          value="${escapeHTML(p.lastWatered || "")}">
      </label>`;

  } else if (kind === "harvest") {

    $("fields").innerHTML =
      field("Crop", "crop") +
      field("Amount (e.g. 2 lbs)", "amount") +
      field("Harvest date", "date", "date", today());

  } else {

    $("fields").innerHTML =
      field("Title", "title") +
      field("Date", "date", "date", today()) +

      `<label>
        Notes
        <textarea name="body" required></textarea>
      </label>`;
  }

  $("editor").showModal();
}


