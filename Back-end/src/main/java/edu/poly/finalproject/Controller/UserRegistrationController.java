package edu.poly.finalproject.Controller;

import edu.poly.finalproject.service.EmailExistsException;
import edu.poly.finalproject.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

@Controller
@RequestMapping("/registration")
public class UserRegistrationController {

    private final UserService userService;

    @Autowired
    public UserRegistrationController(UserService userService) {
        this.userService = userService;
    }

    @ModelAttribute("user")
    public UserRegistrationDto userRegistrationDto() {
        return new UserRegistrationDto();
    }

    @GetMapping
    public String showRegistrationForm() {
        return "registration";  // Make sure "registration.html" exists in the correct location.
    }

    @PostMapping
    public Object registerUserAccount(@RequestBody UserRegistrationDto registrationDto) {
        try {
            userService.save(registrationDto);
            return "redirect:/registration?success";
        } catch (EmailExistsException e){
            return new ResponseEntity<>(e.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }



}
