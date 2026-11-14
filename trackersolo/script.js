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

// Save plant, harvest, or journal entry

$("entryForm").addEventListener("submit", event => {
  event.preventDefault();

  const data = Object.fromEntries(
    new FormData(event.currentTarget)
  );

  if (mode === "plant") {

    const item = {
      ...data,
      id: editing || crypto.randomUUID(),
      interval: Math.max(
        1,
        Number(data.interval) || 3
      )
    };

    if (editing) {
      state.plants = state.plants.map(
        p => p.id === editing ? item : p
      );
    } else {
      state.plants.push(item);
    }

  } else if (mode === "harvest") {

    state.harvests.push({
      ...data,
      id: crypto.randomUUID()
    });

  } else {

    state.notes.push({
      ...data,
      id: crypto.randomUUID()
    });
  }

  $("editor").close();
  save();
});

// ------------------------------------------
// 9. INTERACTIVE RAISED-BED PLANNER
// ------------------------------------------

function renderBeds() {

  $("bedCards").innerHTML = state.beds.length
    ? state.beds.map(bed => {

      const total = bed.rows * bed.cols;

      const planted = Object.values(bed.plots)
        .filter(Boolean).length;

      // Generate planting squares

      const squares = Array.from(
        { length: total },
        (_, index) => {

          const planting = bed.plots[index];

          const crop = planting
            ? (CROPS[planting.crop] || CROPS.Other)
            : null;

          return `
            <button
              type="button"
              class="plot ${planting ? "filled" : ""}"
              onclick="openPlot('${bed.id}', ${index})">

              <b>
                ${crop ? crop.emoji : "+"}
              </b>

              <small>
                ${planting
                  ? escapeHTML(planting.crop)
                  : "Plant"}
              </small>

            </button>
          `;
        }
      ).join("");

// Calculate upcoming harvests

      const upcoming = Object.values(bed.plots)
        .filter(Boolean)
        .map(p => ({
          ...p,
          harvest: addDays(
            p.date,
            (CROPS[p.crop] || CROPS.Other).days
          )
        }))
        .sort((a, b) =>
          a.harvest.localeCompare(b.harvest)
        )
        .slice(0, 3);

      return `
        <article class="bed-card">

          <div class="sectionhead">

            <div>
              <h3>
                🪴 ${escapeHTML(bed.name)}
              </h3>

              <p class="hint">
                ${bed.length} × ${bed.width} ft ·
                ${planted}/${total} zones planted
              </p>
            </div>

            <button
              class="danger"
              onclick="removeBed('${bed.id}')">
              Delete
            </button>

          </div>

          <div
            class="bed-grid"
            style="grid-template-columns:
              repeat(${bed.cols}, minmax(0, 1fr))">

            ${squares}

          </div>

          <strong>
            Estimated upcoming harvests
          </strong>

          <div>
            ${upcoming.length
              ? upcoming.map(p => `
                <span class="harvest-pill">
                  ${escapeHTML(p.crop)} ·
                  ${fmt(p.harvest)}
                </span>
              `).join("")
              : `<p class="hint">
                   Plant a zone to see harvest estimates.
                 </p>`}
          </div>

        </article>
      `;
    }).join("")
    : `<div class="panel">
         No raised beds yet.
         Add one to begin planning.
       </div>`;
}

// ------------------------------------------
// 10. CREATE AND DELETE RAISED BEDS
// ------------------------------------------

function openBedForm() {
  $("bedForm").reset();
  $("bedEditor").showModal();
}

$("bedForm").addEventListener("submit", event => {
  event.preventDefault();

  const data = Object.fromEntries(
    new FormData(event.currentTarget)
  );

  state.beds.push({
    id: crypto.randomUUID(),
    name: data.name,
    length: Number(data.length),
    width: Number(data.width),
    cols: Number(data.cols),
    rows: Number(data.rows),
    plots: {}
  });

  $("bedEditor").close();
  save();
});

function removeBed(id) {
  if (
    confirm(
      "Delete this raised bed and its planting zones?"
    )
  ) {
    state.beds = state.beds.filter(
      bed => bed.id !== id
    );

    save();
  }
}

// ------------------------------------------
// 11. PLANTING ZONES
// ------------------------------------------

let selectedBed = null;
let selectedZone = null;

// Populate crop dropdown

$("cropSelect").innerHTML = Object.keys(CROPS)
  .map(crop => `
    <option value="${escapeHTML(crop)}">
      ${escapeHTML(crop)}
    </option>
  `).join("");

function openPlot(bedId, index) {
  selectedBed = bedId;
  selectedZone = index;

  const bed = state.beds.find(
    b => b.id === bedId
  );

  if (!bed) return;

  const planting = bed.plots[index];

  $("plotTitle").textContent =
    bed.name + " · Zone " + (index + 1);

  $("cropSelect").value =
    planting?.crop || "Tomato";

  $("plotDate").value =
    planting?.date || today();

  updateEstimate();
  $("plotEditor").showModal();
}

// ------------------------------------------
// 12. HARVEST DATE CALCULATOR
// ------------------------------------------

function updateEstimate() {
  const crop = CROPS[$("cropSelect").value];
  const date = $("plotDate").value;

  $("harvestEstimate").textContent =
    crop && date
      ? "Estimated first harvest: " +
        fmt(addDays(date, crop.days)) +
        " (approximately " +
        crop.days +
        " days after planting)"
      : "";
}

$("cropSelect").addEventListener(
  "change",
  updateEstimate
);

$("plotDate").addEventListener(
  "change",
  updateEstimate
);

// ------------------------------------------
// 13. SAVE PLANTING ZONES
// ------------------------------------------

$("plotForm").addEventListener("submit", event => {
  event.preventDefault();

  const bed = state.beds.find(
    b => b.id === selectedBed
  );

  if (!bed) return;

  bed.plots[selectedZone] = {
    crop: $("cropSelect").value,
    date: $("plotDate").value
  };

  $("plotEditor").close();
  save();
});

// Remove a crop from a planting square

function clearSelectedPlot() {
  const bed = state.beds.find(
    b => b.id === selectedBed
  );

  if (!bed) return;

  delete bed.plots[selectedZone];

  $("plotEditor").close();
  save();
}

// ------------------------------------------
// 14. NAVIGATION
// ------------------------------------------

document.querySelectorAll("nav button")
  .forEach(button => {

    button.addEventListener("click", () => {

      // Remove active state from all buttons

      document.querySelectorAll("nav button")
        .forEach(b =>
          b.classList.remove("active")
        );

      // Hide all sections

      document.querySelectorAll(".section")
        .forEach(section =>
          section.classList.remove("active")
        );

      // Activate selected button

      button.classList.add("active");

      // Show selected section

      $(button.dataset.tab)
        .classList.add("active");

    });
  });

// ------------------------------------------
// 15. INITIALIZE WEBSITE
// ------------------------------------------

render();



<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Garden Grove | Garden Tracker</title>

<style>
:root {
  --green: #245b43;
  --mint: #e7f2e9;
  --cream: #f7f8f2;
  --ink: #23352b;
  --muted: #68796e;
  --line: #dce6dd;
}

* { box-sizing: border-box; }

body {
  margin: 0;
  background: var(--cream);
  font-family: system-ui, sans-serif;
  color: var(--ink);
}

header {
  background: var(--green);
  color: white;
  padding: 22px;
}

header h1 { margin: 0; }
header p { color: #d3e7d7; }

main {
  max-width: 1120px;
  margin: auto;
  padding: 24px 20px 70px;
}

.hero {
  background: linear-gradient(120deg, #d8ebd9, #f4f0dc);
  padding: 28px;
  border-radius: 20px;
}

.stats {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 14px;
  margin: 20px 0;
}

.stat, .panel, .bed-card, .plant-card {
  background: white;
  border: 1px solid var(--line);
  border-radius: 16px;
  padding: 20px;
}

.stat span {
  display: block;
  color: var(--muted);
}

.stat strong {
  display: block;
  font-size: 2rem;
  margin-top: 8px;
}

nav {
  display: flex;
  flex-wrap: wrap;
  gap: 9px;
  margin: 24px 0;
}

button {
  font: inherit;
  cursor: pointer;
  border: 0;
  border-radius: 10px;
  padding: 11px 15px;
  font-weight: 600;
  background: var(--green);
  color: white;
}

button.secondary {
  background: var(--mint);
  color: var(--green);
}

button.danger {
  background: #fbe8e6;
  color: #9a3028;
}

nav button {
  background: white;
  color: var(--green);
  border: 1px solid var(--line);
}

nav button.active {
  background: var(--green);
  color: white;
}

.section { display: none; }
.section.active { display: block; }

.sectionhead {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
  margin-bottom: 18px;
}

.cards, .beds {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 18px;
}

.bed-grid {
  display: grid;
  gap: 6px;
  background: #d5b89a;
  border: 9px solid #ad8054;
  border-radius: 12px;
  padding: 9px;
  margin: 16px 0;
}

.plot {
  min-width: 0;
  aspect-ratio: 1;
  background: #f4e6ce;
  color: #574a36;
  border: 1px dashed #bd9d78;
  border-radius: 8px;
  padding: 4px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 3px;
}

.plot b { font-size: 1.5rem; }

.plot small {
  font-size: .7rem;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 100%;
}

.plot.filled {
  background: #d7e9ca;
  color: #254a35;
  border: 1px solid #92b586;
}

.plot:hover, .plot:focus-visible {
  outline: 3px solid #2f7954;
}

.hint {
  color: var(--muted);
  font-size: .85rem;
}

.entry {
  padding: 12px 0;
  border-bottom: 1px solid var(--line);
}

.actions {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
  margin-top: 12px;
}

.harvest-pill {
  display: inline-block;
  background: #eef4df;
  padding: 6px 9px;
  border-radius: 8px;
  margin: 5px;
  font-size: .8rem;
}

dialog {
  border: 0;
  border-radius: 18px;
  padding: 25px;
  width: min(95vw, 470px);
  box-shadow: 0 20px 80px #0003;
}

dialog::backdrop {
  background: #14291b88;
}

form { display: grid; gap: 13px; }

label {
  display: grid;
  gap: 5px;
  font-weight: 600;
}

input, select, textarea {
  font: inherit;
  width: 100%;
  padding: 11px;
  border: 1px solid #cad9cc;
  border-radius: 9px;
}

textarea { min-height: 90px; }

.formactions {
  display: flex;
  justify-content: flex-end;
  gap: 8px;
  margin-top: 8px;
}

@media (max-width: 700px) {
  .stats { grid-template-columns: repeat(2, 1fr); }
  .sectionhead { flex-direction: column; align-items: start; }
}
</style>
</head>

<body>

<header>
  <h1>🌿 Garden Grove</h1>
  <p>Your personal garden tracker</p>
</header>

<main>

<div class="hero">
  <h2>Grow something wonderful 🌱</h2>
  <p>Track your plants, raised beds, watering, and harvests.</p>
</div>

<div class="stats">
  <div class="stat">
    <span>Plants tracked</span>
    <strong id="plantCount">0</strong>
  </div>
  <div class="stat">
    <span>Need watering</span>
    <strong id="waterCount">0</strong>
  </div>
  <div class="stat">
    <span>Harvest records</span>
    <strong id="harvestCount">0</strong>
  </div>
  <div class="stat">
    <span>Journal entries</span>
    <strong id="noteCount">0</strong>
  </div>
</div>

<nav>
  <button class="active" data-tab="dashboard">Dashboard</button>
  <button data-tab="plants">My Plants</button>
  <button data-tab="planner">🪴 Bed Planner</button>
  <button data-tab="harvests">Harvests</button>
  <button data-tab="journal">Journal</button>
</nav>

<section id="dashboard" class="section active">
  <div class="panel">
    <h2>💧 Watering reminders</h2>
    <div id="dueList"></div>
  </div>
</section>

<section id="plants" class="section">
  <div class="sectionhead">
    <h2>My Plants</h2>
    <button onclick="openForm('plant')">+ Add plant</button>
  </div>
  <div id="plantCards" class="cards"></div>
</section>

<section id="planner" class="section">
  <div class="sectionhead">
    <div>
      <h2>Interactive Garden Bed Planner</h2>
      <p class="hint">Select a planting square to assign a vegetable.</p>
    </div>
    <button onclick="openBedForm()">+ Add raised bed</button>
  </div>

  <div class="panel" style="margin-bottom:18px">
    <strong>🌤️ Minnesota growing tip</strong>
    <p class="hint">
      Tomatoes and peppers are generally transplanted outdoors
      after the danger of frost has passed.
    </p>
  </div>

  <div id="bedCards" class="beds"></div>
</section>

<section id="harvests" class="section">
  <div class="sectionhead">
    <h2>Harvest Log</h2>
    <button onclick="openForm('harvest')">+ Log harvest</button>
  </div>
  <div class="panel" id="harvestList"></div>
</section>

<section id="journal" class="section">
  <div class="sectionhead">
    <h2>Garden Journal</h2>
    <button onclick="openForm('note')">+ Add note</button>
  </div>
  <div class="panel" id="noteList"></div>
</section>

<p class="hint">
  Garden information is saved in this browser using local storage.
</p>

</main>

<!-- Add raised bed dialog -->

<dialog id="bedEditor">
  <h2>Add a raised bed</h2>
  <form id="bedForm">
    <label>
      Bed name
      <input name="name" placeholder="South raised bed" required>
    </label>
    <label>
      Length (feet)
      <input type="number" name="length" min="1" max="30" value="8" required>
    </label>
    <label>
      Width (feet)
      <input type="number" name="width" min="1" max="12" value="4" required>
    </label>
    <label>
      Grid columns
      <input type="number" name="cols" min="1" max="8" value="4" required>
    </label>
    <label>
      Grid rows
      <input type="number" name="rows" min="1" max="8" value="2" required>
    </label>
    <div class="formactions">
      <button type="button" class="secondary"
        onclick="bedEditor.close()">Cancel</button>
      <button type="submit">Create bed</button>
    </div>
  </form>
</dialog>

<!-- Plant a zone dialog -->

<dialog id="plotEditor">
  <h2 id="plotTitle">Plant a zone</h2>
  <form id="plotForm">
    <label>
      Crop
      <select name="crop" id="cropSelect" required></select>
    </label>
    <label>
      Planting date
      <input type="date" name="date" id="plotDate" required>
    </label>
    <p class="hint" id="harvestEstimate"></p>
    <div class="formactions">
      <button type="button" class="danger"
        onclick="clearSelectedPlot()">Clear zone</button>
      <button type="button" class="secondary"
        onclick="plotEditor.close()">Cancel</button>
      <button type="submit">Save planting</button>
    </div>
  </form>
</dialog>

<!-- General entry dialog -->

<dialog id="editor">
  <h2 id="formTitle"></h2>
  <form id="entryForm">
    <div id="fields"></div>
    <div class="formactions">
      <button type="button" class="secondary"
        onclick="editor.close()">Cancel</button>
      <button type="submit">Save</button>
    </div>
  </form>
</dialog>

<script>
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
  state = saved && Array.isArray(saved.plants) ? saved : initial;
} catch {
  state = initial;
}

for (const key of Object.keys(initial)) {
  if (!Array.isArray(state[key])) state[key] = [];
}

const $ = id => document.getElementById(id);

const today = () => {
  const d = new Date();
  return [
    d.getFullYear(),
    String(d.getMonth() + 1).padStart(2, "0"),
    String(d.getDate()).padStart(2, "0")
  ].join("-");
};

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

function save() {
  localStorage.setItem(KEY, JSON.stringify(state));
  render();
}

function daysSince(date) {
  const now = new Date(today() + "T12:00:00");
  const then = new Date(date + "T12:00:00");
  return Math.floor((now - then) / 86400000);
}

function due(plant) {
  return !plant.lastWatered ||
    daysSince(plant.lastWatered) >= Number(plant.interval || 3);
}

// Crop catalog with approximate days to harvest.

const CROPS = {
  Tomato:       { emoji: "🍅", days: 80 },
  Pepper:       { emoji: "🫑", days: 85 },
  Carrot:       { emoji: "🥕", days: 70 },
  Lettuce:      { emoji: "🥬", days: 45 },
  Cucumber:     { emoji: "🥒", days: 60 },
  "Green beans":{ emoji: "🫘", days: 55 },
  Radish:       { emoji: "🌱", days: 30 },
  Kale:         { emoji: "🥬", days: 55 },
  Zucchini:     { emoji: "🥒", days: 55 },
  Basil:        { emoji: "🌿", days: 60 },
  Strawberry:   { emoji: "🍓", days: 90 },
  Other:        { emoji: "🌱", days: 70 }
};

// Dashboard and plant tracking

function render() {
  $("plantCount").textContent = state.plants.length;
  $("waterCount").textContent = state.plants.filter(due).length;
  $("harvestCount").textContent = state.harvests.length;
  $("noteCount").textContent = state.notes.length;

  const pending = state.plants.filter(due);

  $("dueList").innerHTML = pending.length
    ? pending.map(p => `
      <div class="entry">
        <strong>${escapeHTML(p.name)}</strong>
        <p>${escapeHTML(p.bed)}</p>
        <button onclick="water('${p.id}')">Mark watered</button>
      </div>
    `).join("")
    : '<p class="hint">No watering reminders right now.</p>';

  $("plantCards").innerHTML = state.plants.length
    ? state.plants.map(p => `
      <article class="plant-card">
        <h3>🌱 ${escapeHTML(p.name)}</h3>
        <p>${escapeHTML(p.type)} · ${escapeHTML(p.stage)}</p>
        <p>📍 ${escapeHTML(p.bed)}</p>
        <p>📅 Planted ${fmt(p.planted)}</p>
        <p>💧 Water every ${Number(p.interval)} days</p>
        <p>${due(p) ? "Watering due" : "Watered " + fmt(p.lastWatered)}</p>
        <div class="actions">
          <button onclick="water('${p.id}')">Watered today</button>
          <button class="secondary" onclick="openForm('plant','${p.id}')">Edit</button>
          <button class="danger" onclick="removeEntry('plants','${p.id}')">Delete</button>
        </div>
      </article>
    `).join("")
    : '<p class="hint">No plants yet. Add your first plant.</p>';

  $("harvestList").innerHTML = state.harvests.length
    ? [...state.harvests].sort((a,b) => b.date.localeCompare(a.date))
      .map(h => `
        <div class="entry">
          <strong>🥬 ${escapeHTML(h.crop)}</strong>
          <p>${escapeHTML(h.amount)} · ${fmt(h.date)}</p>
          <button class="danger" onclick="removeEntry('harvests','${h.id}')">Delete</button>
        </div>
      `).join("")
    : '<p class="hint">No harvests recorded yet.</p>';

  $("noteList").innerHTML = state.notes.length
    ? [...state.notes].sort((a,b) => b.date.localeCompare(a.date))
      .map(n => `
        <div class="entry">
          <strong>${escapeHTML(n.title)}</strong>
          <p>${fmt(n.date)}</p>
          <p style="white-space:pre-wrap">${escapeHTML(n.body)}</p>
          <button class="danger" onclick="removeEntry('notes','${n.id}')">Delete</button>
        </div>
      `).join("")
    : '<p class="hint">Your journal is empty.</p>';

  renderBeds();
}

function water(id) {
  const plant = state.plants.find(p => p.id === id);
  if (plant) {
    plant.lastWatered = today();
    save();
  }
}

function removeEntry(collection, id) {
  if (confirm("Delete this entry?")) {
    state[collection] = state[collection].filter(x => x.id !== id);
    save();
  }
}

// Add and edit plant, harvest, and journal records

let mode;
let editing;

function field(label, name, type = "text", value = "", extra = "") {
  return `
    <label>${label}
      <input name="${name}" type="${type}"
        value="${escapeHTML(value)}" ${extra} required>
    </label>
  `;
}

function choose(label, name, options, selected) {
  return `
    <label>${label}
      <select name="${name}">
        ${options.map(o => `
          <option value="${escapeHTML(o)}" ${o === selected ? "selected" : ""}>
            ${escapeHTML(o)}
          </option>
        `).join("")}
      </select>
    </label>
  `;
}

function openForm(kind, id) {
  mode = kind;
  editing = id || null;

  const p = state.plants.find(x => x.id === id) || {};

  $("formTitle").textContent =
    kind === "plant" ? (id ? "Edit plant" : "Add plant") :
    kind === "harvest" ? "Log a harvest" : "New journal entry";

  if (kind === "plant") {
    $("fields").innerHTML =
      field("Plant name", "name", "text", p.name || "", 'maxlength="80"') +
      choose("Category", "type",
        ["Vegetable","Herb","Flower","Fruit","Other"], p.type) +
      field("Garden bed / location", "bed", "text", p.bed || "") +
      field("Planting date", "planted", "date", p.planted || today()) +
      choose("Growth stage", "stage",
        ["Seed","Seedling","Growing","Flowering","Ready to harvest","Finished"],
        p.stage) +
      field("Water every (days)", "interval", "number", p.interval || 3,
        'min="1" max="365"') +
      `<label>Last watered
        <input name="lastWatered" type="date"
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
      '<label>Notes<textarea name="body" required></textarea></label>';
  }

  $("editor").showModal();
}

$("entryForm").addEventListener("submit", e => {
  e.preventDefault();
  const data = Object.fromEntries(new FormData(e.currentTarget));

  if (mode === "plant") {
    const item = {
      ...data,
      id: editing || crypto.randomUUID(),
      interval: Math.max(1, Number(data.interval) || 3)
    };
    if (editing) {
      state.plants = state.plants.map(p => p.id === editing ? item : p);
    } else {
      state.plants.push(item);
    }
  } else if (mode === "harvest") {
    state.harvests.push({...data, id: crypto.randomUUID()});
  } else {
    state.notes.push({...data, id: crypto.randomUUID()});
  }

  $("editor").close();
  save();
});

// Interactive raised-bed planner

function renderBeds() {
  $("bedCards").innerHTML = state.beds.length
    ? state.beds.map(bed => {
      const total = bed.rows * bed.cols;
      const planted = Object.values(bed.plots).filter(Boolean).length;

      const squares = Array.from({length: total}, (_, i) => {
        const planting = bed.plots[i];
        const crop = planting
          ? (CROPS[planting.crop] || CROPS.Other)
          : null;

        return `
          <button type="button"
            class="plot ${planting ? "filled" : ""}"
            onclick="openPlot('${bed.id}', ${i})">
            <b>${crop ? crop.emoji : "+"}</b>
            <small>${planting ? escapeHTML(planting.crop) : "Plant"}</small>
          </button>
        `;
      }).join("");

      const upcoming = Object.values(bed.plots)
        .filter(Boolean)
        .map(p => ({
          ...p,
          harvest: addDays(
            p.date,
            (CROPS[p.crop] || CROPS.Other).days
          )
        }))
        .sort((a,b) => a.harvest.localeCompare(b.harvest))
        .slice(0, 3);

      return `
        <article class="bed-card">
          <div class="sectionhead">
            <div>
              <h3>🪴 ${escapeHTML(bed.name)}</h3>
              <p class="hint">
                ${bed.length} × ${bed.width} ft ·
                ${planted}/${total} zones planted
              </p>
            </div>
            <button class="danger" onclick="removeBed('${bed.id}')">
              Delete
            </button>
          </div>

          <div class="bed-grid"
            style="grid-template-columns:repeat(${bed.cols},minmax(0,1fr))">
            ${squares}
          </div>

          <strong>Estimated upcoming harvests</strong>
          <div>
            ${upcoming.length
              ? upcoming.map(p => `
                <span class="harvest-pill">
                  ${escapeHTML(p.crop)} · ${fmt(p.harvest)}
                </span>
              `).join("")
              : '<p class="hint">Plant a zone to see harvest estimates.</p>'}
          </div>
        </article>
      `;
    }).join("")
    : '<div class="panel">No raised beds yet. Add one to begin planning.</div>';
}

function openBedForm() {
  $("bedForm").reset();
  $("bedEditor").showModal();
}

$("bedForm").addEventListener("submit", e => {
  e.preventDefault();
  const data = Object.fromEntries(new FormData(e.currentTarget));

  state.beds.push({
    id: crypto.randomUUID(),
    name: data.name,
    length: Number(data.length),
    width: Number(data.width),
    cols: Number(data.cols),
    rows: Number(data.rows),
    plots: {}
  });

  $("bedEditor").close();
  save();
});

function removeBed(id) {
  if (confirm("Delete this raised bed and its planting zones?")) {
    state.beds = state.beds.filter(b => b.id !== id);
    save();
  }
}

let selectedBed = null;
let selectedZone = null;

$("cropSelect").innerHTML = Object.keys(CROPS)
  .map(c => `<option value="${escapeHTML(c)}">${escapeHTML(c)}</option>`)
  .join("");

function openPlot(bedId, index) {
  selectedBed = bedId;
  selectedZone = index;

  const bed = state.beds.find(b => b.id === bedId);
  if (!bed) return;

  const planting = bed.plots[index];

  $("plotTitle").textContent = bed.name + " · Zone " + (index + 1);
  $("cropSelect").value = planting?.crop || "Tomato";
  $("plotDate").value = planting?.date || today();

  updateEstimate();
  $("plotEditor").showModal();
}

function updateEstimate() {
  const crop = CROPS[$("cropSelect").value];
  const date = $("plotDate").value;

  $("harvestEstimate").textContent = crop && date
    ? "Estimated first harvest: " + fmt(addDays(date, crop.days)) +
      " (approximately " + crop.days + " days after planting)"
    : "";
}

$("cropSelect").addEventListener("change", updateEstimate);
$("plotDate").addEventListener("change", updateEstimate);

$("plotForm").addEventListener("submit", e => {
  e.preventDefault();

  const bed = state.beds.find(b => b.id === selectedBed);
  if (!bed) return;

  bed.plots[selectedZone] = {
    crop: $("cropSelect").value,
    date: $("plotDate").value
  };

  $("plotEditor").close();
  save();
});

function clearSelectedPlot() {
  const bed = state.beds.find(b => b.id === selectedBed);
  if (!bed) return;

  delete bed.plots[selectedZone];
  $("plotEditor").close();
  save();
}

// Navigation

document.querySelectorAll("nav button").forEach(button => {
  button.addEventListener("click", () => {
    document.querySelectorAll("nav button")
      .forEach(b => b.classList.remove("active"));

    document.querySelectorAll(".section")
      .forEach(s => s.classList.remove("active"));

    button.classList.add("active");
    $(button.dataset.tab).classList.add("active");
  });
});

// Initialize application

render();
</script>

</body>
</html>

