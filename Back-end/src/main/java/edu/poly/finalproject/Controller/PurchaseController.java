package edu.poly.finalproject.Controller;

import edu.poly.finalproject.model.GymMembership;
import edu.poly.finalproject.model.PurchasedMembership;
import edu.poly.finalproject.service.GymMembershipService;
import edu.poly.finalproject.service.PurchasedMembershipService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/memberships")
public class PurchaseController {

    @Autowired
    private PurchasedMembershipService purchasedMembershipService;

    @Autowired
    private GymMembershipService gymMembershipService;

    // Get current membership details for a user
    @GetMapping("/current/{userId}")
    public ResponseEntity<?> getCurrentMembership(@PathVariable Long userId) {
        try {
            PurchasedMembership currentMembership = purchasedMembershipService.findCurrentMembershipByUserId(userId);
            if (currentMembership == null) {
                return ResponseEntity.ok("No active membership found for user ID: " + userId);
            }
            GymMembership membershipDetails = gymMembershipService.get(currentMembership.getMembershipId());
            return ResponseEntity.ok(membershipDetails);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error while retrieving membership: " + e.getMessage());
        }
    }

    // Purchase a new membership for a user
    @PostMapping("/purchase")
    public ResponseEntity<?> purchaseMembership(@RequestParam Long userId, @RequestParam Long membershipId) {
        try {
            purchasedMembershipService.purchaseMembership(userId, membershipId);
            return ResponseEntity.ok("Membership purchased successfully.");
        } catch (IllegalStateException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error while purchasing membership: " + e.getMessage());
        }
    }
}
