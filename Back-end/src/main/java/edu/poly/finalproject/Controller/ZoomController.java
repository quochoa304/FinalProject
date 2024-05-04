package edu.poly.finalproject.Controller;

import lombok.Getter;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.io.IOException;
import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.nio.charset.StandardCharsets;
import java.time.ZonedDateTime;
import java.time.format.DateTimeFormatter;
import java.util.Base64;

@RestController
public class ZoomController {

    private static final String clientId = "ZQfzUTlKQkqS045gOgfPbQ";
    private static final String clientSecret = "ZseYfItbFgwO54azeWOIkHJv1zpPBR20";
    private static final String accountId = "laDk0cprQfuv0FZd902I2w";

    @GetMapping("/createMeeting")
    public ResponseEntity<String> createMeeting() {
        HttpClient httpClient = HttpClient.newHttpClient();

        ZonedDateTime now = ZonedDateTime.now();
        ZonedDateTime meetingDateTime = now.plusDays(1); // Example: Meeting scheduled for next day

        String meetingTopic = "GWFitness Meeting";
        String meetingStartTime = meetingDateTime.format(DateTimeFormatter.ofPattern("yyyy-MM-dd'T'HH:mm:ss'Z'"));
        int meetingDuration = 60;

        String jwtToken = getAccessToken();

        String apiUrl = "https://api.zoom.us/v2/users/me/meetings";
        String requestBody = "{\"topic\":\"" + meetingTopic + "\",\"type\":2,\"start_time\":\"" + meetingStartTime + "\",\"duration\":" + meetingDuration + ",\"timeZone\":\"UTC\",\"settings\":{\"host_video\":true,\"participant_video\":true}}";

        HttpRequest request = HttpRequest.newBuilder()
                .uri(URI.create(apiUrl))
                .header("Content-Type", "application/json")
                .header("Authorization", "Bearer " + jwtToken)
                .POST(HttpRequest.BodyPublishers.ofString(requestBody))
                .build();

        try {
            HttpResponse<String> response = httpClient.send(request, HttpResponse.BodyHandlers.ofString());

            if (response.statusCode() == 200) {
                return ResponseEntity.ok(response.body());
            } else {
                return ResponseEntity.status(response.statusCode()).body(response.body());
            }
        } catch (IOException | InterruptedException e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body("Error creating meeting");
        }
    }

    private String getAccessToken() {

        HttpClient httpClient = HttpClient.newHttpClient();

        String credentials = clientId + ":" + clientSecret;
        String encodedCredentials = Base64.getEncoder().encodeToString(credentials.getBytes(StandardCharsets.UTF_8));

        String requestBody = "grant_type=account_credentials&account_id=" + accountId;

        HttpRequest request = HttpRequest.newBuilder()
                .uri(URI.create("https://zoom.us/oauth/token"))
                .header("Content-Type", "application/x-www-form-urlencoded")
                .header("Authorization", "Basic " + encodedCredentials)
                .POST(HttpRequest.BodyPublishers.ofString(requestBody))
                .build();

        try {
            HttpResponse<String> response = httpClient.send(request, HttpResponse.BodyHandlers.ofString());

            if (response.statusCode() == 200) {
                ZoomTokenResponse tokenResponse = ZoomTokenResponse.fromJson(response.body());
                return tokenResponse.getAccessToken();
            } else {
                System.out.println("Error getting access token: " + response.body());
            }
        } catch (IOException | InterruptedException e) {
            e.printStackTrace();
        }

        return null;
    }

    @Getter
    private static class ZoomTokenResponse {
        private String accessToken;

        public static ZoomTokenResponse fromJson(String jsonString) {
            // You can use a JSON parsing library like Jackson or Gson here
            // For simplicity, I'll assume direct manipulation of JSON string
            ZoomTokenResponse tokenResponse = new ZoomTokenResponse();
            tokenResponse.accessToken = jsonString.substring(jsonString.indexOf(":\"") + 2, jsonString.indexOf("\",\""));
            return tokenResponse;
        }
    }
}