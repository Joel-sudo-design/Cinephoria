# Cinéphoria

Voici une application Symfony pour présenter les films du cinéma "Le Cinéporia". En tant qu'administrateur on peut ajouter des nouveaux films, créer des séances, créer des comptes pour les employés et afficher le nombre de réservations par films sur 1 semaine. En tant qu'employé il est possible d'ajouter des nouveaux films, créer des séances et valider les avis. Pour les visiteurs il est possible de créer un compte pour réserver en ligne avec accès aux commandes.  Ce projet utilise Symfony pour le backend, MySQL pour la base de données et XAMPP pour le déploiement en local.

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

Avant de commencer, assurez-vous d'avoir installé les éléments suivants sur votre machine :

- [XAMPP](https://www.apachefriends.org/) avec Apache et MySQL
- [Composer](https://getcomposer.org/) pour gérer les dépendances
- PHP 8.1 ou supérieur
- [Yarn](https://classic.yarnpkg.com/en/docs/install) pour gérer les ressources front-end
- Une version récente de [Git](https://git-scm.com/)

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

# Installez Yarn
yarn install

# Modifier le fichier .env avec vos informations (serveur mail, mot de passe MySQL, etc...)

# Compilez les ressources front-end (CSS, JavaScript, images)
yarn build

# Créez la base de données et exécutez les migrations
php bin/console doctrine:database:create
php bin/console make:migration
php bin/console doctrine:migrations:migrate

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



