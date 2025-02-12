# Application Mobile de Gestion de Tâches

## Description Générale
Cette application mobile multiplateforme développée avec NativeScript-Vue offre une solution complète de gestion de tâches personnelles avec authentification sécurisée.

## Prérequis

### Environnement de Développement
- Node.js (version LTS recommandée)
- NativeScript CLI
- Git
- Éditeur de code (VS Code recommandé)

### Installations Requises par Plateforme

#### Pour Android
- Android Studio
- SDK Android
- Java Development Kit (JDK)

#### Pour iOS (Mac uniquement)
- Xcode
- Outils en ligne de commande Xcode
- CocoaPods

## Installation du Projet

### 1. Clonage du Dépôt
```bash
git clone https://github.com/azubakin1973/TP3.git
cd TP3
```

### 2. Installation des Dépendances
```bash
npm install
ns prepare
```

## Configuration de l'Environnement

### Android
1. Installez Android Studio
2. Configurez les variables d'environnement :
   - `ANDROID_HOME` vers le dossier SDK Android
   - `JAVA_HOME` vers votre installation JDK
3. Créez un émulateur via Android Studio ou utilisez un appareil physique

### iOS (Mac uniquement)
1. Installez Xcode depuis l'App Store
2. Installez les outils en ligne de commande :
   ```bash
   xcode-select --install
   ```
3. Installez CocoaPods :
   ```bash
   sudo gem install cocoapods
   ```

## Lancement de l'Application

### Mode Développement
```bash
# Pour Android
ns run android

# Pour iOS (Mac uniquement)
ns run ios
```

### Mode Production
```bash
# Build Android
ns build android --release

# Build iOS (Mac uniquement)
ns build ios --release
```

## Fonctionnalités Principales

### 1. Inscription (Register)
- Création de compte utilisateur
- Validation des champs de formulaire
- Stockage sécurisé des informations personnelles
- Gestion des erreurs d'inscription

### 2. Connexion (Login)
- Authentification sécurisée
- Validation des identifiants
- Gestion des sessions utilisateur
- Protection contre les tentatives de connexion multiples

### 3. Gestion des Tâches
- Création de nouvelles tâches
- Modification des tâches existantes
- Suppression de tâches
- Marquage des tâches comme complétées
- Filtrage et tri des tâches

## Dépendances Principales
- NativeScript-Vue (~2.9.3)
- Vue Router (^4.5.0)
- Axios (^0.18.1)

## Dépannage
- Assurez-vous que toutes les variables d'environnement sont correctement configurées
- Vérifiez que les versions des outils correspondent aux prérequis
- En cas de problème, consultez la documentation NativeScript

## Informations du Projet
**Auteur:** Alexei de Moraes Zubakin  
**Lieu:** Montreal-QC  
**Date:** 30 janvier 2025




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



