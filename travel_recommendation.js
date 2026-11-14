// TravelMate recommendation website
// Add your own contact email below before publishing if you want the form to open an email draft.
const CONTACT_EMAIL = "nython14@gmail.com";

const resultsGrid = document.getElementById("resultsGrid");
const resultMessage = document.getElementById("resultMessage");
const searchInput = document.getElementById("searchInput");
const searchButton = document.getElementById("searchButton");
const clearButton = document.getElementById("clearButton");

let recommendationData = null;

document.getElementById("year").textContent = new Date().getFullYear();

fetch("./travel_recommendation_api.json")
  .then((response) => {
    if (!response.ok) throw new Error("Could not load the recommendation data.");
    return response.json();
  })
  .then((data) => {
    recommendationData = data;
  })
  .catch((error) => {
    resultMessage.textContent = "The recommendations could not be loaded. Please refresh the page.";
    console.error(error);
  });

function findCategory(query) {
  const term = query.trim().toLowerCase();
  if (["beach", "beaches", "seaside", "coast"].some((word) => term.includes(word))) return "beaches";
  if (["temple", "temples", "shrine"].some((word) => term.includes(word))) return "temples";
  if (["country", "countries", "nation"].some((word) => term.includes(word))) return "countries";
  return null;
}

function showRecommendations() {
  const query = searchInput.value;
  if (!query.trim()) {
    resultMessage.textContent = "Type beach, temple, or country to explore recommendations.";
    resultsGrid.innerHTML = "";
    return;
  }
  if (!recommendationData) {
    resultMessage.textContent = "Recommendations are still loading. Try again in a moment.";
    return;
  }

  const category = findCategory(query);
  if (!category) {
    resultMessage.textContent = "No category found. Try “beach”, “temple”, or “country”.";
    resultsGrid.innerHTML = "";
    return;
  }

  const items = recommendationData[category] || [];
  resultMessage.textContent = `Showing ${items.length} ${category} recommendations for “${query}”.`;
  resultsGrid.innerHTML = items.map((place) => `
    <article class="result-card">
      <img src="${place.imageUrl}" alt="${place.name}" loading="lazy">
      <div class="card-body">
        <h3>${place.name}</h3>
        <p><strong>${place.location}</strong></p>
        <p>${place.description}</p>
      </div>
    </article>
  `).join("");
  document.getElementById("recommendations").scrollIntoView({ behavior: "smooth", block: "start" });
}

function clearSearch() {
  searchInput.value = "";
  resultsGrid.innerHTML = "";
  resultMessage.textContent = "Search for “beach”, “temple”, or “country” to get started.";
  searchInput.focus();
}

searchButton.addEventListener("click", showRecommendations);
clearButton.addEventListener("click", clearSearch);
searchInput.addEventListener("keydown", (event) => {
  if (event.key === "Enter") showRecommendations();
});

const contactEmailText = document.getElementById("contactEmailText");
if (CONTACT_EMAIL !== "YOUR_EMAIL@example.com") {
  contactEmailText.textContent = CONTACT_EMAIL;
}

document.getElementById("contactForm").addEventListener("submit", (event) => {
  event.preventDefault();
  const formMessage = document.getElementById("formMessage");
  if (CONTACT_EMAIL === "YOUR_EMAIL@example.com") {
    formMessage.textContent = "Please add your email address in travel_recommendation.js (CONTACT_EMAIL) before using the form.";
    return;
  }
  const form = event.currentTarget;
  const subject = encodeURIComponent(`TravelMate message from ${form.name.value}`);
  const body = encodeURIComponent(
    `Name: ${form.name.value}\nEmail: ${form.email.value}\n\n${form.message.value}`
  );
  window.location.href = `mailto:${CONTACT_EMAIL}?subject=${subject}&body=${body}`;
});
