package edu.poly.finalproject.Controller;

import edu.poly.finalproject.model.User;
import edu.poly.finalproject.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/user")
public class UserController {

    private final UserService userService;

    @Autowired
    public UserController(UserService userService) {
        this.userService = userService;
    }

    @PostMapping("/login")
    public String login(@RequestBody User user) {
        // Kiểm tra xác thực người dùng ở đây
        if (userService.authenticateUser(user.getUsername(), user.getPassword())) {
            return "Đăng nhập thành công!";
        } else {
            return "Đăng nhập thất bại. Vui lòng kiểm tra tên đăng nhập và mật khẩu.";
        }
    }
}
