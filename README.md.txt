# Celdi - Gestion de prospects

Application de gestion de prospects avec trois rôles : administrateur, responsable, commercial.

- `backend/` : API REST (Java 17, Spring Boot 3, MySQL, JWT)
- `frontend/` : interface (Angular)

## Lancer le projet
1. Créer la base MySQL `celdi` et exécuter `backend/database/migration.sql`.
2. Backend : ouvrir `backend` dans IntelliJ et lancer `CrmApplication` (http://localhost:8080).
3. Frontend : dans `frontend`, taper `npm install` puis `ng serve` (http://localhost:4200).

## Comptes de test
- Administrateur : alice@gmail.com / 123
- Responsable : fanta@gmail.com / 123
- Commercial : moussa@gmail.com / 123