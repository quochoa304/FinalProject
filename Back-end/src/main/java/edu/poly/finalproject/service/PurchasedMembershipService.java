package edu.poly.finalproject.service;

import edu.poly.finalproject.model.GymMembership;
import edu.poly.finalproject.model.PurchasedMembership;
import edu.poly.finalproject.repository.PurchasedMembershipRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
public class PurchasedMembershipService {

    @Autowired
    private PurchasedMembershipRepository purchasedMembershipRepository;

    @Autowired
    private GymMembershipService gymMembershipService;

    public void purchaseMembership(Long userId, Long membershipId) {
        // Check for current active membership
        PurchasedMembership currentMembership = findCurrentMembershipByUserId(userId);
        GymMembership newMembership = gymMembershipService.get(membershipId);

        if (currentMembership != null) {
            GymMembership currentMembershipDetails = gymMembershipService.get(currentMembership.getMembershipId());

            if (currentMembership.getMembershipId().equals(membershipId)) {
                throw new IllegalStateException("Đa mua goi nay");

            } else {
                double priceDifference = newMembership.getPrice() - currentMembershipDetails.getPrice();
                if (priceDifference > 0) {
                    // Inform the user about additional payment
                    System.out.println("Can thanh toan them " + priceDifference);

                }
                // Update the current membership to the new one
                currentMembership.setMembershipId(membershipId);
                currentMembership.setExpiryDate(LocalDateTime.now().plusMonths(newMembership.getDurationMonths()));
                currentMembership.setPrice(newMembership.getPrice());
                purchasedMembershipRepository.save(currentMembership);
            }
        } else {
            // Handle new membership purchase
            PurchasedMembership newPurchasedMembership = new PurchasedMembership();
            newPurchasedMembership.setUserId(userId);
            newPurchasedMembership.setMembershipId(membershipId);
            newPurchasedMembership.setPurchaseDate(LocalDateTime.now());
            newPurchasedMembership.setExpiryDate(LocalDateTime.now().plusMonths(newMembership.getDurationMonths()));
            newPurchasedMembership.setPrice(newMembership.getPrice());
            purchasedMembershipRepository.save(newPurchasedMembership);
        }
    }

    public PurchasedMembership findCurrentMembershipByUserId(Long userId) {
        return purchasedMembershipRepository.findTopByUserIdAndExpiryDateAfterOrderByExpiryDateDesc(userId, LocalDateTime.now()).orElse(null);
    }

    @Autowired
    private PurchasedMembershipService purchasedMembershipService;

    public void displayCurrentMembership(Long userId) {
        PurchasedMembership currentMembership = purchasedMembershipService.findCurrentMembershipByUserId(userId);
        if (currentMembership != null) {
            // Lấy thông tin chi tiết membership từ GymMembershipService sử dụng currentMembership.getMembershipId()
            GymMembership membershipDetails = gymMembershipService.get(currentMembership.getMembershipId());
            // Hiển thị thông tin
            System.out.println("Membership ID: " + currentMembership.getMembershipId());
            System.out.println("Expiry Date: " + currentMembership.getExpiryDate());
            System.out.println("Purchase Date: " + currentMembership.getPurchaseDate());
            // Và bất kỳ thông tin nào khác từ membershipDetails
        } else {
            System.out.println("No active membership found for user ID: " + userId);
        }
    }


}
