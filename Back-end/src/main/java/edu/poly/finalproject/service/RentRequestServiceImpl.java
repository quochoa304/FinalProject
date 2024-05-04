package edu.poly.finalproject.service;

import edu.poly.finalproject.model.RentRequest;
import edu.poly.finalproject.model.User;
import edu.poly.finalproject.repository.RentRequestRepository;
import edu.poly.finalproject.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Random;

@Service
public class RentRequestServiceImpl implements RentRequestService {

    @Autowired
    private RentRequestRepository rentRequestRepository;

    @Autowired
    private UserRepository userRepository;

    @Override
    public RentRequest createRentRequest(User user) {
        List<User> masters = userRepository.findUsersByRoleName("ROLE_MASTER");
        if(!masters.isEmpty()){
            Random rand = new Random();
            User master = masters.get(rand.nextInt(masters.size()));
            RentRequest rentRequest = new RentRequest(user, master, "Looking for a coach", "","");
            return rentRequestRepository.save(rentRequest);
        } else {
            throw new IllegalArgumentException("No masters available to handle request");
        }
    }
}