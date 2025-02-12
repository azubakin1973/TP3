<template>
  <Page>
    <ActionBar title="User Profile">
      <NavigationButton text="Back" android:systemIcon="ic_menu_back" @tap="goBack" />
    </ActionBar>
    <StackLayout>
      <TextField v-model="userName" hint="User Name" />
      <TextField v-model="userEmail" hint="Email" keyboardType="email" isEnabled="false" class="email-field" />
      <Button text="Save Changes" @tap="saveChanges" />
      <Button text="Logout" @tap="logout" class="logout-btn" />
    </StackLayout>
  </Page>
</template>

<script>
import { ApplicationSettings } from "@nativescript/core";
import axios from "axios/dist/axios";
import Login from "./Login.vue";

export default {
  data() {
    return {
      userName: "",
      userEmail: "",
    };
  },
  methods: {
    goBack() {
      this.$navigateBack();
    },
    async saveChanges() {
      try {
        const userToken = ApplicationSettings.getString("userToken");
        
        // Use the correct backend endpoint for authentication routes
        const response = await axios({
          method: 'put',
          url: "http://10.0.2.2:3000/auth/users", // Add /auth prefix
          headers: {
            'Authorization': `Bearer ${userToken}`,
            'Content-Type': 'application/json'
          },
          data: {
            username: this.userName,
            email: this.userEmail // Keep the original email
          }
        });

        // Update local storage with new username
        const userData = JSON.parse(ApplicationSettings.getString("userData"));
        userData.name = this.userName;
        ApplicationSettings.setString("userData", JSON.stringify(userData));

        // Show success message
        alert("Username updated successfully!");
      } catch (error) {
        console.error("Full error details:", JSON.stringify(error, null, 2));
        console.error("Error response:", error.response ? JSON.stringify(error.response.data, null, 2) : "No response");
        console.error("Error updating profile:", error.message);
        
        // More detailed error alert
        alert({
          title: "Update Error",
          message: `Failed to update username. 
Error: ${error.message}
Details: ${error.response ? JSON.stringify(error.response.data) : "No additional details"}`,
          okButtonText: "OK"
        });
      }
    },
    logout() {
      // Clear stored user data
      ApplicationSettings.remove("userToken");
      ApplicationSettings.remove("userData");
      
      // Navigate back to login
      this.$navigateTo(Login, { clearHistory: true });
    }
  },
  mounted() {
    // Load current user data when component mounts
    const userData = JSON.parse(ApplicationSettings.getString("userData"));
    this.userName = userData.name || "";
    this.userEmail = userData.email || "";
  }
};
</script>

<style scoped>
.logout-btn {
  background-color: rgba(50, 148, 5, 0.842);
  color: white;
  margin-top: 20;
}

.email-field {
  opacity: 1;
  color: gray;
  background-color: transparent;
}
</style> 