package edu.poly.finalproject.Controller;

import edu.poly.finalproject.model.Exercise;
import edu.poly.finalproject.model.GymMembership;
import edu.poly.finalproject.service.ExerciseService;
import edu.poly.finalproject.service.GymMembershipService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

import java.util.List;

@Controller
public class GymMembershipController {

    @Autowired
    private GymMembershipService gymMembershipService;
    @Autowired
    private ExerciseService exerciseService;

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


    @GetMapping("/admin/gym-memberships/{id}/add-exercises")
    public String showAddExercisesPage(@PathVariable Long id, Model model) {
        GymMembership gymMembership = gymMembershipService.get(id);
        if (gymMembership == null) {
            model.addAttribute("error", "GymMembership not found.");
            return "errorPage"; // Hoặc trang thông báo lỗi tùy chỉnh của bạn
        }
        List<Exercise> availableExercises = exerciseService.findAllExercises();
        model.addAttribute("gymMembership", gymMembership);
        model.addAttribute("availableExercises", availableExercises);
        return "addExercisesPage"; // Tên file HTML mới để thêm Exercises
    }

    @PostMapping("/admin/gym-memberships/{membershipId}/add-exercises")
    public String addExercisesToMembership(@PathVariable Long membershipId, @RequestParam List<Long> exerciseIds, RedirectAttributes redirectAttributes) {
        GymMembership gymMembership = gymMembershipService.get(membershipId);
        if (gymMembership != null) {
            List<Exercise> selectedExercises = exerciseService.findAllById(exerciseIds);
            gymMembership.getExercises().addAll(selectedExercises);
            gymMembershipService.save(gymMembership);
            redirectAttributes.addFlashAttribute("success", "Exercises added successfully.");
        } else {
            redirectAttributes.addFlashAttribute("error", "GymMembership not found.");
        }
        return "redirect:/admin/gym-memberships/" + membershipId + "/add-exercises";
    }





}
