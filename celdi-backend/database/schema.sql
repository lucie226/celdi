-- Reference : creation des tables si tu pars d'une base vide.
CREATE TABLE IF NOT EXISTS utilisateurs (
  idusers INT NOT NULL AUTO_INCREMENT,
  nom VARCHAR(100),
  email VARCHAR(100) UNIQUE,
  mot_de_passe VARCHAR(200),
  role ENUM('admin','commercial','responsable'),
  PRIMARY KEY (idusers)
);

CREATE TABLE IF NOT EXISTS prospects (
  idprospects INT NOT NULL AUTO_INCREMENT,
  nom VARCHAR(100),
  telephone VARCHAR(54),
  email VARCHAR(100),
  source VARCHAR(45),
  statut ENUM('NOUVEAU','CONTACTE','CLIENT','PERDU'),
  assigned_to INT,
  PRIMARY KEY (idprospects)
);
