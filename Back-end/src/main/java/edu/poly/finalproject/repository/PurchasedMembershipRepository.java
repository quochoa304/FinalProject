package edu.poly.finalproject.repository;

import edu.poly.finalproject.model.PurchasedMembership;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

public interface PurchasedMembershipRepository extends JpaRepository<PurchasedMembership, Long> {
    @Query("SELECT pm FROM PurchasedMembership pm WHERE pm.expiryDate <= :now")
    List<PurchasedMembership> findAllExpiredAsOf(LocalDateTime now);
    Optional<PurchasedMembership> findTopByUserIdAndExpiryDateAfterOrderByExpiryDateDesc(Long userId, LocalDateTime now);


    @Query("select count(pm) from PurchasedMembership pm where function('MONTH', pm.purchaseDate) = function('MONTH', current_date())")
    int countMembershipsPurchasedThisMonth();

    @Query("select g.name, sum(pm.price) from PurchasedMembership pm join GymMembership g on pm.membershipId = g.id where function('MONTH', pm.purchaseDate) = function('MONTH', current_date()) group by g.name")
    List<Object[]> getRevenueForMembershipsPurchasedThisMonth();
    @Query("select g.name, count(pm.userId) from PurchasedMembership pm join GymMembership g on pm.membershipId = g.id group by g.name")
    List<Object[]> getCountPerMembership();

    @Query("select function('YEAR',pm.purchaseDate) as year, function('MONTH', pm.purchaseDate) as month, sum(pm.price) "
            + "from PurchasedMembership pm where pm.purchaseDate > :from and pm.purchaseDate <= :to "
            + "group by function('YEAR',pm.purchaseDate), function('MONTH', pm.purchaseDate)")
    List<Object[]> getMonthlyRevenue(@Param("from")LocalDateTime from, @Param("to")LocalDateTime to);

    @Query("select function('YEAR',pm.purchaseDate) as year, function('MONTH', pm.purchaseDate) as month, "
            + "g.name, sum(pm.price) from PurchasedMembership pm join GymMembership g on pm.membershipId = g.id "
            + "where pm.purchaseDate > :from and pm.purchaseDate <= :to "
            + "group by function('YEAR',pm.purchaseDate), function('MONTH', pm.purchaseDate), g.name")
    List<Object[]> getRevenueByMembershipAndMonth(@Param("from")LocalDateTime from, @Param("to")LocalDateTime to);
}
