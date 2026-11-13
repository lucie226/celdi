package com.example.crm.dto;
import jakarta.validation.constraints.NotNull;
public record AssignationRequest(@NotNull(message = "L'identifiant de l'utilisateur est obligatoire") Integer userId) {
}
