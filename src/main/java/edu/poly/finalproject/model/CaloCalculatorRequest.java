package edu.poly.finalproject.model;


import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
public class CaloCalculatorRequest {
    private double height; // Chiều cao tính bằng cm
    private double weight; // Trọng lượng tính bằng kg
    private int age; // Tuổi
    private String gender; // Giới tính: "male" hoặc "female"
    private String activityLevel; // Mức độ hoạt động

    public double getAge() {
        return age;
    }


}
