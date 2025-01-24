<template>
  <Page>
    <ActionBar title="Task List" />
    <GridLayout rows="auto, auto, *">
      <!-- Novo StackLayout para mostrar informações do usuário -->
      <StackLayout row="0" backgroundColor="#f0f0f0" padding="10">
        <Label :text="'Utilisateur: ' + username" fontSize="16" fontWeight="bold" />
      </StackLayout>

      <!-- Ajustando o row dos outros elementos -->
      <StackLayout row="1">
        <TextField v-model="newTask" hint="New Task" />
        <TextField v-model="description" hint="Description" />
        <Button text="Add Task" @tap="addTask" />
        <Button text="Logout" @tap="logout()" />
      </StackLayout>

      <ScrollView row="2">
        <StackLayout>
          <StackLayout v-for="task in tasks" :key="task.id">
            <GridLayout columns="*" rows="*, *, *">
              <Label
                :text="task.title"
                row="0"
                col="0"
                backgroundColor="#43B344"
              />
              <Label
                :text="task.description"
                row="1"
                col="0"
                backgroundColor="#777777"
                color="#ffffff"
              />
              <GridLayout columns="*, *" rows="*" row="2" col="0">
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

      <!-- Modal de edição -->
      <AbsoluteLayout v-if="isEditing" row="0" rowSpan="2">
        <StackLayout backgroundColor="rgba(0,0,0,0.5)" width="100%" height="100%">
          <StackLayout backgroundColor="#ffffff" margin="20" padding="20" borderRadius="10">
            <Label text="Editar Tarefa" fontSize="20" fontWeight="bold" />
            <TextField v-model="editingTask.title" hint="Task Title" />
            <TextField v-model="editingTask.description" hint="Task Description" />
            <Button text="Save" @tap="saveModifiedTask" backgroundColor="#00ff00" color="#ffffff" />
            <Button text="Cancel" @tap="cancelEdit" backgroundColor="#ff0000" color="#ffffff" />
          </StackLayout>
        </StackLayout>
      </AbsoluteLayout>

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
  data() {
    return {
      tasks: [],
      newTask: "",
      description: "",
      error: null,
      token: "",
      username: "",
      isEditing: false,
      editingTask: {
        task_id: null,
        title: "",
        description: ""
      }
    };
  },
  async mounted() {
    try {
      this.token = ApplicationSettings.getString("userToken");
      this.username = ApplicationSettings.getString("username") || "Non identifié";
      if (!this.token) this.$navigateTo(Login);
      this.getTasks();
    } catch (error) {
      this.error = "Failed to load tasks";
    }
  },
  methods: {
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
          },
        };
        const response = await axios.request(config);
        this.getTasks();
        this.newTask = "";
        this.description = "";
      } catch (error) {
        this.error = "Failed to add task";
      }
    },
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
        console.log("Tasks recebidas:", JSON.stringify(response.data));
        this.tasks = response.data;
      } catch (error) {
        console.error("Erro ao carregar tasks:", error);
        this.error = "Failed to load tasks";
      }
    },

    async deleteTask(id) {
      try {
        console.log("Tentando deletar task com ID:", id);
        if (!id) {
          console.error("ID da task é undefined");
          return;
        }

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
          
          const response = await axios.request(config);
          console.log("Resposta do delete:", response.status);
          if (response.status === 200) {
            await this.getTasks();
          }
        } else {
          console.log("Suppression annulée par l'utilisateur");
        }
      } catch (error) {
        console.error("Erro ao deletar:", error);
        console.error("Task ID:", id);
        this.error = "Failed to delete task";
      }
    },

    logout() {
      ApplicationSettings.remove("userToken");
      ApplicationSettings.remove("username");
      this.$navigateTo(Login);
    },
    showModifyDialog(task) {
      this.isEditing = true;
      this.editingTask = {
        task_id: task.id,
        title: task.title,
        description: task.description
      };
    },
    cancelEdit() {
      this.isEditing = false;
      this.editingTask = {
        task_id: null,
        title: "",
        description: ""
      };
    },
    async saveModifiedTask() {
      try {
        if (!this.editingTask.task_id) return;
        
        let config = {
          method: "put",
          url: `http://10.0.2.2:3000/tasks/${this.editingTask.task_id}`,
          headers: {
            Authorization: `Bearer ${this.token}`,
            'Content-Type': 'application/json'
          },
          data: {
            title: this.editingTask.title,
            description: this.editingTask.description
          }
        };
        
        const response = await axios.request(config);
        if (response.status === 200) {
          this.isEditing = false;
          this.editingTask = {
            task_id: null,
            title: "",
            description: ""
          };
          await this.getTasks();
        }
      } catch (error) {
        console.error("Erro ao modificar:", error);
        this.error = "Failed to modify task";
      }
    },
  },
};
</script>
