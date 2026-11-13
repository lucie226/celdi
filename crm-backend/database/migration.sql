-- A executer UNE FOIS sur ta base existante (adapte le nom de la base).
-- USE nom_de_ta_base;

-- 1) Obligatoire : idusers doit s'auto-incrementer pour pouvoir creer des utilisateurs.
ALTER TABLE utilisateurs MODIFY idusers INT NOT NULL AUTO_INCREMENT;

-- 2) Recommande : un email = un seul compte.
ALTER TABLE utilisateurs ADD UNIQUE KEY uq_utilisateurs_email (email);

-- 3) Optionnel : relier prospects.assigned_to a utilisateurs.
--    (echoue si des prospects pointent vers un utilisateur inexistant)
-- ALTER TABLE prospects
--   ADD CONSTRAINT fk_prospects_assigned_to
--   FOREIGN KEY (assigned_to) REFERENCES utilisateurs(idusers) ON DELETE SET NULL;
