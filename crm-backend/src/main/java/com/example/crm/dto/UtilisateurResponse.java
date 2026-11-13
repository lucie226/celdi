package com.example.crm.dto;
import com.example.crm.model.Role;
import com.example.crm.model.Utilisateur;
public record UtilisateurResponse(Integer id, String nom, String email, Role role) {
    public static UtilisateurResponse from(Utilisateur u) {
        return new UtilisateurResponse(u.getId(), u.getNom(), u.getEmail(), u.getRole());
    }
}
