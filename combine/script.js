// ======================================
// GARDEN GROVE - MAIN JAVASCRIPT
// ======================================

const STORAGE_KEY = "gardenGroveDataV1";

const cropInfo = {
  rhubarb: {
    icon: "🌿",
    days: 365,
    tip: "Rhubarb needs lots of space and stays in the ground for years. Keep away from paths!"
  },
  asparagus: {
    icon: "🎋",
    days: 730,
    tip: "Asparagus takes 2-3 years to establish. Plant in a dedicated permanent bed."
  },
  broccoli: {
    icon: "🥦",
    days: 80,
    tip: "Broccoli likes cool weather and firm soil. Watch out for cabbage white butterflies!"
  },
   tomato: {
    icon: "🍅",
    days: 80,
    tip: "Tomatoes need full sun and consistent watering."
  },
  carrot: {
    icon: "🥕",
    days: 75,
    tip: "Carrots prefer loose, stone-free soil."
  },
   lettuce: {
    icon: "🥬",
    days: 50,
    tip: "Lettuce grows best in cooler weather."
  },
  pepper: {
    icon: "🫑",
    days: 80,
    tip: "Peppers need warm soil and plenty of sunlight."
  }
};

const defaultData = () => ({
  plants: [],
  beds: [],
  harvests: [],
  notes: [],
  gourmetGrid: Array(30).fill(null)
});

function loadData() {
  try {
    const saved = JSON.parse(
      localStorage.getItem(STORAGE_KEY)
    );

    if (!saved || typeof saved !== "object") {
      return defaultData();
    }

 const defaults = defaultData();

    for (const key of Object.keys(defaults)) {
      if (!Array.isArray(saved[key])) {
        saved[key] = defaults[key];
      }
    }

    saved.gourmetGrid = Array.from(
      { length: 30 },
      (_, i) => saved.gourmetGrid[i] || null
    );

    return saved;
  } catch {
    return defaultData();
  }
}

let data = loadData();
let formType = null;
let selectedPlot = null;
let activePlant = null;

const $ = id => document.getElementById(id);

function saveData() {
  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify(data)
  );
  renderAll();
}

function today() {
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1)
    .padStart(2, "0");
  const day = String(date.getDate())
    .padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function dateFromString(value) {
  return new Date(`${value}T12:00:00`);
}

function addDays(value, days) {
  const date = dateFromString(value);
  date.setDate(date.getDate() + days);

  return [
    date.getFullYear(),
    String(date.getMonth() + 1).padStart(2, "0"),
    String(date.getDate()).padStart(2, "0")
  ].join("-");
}

function makeId() {
  return crypto.randomUUID
    ? crypto.randomUUID()
    : `${Date.now()}-${Math.random()}`;
}

function createElement(tag, text, className) {
  const element = document.createElement(tag);

  if (text !== undefined) {
    element.textContent = text;
  }

  if (className) {
    element.className = className;
  }

  return element;
}

function addButton(parent, text, callback, className) {
  const button = createElement(
    "button",
    text,
    className
  );

  button.type = "button";
  button.addEventListener("click", callback);
  parent.appendChild(button);

  return button;
}

// ======================================
// NAVIGATION
// ======================================

document.querySelectorAll("nav button")
  .forEach(button => {
    button.addEventListener("click", () => {
      document.querySelectorAll("nav button")
        .forEach(item => item.classList.remove("active"));

      document.querySelectorAll(".section")
        .forEach(section =>
          section.classList.remove("active")
        );

      button.classList.add("active");
      $(button.dataset.tab).classList.add("active");
    });
  });

// ======================================
// DASHBOARD
// ======================================

function needsWater(plant) {
  return addDays(
    plant.lastWatered,
    plant.frequency
  ) <= today();
}

function renderDashboard() {
  $("plantCount").textContent = data.plants.length;
  $("waterCount").textContent =
    data.plants.filter(needsWater).length;
  $("harvestCount").textContent =
    data.harvests.length;
  $("noteCount").textContent = data.notes.length;

  const list = $("dueList");
  list.replaceChildren();

  const duePlants = data.plants.filter(needsWater);

  if (!duePlants.length) {
    list.appendChild(
      createElement(
        "p",
        "All tracked plants are up to date!"
      )
    );
    return;
  }

  duePlants.forEach(plant => {
    const row = createElement("div", "", "entry");

    row.appendChild(
      createElement(
        "strong",
        `${plant.name} needs watering`
      )
    );

    addButton(row, "Mark watered", () => {
      plant.lastWatered = today();
      saveData();
    });

    list.appendChild(row);
  });
}

// ======================================
// GENERAL ENTRY FORMS
// ======================================

const formFields = {
  plant: [
    {
      name: "name",
      label: "Plant name",
      type: "text",
      required: true
    },
    {
      name: "location",
      label: "Location or raised bed",
      type: "text"
    },
    {
      name: "lastWatered",
      label: "Last watered",
      type: "date",
      required: true
    },
    {
      name: "frequency",
      label: "Water every how many days?",
      type: "number",
      min: 1,
      value: 3,
      required: true
    }
  ],
  harvest: [
    {
      name: "crop",
      label: "Crop harvested",
      type: "text",
      required: true
    },
    {
      name: "quantity",
      label: "Quantity",
      type: "text",
      required: true
    },
    {
      name: "date",
      label: "Harvest date",
      type: "date",
      required: true
    }
  ],
  note: [
    {
      name: "title",
      label: "Journal title",
      type: "text",
      required: true
    },
    {
      name: "date",
      label: "Date",
      type: "date",
      required: true
    },
    {
      name: "content",
      label: "Garden notes",
      type: "textarea",
      required: true
    }
  ]
};

function openForm(type) {
  formType = type;

  const titles = {
    plant: "Add a Plant",
    harvest: "Log a Harvest",
    note: "Add Journal Entry"
  };

  $("formTitle").textContent = titles[type];

  const fields = $("fields");
  fields.replaceChildren();

  formFields[type].forEach(field => {
    const label = createElement(
      "label",
      field.label
    );

    const input = document.createElement(
      field.type === "textarea"
        ? "textarea"
        : "input"
    );

    if (field.type !== "textarea") {
      input.type = field.type;
    }

    input.name = field.name;
    input.required = Boolean(field.required);

    if (field.min !== undefined) {
      input.min = field.min;
    }

    if (field.type === "date") {
      input.value = today();
    } else if (field.value !== undefined) {
      input.value = field.value;
    }

    label.appendChild(input);
    fields.appendChild(label);
  });

  $("editor").showModal();
}

$("entryForm").addEventListener("submit", event => {
  event.preventDefault();

  const values = Object.fromEntries(
    new FormData(event.target).entries()
  );

  if (formType === "plant") {
    data.plants.push({
      id: makeId(),
      name: values.name.trim(),
      location: values.location.trim(),
      lastWatered: values.lastWatered,
      frequency: Number(values.frequency)
    });
  }

  if (formType === "harvest") {
    data.harvests.push({
      id: makeId(),
      crop: values.crop.trim(),
      quantity: values.quantity.trim(),
      date: values.date
    });
  }

  if (formType === "note") {
    data.notes.push({
      id: makeId(),
      title: values.title.trim(),
      content: values.content.trim(),
      date: values.date
    });
  }

  $("editor").close();
  event.target.reset();
  saveData();
});

// ======================================
// MY PLANTS
// ======================================

function renderPlants() {
  const container = $("plantCards");
  container.replaceChildren();

  if (!data.plants.length) {
    container.appendChild(
      createElement(
        "p",
        "No plants yet. Add your first plant!"
      )
    );
    return;
  }

  data.plants.forEach(plant => {
    const card = createElement("div", "", "card");

    card.appendChild(
      createElement("h3", `🌱 ${plant.name}`)
    );

    card.appendChild(
      createElement(
        "p",
        `Location: ${plant.location || "Not specified"}`
      )
    );

    card.appendChild(
      createElement(
        "p",
        `Next watering: ${addDays(
          plant.lastWatered,
          plant.frequency
        )}`
      )
    );

    addButton(card, "Water today", () => {
      plant.lastWatered = today();
      saveData();
    });

    addButton(
      card,
      "Delete",
      () => {
        if (confirm(`Delete ${plant.name}?`)) {
          data.plants = data.plants.filter(
            item => item.id !== plant.id
          );
          saveData();
        }
      },
      "danger"
    );

    container.appendChild(card);
  });
}

// ======================================
// GOURMET GARDEN GRID
// ======================================

const gardenGrid = $("garden-grid");
const tipText = $("tip-text");

function showCropTip(type) {
  const crop = cropInfo[type];

  if (!crop) {
    tipText.textContent =
      "Select a vegetable to see growing tips.";
    return;
  }

  tipText.textContent =
    `${type.toUpperCase()}: ${crop.tip}`;
}

function selectSeed(type) {
  activePlant = type;
  showCropTip(type);

  document.querySelectorAll(".plant-option")
    .forEach(item => {
      item.classList.toggle(
        "selected",
        item.dataset.type === type
      );
    });
}

document.querySelectorAll(".plant-option")
  .forEach(item => {
    item.addEventListener("dragstart", event => {
      selectSeed(item.dataset.type);

      event.dataTransfer.setData(
        "text/plain",
        item.dataset.type
      );
    });

    item.addEventListener("click", () => {
      selectSeed(item.dataset.type);
    });
  });

function plantGourmetCell(index, type) {
  if (!cropInfo[type]) return;

  data.gourmetGrid[index] = type;
  showCropTip(type);
  saveData();
}

function renderGourmetGrid() {
  gardenGrid.replaceChildren();

  for (let i = 0; i < 30; i++) {
    const type = data.gourmetGrid[i];
    const cell = createElement("button", "", "cell");

    cell.type = "button";

    if (type && cropInfo[type]) {
      cell.textContent = cropInfo[type].icon;
    }

    cell.setAttribute(
      "aria-label",
      type
        ? `Plot ${i + 1}: ${type}. Click to clear.`
        : `Empty plot ${i + 1}. Click to plant.`
    );

    cell.addEventListener("dragover", event => {
      event.preventDefault();
    });

    cell.addEventListener("drop", event => {
      event.preventDefault();

      const crop = event.dataTransfer.getData(
        "text/plain"
      );

      plantGourmetCell(i, crop);
    });

    cell.addEventListener("click", () => {
      if (data.gourmetGrid[i]) {
        data.gourmetGrid[i] = null;
        saveData();
      } else if (activePlant) {
        plantGourmetCell(i, activePlant);
      } else {
        tipText.textContent =
          "Select a seed from the Seed Box first.";
      }
    });

    gardenGrid.appendChild(cell);
  }
}

$("clearGarden").addEventListener("click", () => {
  if (confirm("Clear all 30 planting squares?")) {
    data.gourmetGrid = Array(30).fill(null);
    saveData();
  }
});

// ======================================
// CUSTOM RAISED BEDS
// ======================================

function openBedForm() {
  $("bedEditor").showModal();
}

$("bedForm").addEventListener("submit", event => {
  event.preventDefault();

  const values = Object.fromEntries(
    new FormData(event.target).entries()
  );

  const rows = Number(values.rows);
  const cols = Number(values.cols);

  data.beds.push({
    id: makeId(),
    name: values.name.trim(),
    length: Number(values.length),
    width: Number(values.width),
    rows,
    cols,
    plots: Array(rows * cols).fill(null)
  });

  $("bedEditor").close();
  event.target.reset();
  saveData();
});

function renderBeds() {
  const container = $("bedCards");
  container.replaceChildren();

  if (!data.beds.length) {
    container.appendChild(
      createElement(
        "p",
        "No custom raised beds yet."
      )
    );
    return;
  }

  data.beds.forEach(bed => {
    const card = createElement(
      "div",
      "",
      "bed-card"
    );

    card.appendChild(
      createElement("h3", `🪴 ${bed.name}`)
    );

    card.appendChild(
      createElement(
        "p",
        `${bed.length} ft × ${bed.width} ft`
      )
    );

    const grid = createElement(
      "div",
      "",
      "bed-grid"
    );

    grid.style.gridTemplateColumns =
      `repeat(${bed.cols}, minmax(0, 1fr))`;

    for (let i = 0; i < bed.rows * bed.cols; i++) {
      const plot = bed.plots[i];

      const cell = createElement(
        "button",
        "",
        "bed-cell"
      );

      cell.type = "button";

      if (plot) {
        cell.classList.add("planted");

        const crop = cropInfo[plot.crop];

        cell.appendChild(
          createElement(
            "div",
            `${crop?.icon || "🌱"} ${plot.crop}`
          )
        );

        cell.appendChild(
          createElement(
            "span",
            `Planted: ${plot.date}`
          )
        );
      } else {
        cell.textContent = "+";
      }

      cell.addEventListener("click", () => {
        openPlotForm(bed.id, i);
      });

      grid.appendChild(cell);
    }

    card.appendChild(grid);

    addButton(
      card,
      "Delete bed",
      () => {
        if (confirm(`Delete ${bed.name}?`)) {
          data.beds = data.beds.filter(
            item => item.id !== bed.id
          );
          saveData();
        }
      },
      "danger"
    );

    container.appendChild(card);
  });
}

// ======================================
// PLANTING ZONE DIALOG
// ======================================

function openPlotForm(bedId, index) {
  selectedPlot = { bedId, index };

  const bed = data.beds.find(
    item => item.id === bedId
  );

  const plot = bed.plots[index];

  $("plotTitle").textContent =
    `${bed.name} - Zone ${index + 1}`;

  const select = $("cropSelect");
  select.replaceChildren();

  Object.keys(cropInfo).forEach(type => {
    const option = document.createElement("option");

    option.value = type;
    option.textContent =
      `${cropInfo[type].icon} ${type}`;

    select.appendChild(option);
  });

  select.value = plot?.crop || "broccoli";
  $("plotDate").value = plot?.date || today();

  updateHarvestEstimate();
  $("plotEditor").showModal();
}

function updateHarvestEstimate() {
  const type = $("cropSelect").value;
  const date = $("plotDate").value;

  if (!type || !date) {
    $("harvestEstimate").textContent = "";
    return;
  }

  const crop = cropInfo[type];

  $("harvestEstimate").textContent =
    `Approximate harvest or establishment: ${
      addDays(date, crop.days)
    }. Actual timing varies by variety and conditions.`;
}

$("cropSelect").addEventListener(
  "change",
  updateHarvestEstimate
);

$("plotDate").addEventListener(
  "change",
  updateHarvestEstimate
);

$("plotForm").addEventListener("submit", event => {
  event.preventDefault();

  if (!selectedPlot) return;

  const bed = data.beds.find(
    item => item.id === selectedPlot.bedId
  );

  if (!bed) return;

  bed.plots[selectedPlot.index] = {
    crop: $("cropSelect").value,
    date: $("plotDate").value
  };

  $("plotEditor").close();
  selectedPlot = null;
  saveData();
});

function clearSelectedPlot() {
  if (!selectedPlot) return;

  const bed = data.beds.find(
    item => item.id === selectedPlot.bedId
  );

  if (bed) {
    bed.plots[selectedPlot.index] = null;
  }

  $("plotEditor").close();
  selectedPlot = null;
  saveData();
}

// ======================================
// HARVEST LOG
// ======================================

function renderHarvests() {
  const container = $("harvestList");
  container.replaceChildren();

  if (!data.harvests.length) {
    container.appendChild(
      createElement("p", "No harvests recorded yet.")
    );
    return;
  }

  data.harvests.forEach(harvest => {
    const row = createElement("div", "", "entry");

    row.appendChild(
      createElement(
        "strong",
        `🥬 ${harvest.crop}`
      )
    );

    row.appendChild(
      createElement(
        "p",
        `${harvest.quantity} — ${harvest.date}`
      )
    );

    addButton(
      row,
      "Delete",
      () => {
        data.harvests = data.harvests.filter(
          item => item.id !== harvest.id
        );
        saveData();
      },
      "danger"
    );

    container.appendChild(row);
  });
}

// ======================================
// GARDEN JOURNAL
// ======================================

function renderNotes() {
  const container = $("noteList");
  container.replaceChildren();

  if (!data.notes.length) {
    container.appendChild(
      createElement("p", "No journal entries yet.")
    );
    return;
  }

  data.notes.forEach(note => {
    const row = createElement("div", "", "entry");

    row.appendChild(
      createElement("h3", note.title)
    );

    row.appendChild(
      createElement("small", note.date)
    );

    row.appendChild(
      createElement("p", note.content)
    );

    addButton(
      row,
      "Delete",
      () => {
        data.notes = data.notes.filter(
          item => item.id !== note.id
        );
        saveData();
      },
      "danger"
    );

    container.appendChild(row);
  });
}

// ======================================
// RENDER EVERYTHING
// ======================================

function renderAll() {
  renderDashboard();
  renderPlants();
  renderGourmetGrid();
  renderBeds();
  renderHarvests();
  renderNotes();
}

renderAll();