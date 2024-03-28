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
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.oauth2.client.authentication.OAuth2AuthenticationToken;
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
    public Object getUserInfo() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication instanceof OAuth2AuthenticationToken) {
            OAuth2AuthenticationToken oauthToken = (OAuth2AuthenticationToken) authentication;
            Map<String, Object> attributes = oauthToken.getPrincipal().getAttributes();
            // Process and return the user info based on attributes
            return attributes; // For demo purposes, adapt as needed
        } else {
            String email = authentication.getName(); // Traditional login
            return userRepository.findByEmail(email);
        }
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
    public ResponseEntity<?> changeUserPassword(@RequestBody PasswordChangeRequest passwordChangeRequest) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String email = authentication.getName();

        User user = userRepository.findByEmail(email);
        if (user == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Error: User not found.");
        }

        if (!passwordEncoder.matches(passwordChangeRequest.getOldPassword(), user.getPassword())) {
            return ResponseEntity.badRequest().body("Error: Old password is incorrect.");
        }

        user.setPassword(passwordEncoder.encode(passwordChangeRequest.getNewPassword()));
        userRepository.save(user);
        return ResponseEntity.ok("Password successfully changed.");
    }



    @Setter
    @Getter
    public static class DetailChangeRequest {
        private String newFirstName;
        private String newLastName;
        // Getters and setters
    }
    @PostMapping("/change-detail")
    public String changeUserInformation(@RequestBody DetailChangeRequest detailChangeRequest) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String email = authentication.getName();

        User user = userRepository.findByEmail(email);
        if (user == null) {
            throw new RuntimeException("User not found.");
        }

        user.setFirstName(detailChangeRequest.getNewFirstName());
        user.setLastName(detailChangeRequest.getNewLastName());
        userRepository.save(user);
        return "Password successfully changed.";
    }


}
