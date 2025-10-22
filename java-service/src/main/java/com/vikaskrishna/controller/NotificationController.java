package com.vikaskrishna.taskboard.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.Map;

@RestController
@RequestMapping("/api")
public class NotificationController {

    @PostMapping("/notify")
    public ResponseEntity<String> notify(@RequestBody Map<String, Object> task) {
        System.out.println("📢 New task received for notification: " + task);
        return ResponseEntity.ok("Notification scheduled successfully!");
    }
}
