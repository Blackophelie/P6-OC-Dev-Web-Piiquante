# OpenClassrooms - P6 - API Backend - "Piiquante"

6ème projet de la formation de [développeur web de OpenClassrooms](https://openclassrooms.com/fr/paths/185-developpeur-web)

## Scénario

Développement d'une application web nommée "Piiquante" dans laquelle les utilisateurs pourront ajouter leurs sauces préférées et liker ou disliker les sauces proposées par les autres utilisateurs.  
Le but est de créer le backend de l'application, le frontend étant déjà codé et fourni.

## Objectifs du projet et compétences évaluées
#### Développement Backend en Javascript

- Serveur **Node.js**
- Framework **Express**
- Base de données **MongoDB**
  - Hébergement sur MongoDB Atlas
  - Opérations relatives à la BDD réalisées avec mongoose
- **API REST**
- Sécurité **OWASP** et **RGPD**

## Mesures de sécurité mises en place

- Hashage du mot de passe utilisateur avec **bcrypt**
- Manipulation sécurisée de la base de données avec **mongoose**
- Vérification de l'unicité de l'email dans la base de données avec **mongoose-unique-validator**
- Vérification de la validité du format de l'email utilisateur avec **email-validator**
- Vérification de la force du mot de passe avec **password-validator**
- Utilisation de variables d'environnement pour les données sensibles avec **dotenv**
- Authentification de l'utilisateur par token avec **jsonwebtoken**


## Lancement de l'application

1. Cloner le [frontend  de l'application](https://github.com/OpenClassrooms-Student-Center/Web-Developer-P6) et le lancer : 
   - dans un terminal, accéder au dossier du frontend ;
   - installer les dépendances avec la commande : `npm install` ;
   - lancer avec la commande : `npm start` .
      
2. Cloner [ce repository backend](https://github.com/Blackophelie/P6-OC-Dev-Web-Piiquante.git).

3. Ajouter un fichier de configuration nommé **".env"** à la racine du backend contenant les variables d'environnement.

4. Ajouter un fichier nommé **".gitignore"** à la racine du backend également, qui designera les fichiers à ne pas publier sur GitHub : 
 > .env
 > node_modules
 > images
 > .vscode

5. Lancer le backend :
   - dans un terminal, accéder au dossier du frontend ;
   - installer les dépendances avec la commande : `npm install` ;
   - lancer avec la commande : `node server` ou `nodemon server`.

6. Le frontend est accessible à l'adresse http://localhost:4200

7. Pour des tests spécifiques (avec postman par exemple), le backend répond à l'adresse: http://localhost:3000.
(:warning: Attention: authentification requise pour toutes les routes /api/sauces/)