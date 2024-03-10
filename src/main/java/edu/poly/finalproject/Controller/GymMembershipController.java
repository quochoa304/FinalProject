package edu.poly.finalproject.Controller;

import edu.poly.finalproject.model.Exercise;
import edu.poly.finalproject.model.GymMembership;
import edu.poly.finalproject.repository.GymMembershipRepository;
import edu.poly.finalproject.service.GymMembershipService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;

import java.util.List;

@Controller
public class GymMembershipController {

    @Autowired
    private GymMembershipService gymMembershipService;
    @Autowired
    private GymMembershipRepository gymMembershipRepository;

    @GetMapping("/admin/gym-memberships")
    public String showGymMembershipPage(Model model) {
        List<GymMembership> gymMemberships = gymMembershipService.listAll();
        model.addAttribute("gymMemberships", gymMemberships);
        // Add an empty gymMembership object to the model for the form
        model.addAttribute("gymMembership", new GymMembership());
        return "adminPage"; // Ensure this page has the form and list to manage gym memberships
    }


    @PostMapping("/admin/gym-memberships/save")
    public String saveGymMembership(GymMembership gymMembership) {
        gymMembershipService.save(gymMembership);
        return "redirect:/admin/gym-memberships";
    }

    @GetMapping("/admin/gym-memberships/edit/{id}")
    public String showEditGymMembershipPage(@PathVariable Long id, Model model) {
        GymMembership gymMembership = gymMembershipService.get(id);
        model.addAttribute("gymMembership", gymMembership);
        List<GymMembership> gymMemberships = gymMembershipService.listAll();
        model.addAttribute("gymMemberships", gymMemberships); // Thêm để giữ danh sách hiển thị
        return "adminPage";
    }


    @GetMapping("/admin/gym-memberships/delete/{id}")
    public String deleteGymMembership(@PathVariable(name = "id") Long id) {
        gymMembershipService.delete(id);
        return "redirect:/admin/gym-memberships";
    }

    @PostMapping("/gym-memberships/{membershipId}/add-exercise")
    public String addExerciseToMembership(@PathVariable Long membershipId, @ModelAttribute Exercise exercise, Model model) {
        if (!gymMembershipService.existsById(membershipId)) {
            model.addAttribute("error", "GymMembership không tồn tại.");
            return "errorPage";
        }
        gymMembershipService.addExerciseToMembership(membershipId, exercise);
        return "redirect:/gym-memberships/" + membershipId;
    }

}
