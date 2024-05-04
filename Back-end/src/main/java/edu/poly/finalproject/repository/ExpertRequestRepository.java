package edu.poly.finalproject.repository;

import edu.poly.finalproject.model.ExpertRequest;
import edu.poly.finalproject.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ExpertRequestRepository extends JpaRepository<ExpertRequest, Long> {

    ExpertRequest findByUser(User user);
    Optional<ExpertRequest> findById(Long id);
}