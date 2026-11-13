package com.example.crm.model;
import jakarta.persistence.*;
@Entity
@Table(name = "prospects")
public class Prospect {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "idprospects")
    private Integer id;
    @Column(length = 100)
    private String nom;
    @Column(length = 54)
    private String telephone;
    @Column(length = 100)
    private String email;
    @Column(length = 45)
    private String source;
    @Enumerated(EnumType.STRING)
    private Statut statut = Statut.NOUVEAU;
    @Column(name = "assigned_to")
    private Integer assignedTo;
    public Integer getId() { return id; }
    public void setId(Integer id) { this.id = id; }
    public String getNom() { return nom; }
    public void setNom(String nom) { this.nom = nom; }
    public String getTelephone() { return telephone; }
    public void setTelephone(String telephone) { this.telephone = telephone; }
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    public String getSource() { return source; }
    public void setSource(String source) { this.source = source; }
    public Statut getStatut() { return statut; }
    public void setStatut(Statut statut) { this.statut = statut; }
    public Integer getAssignedTo() { return assignedTo; }
    public void setAssignedTo(Integer assignedTo) { this.assignedTo = assignedTo; }
}
