package edu.poly.finalproject.adapter;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityCustomizer;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.servlet.config.annotation.EnableWebMvc;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.ViewControllerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class MvcConfig implements WebMvcConfigurer {

    @Override
    public void addViewControllers(ViewControllerRegistry registry) {
        // Map the login page
        registry.addViewController("/login").setViewName("login");

        // Map the member page and require authentication
        registry.addViewController("/member").setViewName("member");
    }
    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        // Existing configuration code...

        // Add this to serve static resources from /assets/images/
        registry.addResourceHandler("/assets/**").addResourceLocations("classpath:/static/assets/");
    }
    @Bean
    public RestTemplate restTemplate() {
        return new RestTemplate();
    }

}
