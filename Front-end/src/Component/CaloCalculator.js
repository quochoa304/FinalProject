import React, { useState } from 'react';
import Header from './Header';
import gymVideo from '../assets/images/gym-video.mp4';
import '../assets/css/MealTable.css';

function CaloCalculator() {






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
            mealDiv.classList.add("mealItem");

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





  const styles = {
    formControl: {
      display: 'flex',
      alignItems: 'center',
      marginBottom: '10px',
      backgroundColor: 'transparent',
      width: '60%',
      marginLeft: 'auto',
      marginRight: 'auto',
      fontSize: '20px',
    },
    label: {
      width: '150px', // Adjust based on your needs
      textAlign: 'left',
      marginRight: '10px',
      color: '#ed563b',
    },
    input: {
      flex: 1,
    },
    select: {
      flex: 1,
    },
    button: {
      textAlign: 'center',
    },

  };

  const [formData, setFormData] = useState({
    height: '',
    weight: '',
    age: '',
    gender: 'male',
    activityLevel: 'sedentary',
  });
  const [result, setResult] = useState({
    baseCalo: 0,
    fat: 0,
    protein: 0,
    carb: 0,
  });

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const { height, weight, age, gender, activityLevel } = formData;
    let baseCalo = (6.25 * height) + (10 * weight) - (5 * age) + (gender === 'male' ? 5 : -161);
    let adjustedCalo = baseCalo;

    switch (activityLevel) {
      case 'sedentary':
        adjustedCalo *= 1.2;
        break;
      case 'light':
        adjustedCalo *= 1.375;
        break;
      case 'moderate':
        adjustedCalo *= 1.55;
        break;
      case 'active':
        adjustedCalo *= 1.725;
        break;
      default:
        adjustedCalo = baseCalo;
    }

    setResult({
      baseCalo: adjustedCalo.toFixed(2),
      fat: ((adjustedCalo * 0.3) / 9).toFixed(2),
      protein: ((adjustedCalo * 0.2) / 4).toFixed(2),
      carb: ((adjustedCalo * 0.5) / 4).toFixed(2),
    });
  };


  return (
    <div>
      <Header />
      <div className="main-banner" id="top">
        <video autoPlay muted loop id="bg-video">
          <source src={gymVideo} type="video/mp4" />
        </video>
        <div className="video-overlay header-text">
          <div className="caption">
            <br></br>
            <br></br>
            <h6 id="slogan">work harder, get stronger</h6>
            <h2>Calo <em>calculator</em></h2>
            <h6>
              <form onSubmit={handleSubmit}>
                <div style={styles.formControl}>
                  <label style={styles.label} htmlFor="height">Height (cm):</label>
                  <input style={styles.input}
                    type="number"
                    id="height"
                    name="height"
                    required
                    value={formData.height}
                    onChange={handleChange}
                  />
                </div>
                <div style={styles.formControl}>
                  <label style={styles.label} htmlFor="weight">Weight (kg):</label>
                  <input
                    type="number"
                    id="weight"
                    name="weight"
                    required
                    value={formData.weight}
                    onChange={handleChange}
                    style={styles.input}
                  />
                </div>
                <div style={styles.formControl}>
                  <label style={styles.label} htmlFor="age">Age:</label>
                  <input
                    type="number"
                    id="age"
                    name="age"
                    required
                    value={formData.age}
                    onChange={handleChange}
                    style={styles.input}
                  />
                </div>
                <div style={styles.formControl}>
                  <label style={styles.label} htmlFor="gender">Gender:</label>
                  <select style={styles.select}
                    id="gender"
                    name="gender"
                    value={formData.gender}
                    onChange={handleChange}
                    required
                  >
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                  </select>
                </div>
                <div style={styles.formControl}>
                  <label style={styles.label} htmlFor="activityLevel">Activity Level:</label>
                  <select style={styles.select}
                    id="activityLevel"
                    name="activityLevel"
                    value={formData.activityLevel}
                    onChange={handleChange}
                    required
                  >
                    <option value="sedentary">Sedentary</option>
                    <option value="light">Light Activity</option>
                    <option value="moderate">Moderate Activity</option>
                    <option value="active">Active</option>
                  </select>
                </div>
                <br />
                <div>
                  <button type="submit">Calculate</button>
                </div>
              </form>
            </h6>
            <br></br>
            <div
              id="results"
              className="main-button scroll-to-section"
              style={{ display: result.baseCalo > 0 ? 'block' : 'none' }}
            >
              <a>
                The calculated caloric needs are: <span>{result.baseCalo}</span> calories.<br />
                Nutrition: <br />
                Fat: <span>{result.fat}</span>g<br />
                Protein: <span>{result.protein}</span>g<br />
                Carb: <span>{result.carb}</span>g
              </a>
            </div>
          </div>
        </div>
      </div>

      <div>
        <section className="section" id="features">
          <div className="row">
            <div className="col-lg-6 offset-lg-3">
              <div className="section-heading">
                <h2>Choose <em>Diet</em></h2>
                <img src="../assets/images/line-dec.png" alt="waves" />
                <p>Training Studio is free CSS template for gyms and fitness centers. You are allowed to use this layout for your business website.</p>
              </div>
              <div>
                <div style={styles.formControl}>
                  <label style={styles.label} htmlFor="qhoa3042001">Favorite Food:</label>
                  <input style={styles.input} list="qhoa3042001" id="foodInput" name="browser"></input>
                  <datalist id="qhoa3042001">
                    <option value="Salad"></option>
                    <option value="Spinach">Spinach</option>
                    <option value="Chicken"></option>
                    <option value="Fish"></option>
                    <option value="Beef"></option>
                    <option value="Tomato"></option>
                    <option value="Pork"></option>
                    <option value="Lamb"></option>
                    <option value="Turkey"></option>
                    <option value="Duck"></option>
                    <option value="Venison"></option>
                    <option value="Tofu"></option>
                    <option value="Seitan"></option>
                    <option value="Tempeh"></option>
                    <option value="Eggplant"></option>
                    <option value="Lentils"></option>
                    <option value="Chickpeas"></option>
                    <option value="Mushrooms"></option>
                    <option value="Quinoa"></option>
                    <option value="Rice"></option>
                    <option value="Pasta"></option>
                    <option value="Kale">Kale</option>
                    <option value="Broccoli">Broccoli</option>
                    <option value="Cauliflower">Cauliflower</option>
                    <option value="Sweet Potato">Sweet Potato</option>
                    <option value="Peppers">Peppers</option>
                    <option value="Zucchini">Zucchini</option>
                    <option value="Asparagus">Asparagus</option>
                    <option value="Brussels Sprouts">Brussels Sprouts</option>
                    <option value="Onions">Onions</option>
                    <option value="Garlic">Garlic</option>
                    <option value="Leeks">Leeks</option>
                    <option value="Cabbage">Cabbage</option>
                    <option value="Cucumber">Cucumber</option>
                    <option value="Celery">Celery</option>
                    <option value="Carrots">Carrots</option>
                    <option value="Beans">Beans</option>
                    <option value="Peas">Peas</option>
                    <option value="Corn">Corn</option>
                    <option value="Potatoes">Potatoes</option>
                    <option value="Avocado">Avocado</option>
                    <option value="Apples">Apples</option>
                    <option value="Bananas">Bananas</option>
                    <option value="Oranges">Oranges</option>
                    <option value="Peaches">Peaches</option>
                    <option value="Grapes">Grapes</option>
                    <option value="Cherries">Cherries</option>
                    <option value="Strawberries">Strawberries</option>
                    <option value="Blueberries">Blueberries</option>
                    <option value="Watermelon">Watermelon</option>
                  </datalist>
                </div>
                <div style={styles.formControl}>
                  <label style={styles.label} htmlFor="mealType">Meal Type:</label>
                  <select style={styles.select} id="mealType">
                    <option value="Breakfast">Breakfast</option>
                    <option value="Dinner">Dinner</option>
                    <option value="Lunch">Lunch</option>
                    <option value="Snack">Snack</option>
                    <option value="Teatime">Teatime</option>
                  </select>
                </div>
                <div style={styles.formControl}>
                  <label style={styles.label} htmlFor="calories">Calories</label>
                  <input style={styles.input} type="text" id="calories" value={result.baseCalo} />
                </div>

                <br></br>
                <div style={styles.button}>
                <button onClick={suggestMeals} >Plan your meal</button>
                </div>
                <br></br>
                <div style={styles.button}>
                <h5>Meal Suggestions:</h5>
                </div>
              </div>
              <table id="mealSuggestions" style={styles.mealSuggestions}></table>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

export default CaloCalculator;
