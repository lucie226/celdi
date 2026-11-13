package com.example.crm.repository;

import com.example.crm.model.Prospect;
import com.example.crm.model.Statut;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ProspectRepository extends JpaRepository<Prospect, Integer> {
    List<Prospect> findByStatut(Statut statut);
    List<Prospect> findByAssignedTo(Integer assignedTo);
    List<Prospect> findByAssignedToAndStatut(Integer assignedTo, Statut statut);
}
