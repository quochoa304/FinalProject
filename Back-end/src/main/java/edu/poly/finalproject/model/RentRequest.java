package edu.poly.finalproject.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Entity
@Table(name = "request")
public class RentRequest {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;

    @ManyToOne
    @JoinColumn(name = "master_id")
    private User master;

    private String status;

    private String start_url;

    private  String join_url;

    public RentRequest() {
    }


    public RentRequest(User user, User master, String status, String start_url, String join_url) {
        this.user = user;
        this.master = master;
        this.status = status;
        this.start_url = start_url;
        this.join_url = join_url;
    }

}