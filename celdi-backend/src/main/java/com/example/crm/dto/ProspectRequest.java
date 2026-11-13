package com.example.crm.dto;
import com.example.crm.model.Statut;
import com.fasterxml.jackson.annotation.JsonAlias;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
public record ProspectRequest(
        @NotBlank(message = "Le nom est obligatoire") @Size(max = 100) String nom,
        @Size(max = 54) String telephone,
        @Email(message = "Email invalide") @Size(max = 100) String email,
        @Size(max = 45) String source,
        Statut statut,
        @JsonAlias("assigned_to") Integer assignedTo) {
}
