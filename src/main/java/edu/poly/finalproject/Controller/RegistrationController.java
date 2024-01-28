package edu.poly.finalproject.Controller;

import edu.poly.finalproject.model.User;
import edu.poly.finalproject.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;

@Controller
public class RegistrationController {

    private final UserService userService;

    // Inject the UserService through constructor
    @Autowired
    public RegistrationController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping("/register")
    public String showRegistrationForm() {
        return "register";
    }

    @PostMapping("/register")
    public String processRegistration(@ModelAttribute("user") User user) {
        // Set other attributes
        String name = user.getName();
        String password = user.getPassword();

        // Create a new User object
        User newUser = new User();
        newUser.setName(name);
        newUser.setPassword(password);

        // Call the registerUser method to save the new user
        userService.registerUser(newUser);

        // Redirect to the login page after successful registration
        return "redirect:/api/user/login";
    }



}

