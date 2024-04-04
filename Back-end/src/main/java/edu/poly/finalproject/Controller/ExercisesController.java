package edu.poly.finalproject.Controller;

import edu.poly.finalproject.model.Exercise;
import edu.poly.finalproject.service.ExerciseService;
import edu.poly.finalproject.service.GymMembershipService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping(path = "/admin") // This means all methods will start with /admin
public class ExercisesController {

    @Autowired
    private ExerciseService exerciseService;
    @Autowired
    private GymMembershipService gymMembershipService;

    // This method returns JSON
    @GetMapping(path = "/exercises", produces = "application/json")
    public List<Exercise> showExercisesPage() {
        return exerciseService.findAllExercises();
    }

    @PostMapping(path = "/exercises/save", consumes = "application/json")
    public Exercise saveExercises(@RequestBody Exercise exercise) {
        return exerciseService.saveExercise(exercise);
    }

    @GetMapping(path = "/exercises/edit/{id}", produces = "application/json")
    public Exercise showEditExercisesPage(@PathVariable Long id) {
        return exerciseService.get(id);
    }

    @PutMapping(path = "/exercises/update/{id}", consumes = "application/json")
    public Exercise updateExercise(@PathVariable Long id, @RequestBody Exercise updatedExercise) {
        Exercise exercise = exerciseService.get(id);

        if (exercise != null) {
            exercise.setName(updatedExercise.getName());
            exercise.setType(updatedExercise.getType());
            exercise.setDescription(updatedExercise.getDescription());

            return exerciseService.saveExercise(exercise);
        } else {
            // Handle case where exercise with given id is not found
            return null;
        }
    }

    @DeleteMapping(path = "/exercises/delete/{id}")
    // In RESTful services, 204 No Content is the more appropriate response
    // status when the server successfully performs a DELETE request.
    public void deleteExercises(@PathVariable(name = "id") Long id) {
        exerciseService.deleteExercise(id);
    }

}