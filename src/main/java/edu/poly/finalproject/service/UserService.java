package edu.poly.finalproject.service;

import edu.poly.finalproject.model.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class UserService {

    private final UserRepository userRepository;

    @Autowired
    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }
    public User getUserByName(String name) {
        return userRepository.findByName(name);
    }
    public boolean isValidUser(String name, String password) {
        User user = getUserByName(name);
        return user != null && user.getPassword().equals(password);
    }


    public void registerUser(User user) {
        // Validate that the name is not null
        if (user.getName() == null || user.getName().trim().isEmpty()) {
            throw new IllegalArgumentException("Name cannot be null or empty");
        }

        // Other validation logic if needed

        // Save the user to the database
        userRepository.save(user);
    }

    public boolean authenticateUser(String name, String password) {
        return false;
    }

    // Add other methods as needed
}

