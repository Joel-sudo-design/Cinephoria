# Cinéphoria

Voici une application Symfony pour présenter les films du cinéma "Le Cinéporia". En tant qu'administrateur on peut ajouter des nouveaux films, créer des séances, créer des comptes pour les employés et afficher le nombre de réservations par films sur 1 semaine. En tant qu'employé il est possible d'ajouter des nouveaux films, créer des séances et valider les avis. Pour les visiteurs il est possible de créer un compte pour réserver en ligne avec accès aux commandes.  Ce projet utilise Symfony pour le backend, MySQL pour la base de données et XAMPP pour le déploiement en local.

---

## Table des Matières

1. [Aperçu]
2. [Prérequis]
3. [Installation et Configuration]
4. [Déploiement en Local avec XAMPP]
5. [Utilisation]
6. [Contributions]
7. [Licence]
8. [Auteurs]

---

## Aperçu

![Aperçu de l'application](aperçu.png)
  
---

## Prérequis

Avant de commencer, assurez-vous d'avoir installé les éléments suivants sur votre machine :

- [XAMPP](https://www.apachefriends.org/) avec Apache et MySQL
- [Composer](https://getcomposer.org/) pour gérer les dépendances
- PHP 8.1 ou supérieur
- Une version récente de [Git](https://git-scm.com/)

---

## Installation et Configuration

Exécutez les commandes suivantes pour installer et configurer le projet :

```bash
# Clonez le dépôt Git
git clone https://github.com/utilisateur/nom-du-projet.git

# Accédez au répertoire du projet
cd nom-du-projet

# Installez les dépendances nécessaires
composer install

# Configurez le fichier .env avec vos informations MySQL
# Exemple pour XAMPP (modifiez 'nom_de_votre_base_de_donnees')
DATABASE_URL="mysql://root:@127.0.0.1:3306/nom_de_votre_base_de_donnees"

# Créez la base de données et exécutez les migrations
php bin/console doctrine:database:create
php bin/console doctrine:migrations:migrate

# (Facultatif) Chargez des données fictives si des fixtures sont configurées
php bin/console doctrine:fixtures:load
