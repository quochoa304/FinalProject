package edu.poly.finalproject.Controller;

import edu.poly.finalproject.model.CaloCalculatorRequest;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;

@Controller
public class CaloCalculatorController {
    @GetMapping("/caloCalculator")
    public String showCalculatorForm(Model model) {
        // Set default baseCalo to 0
        model.addAttribute("baseCalo", 0.0);
        model.addAttribute("caloCalcRequest", new CaloCalculatorRequest());
        return "caloCalculator";
    }

    @PostMapping("/caloCalculator") // Change the endpoint to /caloCalculator
    public String calculateCalo(CaloCalculatorRequest request, Model model) {
        double baseCalo = (6.25 * request.getHeight()) + (10 * request.getWeight()) - (5 * request.getAge());
        baseCalo += request.getGender().equalsIgnoreCase("male") ? 5 : -161;

        double adjustedCalo = baseCalo; // Default case
        String formattedCalo = String.format("%.2f", baseCalo);
        switch (request.getActivityLevel()) {
            case "sedentary":
                adjustedCalo *= 1.2;
                break;
            case "light":
                adjustedCalo *= 1.375;
                break;
            case "moderate":
                adjustedCalo *= 1.55;
                break;
            case "active":
                adjustedCalo *= 1.725;
                break;
        }
        double fat = (adjustedCalo * 0.3)/9;
        String formatFat = String.format("%.2f", fat);
        double protein = (adjustedCalo *0.2/4);
        String formattedProtein = String.format("%.2f", protein);
        double carb = (adjustedCalo *0.5/4);
        String formattedCarb = String.format("%.2f", carb);
        // Add the calculated caloric needs to the model
        model.addAttribute("baseCalo", formattedCalo);
        model.addAttribute("fat", formatFat);
        model.addAttribute("protein", formattedProtein);
        model.addAttribute("carb", formattedCarb);
        // Add the form request back to the model for redisplaying the form
        model.addAttribute("caloCalcRequest", request);

        // Return the same view name to be rendered
        return "caloCalculator";
    }
}

