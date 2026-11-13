package com.example.crm.service;
import com.example.crm.dto.ProspectRequest;
import com.example.crm.model.Prospect;
import com.example.crm.model.Role;
import com.example.crm.model.Statut;
import com.example.crm.model.Utilisateur;
import com.example.crm.repository.ProspectRepository;
import com.example.crm.repository.UtilisateurRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.EnumMap;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Objects;
@Service
public class ProspectService {

    private final ProspectRepository prospects;
    private final UtilisateurRepository utilisateurs;

    public ProspectService(ProspectRepository prospects, UtilisateurRepository utilisateurs) {
        this.prospects = prospects;
        this.utilisateurs = utilisateurs;
    }

    public List<Prospect> lister(String emailCourant, Statut statut, Integer assignedTo, String q) {
        Utilisateur u = courant(emailCourant);
        Integer proprietaire = estCommercial(u) ? u.getId() : assignedTo;

        List<Prospect> liste;
        if (proprietaire != null && statut != null) {
            liste = prospects.findByAssignedToAndStatut(proprietaire, statut);
        } else if (proprietaire != null) {
            liste = prospects.findByAssignedTo(proprietaire);
        } else if (statut != null) {
            liste = prospects.findByStatut(statut);
        } else {
            liste = prospects.findAll();
        }

        if (q == null || q.isBlank()) {
            return liste;
        }
        String recherche = q.toLowerCase();
        return liste.stream()
                .filter(p -> contient(p.getNom(), recherche)
                        || contient(p.getEmail(), recherche)
                        || contient(p.getTelephone(), recherche))
                .toList();
    }

    public Prospect obtenir(Integer id, String emailCourant) {
        Utilisateur u = courant(emailCourant);
        Prospect p = trouver(id);
        verifierAcces(u, p);
        return p;
    }

    public Prospect creer(ProspectRequest req, String emailCourant) {
        Utilisateur u = courant(emailCourant);
        Prospect p = new Prospect();
        copier(req, p);
        p.setStatut(req.statut() != null ? req.statut() : Statut.NOUVEAU);
        if (estCommercial(u)) {
            p.setAssignedTo(u.getId());
        } else {
            verifierUtilisateurExiste(req.assignedTo());
            p.setAssignedTo(req.assignedTo());
        }
        return prospects.save(p);
    }
    public Prospect modifier(Integer id, ProspectRequest req, String emailCourant) {
        Utilisateur u = courant(emailCourant);
        Prospect p = trouver(id);
        verifierAcces(u, p);
        copier(req, p);
        if (req.statut() != null) {
            p.setStatut(req.statut());
        }
        if (!estCommercial(u)) {
            verifierUtilisateurExiste(req.assignedTo());
            p.setAssignedTo(req.assignedTo());
        }
        return prospects.save(p);
    }
    public Prospect changerStatut(Integer id, Statut statut, String emailCourant) {
        Utilisateur u = courant(emailCourant);
        Prospect p = trouver(id);
        verifierAcces(u, p);
        p.setStatut(statut);
        return prospects.save(p);
    }
    public Prospect assigner(Integer id, Integer userId) {
        Prospect p = trouver(id);
        if (!utilisateurs.existsById(userId)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Utilisateur introuvable");
        }
        p.setAssignedTo(userId);
        return prospects.save(p);
    }

    public void supprimer(Integer id) {
        prospects.delete(trouver(id));
    }
    public Map<String, Object> statistiques(String emailCourant) {
        List<Prospect> liste = lister(emailCourant, null, null, null);
        Map<Statut, Long> parStatut = new EnumMap<>(Statut.class);
        for (Statut s : Statut.values()) {
            parStatut.put(s, 0L);
        }
        liste.forEach(p -> {
            if (p.getStatut() != null) {
                parStatut.merge(p.getStatut(), 1L, Long::sum);
            }
        });
        long clients = parStatut.get(Statut.CLIENT);
        double tauxConversion = liste.isEmpty() ? 0 : Math.round(clients * 1000.0 / liste.size()) / 10.0;

        Map<String, Object> resultat = new LinkedHashMap<>();
        resultat.put("total", liste.size());
        resultat.put("parStatut", parStatut);
        resultat.put("tauxConversion", tauxConversion);
        return resultat;
    }
    private Utilisateur courant(String email) {
        return utilisateurs.findByEmail(email)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Utilisateur introuvable"));
    }

    private Prospect trouver(Integer id) {
        return prospects.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Prospect introuvable"));
    }

    private boolean estCommercial(Utilisateur u) {
        return u.getRole() == Role.commercial;
    }

    private void verifierAcces(Utilisateur u, Prospect p) {
        if (estCommercial(u) && !Objects.equals(p.getAssignedTo(), u.getId())) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Ce prospect ne t'est pas assigne");
        }
    }

    private void verifierUtilisateurExiste(Integer userId) {
        if (userId != null && !utilisateurs.existsById(userId)) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Utilisateur assigne introuvable");
        }
    }

    private void copier(ProspectRequest req, Prospect p) {
        p.setNom(req.nom());
        p.setTelephone(req.telephone());
        p.setEmail(req.email());
        p.setSource(req.source());
    }

    private boolean contient(String valeur, String recherche) {
        return valeur != null && valeur.toLowerCase().contains(recherche);
    }
}
