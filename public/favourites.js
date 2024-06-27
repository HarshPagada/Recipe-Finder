document.addEventListener('DOMContentLoaded', async () => {
    await fetchFavourites();
});

async function fetchFavourites() {
    try {
        const response = await fetch('/get-favourites', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (response.status === 200) {
            const recipes = await response.json();
            displayRecipes(recipes);
        } else if (response.status === 401) {
            alert('You need to log in to view your favourite recipes.');
            //window.location.href = '/login'; // Redirect to login page if not authenticated
        } else {
            alert('Failed to fetch favourite recipes. Please try again later.');
        }
    } catch (error) {
        console.error('Error fetching favourites:', error);
        alert('Error fetching favourites. Please try again later.');
    }
}

// function displayRecipes(recipes) {
//     const favouritesContainer = document.getElementById('favourites-container');
//     favouritesContainer.innerHTML = '';
//     recipes.forEach((recipe) => {
//         console.log(recipe.instructions);
//         const card = document.createElement('div');
//         card.className = 'card';
//         card.innerHTML = `
//             <img src="${recipe.image}" alt="recipe-image" class="card-image-top rounded-top">
//             <div class="card-body">
//                 <h2 class="card-head">${recipe.name}</h2>
//                 <button type="button" class="details-btn btn" onclick="showDetails()">
//                     Read More<span class="material-symbols-outlined">chevron_forward</span>
//                 </button>
//                 <a href="${recipe.sourceUrl}" class="d-none link-body-emphasis link-offset-2 link-underline-opacity-25 link-underline-opacity-75-hover" target="_blank">Read More</a>
//                 <p class="card-summary d-none">${recipe.summary}</p>
//                 <div class="method d-none">${formatInstructions(recipe.instructions)}</div>
//             </div>
//         `;
//         favouritesContainer.appendChild(card);
//     });
// }

// function displayRecipes(recipes) {
//     const favouritesContainer = document.getElementById('favourites-container');
//     favouritesContainer.innerHTML = '';
//     recipes.forEach((recipe) => {
//         console.log(recipe.instructions);
//         const card = document.createElement('div');
//         card.className = 'card';
//         card.innerHTML = `
//             <img src="${recipe.image}" alt="recipe-image" class="card-image-top rounded-top">
//             <div class="card-body">
//                 <h2 class="card-head">${recipe.name}</h2>
//                 <button type="button" class="details-btn btn" onclick="showDetails()">
//                     Read More<span class="material-symbols-outlined">chevron_forward</span>
//                 </button>
//                 <a href="${recipe.sourceUrl}" class="d-none link-body-emphasis link-offset-2 link-underline-opacity-25 link-underline-opacity-75-hover" target="_blank">Read More</a>
//                 <p class="card-summary d-none">${recipe.summary}</p>
//                 <div class="method d-none">${formatInstructions(recipe.instructions)}</div>
//             </div>
//         `;
//         favouritesContainer.appendChild(card);
//     });
// }


// function formatInstructions(instructions) {
//     if (Array.isArray(instructions) && instructions.length > 0) {
//         return `
//             <h2>Instructions</h2>
//             <ul>
//                 ${instructions.map((step, index) => `<li class="py-1 fs-6">${index + 1}. ${step}</li>`).join('')}
//             </ul>
//             <br/>Click <a href="${recipe.sourceUrl}" target="_blank" class="fs-4 fw-bold">HERE</a> to view the Complete Recipe.
//         `;
//     }
//     return 'No instructions found.';
// }

function displayRecipes(recipes) {
    const favouritesContainer = document.getElementById('favourites-container');
    favouritesContainer.innerHTML = '';
    recipes.forEach((recipe) => {
        console.log(recipe.instructions);
        const card = document.createElement('div');
        card.className = 'card';
        card.innerHTML = `
            <img src="${recipe.image}" alt="recipe-image" class="card-image-top rounded-top">
            <div class="card-body">
                <h2 class="card-head">${recipe.name}</h2>
                <button type="button" class="details-btn btn" onclick="showDetails()">
                    Read More<span class="material-symbols-outlined"></span>
                </button>
                <a href="${recipe.sourceUrl}" class="d-none link-body-emphasis link-offset-2 link-underline-opacity-25 link-underline-opacity-75-hover" target="_blank">Read More</a>
                <p class="card-summary d-none">${recipe.summary}</p>
                <div class="method d-none">${formatInstructions(recipe.instructions, recipe.sourceUrl)}</div>
            </div>
        `;
        favouritesContainer.appendChild(card);
    });
}

function formatInstructions(instructions, sourceUrl) {
    if (instructions && instructions.length) {
        return `
            <h2>Instructions</h2>
            <ul>
                ${instructions.map((step, index) => `<li class="py-1 fs-6">${index + 1}. ${step}</li>`).join('')}
            </ul>
            <br/>Click <a href="${sourceUrl}" target="_blank" class="fs-4 fw-bold">HERE</a> to view the Complete Recipe.
        `;
    }
    return 'No instructions found.';
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
