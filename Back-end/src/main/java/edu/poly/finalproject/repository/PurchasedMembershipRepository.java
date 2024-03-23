package edu.poly.finalproject.repository;

import edu.poly.finalproject.model.PurchasedMembership;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

public interface PurchasedMembershipRepository extends JpaRepository<PurchasedMembership, Long> {
    @Query("SELECT pm FROM PurchasedMembership pm WHERE pm.expiryDate <= :now")
    List<PurchasedMembership> findAllExpiredAsOf(LocalDateTime now);
    Optional<PurchasedMembership> findTopByUserIdAndExpiryDateAfterOrderByExpiryDateDesc(Long userId, LocalDateTime now);
}
