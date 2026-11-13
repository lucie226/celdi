package com.example.crm.config;

import com.example.crm.model.Role;
import com.example.crm.model.Utilisateur;
import com.example.crm.repository.UtilisateurRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
@Component
public class DataInitializer implements CommandLineRunner {
    private static final Logger log = LoggerFactory.getLogger(DataInitializer.class);
    private final UtilisateurRepository utilisateurs;
    private final PasswordEncoder encoder;
    private final boolean actif;
    private final String nom;
    private final String email;
    private final String motDePasse;

    public DataInitializer(UtilisateurRepository utilisateurs,
                           PasswordEncoder encoder,
                           @Value("${app.bootstrap-admin.enabled:false}") boolean actif,
                           @Value("${app.bootstrap-admin.nom}") String nom,
                           @Value("${app.bootstrap-admin.email}") String email,
                           @Value("${app.bootstrap-admin.password}") String motDePasse) {
        this.utilisateurs = utilisateurs;
        this.encoder = encoder;
        this.actif = actif;
        this.nom = nom;
        this.email = email;
        this.motDePasse = motDePasse;
    }

    @Override
    public void run(String... args) {
        if (!actif || utilisateurs.count() > 0) {
            return;
        }
        try {
            Utilisateur admin = new Utilisateur();
            admin.setNom(nom);
            admin.setEmail(email);
            admin.setMotDePasse(encoder.encode(motDePasse));
            admin.setRole(Role.admin);
            utilisateurs.save(admin);
            log.warn("Compte admin cree : {} (pense a changer son mot de passe)", email);
        } catch (Exception e) {
            log.error("Impossible de creer l'admin. Verifie que idusers est AUTO_INCREMENT "
                    + "(voir database/migration.sql). Cause : {}", e.getMessage());
        }
    }
}
