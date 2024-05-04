package edu.poly.finalproject.Controller;

import edu.poly.finalproject.model.RentRequest;
import edu.poly.finalproject.model.User;
import edu.poly.finalproject.repository.RentRequestRepository;
import edu.poly.finalproject.repository.UserRepository;
import edu.poly.finalproject.service.RentRequestService;
import edu.poly.finalproject.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/rentRequests")
public class RentRequestController {

    @Autowired
    private RentRequestService rentRequestService;
    @Autowired
    private UserService userService;
    @Autowired
    private RentRequestRepository rentRequestRepository;
    @Autowired
    private UserRepository userRepository;
    @PostMapping
    public ResponseEntity<RentRequest> createRentRequest() {
        try {
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            String currentPrincipalName = authentication.getName();
            User user = userRepository.findByEmail(currentPrincipalName);

            RentRequest newRentRequest = rentRequestService.createRentRequest(user);
            return ResponseEntity.ok(newRentRequest);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @GetMapping("/master/{masterId}")
    public ResponseEntity<List<RentRequest>> getRequestsByMasterId(@PathVariable Long masterId) {
        try {
            User master = new User();
            master.setId(masterId);
            List<RentRequest> rentRequests = rentRequestRepository.findByMaster(master);
            return ResponseEntity.ok(rentRequests);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @GetMapping("/userRequest")
    public ResponseEntity<List<RentRequest>> getRequestsByUserId(Principal principal) {
        try {
            String email = principal.getName();
            User user = userRepository.findByEmail(email);
            if (user != null) {
                List<RentRequest> rentRequests = rentRequestRepository.findByUser(user);
                return ResponseEntity.ok(rentRequests);
            } else {
                return ResponseEntity.notFound().build();
            }
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @GetMapping("/masterRequest")
    public ResponseEntity<List<RentRequest>> getRequestsByMasterId(Principal principal) {
        try {
            String email = principal.getName();
            User user = userRepository.findByEmail(email);
            if (user != null) {
                List<RentRequest> rentRequests = rentRequestRepository.findByMaster(user);
                return ResponseEntity.ok(rentRequests);
            } else {
                return ResponseEntity.notFound().build();
            }
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }





    @PutMapping("/update/{id}")
    public ResponseEntity<?> updateRentRequestStatus(@PathVariable Long id, @RequestBody Map<String, String> updateData) {
        try {

            RentRequest existingRequest = rentRequestRepository.findById(id)
                    .orElseThrow(() -> new IllegalArgumentException("No RentRequest found with this id: " + id));

            String newStatus = updateData.get("status");
            existingRequest.setStatus(newStatus);

            if(updateData.containsKey("start_url")) {
                String newStartUrl = updateData.get("start_url");
                existingRequest.setStart_url(newStartUrl);
            }

            if(updateData.containsKey("join_url")) {
                String newJoinUrl = updateData.get("join_url");
                existingRequest.setJoin_url(newJoinUrl);
            }

            rentRequestRepository.save(existingRequest);

            if ("accepted".equals(newStatus)) {
                return ResponseEntity.ok("https://meet.google.com/tpq-qabv-qqk");
            }

            if ("denied".equals(newStatus)) {
                rentRequestRepository.delete(existingRequest);
                User currentUser = existingRequest.getUser();
                User currentMaster = existingRequest.getMaster();
                User anotherMaster = userService.findNextMaster(currentMaster.getId(), "ROLE_MASTER");

                if (anotherMaster != null) {
                    RentRequest newRentRequest = rentRequestService.createRentRequest(currentUser);
                    newRentRequest.setMaster(anotherMaster);
                    rentRequestRepository.save(newRentRequest);
                }
            }
            return ResponseEntity.ok(existingRequest);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().build();
        }
    }


}