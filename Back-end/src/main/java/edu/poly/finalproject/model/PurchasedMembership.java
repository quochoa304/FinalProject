package edu.poly.finalproject.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Entity
@Getter
@Setter
@Table(name = "purchased_memberships")
public class PurchasedMembership {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "user_id")
    private Long userId;

    @Column(name = "membership_id")
    private Long membershipId;

    @Column(name = "expiry_date")
    private LocalDateTime expiryDate;

    @Column(name ="purchase_date")
    private LocalDateTime purchaseDate;

    // Constructors, Getters, and Setters


}
