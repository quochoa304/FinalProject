package edu.poly.finalproject.service;

import edu.poly.finalproject.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserRepository extends JpaRepository<User, Long> {
    // You can add custom query methods here if needed
    User findByName(String name);
}
