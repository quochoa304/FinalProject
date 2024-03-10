package edu.poly.finalproject.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "gym_memberships")
@Getter
@Setter
public class GymMembership {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "name")
    private String name;

    @Column(name = "price")
    private Double price;

    @Column(name = "duration_months")
    private Integer durationMonths;


    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(
            name = "membership_exercises",
            joinColumns = @JoinColumn(name = "membership_id"),
            inverseJoinColumns = @JoinColumn(name = "exercise_id")
    )
    private Set<Exercise> exercises = new HashSet<>();
}
