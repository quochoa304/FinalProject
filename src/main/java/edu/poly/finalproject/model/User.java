package edu.poly.finalproject.model;

public class User {
    private Long id;
    private String username;
    private String password;
    // Các trường khác cần thiết

    // Constructors
    public User() {
    }

    public User(Long id, String username, String password) {
        this.id = id;
        this.username = username;
        this.password = password;
    }

    // Getter và Setter cho các trường

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    // Các phương thức khác nếu cần
}
