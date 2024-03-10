package edu.poly.finalproject.repository;

import edu.poly.finalproject.model.GymMembership;
import org.springframework.data.jpa.repository.JpaRepository;

public interface GymMembershipRepository extends JpaRepository<GymMembership, Long> {
}