package edu.poly.finalproject.Controller;

import edu.poly.finalproject.service.EmailSenderService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class EmailSenderController {

    @Autowired
    private EmailSenderService emailService;

    @PostMapping("/sendEmail")
    public String sendEmail(@RequestParam("toEmail") String toEmail,
                            @RequestParam("subject") String subject,
                            @RequestParam("body") String body) {
        emailService.sendMail(toEmail, subject, body);
        return "Email sent successfully!";
    }
}