import { breeds } from './data_sample.js';
const list = document.querySelector("ul#breeds.cards");

//array for saving current filers
let currentFilters = {
  maxHeight: 100,
  maxLifeSpan: 50,
  weightCategory: "all",
  keyword: "",
};

function getAverageWeight(weightMetric) {
  if (!weightMetric) return 0;
  const parts = weightMetric.split(' - ');
  if (parts.length === 2) {
    const [min, max] = parts.map(Number);
    return (min + max) / 2;
  } else {
    return Number(weightMetric);
  }
}

function getAverageHeight(heightMetric) {
  if (!heightMetric) return 0;
  const parts = heightMetric.split(' - ');
  if (parts.length === 2) {
    const [min, max] = parts.map(Number);
    return (min + max) / 2;
  } else {
    return Number(heightMetric);
  }
}

function parseLifeSpan(lifeSpan) {
  if (!lifeSpan) return 0;
  const parts = lifeSpan.split(' ');
  for (let i = 0; i < parts.length; i++) {
    const num = parseInt(parts[i]);
    if (!isNaN(num)) {
      return num;
    }
  }
  return 0;
}

function renderBreeds(breedsArray) {
  list.innerHTML = "";
  for (const breed of breedsArray) {
    const li = document.createElement("li");
    li.className = "card";
    li.innerHTML = `
      <div class="card-image">
        <img src="https://cdn2.thedogapi.com/images/${breed.reference_image_id}.jpg" alt="${breed.name}">
      </div>
      <div class="card-content">
        <h2>${breed.name}</h2>
        <p>Weight: ${breed.weight.metric} kg</p>
        <p>Height: ${breed.height.metric} cm</p>
        <p>Life Span: ${breed.life_span}</p>
        <p>Temperament: ${breed.temperament ?? "Unknown"}</p>
      </div>`;
    list.appendChild(li);
  }
}


//function for applying filters
function applyFilters() {
  let filtered = breeds.filter(breed => {
    const avgHeight = getAverageHeight(breed.height?.metric);
    const avgLifeSpan = parseLifeSpan(breed.life_span);
    const avgWeight = getAverageWeight(breed.weight?.metric);

    const heightOk = avgHeight <= currentFilters.maxHeight;
    const lifeSpanOk = avgLifeSpan <= currentFilters.maxLifeSpan;
    let weightOk = true;

    if (currentFilters.weightCategory === "under5"){
      weightOk = avgWeight < 5;
    } else if (currentFilters.weightCategory === "over5"){
      weightOk = avgWeight >= 5;
    }

    const keywordOk = currentFilters.keyword === "" || breed.name.toLowerCase().includes(currentFilters.keyword);

    return heightOk && lifeSpanOk && weightOk && keywordOk; 
  });

  renderBreeds(filtered);
}


const sortSelect = document.createElement("select");
sortSelect.classList.add("sort-select");
sortSelect.style.width = "200px";
sortSelect.innerHTML = `
  <option value="default">Sort dogs by</option>
  <option value="weight">Weight</option>
  <option value="height">Height</option>
  <option value="life_span">Life Span</option>`;
list.before(sortSelect);

renderBreeds(breeds);

sortSelect.addEventListener("change", (event) => {
  const sortBy = event.target.value;
  if (sortBy === "default") {
    renderBreeds(breeds);
    return;
  }
  const sortedBreeds = [...breeds].sort((a, b) => {
    if (sortBy === "weight") {
      return getAverageWeight(a.weight.metric) - getAverageWeight(b.weight.metric);
    } else if (sortBy === "height") {
      return getAverageHeight(a.height.metric) - getAverageHeight(b.height.metric);
    } else if (sortBy === "life_span") {
      const lifeA = parseLifeSpan(a.life_span);
      const lifeB = parseLifeSpan(b.life_span);
      return lifeA - lifeB;
    }
    return 0;
  });
  renderBreeds(sortedBreeds);
});

const sortRangeHeight = document.getElementById("input-height");
const heightValueSpan = document.getElementById("height-value");

//HEIGHT refresh event listeners for inputs 
sortRangeHeight.addEventListener("input", (event) => {
  const rangeValue = Number(event.target.value);
  heightValueSpan.textContent = `${rangeValue} cm`;
  currentFilters.maxHeight = rangeValue;
  applyFilters();
});

const sortRangeLifeSpan = document.getElementById("input-life-span");
const lifeSpanValueSpan = document.getElementById("life-span-value");

//LIFE SPAN refresh even listener for input
sortRangeLifeSpan.addEventListener("input", (event) => {
  const rangeValue = Number(event.target.value);
  lifeSpanValueSpan.textContent = `${rangeValue} years`;
  currentFilters.maxLifeSpan = rangeValue;
  applyFilters();
});

//BUTTIONS EVENTLISTENERS adding eventlisteners for buttons
const weightButtons = document.querySelectorAll(".sidebarBottons button");

weightButtons[0].addEventListener("click", () => {
  currentFilters.weightCategory = "under5";
  applyFilters();
});

weightButtons[1].addEventListener("click", () => {
  currentFilters.weightCategory = "over5";
  applyFilters();
});

//SEARCHING element adding and eventlistener to him
const keywordInput = document.querySelector('#keyword-input');
keywordInput.addEventListener('input', () => {
  currentFilters.keyword = keywordInput.value.toLowerCase();
  applyFilters(); 
});
