package edu.poly.finalproject.service;

import edu.poly.finalproject.model.Exercise;
import edu.poly.finalproject.repository.ExerciseRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
@Service
public class ExerciseService {
    @Autowired
    private ExerciseRepository exerciseRepository;

    public List<Exercise> listAll() {
        return exerciseRepository.findAll();
    }

    public void save(Exercise exercise) {
        exerciseRepository.save(exercise);
    }

    public Exercise get(Long id) {
        return exerciseRepository.findById(id).orElse(null);
    }

    public void delete(Long id) {
        exerciseRepository.deleteById(id);
    }
}
