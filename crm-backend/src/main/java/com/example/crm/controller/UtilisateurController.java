package com.example.crm.controller;

import com.example.crm.dto.UtilisateurRequest;
import com.example.crm.dto.UtilisateurResponse;
import com.example.crm.service.UtilisateurService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/utilisateurs")
public class UtilisateurController {

    private final UtilisateurService service;

    public UtilisateurController(UtilisateurService service) {
        this.service = service;
    }

    @GetMapping
    public List<UtilisateurResponse> lister() {
        return service.lister();
    }

    @GetMapping("/{id}")
    public UtilisateurResponse obtenir(@PathVariable Integer id) {
        return service.obtenir(id);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public UtilisateurResponse creer(@Valid @RequestBody UtilisateurRequest req) {
        return service.creer(req);
    }

    @PutMapping("/{id}")
    public UtilisateurResponse modifier(@PathVariable Integer id, @Valid @RequestBody UtilisateurRequest req) {
        return service.modifier(id, req);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void supprimer(@PathVariable Integer id, Authentication auth) {
        service.supprimer(id, auth.getName());
    }
}
