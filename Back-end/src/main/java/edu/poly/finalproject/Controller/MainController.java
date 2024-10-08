package edu.poly.finalproject.Controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class MainController {

    @GetMapping("/login")
    public String login() {
        return "login";
    }

    @GetMapping("/")
    public String home() {
        return "index";
    }

    @GetMapping("/member")
    public String member() {
        return "member";
    }
    @GetMapping("/classes")
    public String classes() {
        return "classes";
    }
    @GetMapping("/admin")
    public String admin() {
        return "adminPage";
    }
}