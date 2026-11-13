package com.example.crm.service;
import com.example.crm.dto.UtilisateurRequest;
import com.example.crm.dto.UtilisateurResponse;
import com.example.crm.model.Prospect;
import com.example.crm.model.Utilisateur;
import com.example.crm.repository.ProspectRepository;
import com.example.crm.repository.UtilisateurRepository;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@Service
public class UtilisateurService {

    private final UtilisateurRepository utilisateurs;
    private final ProspectRepository prospects;
    private final PasswordEncoder encoder;

    public UtilisateurService(UtilisateurRepository utilisateurs, ProspectRepository prospects,
                              PasswordEncoder encoder) {
        this.utilisateurs = utilisateurs;
        this.prospects = prospects;
        this.encoder = encoder;
    }

    public List<UtilisateurResponse> lister() {
        return utilisateurs.findAll().stream().map(UtilisateurResponse::from).toList();
    }

    public UtilisateurResponse obtenir(Integer id) {
        return UtilisateurResponse.from(trouver(id));
    }

    public UtilisateurResponse obtenirParEmail(String email) {
        return UtilisateurResponse.from(utilisateurs.findByEmail(email)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Utilisateur introuvable")));
    }

    public UtilisateurResponse creer(UtilisateurRequest req) {
        if (req.motDePasse() == null || req.motDePasse().length() < 6) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                    "Le mot de passe est obligatoire (6 caracteres minimum)");
        }
        if (utilisateurs.existsByEmail(req.email())) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Cet email est deja utilise");
        }
        Utilisateur u = new Utilisateur();
        u.setNom(req.nom());
        u.setEmail(req.email());
        u.setRole(req.role());
        u.setMotDePasse(encoder.encode(req.motDePasse()));
        return UtilisateurResponse.from(utilisateurs.save(u));
    }

    public UtilisateurResponse modifier(Integer id, UtilisateurRequest req) {
        Utilisateur u = trouver(id);
        if (!u.getEmail().equalsIgnoreCase(req.email()) && utilisateurs.existsByEmail(req.email())) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Cet email est deja utilise");
        }
        u.setNom(req.nom());
        u.setEmail(req.email());
        u.setRole(req.role());
        if (req.motDePasse() != null && !req.motDePasse().isBlank()) {
            if (req.motDePasse().length() < 6) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                        "Le mot de passe doit contenir au moins 6 caracteres");
            }
            u.setMotDePasse(encoder.encode(req.motDePasse()));
        }
        return UtilisateurResponse.from(utilisateurs.save(u));
    }

    @Transactional
    public void supprimer(Integer id, String emailCourant) {
        Utilisateur u = trouver(id);
        if (u.getEmail().equalsIgnoreCase(emailCourant)) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                    "Tu ne peux pas supprimer ton propre compte");
        }
        List<Prospect> lies = prospects.findByAssignedTo(id);
        lies.forEach(p -> p.setAssignedTo(null));
        prospects.saveAll(lies);
        utilisateurs.delete(u);
    }

    private Utilisateur trouver(Integer id) {
        return utilisateurs.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Utilisateur introuvable"));
    }
}
