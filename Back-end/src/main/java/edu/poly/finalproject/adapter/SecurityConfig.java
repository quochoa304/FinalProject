package edu.poly.finalproject.adapter;

import edu.poly.finalproject.service.UserService;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.AuthenticationFailureHandler;
import org.springframework.security.web.util.matcher.AntPathRequestMatcher;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.web.servlet.config.annotation.EnableWebMvc;

import java.io.IOException;
import java.util.Arrays;

@Configuration
@EnableWebSecurity
@EnableWebMvc
public class SecurityConfig  {

    private final UserService userService;

    @Autowired
    public SecurityConfig(UserService userService, BCryptPasswordEncoder passwordEncoder) {
        this.userService = userService;
        this.passwordEncoder = passwordEncoder;
    }

    private final BCryptPasswordEncoder passwordEncoder;

    @Bean
    public DaoAuthenticationProvider authenticationProvider() {
        DaoAuthenticationProvider auth = new DaoAuthenticationProvider();
        auth.setUserDetailsService(userService);
        auth.setPasswordEncoder(passwordEncoder);
        return auth;
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowedOrigins(Arrays.asList("http://localhost:3000")); // Cho phép CORS từ localhost:3000
        configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        configuration.setAllowedHeaders(Arrays.asList("Authorization", "Content-Type", "X-CSRF-Token"));
        configuration.setAllowCredentials(true);
        configuration.setExposedHeaders(Arrays.asList("Custom-Header1", "Custom-Header2"));

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration); // Áp dụng cho tất cả các endpoint
        return source;
    }


    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .httpBasic(AbstractHttpConfigurer::disable)
                .cors(Customizer.withDefaults())
                .cors(cors -> cors.configurationSource(corsConfigurationSource()))
                .csrf(AbstractHttpConfigurer::disable)
                .authorizeRequests((authz) -> authz
                        .requestMatchers(
                                "/",
                                "/registration",
                                "/buy-a-plan",
                                "/login",
                                "/calculateCalo",
                                "/assets/**",
                                "/js/**",
                                "/css/**",
                                "/img/**").permitAll()
                        .requestMatchers("/admin/**").hasRole("ADMIN")
                        .anyRequest().authenticated()
                )
                .formLogin((formLogin) -> formLogin
                        .loginPage("/login")
                        .failureHandler(new AuthenticationFailureHandler() {
                            @Override
                            public void onAuthenticationFailure(HttpServletRequest request, HttpServletResponse response, AuthenticationException exception) throws IOException, ServletException {
                                response.setStatus(HttpStatus.UNAUTHORIZED.value());
                                response.setContentType("application/json");
                                response.getWriter().write("{\"error\": \"Invalid username or password.\"}");
                            }
                        })
                        .defaultSuccessUrl("/member")
                        .permitAll()
                )
                .logout((logout) -> logout
                        .invalidateHttpSession(true)
                        .clearAuthentication(true)
                        .logoutRequestMatcher(new AntPathRequestMatcher("/logout"))
                        .logoutSuccessUrl("/login?logout")
                        .permitAll()
                );
        return http.build();
    }

}
