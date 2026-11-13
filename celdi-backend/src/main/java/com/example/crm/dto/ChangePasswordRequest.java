package com.example.crm.dto;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
public record ChangePasswordRequest(
        @NotBlank(message = "L'ancien mot de passe est obligatoire") String ancienMotDePasse,
        @NotBlank @Size(min = 6, message = "Le nouveau mot de passe doit contenir au moins 6 caracteres")
        String nouveauMotDePasse) {
}
