package com.example.crm.service;
import com.example.crm.dto.ChangePasswordRequest;
import com.example.crm.dto.LoginRequest;
import com.example.crm.dto.LoginResponse;
import com.example.crm.dto.UtilisateurResponse;
import com.example.crm.model.Utilisateur;
import com.example.crm.repository.UtilisateurRepository;
import com.example.crm.security.JwtService;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;
@Service
public class AuthService {
    private final UtilisateurRepository utilisateurs;
    private final PasswordEncoder encoder;
    private final JwtService jwtService;
    public AuthService(UtilisateurRepository utilisateurs, PasswordEncoder encoder, JwtService jwtService) {
        this.utilisateurs = utilisateurs;
        this.encoder = encoder;
        this.jwtService = jwtService;
    }
    public LoginResponse login(LoginRequest req) {
        Utilisateur u = utilisateurs.findByEmail(req.email())
                .filter(user -> motDePasseValide(user, req.motDePasse()))
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED,
                        "Email ou mot de passe incorrect"));
        return new LoginResponse(jwtService.generer(u), "Bearer", UtilisateurResponse.from(u));
    }
    public void changerMotDePasse(String email, ChangePasswordRequest req) {
        Utilisateur u = utilisateurs.findByEmail(email)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Utilisateur introuvable"));
        if (!motDePasseValide(u, req.ancienMotDePasse())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Ancien mot de passe incorrect");
        }
        u.setMotDePasse(encoder.encode(req.nouveauMotDePasse()));
        utilisateurs.save(u);
    }
    private boolean motDePasseValide(Utilisateur u, String saisi) {
        String stocke = u.getMotDePasse();
        if (stocke == null || saisi == null) {
            return false;
        }
        if (stocke.startsWith("$2")) {
            return encoder.matches(saisi, stocke);
        }
        if (stocke.equals(saisi)) {
            u.setMotDePasse(encoder.encode(saisi));
            utilisateurs.save(u);
            return true;
        }
        return false;
    }
}
