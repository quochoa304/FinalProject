package edu.poly.finalproject.service;

import edu.poly.finalproject.model.Exercise;
import edu.poly.finalproject.model.GymMembership;
import edu.poly.finalproject.repository.GymMembershipRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class GymMembershipService {

    @Autowired
    private GymMembershipRepository gymMembershipRepository;

    public List<GymMembership> listAll() {
        return gymMembershipRepository.findAll();
    }

    public void save(GymMembership gymMembership) {
        gymMembershipRepository.save(gymMembership);
    }

    public GymMembership get(Long id) {
        return gymMembershipRepository.findById(id).orElse(null);
    }

    public void delete(Long id) {
        gymMembershipRepository.deleteById(id);
    }

    public boolean existsById(Long id) {
        return gymMembershipRepository.existsById(id);
    }

    public void addExerciseToMembership(Long membershipId, Exercise exercise) {
        GymMembership gymMembership = gymMembershipRepository.findById(membershipId).orElse(null);
        if (gymMembership != null) {
            gymMembership.getExercises().add(exercise);
            gymMembershipRepository.save(gymMembership);
        }
    }
}
