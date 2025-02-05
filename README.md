# Application Mobile de Gestion de Tâches

Cette application mobile multiplateforme a été développée avec NativeScript-Vue, permettant une gestion efficace des tâches personnelles avec authentification utilisateur.

## Prérequis

Avant de commencer, assurez-vous d'avoir installé les éléments suivants :

- [Node.js](https://nodejs.org/) (version LTS recommandée)
- [NativeScript CLI](https://docs.nativescript.org/setup/)
- Android Studio (pour le développement Android)
- Xcode (pour le développement iOS, Mac uniquement)


## Configuration de l'environnement de développement

### Android
1. Installez Android Studio
2. Installez le SDK Android
3. Configurez les variables d'environnement ANDROID_HOME et JAVA_HOME
4. Créez un émulateur Android via Android Studio ou connectez un appareil physique

### iOS (Mac uniquement)
1. Installez Xcode depuis l'App Store
2. Installez les outils en ligne de commande Xcode
3. Installez xcodeproj (`sudo gem install xcodeproj`)

## Lancement de l'application

### Pour le développement
```bash
ns run android  # Pour Android
ns run ios      # Pour iOS (Mac uniquement)
```

### Pour la production
```bash
ns build android --release  # Pour Android
ns build ios --release      # Pour iOS (Mac uniquement)
```

## Fonctionnalités principales

### 1. Inscription (Register)
- Création d'un nouveau compte utilisateur
- Validation des champs de formulaire
- Stockage sécurisé des informations utilisateur

### 2. Connexion (Login)
- Authentification sécurisée
- Gestion des sessions utilisateur
- Récupération des informations de connexion

### 3. Gestion des tâches
- Affichage de la liste des tâches
- Ajout de nouvelles tâches
- Modification des tâches existantes
- Suppression des tâches
- Marquage des tâches comme complétées

## Structure du projet

```
TP3/
├── app/
│   ├── components/     # Composants Vue
│   ├── assets/        # Ressources statiques
│   └── app.js         # Point d'entrée de l'application
├── package.json       # Dépendances et scripts
└── README.md         # Documentation
```

## Technologies utilisées

- NativeScript-Vue (~2.9.3)
- @nativescript/core (~8.8.0)
- Vue Router (^4.5.0)
- Axios (^0.18.1)


## Informations

**Auteur:** Alexei de Moraes Zubakin  
**Lieu:** Montreal-QC  
**Date:** 30 janvier 2025



