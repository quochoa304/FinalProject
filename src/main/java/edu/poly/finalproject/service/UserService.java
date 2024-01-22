package edu.poly.finalproject.service;

import org.springframework.stereotype.Service;

@Service
public class UserService {

    public boolean authenticateUser(String username, String password) {
        return "admin".equals(username) && "password".equals(password);
    }

    // Các phương thức khác nếu cần
}
