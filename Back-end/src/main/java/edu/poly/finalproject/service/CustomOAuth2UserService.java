package edu.poly.finalproject.service;

import edu.poly.finalproject.model.Role;
import edu.poly.finalproject.model.User;
import edu.poly.finalproject.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.oauth2.client.userinfo.DefaultOAuth2UserService;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserRequest;
import org.springframework.security.oauth2.core.OAuth2AuthenticationException;
import org.springframework.security.oauth2.core.user.DefaultOAuth2User;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Service;

import java.util.Arrays;
import java.util.Collections;
import java.util.Map;

@Service
public class CustomOAuth2UserService extends DefaultOAuth2UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private BCryptPasswordEncoder passwordEncoder;

    @Override
    public OAuth2User loadUser(OAuth2UserRequest userRequest) throws OAuth2AuthenticationException {
        OAuth2User oauthUser = super.loadUser(userRequest);
        // Extract the email or other identifying info
        String email = oauthUser.getAttribute("email");
        User existingUser = userRepository.findByEmail(email);
        if (existingUser == null) {
            // Create a new user in the system
            existingUser = createUser(email, oauthUser.getAttributes());
        }
        // Return a user that Spring Security can use, with roles and privileges
        return new DefaultOAuth2User(
                Collections.singleton(new SimpleGrantedAuthority("ROLE_USER")),
                oauthUser.getAttributes(),
                "email");
    }

    private User createUser(String email, Map<String, Object> attributes) {
        User user = new User();
        user.setEmail(email);
        user.setFirstName((String) attributes.get("given_name")); // Adjust based on the actual attribute name
        user.setLastName((String) attributes.get("family_name")); // Adjust based on the actual attribute name
        user.setPassword(passwordEncoder.encode("A default or random password")); // You might want to set a random or temporary password
        Role defaultRole = new Role("ROLE_USER");
        user.setRoles(Arrays.asList(defaultRole)); // Set default roles
        return userRepository.save(user); // Save the new user in the repository
    }
}
