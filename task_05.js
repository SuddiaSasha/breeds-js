import { breeds } from './data_sample.js';
const list = document.querySelector("ul#breeds.cards");

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

sortRangeHeight.addEventListener("input", (event) => {
  const rangeValue = Number(event.target.value);
  heightValueSpan.textContent = `${rangeValue} cm`;
  const filteredBreeds = breeds.filter((breed) => {
    const avgHeight = getAverageHeight(breed.height?.metric);
    return avgHeight <= rangeValue;
  });
  renderBreeds(filteredBreeds);
});

const sortRangeLifeSpan = document.getElementById("input-life-span");
const lifeSpanValueSpan = document.getElementById("life-span-value");

sortRangeLifeSpan.addEventListener("input", (event) => {
  const rangeValue = Number(event.target.value);
  lifeSpanValueSpan.textContent = `${rangeValue} years`;
  const filteredBreeds = breeds.filter((breed) => {
    const avgLifeSpan = parseLifeSpan(breed.life_span);
    return avgLifeSpan <= rangeValue;
  });
  renderBreeds(filteredBreeds);
});
