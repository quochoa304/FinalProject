package edu.poly.finalproject.service;

import edu.poly.finalproject.Controller.UserRegistrationDto;
import edu.poly.finalproject.model.Role;
import edu.poly.finalproject.model.User;
import edu.poly.finalproject.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Arrays;
import java.util.Collection;
import java.util.Map;
import java.util.stream.Collectors;



@Service
public class UserServiceImpl implements UserService {
    @Autowired
    private final UserRepository userRepository;
    @Autowired
    private final PasswordEncoder passwordEncoder;
    public UserServiceImpl(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }


    @Override
    public User save(UserRegistrationDto registrationDto) {
        if (emailExist(registrationDto.getEmail())) {
            throw new EmailExistsException("There is an account with that email address: " + registrationDto.getEmail());
        }
        if (registrationDto.getPassword() == null || registrationDto.getPassword().isEmpty()) {
            throw new IllegalArgumentException("Password cannot be null or empty");
        }
        User user = new User(registrationDto.getFirstName(),
                registrationDto.getLastName(), registrationDto.getEmail(),
                passwordEncoder.encode(registrationDto.getPassword()), Arrays.asList(new Role("ROLE_USER")));

        return userRepository.save(user);
    }
    private boolean emailExist(String email) {
        return userRepository.findByEmail(email) != null;
    }


    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {

        User user = userRepository.findByEmail(username);
        if(user == null) {
            throw new UsernameNotFoundException("Invalid username or password.");
        }
        return new org.springframework.security.core.userdetails.User(user.getEmail(),
                                                                    user.getPassword(),
                                                                    mapRolesToAuthorities(user.getRoles()));
    }

    private Collection<? extends GrantedAuthority> mapRolesToAuthorities(Collection<Role> roles){
        return roles.stream().map(role -> new SimpleGrantedAuthority(role.getName())).collect(Collectors.toList());
    }

    public User saveOrUpdateUserFromOAuth2(Map<String, Object> attributes) {
        String email = (String) attributes.get("email");
        // Kiểm tra xem người dùng đã tồn tại chưa
        User user = userRepository.findByEmail(email);
        if (user == null) {
            // Tạo người dùng mới nếu không tồn tại
            user = new User();
            user.setEmail(email);
            user.setFirstName((String) attributes.get("given_name")); // hoặc "name" tùy thuộc vào thuộc tính trả về từ Google
            user.setLastName((String) attributes.get("family_name")); // tương tự như trên
            user.setPassword(passwordEncoder.encode("A default or random password")); // Đặt mật khẩu mặc định hoặc ngẫu nhiên
            Role defaultRole = new Role("ROLE_USER");
            user.setRoles(Arrays.asList(defaultRole)); // Thiết lập quyền mặc định
        } else {
            // Cập nhật thông tin người dùng nếu muốn
        }
        return userRepository.save(user); // Lưu người dùng
    }



}