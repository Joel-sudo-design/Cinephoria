# Cinéphoria

Voici une application Symfony pour présenter les films du cinéma "Le Cinéporia". 

- En tant qu'administrateur on peut ajouter et supprimer des nouveaux films, des séances, créer des comptes pour les employés, modifier les mots de passe des comptes employés et afficher le nombre de réservations par film sur 1 semaine. 
- En tant qu'employé il est possible de gérer des nouveaux films comme les administrateurs et valider les avis. 
- Pour les visiteurs il est possible de créer un compte pour réserver en ligne avec accès aux commandes une fois authentifié (utilisateur).  

Ce projet utilise Symfony pour le backend.
HTML5, CSS, Bootstrap, JS avec JQuerry, AJAX avec AXIOS pour le frontend.
MySQL pour la base de données relationnelle et MongoDB pour la base de donnée NoSQL.
XAMPP pour le déploiement en local.

Lien vers le site: https://cinephoria.joeldermont.fr

---

## Table des Matières

1. [Aperçu](#aperçu)
2. [Prérequis](#prérequis)
3. [Installation et Configuration](#installation-et-configuration)
4. [Utilisation](#utilisation)
5. [Auteur](#auteur)

---

## Aperçu

![Aperçu de l'application](aperçu.png)
  
---

## Prérequis

Avant de commencer, assurez-vous d'avoir installé les éléments suivants :

- [XAMPP](https://www.apachefriends.org/) - Serveur local incluant Apache et MySQL.
- [MongoDB](https://www.mongodb.com/try/download/community) - Base de données NoSQL utilisée dans ce projet.
- [Composer](https://getcomposer.org/) - Gestionnaire de dépendances pour PHP.
- [PHP 8.1 ou supérieur](https://windows.php.net/download) - Version recommandée pour Symfony.
- [Node.js](https://nodejs.org/) - Plateforme JavaScript requise pour gérer les dépendances.
- [Yarn](https://classic.yarnpkg.com/en/docs/install) - Gestionnaire de paquets pour les ressources front-end.
- Une version récente de [Git](https://git-scm.com/) - Outil de gestion de version.

---

## Installation et Configuration

Exécutez les commandes suivantes pour installer et configurer le projet :

```

## Placer les fichiers dans le dossier XAMPP
Placez les fichiers `index.php` et `.htaccess` dans le répertoire `C:\xampp\htdocs`.

# Clonez le dépôt Git dans C:\xampp\htdocs\Cinephoria
git clone https://github.com/Joel-sudo-design/Cinephoria.git

# Accédez au répertoire du projet
cd C:\xampp\htdocs\Cinephoria

# Installez les dépendances nécessaires
composer install

# Modifier le fichier .env avec vos informations (serveur mail et mot de passe MySQL)

# Compilez les ressources front-end (CSS, JavaScript, images)
yarn build

# Créez la base de données et exécutez les migrations
php bin/console doctrine:database:create
php bin/console make:migration
php bin/console doctrine:migrations:migrate

# Importer la transaction_sql.sql avec phpMyAdmin

```

---

## Utilisation

Ouvrez le panneau de contrôle XAMPP et lancez les services Apache et MySQL.  
Dans votre navigateur, ouvrez l'URL suivante pour accéder à l'application :  
http://localhost

---

## Auteur

Joël DERMONT  
Développeur principal - [Profil GitHub de Joël DERMONT](https://github.com/Joel-sudo-design)



