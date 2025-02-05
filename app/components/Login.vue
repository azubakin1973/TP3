/**
 * Composant de connexion pour l'application de gestion de tâches
 * 
 * Ce composant gère l'authentification des utilisateurs avec les fonctionnalités suivantes :
 * - Saisie des identifiants (email et mot de passe)
 * - Validation des credentials via une requête API
 * - Gestion des sessions utilisateur
 * - Redirection vers la liste des tâches après connexion réussie
 */
<template>
  <Page>
    <ActionBar title="Login" />
    <StackLayout>
      <!-- Champs de saisie avec liaison de données (v-model) pour email et mot de passe -->
      <TextField v-model="email" hint="Email" keyboardType="email" />
      <TextField v-model="password" hint="Password" secure="true" />
      
      <!-- Bouton de connexion avec gestionnaire d'événement asynchrone -->
      <Button text="Login" @tap="login" />
      
      <!-- Affichage conditionnel des erreurs de connexion -->
      <Label v-if="error" text="Invalid credentials" class="error" />
      
      <!-- Bouton de navigation vers l'inscription -->
      <Button text="Register" @tap="register" />
    </StackLayout>
  </Page>
</template>

<script>
import { ApplicationSettings } from "@nativescript/core";
import axios from "axios/dist/axios";
import Register from "./Register.vue";
import TaskList from "./TaskList.vue";

export default {
  /**
   * État initial du composant
   * @returns {Object} État réactif pour la gestion de la connexion
   */
  data() {
    return {
      email: "",        // Stockage de l'email saisi
      password: "",     // Stockage du mot de passe saisi
      error: null,      // Gestion des messages d'erreur
      userToken: null,  // Stockage du token d'authentification
    };
  },
  methods: {
    /**
     * Méthode de navigation vers le composant d'inscription
     * Utilise la navigation intégrée de NativeScript-Vue
     */
    async register() {
      this.$navigateTo(Register);
    },

    /**
     * Méthode de connexion avec gestion complète de l'authentification
     * 
     * Étapes principales :
     * 1. Envoi des credentials au backend
     * 2. Validation de la réponse
     * 3. Stockage sécurisé du token et des données utilisateur
     * 4. Redirection vers la liste des tâches
     */
    async login() {
      try {
        // Requête d'authentification à l'API
        const response = await axios.post("http://10.0.2.2:3000/auth/login", {
          email: this.email,
          password: this.password,
        });

        if (response.data) {
          // Sauvegarde du token d'authentification dans les paramètres de l'application
          ApplicationSettings.setString("userToken", response.data.token);
          
          // Décodage du token JWT pour extraire les informations utilisateur
          const tokenParts = response.data.token.split('.');
          const tokenPayload = JSON.parse(atob(tokenParts[1]));
          
          // Stockage des données utilisateur pour une utilisation ultérieure
          ApplicationSettings.setString("userData", JSON.stringify({
            email: this.email,
            name: tokenPayload.username || 'User'
          }));
          
          // Navigation vers la liste des tâches après connexion réussie
          this.$navigateTo(TaskList);
        }
      } catch (error) {
        // Gestion des erreurs de connexion
        this.error = "Invalid login credentials";
      }
    },
  },
  
  /**
   * Hook de montage : vérifie si une session existe déjà
   * Redirection automatique si un token valide est présent
   */
  mounted() {
    this.userToken = ApplicationSettings.getString("userToken");
    if (this.userToken) this.$navigateTo(TaskList);
  },
};
</script>
