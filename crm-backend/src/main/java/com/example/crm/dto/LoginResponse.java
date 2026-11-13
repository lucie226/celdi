package com.example.crm.dto;
public record LoginResponse(String token, String type, UtilisateurResponse utilisateur) {
}
