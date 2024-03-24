
async function suggestMeals() {
    const selectedFood = document.getElementById("foodInput").value;

    const mealTypeElement = document.getElementById("mealType");
    const mealType = encodeURIComponent(mealTypeElement.value);

    const dietTypes = document.getElementsByName("fav_language");

    const calo = encodeURIComponent(document.getElementById("calories").value);

    const mealSuggestions = document.getElementById("mealSuggestions");
    mealSuggestions.innerHTML = ""; // Clear previous suggestions

    // Cập nhật API URL bằng cách sử dụng giá trị selectedFood
    const appId = '799b7e0a';
    const appKey = '2a7cbd461d76b465dacad645ba80f3b7';
    let queryParams = [];
    if (selectedFood) queryParams.push(`q=${selectedFood}`);
    if (mealType) queryParams.push(`mealType=${mealType}`);
    if (calo) queryParams.push(`calories=${calo}`);

    const apiUrl = `https://api.edamam.com/search?${queryParams.join('&')}&app_id=${appId}&app_key=${appKey}`;
    try {
        const response = await fetch(apiUrl);
        const data = await response.json();

        // Extract meals from the API response
        const meals = data.hits.map(hit => ({
            name: hit.recipe.label,
            fat: hit.recipe.totalNutrients.FAT.quantity,
            protein: hit.recipe.totalNutrients.PROCNT.quantity,
            carb: hit.recipe.totalNutrients.CHOCDF.quantity,
            totalCalories: hit.recipe.calories,
            serving: hit.recipe.yield,

            image: hit.recipe.image
        }));

        meals.slice(0, 9).forEach(meal => {
            const mealDiv = document.createElement("div");
            mealDiv.classList.add("meal-item");

            // Create an image element
            const image = document.createElement("img");
            image.src = meal.image;
            image.alt = meal.name + " Image";
            image.classList.add("mealImage");
            mealDiv.appendChild(image);

            // Add meal details
            mealDiv.innerHTML += `<br>${meal.serving} servings of ${meal.name}: ${meal.totalCalories.toFixed(2) / 4 /*1 of 4 servings*/} kcal, ${meal.fat.toFixed(2)}g fat, ${meal.protein.toFixed(2)}g protein, ${meal.carb.toFixed(2)}g carbohydrate`;

            mealSuggestions.appendChild(mealDiv);
        });
    } catch (error) {
        console.error('Error fetching meal suggestions:', error);
    }
}
