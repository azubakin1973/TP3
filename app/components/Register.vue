/**
 * Composant d'inscription pour l'application de gestion de tâches
 * 
 * Fonctionnalités principales :
 * - Formulaire d'inscription avec validation côté client
 * - Vérification des données utilisateur
 * - Communication avec le backend pour créer un nouveau compte
 * - Gestion des erreurs d'inscription
 */
<template>
  <Page>
    <ActionBar title="Register" />
    <StackLayout padding="20">
      <!-- Champs de saisie avec validation et liaison de données -->
      <TextField v-model="username" hint="Username" autocorrect="false" />
      <TextField v-model="email" hint="Email" keyboardType="email" autocorrect="false" />
      <TextField v-model="password" hint="Password" secure="true" />
      <TextField v-model="confirmPassword" hint="Confirm Password" secure="true" />
      
      <!-- Bouton d'inscription avec style et gestionnaire d'événement -->
      <Button text="Register" @tap="register" backgroundColor="#2196F3" color="white" />
      
      <!-- Bouton de retour à la page de connexion -->
      <Button text="Go Back to Login" @tap="goToLogin" />
      
      <!-- Affichage conditionnel des messages d'erreur -->
      <Label v-if="error" :text="error" class="error" color="red" textAlignment="center" textWrap="true" />
    </StackLayout>
  </Page>
</template>

<script>
import axios from "axios";
import Login from "./Login.vue";

export default {
  /**
   * État initial du composant
   * @returns {Object} État réactif pour le formulaire d'inscription
   */
  data() {
    return {
      username: "",        // Nom d'utilisateur saisi
      email: "",           // Email saisi
      password: "",        // Mot de passe saisi
      confirmPassword: "", // Confirmation du mot de passe
      error: null,         // Message d'erreur de validation
    };
  },
  methods: {
    /**
     * Navigation vers la page de connexion
     * Utilise la navigation intégrée de NativeScript-Vue
     */
    goToLogin() {
      this.$navigateTo(Login);
    },
    
    /**
     * Validation complète du formulaire d'inscription
     * 
     * Vérifie :
     * - Présence et format du nom d'utilisateur
     * - Présence et format de l'email
     * - Longueur et correspondance des mots de passe
     * 
     * @returns {boolean} Validité du formulaire
     */
    validateForm() {
      // Validation du nom d'utilisateur
      if (!this.username.trim()) {
        this.error = "Username is required";
        return false;
      }
      
      // Validation du format du nom d'utilisateur
      const usernameRegex = /^[a-zA-Z0-9_]{3,20}$/;
      if (!usernameRegex.test(this.username)) {
        this.error = "Username must be 3-20 characters and contain only letters, numbers and underscores";
        return false;
      }

      // Validation de l'email
      if (!this.email.trim()) {
        this.error = "Email is required";
        return false;
      }
      
      // Nettoyage et normalisation de l'email
      this.email = this.email.trim().toLowerCase();
      
      // Validation du format de l'email
      const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
      if (!emailRegex.test(this.email)) {
        this.error = "Invalid email format";
        return false;
      }
      
      // Validation de la longueur du mot de passe
      if (this.password.length < 3) {
        this.error = "Password must be at least 3 characters";
        return false;
      }
      
      // Nettoyage des mots de passe
      this.password = this.password.trim();
      this.confirmPassword = this.confirmPassword.trim();
      
      // Validation de la correspondance des mots de passe
      if (this.password !== this.confirmPassword) {
        this.error = "Passwords do not match";
        return false;
      }
      return true;
    },

    /**
     * Méthode d'inscription asynchrone
     * 
     * Étapes principales :
     * 1. Validation du formulaire
     * 2. Préparation des données utilisateur
     * 3. Envoi de la requête d'inscription à l'API
     * 4. Gestion des réponses et des erreurs
     */
    async register() {
      try {
        // Réinitialisation des erreurs
        this.error = null;
        
        // Validation du formulaire avant soumission
        if (!this.validateForm()) {
          return;
        }

        // Préparation des données utilisateur nettoyées
        const userData = {
          username: this.username.trim(),
          email: this.email.trim().toLowerCase(),
          password: this.password.trim()
        };

        // Requête d'inscription à l'API
        const response = await axios.post("http://10.0.2.2:3000/auth/users", userData);
        
        // Gestion de la réponse réussie
        if (response.data) {
          // Affichage d'une alerte de succès
          alert({
            title: "Success",
            message: "Inscription réussie ! Veuillez vous connecter.",
            okButtonText: "OK"
          });
          // Navigation vers la page de connexion
          this.$navigateTo(Login);
        }
      } catch (error) {
        // Gestion détaillée des erreurs d'inscription
        if (error.response?.status === 500) {
          this.error = "Server error. Please check your input and try again.";
        } else if (error.response?.status === 409) {
          this.error = "Username or email already registered";
        } else if (error.response?.status === 400) {
          this.error = "Invalid input format";
        } else if (error.response?.data?.message) {
          this.error = error.response.data.message;
        } else {
          this.error = "Error registering account. Please try again.";
        }
      }
    },
  },
};
</script>

<style scoped>
/* Styles spécifiques au composant d'inscription */
TextField {
  margin: 10;
  padding: 10;
}
Button {
  margin: 10;
  padding: 10;
}
.error {
  margin: 10;
}
</style>
