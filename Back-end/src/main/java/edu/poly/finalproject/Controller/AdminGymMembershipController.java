package edu.poly.finalproject.Controller;

import edu.poly.finalproject.model.Exercise;
import edu.poly.finalproject.model.GymMembership;
import edu.poly.finalproject.service.ExerciseService;
import edu.poly.finalproject.service.GymMembershipService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.ArrayList;
import java.util.Set;

@RestController
@RequestMapping("/admin")
public class AdminGymMembershipController {

    @Autowired
    private GymMembershipService gymMembershipService;

    @Autowired
    private ExerciseService exerciseService;

    @GetMapping("/gym-memberships")
    public ResponseEntity<List<GymMembership>> getGymMemberships() {
        List<GymMembership> gymMemberships = gymMembershipService.listAll();
        return ResponseEntity.ok(gymMemberships);
    }

    @PostMapping("/gym-memberships")
    public ResponseEntity<Void> createGymMembership(@RequestBody GymMembership gymMembership) {
        gymMembershipService.save(gymMembership);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/gym-memberships/{id}")
    public ResponseEntity<GymMembership> getGymMembership(@PathVariable Long id) {
        GymMembership gymMembership = gymMembershipService.get(id);
        return ResponseEntity.ok(gymMembership);
    }

    @DeleteMapping("/gym-memberships/{id}")
    public ResponseEntity<Void> deleteGymMembership(@PathVariable Long id) {
        gymMembershipService.delete(id);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/gym-memberships/{id}/exercises")
    public ResponseEntity<List<Exercise>> getExercises(@PathVariable Long id) {
        GymMembership gymMembership = gymMembershipService.get(id);
        Set<Exercise> availableExercises = gymMembership.getExercises();
        return ResponseEntity.ok(new ArrayList<>(availableExercises));
    }

    @PostMapping("/gym-memberships/{membershipId}/exercises")
    public ResponseEntity<Void> addExercisesToMembership(@PathVariable Long membershipId, @RequestBody List<Long> exerciseIds) {
        GymMembership gymMembership = gymMembershipService.get(membershipId);
        List<Exercise> selectedExercises = exerciseService.findAllById(exerciseIds);
        gymMembership.getExercises().addAll(selectedExercises);
        gymMembershipService.save(gymMembership);
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/gym-memberships/{membershipId}/exercises/{exerciseId}")
    public ResponseEntity<Void> removeExerciseFromMembership(@PathVariable Long membershipId, @PathVariable Long exerciseId) {
        gymMembershipService.removeExerciseFromMembership(membershipId, exerciseId);
        return ResponseEntity.ok().build();
    }
}