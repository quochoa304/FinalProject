package edu.poly.finalproject.Controller;

import edu.poly.finalproject.model.GymMembership;
import edu.poly.finalproject.model.PurchasedMembership;
import edu.poly.finalproject.model.User;
import edu.poly.finalproject.repository.GymMembershipRepository;
import edu.poly.finalproject.repository.UserRepository;
import edu.poly.finalproject.service.GymMembershipService;
import edu.poly.finalproject.service.PurchasedMembershipService;
import edu.poly.finalproject.service.UserService;
import lombok.Getter;
import lombok.Setter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/user")
public class UserController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private UserService userService;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private PurchasedMembershipService purchasedMembershipService;

    @Autowired
    private GymMembershipService gymMembershipService;

    @Autowired
    private GymMembershipRepository gymMembershipRepository;


    @GetMapping("/info")
    public User getUserInfo() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String email = authentication.getName(); // Assuming username is the user's email
        return userRepository.findByEmail(email);
    }

    @GetMapping("/member")
    public ResponseEntity<?> showBuyAPlanPage() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String currentPrincipalName = authentication.getName();

        // Assuming userRepository is already autowired and initialized
        User user = userRepository.findByEmail(currentPrincipalName);
        Long userId = user.getId();
        String email = user.getEmail();

        Map<String, Object> response = new HashMap<>();
        PurchasedMembership currentMembership = purchasedMembershipService.findCurrentMembershipByUserId(userId);

        if (currentMembership != null) {
            GymMembership membershipDetails = gymMembershipService.get(currentMembership.getMembershipId());

            response.put("currentMembership", membershipDetails.getName());
            response.put("expiryDate", currentMembership.getExpiryDate());
            response.put("purchaseDate", currentMembership.getPurchaseDate());
        } else {
            response.put("message", "No active membership found for user: " + email);
        }

        // Assuming gymMembershipRepository is already autowired and initialized
        response.put("gymMemberships", gymMembershipRepository.findAll());
        response.put("gymMembership", currentMembership);

        return ResponseEntity.ok(response);
    }



    @Setter
    @Getter
    public static class PasswordChangeRequest {
        private String oldPassword;
        private String newPassword;

        // Getters and setters
    }


    @PostMapping("/change-password")
    public String changeUserPassword(@RequestBody PasswordChangeRequest passwordChangeRequest) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String email = authentication.getName();

        User user = userRepository.findByEmail(email);
        if (user == null) {
            throw new RuntimeException("User not found.");
        }

        if (!passwordEncoder.matches(passwordChangeRequest.getOldPassword(), user.getPassword())) {
            return "Error: Old password is incorrect.";
        }

        user.setPassword(passwordEncoder.encode(passwordChangeRequest.getNewPassword()));
        userRepository.save(user);
        return "Password successfully changed.";
    }


}
