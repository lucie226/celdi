package com.example.crm.controller;

import com.example.crm.dto.ChangePasswordRequest;
import com.example.crm.dto.LoginRequest;
import com.example.crm.dto.LoginResponse;
import com.example.crm.dto.UtilisateurResponse;
import com.example.crm.service.AuthService;
import com.example.crm.service.UtilisateurService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
@RestController
@RequestMapping("/api/auth")
public class AuthController {
    private final AuthService authService;
    private final UtilisateurService utilisateurService;
    public AuthController(AuthService authService, UtilisateurService utilisateurService) {
        this.authService = authService;
        this.utilisateurService = utilisateurService;
    }
    @PostMapping("/login")
    public LoginResponse login(@Valid @RequestBody LoginRequest req) {
        return authService.login(req);
    }
    @GetMapping("/me")
    public UtilisateurResponse me(Authentication auth) {
        return utilisateurService.obtenirParEmail(auth.getName());
    }
    @PutMapping("/mot-de-passe")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void changerMotDePasse(@Valid @RequestBody ChangePasswordRequest req, Authentication auth) {
        authService.changerMotDePasse(auth.getName(), req);
    }
}
