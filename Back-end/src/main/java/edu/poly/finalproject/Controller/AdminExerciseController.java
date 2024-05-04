package edu.poly.finalproject.Controller;

import edu.poly.finalproject.model.Exercise;
import edu.poly.finalproject.model.ExpertRequest;
import edu.poly.finalproject.model.Role;
import edu.poly.finalproject.model.User;
import edu.poly.finalproject.repository.UserRepository;
import edu.poly.finalproject.service.ExerciseService;
import edu.poly.finalproject.service.ExpertRequestService;
import edu.poly.finalproject.service.GymMembershipService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping(path = "/admin") // This means all methods will start with /admin
public class AdminExerciseController {

    @Autowired
    private ExerciseService exerciseService;
    @Autowired
    private GymMembershipService gymMembershipService;
    @Autowired
    private ExpertRequestService expertRequestService;
    @Autowired
    private UserRepository userRepository;

    // This method returns JSON
    @GetMapping(path = "/exercises", produces = "application/json")
    public List<Exercise> showExercisesPage() {
        return exerciseService.findAllExercises();
    }

    @PostMapping(path = "/exercises/save")
    public Exercise saveExercises(@RequestParam("image") MultipartFile image,
                                  @RequestParam("name") String name,
                                  @RequestParam("description") String description,
                                  @RequestParam("type") String type) {
        Exercise exercise = new Exercise();
        exercise.setName(name);
        exercise.setDescription(description);
        exercise.setType(type);

        // Check if an image file is uploaded
        if (image != null && !image.isEmpty()) {
            try {
                exercise.setImage(image.getBytes());
            } catch (IOException e) {
                e.printStackTrace();
                // Handle error
            }
        }

        return exerciseService.saveExercise(exercise);
    }

    @GetMapping(path = "/exercises/edit/{id}", produces = "application/json")
    public Exercise showEditExercisesPage(@PathVariable Long id) {
        return exerciseService.get(id);
    }

    @PutMapping(path = "/exercises/update/{id}", consumes = "multipart/form-data")
    public Exercise updateExercise(@PathVariable Long id,
                                   @RequestParam("image") MultipartFile image,
                                   @RequestParam("name") String name,
                                   @RequestParam("description") String description,
                                   @RequestParam("type") String type) {
        Exercise exercise = exerciseService.get(id);

        if (exercise != null) {
            exercise.setName(name);
            exercise.setType(type);
            exercise.setDescription(description);

            // Check if a new image file is uploaded
            if (image != null && !image.isEmpty()) {
                try {
                    exercise.setImage(image.getBytes());
                } catch (IOException e) {
                    e.printStackTrace();
                    // Handle error
                }
            }

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

    @GetMapping("/showAllExpertRequest")
    public List<ExpertRequest> getAllExpertRequest() {
        return expertRequestService.getExpertRequest();
    }

    @PutMapping("/updateExpertRequest/{id}")
    public ExpertRequest updateStatus(@PathVariable Long id, @RequestBody String status) {
        ExpertRequest existingRequest = expertRequestService.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("No ExpertRequest found with this id: " + id));

        validateStatus(status);

        existingRequest.setStatus(status);
        expertRequestService.saveExpertRequest(existingRequest); // Saving the updated request

        User requestUser = existingRequest.getUser(); // Get user from the request
        String userEmail = requestUser.getEmail(); // Get email of the user

        User user = userRepository.findByEmail(userEmail);

        if (status.equals("accepted")) {
            if (user != null) {

                user.setRoles(new ArrayList<>(List.of(new Role("ROLE_MASTER"))));
                userRepository.save(user); // Saving the updated user
            }
        }
        if (status.equals("denied")) {
            if (user != null) {
                user.setRoles(new ArrayList<>(List.of(new Role("ROLE_USER"))));
                userRepository.save(user); // Saving the updated user
            }
        }

        return existingRequest;
    }


    private void validateStatus(String status) {
        // Check if the status is valid
        if (!status.equals("pending") && !status.equals("accepted") && !status.equals("denied")) {
            throw new IllegalArgumentException("Invalid status. " +
                    "Status must be either 'pending', 'accepted' or 'denied'");
        }
    }

}