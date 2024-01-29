package edu.poly.finalproject.service;

import edu.poly.finalproject.Controller.UserRegistrationDto;
import edu.poly.finalproject.model.User;
import org.springframework.security.core.userdetails.UserDetailsService;



public interface UserService extends UserDetailsService{
    User save(UserRegistrationDto registrationDto);
}