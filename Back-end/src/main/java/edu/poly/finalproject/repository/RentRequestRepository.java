package edu.poly.finalproject.repository;

import edu.poly.finalproject.model.RentRequest;
import edu.poly.finalproject.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface RentRequestRepository extends JpaRepository<RentRequest, Long> {
    List<RentRequest> findByUser(User user);
    List<RentRequest> findByMaster(User master);


}