package edu.poly.finalproject.service;

import edu.poly.finalproject.model.User;

public interface UserRepository extends org.springframework.data.jpa.repository.JpaRepository<User, Long> {
}