/**
 * Composant de gestion des tâches pour l'application mobile
 * 
 * Fonctionnalités principales :
 * - Affichage et gestion de la liste des tâches
 * - Ajout, modification et suppression de tâches
 * - Authentification et gestion de session
 * - Interface utilisateur réactive
 */
<template>
  <Page>
    <ActionBar :title="'Tasks from ' + userName" />
    <GridLayout rows="auto, auto, *">
      <!-- Section d'informations utilisateur -->
      <StackLayout row="0" backgroundColor="#f0f0f0" padding="10">
        <Label :text="'Bienvenu, ' + userName" class="welcome-text" />
      </StackLayout>

      <!-- Section de saisie de nouvelles tâches -->
      <StackLayout row="1">
        <TextField v-model="newTask" hint="New Task" />
        <TextField v-model="description" hint="Description" />
        <Button text="Add Task" @tap="addTask" />
        <Button text="Logout" @tap="logout()" />
      </StackLayout>

      <!-- Liste déroulante des tâches -->
      <ScrollView row="2">
        <StackLayout>
          <StackLayout v-for="task in tasks" :key="task.id">
            <GridLayout columns="*" rows="*, *, *, *">
              <!-- Affichage des détails de la tâche -->
              <Label
                :text="task.title"
                row="0"
                col="0"
                backgroundColor="#2196F3"
              />
              <Label
                :text="task.description"
                row="1"
                col="0"
                backgroundColor="#777777"
                color="#ffffff"
              />
              <Label
                :text="formatStatus(task.status)"
                row="2"
                col="0"
                :backgroundColor="task.status === 'terminé' ? '#4CAF50' : '#FFA500'"
                color="#ffffff"
              />
              <!-- Boutons de modification et suppression -->
              <GridLayout columns="*, *" rows="*" row="3" col="0">
                <Button
                  backgroundColor="#00ff00"
                  color="#ffffff"
                  row="0"
                  col="0"
                  text="Modify"
                  @tap="showModifyDialog(task)"
                />
                <Button
                  backgroundColor="#ff0000"
                  color="#ffffff"
                  row="0"
                  col="1"
                  text="Delete"
                  @tap="deleteTask(task.id)"
                />
              </GridLayout>
            </GridLayout>
          </StackLayout>
        </StackLayout>
      </ScrollView>

      <!-- Modal de modification de tâche -->
      <AbsoluteLayout v-if="isEditing" row="0" rowSpan="2">
        <StackLayout backgroundColor="rgba(0,0,0,0.5)" width="100%" height="100%">
          <StackLayout backgroundColor="#ffffff" margin="20" padding="20" borderRadius="10">
            <Label text="Editar Tarefa" fontSize="20" fontWeight="bold" />
            <TextField v-model="editingTask.title" hint="Task Title" />
            <TextField v-model="editingTask.description" hint="Task Description" />
            <ListPicker 
              :items="statusOptions" 
              :selectedIndex="getStatusIndex(editingTask.status)"
              @selectedIndexChange="onStatusChange"
            />
            <Button text="Save" @tap="saveModifiedTask" backgroundColor="#00ff00" color="#ffffff" />
            <Button text="Cancel" @tap="cancelEdit" backgroundColor="#ff0000" color="#ffffff" />
          </StackLayout>
        </StackLayout>
      </AbsoluteLayout>

      <!-- Gestion des erreurs -->
      <Label v-if="error" text="Error loading tasks" class="error" />
    </GridLayout>
  </Page>
</template>

<script>
import { ApplicationSettings } from "@nativescript/core";
import { confirm } from "@nativescript/core/ui/dialogs";
import Login from "./Login.vue";
import axios from "axios";

export default {
  /**
   * État initial du composant
   * @returns {Object} État réactif pour la gestion des tâches
   */
  data() {
    return {
      tasks: [],               // Liste des tâches
      newTask: "",             // Titre de la nouvelle tâche
      description: "",         // Description de la nouvelle tâche
      error: null,             // Gestion des messages d'erreur
      token: "",               // Token d'authentification
      userName: "",            // Nom de l'utilisateur
      isEditing: false,        // État de modification de tâche
      editingTask: {           // Tâche en cours de modification
        task_id: null,
        title: "",
        description: "",
        status: "En cours"
      },
      statusOptions: ['En cours', 'Terminé'],  // Options de statut
    };
  },

  /**
   * Hook de montage : initialisation du composant
   * Récupère les informations utilisateur et les tâches
   */
  async mounted() {
    try {
      // Récupération du token et des données utilisateur
      this.token = ApplicationSettings.getString("userToken");
      const userData = ApplicationSettings.getString("userData");
      
      // Configuration du nom d'utilisateur
      if (userData) {
        const user = JSON.parse(userData);
        this.userName = user.name || user.email || 'Utilisateur';
      } else {
        this.userName = 'Utilisateur';
      }

      // Redirection si aucun token n'est présent
      if (!this.token) {
        this.$navigateTo(Login);
        return;
      }
      
      // Chargement des tâches
      this.getTasks();
    } catch (error) {
      this.userName = 'Utilisateur';
      this.error = "Failed to load tasks";
    }
  },

  methods: {
    /**
     * Ajout d'une nouvelle tâche
     * Envoie une requête POST à l'API avec les détails de la tâche
     */
    async addTask() {
      try {
        let config = {
          method: "post",
          url: "http://10.0.2.2:3000/tasks",
          headers: {
            Authorization: "Bearer " + this.token,
          },
          data: {
            title: this.newTask,
            description: this.description,
            status: "En cours"
          },
        };
        await axios.request(config);
        this.getTasks();
        this.newTask = "";
        this.description = "";
      } catch (error) {
        this.error = "Failed to add task";
      }
    },

    /**
     * Récupération de la liste des tâches
     * Requête GET à l'API avec authentification
     */
    async getTasks() {
      try {
        let config = {
          method: "get",
          url: "http://10.0.2.2:3000/tasks",
          headers: {
            Authorization: "Bearer " + this.token,
          }
        };
        const response = await axios.request(config);
        this.tasks = response.data;
      } catch (error) {
        this.error = "Failed to load tasks";
      }
    },

    /**
     * Suppression d'une tâche
     * @param {number} id - Identifiant de la tâche à supprimer
     * Affiche une boîte de confirmation avant suppression
     */
    async deleteTask(id) {
      try {
        if (!id) return;

        const result = await confirm({
          title: "Confirmation",
          message: "Êtes-vous sûr de vouloir supprimer cette tâche?",
          okButtonText: "Oui",
          cancelButtonText: "Non"
        });

        if (result) {
          let config = {
            method: "delete",
            url: `http://10.0.2.2:3000/tasks/${id}`,
            headers: {
              Authorization: `Bearer ${this.token}`
            }
          };
          
          await axios.request(config);
          await this.getTasks();
        }
      } catch (error) {
        this.error = "Failed to delete task";
      }
    },

    /**
     * Déconnexion de l'utilisateur
     * Supprime les informations de session et redirige vers la page de connexion
     */
    logout() {
      ApplicationSettings.remove("userToken");
      ApplicationSettings.remove("userData");
      this.$navigateTo(Login);
    },

    /**
     * Affichage du modal de modification de tâche
     * @param {Object} task - Tâche à modifier
     */
    showModifyDialog(task) {
      this.isEditing = true;
      this.editingTask = {
        task_id: task.id,
        title: task.title,
        description: task.description,
        status: task.status || "En cours"
      };
    },

    /**
     * Annulation de la modification de tâche
     * Réinitialise l'état de modification
     */
    cancelEdit() {
      this.isEditing = false;
      this.editingTask = {
        task_id: null,
        title: "",
        description: "",
        status: "En cours"
      };
    },

    /**
     * Obtention de l'index du statut pour le sélecteur
     * @param {string} status - Statut de la tâche
     * @returns {number} Index du statut
     */
    getStatusIndex(status) {
      const normalizedStatus = status ? status.toLowerCase() : 'en cours';
      if (normalizedStatus === 'en cours') return 0;
      if (normalizedStatus === 'terminé' || normalizedStatus === 'termine') return 1;
      return 0;
    },
    
    /**
     * Gestion du changement de statut
     * @param {Event} event - Événement de changement de sélection
     */
    onStatusChange(event) {
      this.editingTask.status = this.statusOptions[event.value];
    },
    
    /**
     * Sauvegarde des modifications de tâche
     * Envoie une requête PUT à l'API avec les nouvelles informations
     */
    async saveModifiedTask() {
      try {
        if (!this.editingTask.task_id) return;
        
        const statusToSend = this.editingTask.status === 'Terminé' ? 'terminé' : 'en cours';
        
        let config = {
          method: "put",
          url: `http://10.0.2.2:3000/tasks/${this.editingTask.task_id}`,
          headers: {
            Authorization: `Bearer ${this.token}`,
            'Content-Type': 'application/json'
          },
          data: {
            title: this.editingTask.title,
            description: this.editingTask.description,
            status: statusToSend
          }
        };
        
        const response = await axios.request(config);
        
        if (response.status === 200) {
          this.isEditing = false;
          this.editingTask = {
            task_id: null,
            title: "",
            description: "",
            status: "En cours"
          };
          await this.getTasks();
        }
      } catch (error) {
        this.error = "Failed to modify task";
      }
    },
    formatStatus(status) {
      if (!status) return 'En cours';
      
      // Convertir la première lettre en majuscule
      switch (status.toLowerCase()) {
        case 'terminé':
        case 'termine':
          return 'Terminé';
        case 'en cours':
          return 'En cours';
        default:
          return 'En cours';
      }
    },
  },
};
</script>

<style scoped>
.welcome-text {
  font-size: 18;
  margin: 10;
  text-align: center;
}
</style>
