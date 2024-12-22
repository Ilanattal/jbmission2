document.addEventListener("DOMContentLoaded", () => {
    const searchInput = document.getElementById("searchInput");
    const searchButton = document.getElementById("searchButton");
    const allButton = document.getElementById("allButton");
    const statisticsDiv = document.getElementById("statistics");
    const countriesTableBody = document.querySelector("#countriesTable tbody");
    const regionTableBody = document.querySelector("#regionTable tbody");
  
    // Fonction pour afficher les résultats
    const displayCountries = (countries) => {
      countriesTableBody.innerHTML = "";
      regionTableBody.innerHTML = "";
      const regionCount = {};
      const languagesSet = new Set(); // Set pour stocker les langues uniques
  
      let totalPopulation = 0;
  
      countries.forEach((country) => {
        const { name, population, region, languages } = country;
  
        totalPopulation += population;
  
        // Ajouter les langues au Set (pour éviter les doublons)
        if (languages) {
          Object.values(languages).forEach((language) => languagesSet.add(language));
        }
  
        const row = document.createElement("tr");
        row.innerHTML = `
          <td>${name.common}</td>
          <td>${population.toLocaleString()}</td>
          <td>${region}</td>
        `;
        countriesTableBody.appendChild(row);
  
        // Compter les régions
        regionCount[region] = (regionCount[region] || 0) + 1;
      });
  
      // Afficher les statistiques globales
      const avgPopulation = totalPopulation / countries.length;
      statisticsDiv.innerHTML = `
        <p>Total countries: ${countries.length}</p>
        <p>Total population: ${totalPopulation.toLocaleString()}</p>
        <p>Average population: ${avgPopulation.toFixed(2)}</p>
        <p>Total languages spoken: ${languagesSet.size}</p>
        <p>Languages: ${[...languagesSet].join(", ")}</p>
      `;
  
      // Afficher les régions
      Object.entries(regionCount).forEach(([region, count]) => {
        const row = document.createElement("tr");
        row.innerHTML = `
          <td>${region}</td>
          <td>${count}</td>
        `;
        regionTableBody.appendChild(row);
      });
    };
  
    // Fonction pour récupérer les pays
    const fetchCountries = async (url) => {
      try {
        const response = await fetch(url);
        if (!response.ok) throw new Error("Failed to fetch data");
        return await response.json();
      } catch (error) {
        console.error("Error:", error);
      }
    };
  
    // Bouton ALL
    allButton.addEventListener("click", async () => {
      const countries = await fetchCountries("https://restcountries.com/v3.1/all");
      displayCountries(countries);
    });
  
    // Bouton Search
    searchButton.addEventListener("click", async () => {
      const searchQuery = searchInput.value.trim();
      if (!searchQuery) {
        alert("Please enter a country name");
        return;
      }
      const countries = await fetchCountries(
        `https://restcountries.com/v3.1/name/${searchQuery}`
      );
      if (countries) {
        displayCountries(countries);
      }
    });
  });