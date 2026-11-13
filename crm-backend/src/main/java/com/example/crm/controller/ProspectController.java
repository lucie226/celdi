package com.example.crm.controller;

import com.example.crm.dto.AssignationRequest;
import com.example.crm.dto.ProspectRequest;
import com.example.crm.dto.StatutRequest;
import com.example.crm.model.Prospect;
import com.example.crm.model.Statut;
import com.example.crm.service.ProspectService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/prospects")
public class ProspectController {
    private final ProspectService service;
    public ProspectController(ProspectService service) {
        this.service = service;
    }
    @GetMapping
    public List<Prospect> lister(@RequestParam(required = false) Statut statut,
                                 @RequestParam(required = false) Integer assignedTo,
                                 @RequestParam(required = false) String q,
                                 Authentication auth) {
        return service.lister(auth.getName(), statut, assignedTo, q);
    }
    @GetMapping("/stats")
    public Map<String, Object> statistiques(Authentication auth) {
        return service.statistiques(auth.getName());
    }
    @GetMapping("/{id}")
    public Prospect obtenir(@PathVariable Integer id, Authentication auth) {
        return service.obtenir(id, auth.getName());
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public Prospect creer(@Valid @RequestBody ProspectRequest req, Authentication auth) {
        return service.creer(req, auth.getName());
    }

    @PutMapping("/{id}")
    public Prospect modifier(@PathVariable Integer id, @Valid @RequestBody ProspectRequest req,
                             Authentication auth) {
        return service.modifier(id, req, auth.getName());
    }

    @PatchMapping("/{id}/statut")
    public Prospect changerStatut(@PathVariable Integer id, @Valid @RequestBody StatutRequest req,
                                  Authentication auth) {
        return service.changerStatut(id, req.statut(), auth.getName());
    }

    @PutMapping("/{id}/assignation")
    public Prospect assigner(@PathVariable Integer id, @Valid @RequestBody AssignationRequest req) {
        return service.assigner(id, req.userId());
    }
    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void supprimer(@PathVariable Integer id) {
        service.supprimer(id);
    }
}
