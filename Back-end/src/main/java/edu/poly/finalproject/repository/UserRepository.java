package edu.poly.finalproject.repository;

import edu.poly.finalproject.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    User findByEmail(String email);
    @Query("select count(u) from User u")
    int countAllUsers();
    @Query("select u from User u inner join u.roles r where r.name = :roleName")
    List<User> findUsersByRoleName(String roleName);

    @Query("SELECT u FROM User u INNER JOIN u.roles r WHERE r.name = :roleName AND u.id <> :userId ORDER BY u.id ASC")
    List<User> findAllMastersExceptCurrent(Long userId, String roleName);


}