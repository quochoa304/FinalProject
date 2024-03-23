package edu.poly.finalproject.Controller;

import edu.poly.finalproject.model.GymMembership;
import edu.poly.finalproject.model.PurchasedMembership;
import edu.poly.finalproject.model.User;
import edu.poly.finalproject.repository.GymMembershipRepository;
import edu.poly.finalproject.repository.UserRepository;
import edu.poly.finalproject.service.GymMembershipService;
import edu.poly.finalproject.service.PurchasedMembershipService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;

@Controller
public class PurchaseController {

    @Autowired
    private PurchasedMembershipService purchasedMembershipService;
    @Autowired
    private GymMembershipRepository gymMembershipRepository;
    @Autowired
    private UserRepository userRepository ;
    @Autowired
    private GymMembershipService gymMembershipService;
    @GetMapping("/buy-a-plan")
    public String showBuyAPlanPage(Model model) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String currentPrincipalName = authentication.getName();

        // Lấy userId từ username (email hoặc username đăng nhập)
        User user = userRepository.findByEmail(currentPrincipalName); // Giả sử phương thức này trả về đối tượng User dựa trên username
        Long userId = user.getId();
        String mail = user.getEmail();
        PurchasedMembership currentMembership = purchasedMembershipService.findCurrentMembershipByUserId(userId);
        if (currentMembership != null) {
            GymMembership membershipDetails = gymMembershipService.get(currentMembership.getMembershipId());
            model.addAttribute("membership", membershipDetails);
            model.addAttribute("expiryDate", currentMembership.getExpiryDate());
            model.addAttribute("purchaseDate", currentMembership.getPurchaseDate());
        } else {
            model.addAttribute("message", "No active membership found for user: " + mail);
        }
        model.addAttribute("gymMemberships", gymMembershipRepository.findAll());
        return "buyAPlan"; // Tên file buyAPlan.html trong thư mục templates

    }


    @PostMapping("/buy-a-plan")
    public String purchase(@RequestParam Long membership_Id, @RequestParam int durationMonths) {
        // Lấy thông tin xác thực của người dùng hiện tại
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String currentUserName = authentication.getName();
        // Tìm người dùng dựa trên username (email)
        User user = userRepository.findByEmail(currentUserName);
        if (user == null) {
            // Xử lý trường hợp không tìm thấy người dùng
            return "redirect:/buyAPlan?error";
        }
        Long user_Id = user.getId();
        try {
            purchasedMembershipService.purchaseMembership(user_Id, membership_Id);
            // handle successful purchase
            return "redirect:/buy-a-plan?success";
        } catch (IllegalStateException e) {
            return "redirect:/buy-a-plan?duplicate";
        }
    }
}
