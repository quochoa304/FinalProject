package edu.poly.finalproject.adapter;

import org.springframework.context.annotation.Configuration;
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
}
