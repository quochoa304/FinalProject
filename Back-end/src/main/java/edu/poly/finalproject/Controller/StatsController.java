package edu.poly.finalproject.Controller;

import edu.poly.finalproject.repository.PurchasedMembershipRepository;
import edu.poly.finalproject.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/stats")
public class StatsController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PurchasedMembershipRepository purchasedMembershipRepository;


    @GetMapping("/users/count")
    public int getTotalUsers() {
        return userRepository.countAllUsers();
    }

    @GetMapping("/memberships/counts")
    public Map<String, Long> getMembershipCounts() {
        List<Object[]> counts = purchasedMembershipRepository.getCountPerMembership();
        Map<String, Long> result = new HashMap<>();
        for (Object[] count : counts) {
            result.put((String) count[0], (Long) count[1]);
        }
        return result;
    }

    @GetMapping("/memberships/monthly")
    public int getMonthlyMembershipPurchases() {
        return purchasedMembershipRepository.countMembershipsPurchasedThisMonth();
    }

    @GetMapping("/memberships/revenueThisMonthPerMembership")
    public List<Map<String, Object>> getRevenueThisMonthPerMembership() {

        List<Object[]> revenues = purchasedMembershipRepository.getRevenueForMembershipsPurchasedThisMonth();
        List<Map<String, Object>> results = new ArrayList<>();

        for (Object[] revenue : revenues) {
            Map<String, Object> map = new HashMap<>();
            map.put("membershipName", revenue[0]);
            map.put("revenue", revenue[1]);
            results.add(map);
        }

        return results;
    }

    @GetMapping("/memberships/revenueLastFourMonths")
    public List<Map<String, Object>> getRevenueLastFourMonths() {
        LocalDateTime now = LocalDateTime.now();
        LocalDateTime fourMonthsAgo = now.minusMonths(4);

        List<Object[]> revenues = purchasedMembershipRepository.getMonthlyRevenue(fourMonthsAgo, now);
        List<Map<String, Object>> results = new ArrayList<>();

        for (Object[] revenue : revenues) {
            Map<String, Object> map = new HashMap<>();
            map.put("year", revenue[0]);
            map.put("month", revenue[1]);
            map.put("revenue", revenue[2]);
            results.add(map);
        }

        return results;
    }
    @GetMapping("/memberships/revenueByMembershipLastFourMonths")
    public List<Map<String, Object>> getRevenueByMembershipLastFourMonths() {
        LocalDateTime now = LocalDateTime.now();
        LocalDateTime fourMonthsAgo = now.minusMonths(4);

        List<Object[]> revenues = purchasedMembershipRepository.getRevenueByMembershipAndMonth(fourMonthsAgo, now);
        List<Map<String, Object>> results = new ArrayList<>();

        for (Object[] revenue : revenues) {
            Map<String, Object> map = new HashMap<>();
            map.put("year", revenue[0]);
            map.put("month", revenue[1]);
            map.put("membershipName", revenue[2]);
            map.put("revenue", revenue[3]);
            results.add(map);
        }

        return results;
    }

}