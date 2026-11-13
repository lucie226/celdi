package com.example.crm.dto;
import com.example.crm.model.Role;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
public record UtilisateurRequest(
        @NotBlank(message = "Le nom est obligatoire") @Size(max = 100) String nom,
        @NotBlank(message = "L'email est obligatoire") @Email(message = "Email invalide") @Size(max = 100) String email,
        String motDePasse,
        @NotNull(message = "Le role est obligatoire") Role role) {
}
