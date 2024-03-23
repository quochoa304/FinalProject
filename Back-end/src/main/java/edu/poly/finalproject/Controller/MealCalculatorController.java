package edu.poly.finalproject.Controller;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;

import java.util.*;

@Controller
public class MealCalculatorController {
    @GetMapping("/calculatorMeal")
    public String showCalculatorMealPage() {
        return "calculatorMeal";
    }
    private static final Map<String, Integer> foodData = new HashMap<>();

    static {
        foodData.put("Broccoli", 55);
        foodData.put("Spinach", 23);
        foodData.put("Cauliflower", 25);
        foodData.put("Kale", 49);
        foodData.put("Cabbage", 25);
        foodData.put("Carrots", 41);
        foodData.put("Bell Peppers (Red)", 31);
        foodData.put("Tomatoes", 18);
        foodData.put("Cucumber", 16);
        foodData.put("Lettuce (Romaine)", 17);
        foodData.put("Chicken Breast (Grilled, Skinless)", 165);
        foodData.put("Salmon (Baked)", 206);
        foodData.put("Tuna (Canned in Water)", 94);
        foodData.put("Eggs", 155);
        foodData.put("Quinoa (Cooked)", 120);
        foodData.put("Brown Rice (Cooked)", 111);
        foodData.put("Black Beans (Cooked)", 132);
        foodData.put("Greek Yogurt (Non-fat)", 59);
    }

    @PostMapping("/calculate-meal-calories")
    public String calculateMealCalories(@RequestParam("weight") double weight,
                                        @RequestParam("height") double height,
                                        @RequestParam("age") int age,
                                        @RequestParam("sex") String sex,
                                        @RequestParam("activity") double activity,
                                        Model model) {
        double calorie = 0;
        if ("male".equals(sex)) {
            calorie = (10 * weight + 6.25 * height - 5 * age + 5) * activity;
        } else if ("female".equals(sex)) {
            calorie = (10 * weight + 6.25 * height - 5 * age - 161) * activity;
        }

        model.addAttribute("calorie", calorie);

        // Recommend meals based on calculated calorie
        List<Map.Entry<String, Integer>> recommendedMeals = recommendMeals(calorie);
        model.addAttribute("recommendedMeals", recommendedMeals);

        return "meal-calculator-result";
    }

    private List<Map.Entry<String, Integer>> recommendMeals(double calorie) {
        List<Map.Entry<String, Integer>> allFoods = new ArrayList<>(foodData.entrySet());

        // Shuffle the list of foods to get random order
        Collections.shuffle(allFoods);

        List<Map.Entry<String, Integer>> recommendedMeals = new ArrayList<>();

        // Iterate through shuffledFoods and recommend meals based on calories
        for (Map.Entry<String, Integer> entry : allFoods) {
            String food = entry.getKey();
            int caloriesPer100g = entry.getValue();
            int servings = (int) Math.ceil(calorie / caloriesPer100g);

            if (servings > 0) {
                recommendedMeals.add(new AbstractMap.SimpleEntry<>(food, servings));

                // Limit the number of recommended meals to 6
                if (recommendedMeals.size() == 6) {
                    break;
                }
            }
        }

        return recommendedMeals;
    }
}
