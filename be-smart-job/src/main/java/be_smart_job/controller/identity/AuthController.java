package be_smart_job.controller.identity;

import be_smart_job.service.identity.interfaces.AuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
public class AuthController {
//
//    private final AuthService authService;
//
//    @PostMapping("/login")
//    public ResponseEntity<String> login(@RequestParam String usernameOrEmail, @RequestParam String password) {
//        return ResponseEntity.ok(authService.login(usernameOrEmail, password));
//    }
//
//    @PostMapping("/register")
//    public ResponseEntity<Void> register(@RequestParam String username,
//                                         @RequestParam String email,
//                                         @RequestParam String password,
//                                         @RequestParam String roleId) {
//        authService.register(username, email, password, roleId);
//        return ResponseEntity.ok().build();
//    }
//
//    @PostMapping("/refresh-token")
//    public ResponseEntity<Void> refreshToken(@RequestParam String refreshToken) {
//        authService.refreshToken(refreshToken);
//        return ResponseEntity.ok().build();
//    }
}