# Cinéphoria

Une application Symfony pour présenter les films du cinéma "Le Cinéporia", permettre une gestion de ces films, des séances et pourvoir réserver en ligne. Ce projet utilise Symfony pour le backend, MySQL pour la base de données et XAMPP pour le déploiement en local.

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
