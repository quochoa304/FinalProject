package edu.poly.finalproject.task;

import edu.poly.finalproject.model.PurchasedMembership;
import edu.poly.finalproject.repository.PurchasedMembershipRepository;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.util.List;

@Component
public class MembershipCleanupTask {
    private final PurchasedMembershipRepository purchasedMembershipRepository;

    public MembershipCleanupTask(PurchasedMembershipRepository purchasedMembershipRepository) {
        this.purchasedMembershipRepository = purchasedMembershipRepository;
    }

    @Scheduled(cron = "0 0 0 * * ?") // This runs at midnight every day
    public void cleanExpiredMemberships() {
        LocalDateTime now = LocalDateTime.now();
        List<PurchasedMembership> expiredMemberships = purchasedMembershipRepository.findAllExpiredAsOf(now);
        purchasedMembershipRepository.deleteAll(expiredMemberships);
    }
}
