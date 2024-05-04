package edu.poly.finalproject.service;

import edu.poly.finalproject.model.ExpertRequest;
import edu.poly.finalproject.model.User;
import edu.poly.finalproject.repository.ExpertRequestRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ExpertRequestService {

    private final ExpertRequestRepository expertRequestRepository;

    @Autowired
    public ExpertRequestService(ExpertRequestRepository  expertRequestRepository) {
        this.expertRequestRepository = expertRequestRepository;
    }

    public ExpertRequest saveExpertRequest (ExpertRequest application) {
        return expertRequestRepository.save(application);
    }

    public List<ExpertRequest> getExpertRequest() {
        return expertRequestRepository.findAll();
    }
    public ExpertRequest findByUser(User user) {
        return expertRequestRepository.findByUser(user);
    }
    public Optional<ExpertRequest> findById(Long id) {
        return expertRequestRepository.findById(id);
    }
}