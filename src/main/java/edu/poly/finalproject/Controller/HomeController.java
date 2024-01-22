package edu.poly.finalproject.Controller;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
@Controller
public class HomeController {

    @GetMapping("/")
    public String home(Model model) {
        // Truyền các dữ liệu mà bạn muốn hiển thị trên trang chủ vào Model
        model.addAttribute("appName", "GW Fitness App");
        model.addAttribute("welcomeMessage", "Chào mừng đến với " + model.getAttribute("appName") + "!");
        return "index"; // Trả về tên của template Thymeleaf

    }
}
