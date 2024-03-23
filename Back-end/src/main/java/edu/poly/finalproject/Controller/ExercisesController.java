package edu.poly.finalproject.Controller;

import edu.poly.finalproject.model.Exercise;
import edu.poly.finalproject.service.ExerciseService;
import edu.poly.finalproject.service.GymMembershipService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;

import java.util.List;

@Controller
public class ExercisesController {

    @Autowired
    private ExerciseService exerciseService;
    @Autowired
    private GymMembershipService gymMembershipService;

    @GetMapping("/admin/exercises")
    public String showExercisesPage(Model model) {
        List<Exercise> exercises = exerciseService.findAllExercises();
        model.addAttribute("exercisesList", exercises); // Thay đổi ở đây
        model.addAttribute("exercise", new Exercise()); // Đổi thành "exercise"
        return "ExercisePage"; // Đảm bảo rằng tên view trùng khớp với tên file HTML
    }

    @PostMapping("/admin/exercises/save")
    public String saveExercises(Exercise exercise) {
        exerciseService.saveExercise(exercise);
        return "redirect:/admin/exercises";
    }

    @GetMapping("/admin/exercises/edit/{id}")
    public String showEditExercisesPage(@PathVariable Long id, Model model) {
        Exercise exercise = exerciseService.get(id);
        model.addAttribute("exercise", exercise);
        List<Exercise> exercises = exerciseService.findAllExercises();
        model.addAttribute("exercises", exercises); // Thêm để giữ danh sách hiển thị
        return "ExercisePage";
    }


    @GetMapping("/admin/exercises/delete/{id}")
    public String deleteExercises(@PathVariable(name = "id") Long id) {
        exerciseService.deleteExercise(id);
        return "redirect:/admin/exercises";
    }


}
