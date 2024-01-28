package edu.poly.finalproject.Controller;

import edu.poly.finalproject.model.User;
import edu.poly.finalproject.service.UserService;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;

@Controller
public class LoginController {

    private final UserService userService;

    public LoginController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping("/login")
    public String showLoginForm() {
        return "login";
    }

    @PostMapping("/login")
    public String login(@RequestParam String name, @RequestParam String password, Model model) {
        if (userService.isValidUser(name, password)) {
            // Authentication successful, redirect to /member
            return "redirect:/member";
        } else {
            // Authentication failed, add an error message and return to the login page
            model.addAttribute("error", "Invalid username or password");
            return "login";
        }
    }

    @GetMapping("/member")
    public String showMemberPage(@ModelAttribute("user") User user, Model model) {
        // You can add logic or retrieve additional data to display on the member page if needed
        model.addAttribute("user", user);
        return "member";
    }
}

