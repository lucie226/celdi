package com.example.crm.dto;

import com.example.crm.model.Statut;
import jakarta.validation.constraints.NotNull;

public record StatutRequest(@NotNull(message = "Le statut est obligatoire") Statut statut) {
}
