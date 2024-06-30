const searchFormEl = document.getElementById("search-form");
const searchBarEl = document.getElementById("search-bar");
const apiKey = "543f9036e1164201a6e40387f1d624a9";

window.onload = async () => {
  const randomRecipes = await searchRandom();
  createRecipeCard(randomRecipes);
}
const searchRandom = async () => {
  const randomURL = `https://api.spoonacular.com/recipes/random?number=8&apiKey=${apiKey}`;
  try {
    const randomResponse = await fetch(randomURL);
    const randomData = await randomResponse.json();
    return randomData.recipes.map((recipe) => {
      return {
        Name: recipe.title,
        Image: recipe.image,
        Summary: recipe.summary,
        sourceUrl: recipe.sourceUrl,
        Instructions: recipe.analyzedInstructions[0],
      }
    })
  } catch (error) {
    console.log(error)
  }
}

searchFormEl.addEventListener("submit", async (event) => {
  event.preventDefault();
  const recipesData = await recipes();
  createRecipeCard(recipesData);
});

const recipes = async () => {
  let query = searchBarEl.value;
  query = query.trim().toLowerCase();
  // const apiKey = "a1674bf3bbc9460caf143266107318bb";
  const url = `https://api.spoonacular.com/recipes/complexSearch?includeIngredients=${query}&instructionsRequired=true&addRecipeInformation=true&addRecipeInstructions=true&number=9&apiKey=${apiKey}`;
  try {
    if (query) {
      const response = await fetch(url);
      const data = await response.json();
      console.log(data.results);
      return data.results.map((recipe) => {
        return {
          Name: recipe.title,
          Image: recipe.image,
          Summary: recipe.summary,
          sourceUrl: recipe.sourceUrl,
          Instructions: recipe.analyzedInstructions[0],
        };
      });
    }
  } catch (error) {
    console.log(error);
  }
};



async function addToFavourites(name, image, summary, sourceUrl, instructions) {
  try {
    const response = await fetch('/add-to-favourites', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        name,
        image,
        summary,
        sourceUrl,
        instructions
      })
    });

    if (response.status === 200) {
      alert('Recipe added to favourites');
    } else if (response.status === 401) {
      alert('You need to log in to add recipes to favourites');
    } else {
      alert('Failed to add recipe to favourites. Please try again later.');
    }
  } catch (error) {
    console.error('Error adding to favourites:', error);
    alert('Error adding to favourites. Please try again later.');
  }
}

function createRecipeCard(recipes) {
  const resultContainer = document.getElementById("search-result-container");
  resultContainer.innerHTML = "";
  recipes.forEach((recipe) => {
    const card = document.createElement("div");
    card.className = "card";
    card.innerHTML = `
        <img src="${recipe.Image}" alt="recipe-image" class="card-image-top rounded-top">
        <div class="card-body">
          <h2 class="card-head">${recipe.Name}</h2>
          <button type="button" class="details-btn btn" onclick="showDetails()">
            Read More <span class="material-symbols-outlined"></span>
          </button>
          <button type="button" class="details-btn btn add-to-favorites-btn">
            Add to Favourites
          </button>
        </div>
        <a href="${recipe.sourceUrl}" class="d-none link-body-emphasis link-offset-2 link-underline-opacity-25 link-underline-opacity-75-hover" target="_blank">Read More</a>
        <p class="card-summary d-none">${recipe.Summary}</p>
        <div class="method d-none"></div>
    `;

    if (recipe.Instructions) {
      card.querySelector(".method").innerHTML = `
        <h2>Instructions</h2>
        ${recipe.Instructions.steps.map((step) => `<li class="py-1 fs-6">${step.number}. ${step.step}</li>`).join("")}
        <br/>Click <a href="${recipe.sourceUrl}" target="_blank" class="fs-4 fw-bold">HERE</a> to view the Complete Recipe.
      `;
    } else {
      card.querySelector(".method").innerHTML = `
        No instructions found. Click <a href="${recipe.sourceUrl}" target="_blank">Here</a> to view the recipe.
      `;
    }
    resultContainer.appendChild(card);

    const addToFavoritesBtn = card.querySelector('.add-to-favorites-btn');
    addToFavoritesBtn.addEventListener('click', () => {
      addToFavourites(recipe.Name, recipe.Image, recipe.Summary, recipe.sourceUrl, recipe.Instructions);
    });
  });
}


//read more button 
function showDetails() {
  const detailsBtns = document.querySelectorAll(".details-btn");
  detailsBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      const itemCard = btn.closest(".card");
      const recipeName = itemCard.querySelector(".card-head").textContent;
      const recipeImage = itemCard.querySelector(".card-image-top").src;
      const recipeSummary = itemCard.querySelector(".card-summary").innerHTML;
      const recipeSourceUrl = itemCard.querySelector(
        ".link-body-emphasis"
      ).href;
      const recipeInstructions = itemCard.querySelector(".method").innerHTML;
      // Pass the recipe details to info.html
      localStorage.setItem("recipeName", recipeName);
      localStorage.setItem("recipeImage", recipeImage);
      localStorage.setItem("recipeSummary", recipeSummary);
      localStorage.setItem("recipeSourceUrl", recipeSourceUrl);
      localStorage.setItem("recipeInstructions", recipeInstructions);

      window.open("info.html");
    });
  });
}
