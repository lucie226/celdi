# Celdi - Backend (Spring Boot)

API REST de gestion de prospects : Java 17, Spring Boot 3, MySQL, JWT.

## Lancer le projet
1. Créer la base MySQL `celdi` et exécuter `database/migration.sql`.
2. Définir le mot de passe MySQL : variable DB_PASSWORD (ou modifier application.properties).
3. Lancer la classe CrmApplication. L'API démarre sur http://localhost:8080.

## Comptes de test
- Administrateur : alice@gmail.com / 123
- Responsable : fanta@gmail.com / 123
- Commercial : moussa@gmail.com / 123

## Rôles
- admin : tous les droits
- responsable : voit tous les prospects, les attribue et les supprime
- commercial : voit et modifie uniquement ses prospects

## Structure
model, dto, repository, service, controller, security, config