package edu.poly.finalproject.service;

import edu.poly.finalproject.model.Exercise;
import edu.poly.finalproject.repository.ExerciseRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ExerciseService {

    private final ExerciseRepository exerciseRepository;

    @Autowired
    public ExerciseService(ExerciseRepository exerciseRepository) {
        this.exerciseRepository = exerciseRepository;
    }

    public List<Exercise> findAllExercises() {
        return exerciseRepository.findAll();
    }
    public List<Exercise> findAllById(List<Long> ids) {
        return exerciseRepository.findAllById(ids);
    }



    public Exercise get(Long id){
        return exerciseRepository.findById(id).orElse(null);
    }

    public Exercise saveExercise(Exercise exercise) {
        return exerciseRepository.save(exercise);
    }

    public Exercise updateExercise(Exercise exercise) {
        // Đảm bảo rằng Exercise có trong DB trước khi cập nhật
        return exerciseRepository.save(exercise);
    }

    public void deleteExercise(Long id) {
        exerciseRepository.deleteById(id);
    }
}
