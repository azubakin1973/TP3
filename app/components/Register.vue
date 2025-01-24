<template>
  <Page>
    <ActionBar title="Register" />
    <StackLayout>
      <TextField v-model="email" hint="Email" keyboardType="email" />
      <TextField v-model="password" hint="Password" secure="true" />
      <Button text="Register" @tap="register" />
      <Button text="Go Back to Login" @tap="goToLogin" />
      <Label v-if="error" text="Error registering account" class="error" />
    </StackLayout>
  </Page>
</template>
<script>
import axios from "axios";
import Login from "./Login.vue";
export default {
  data() {
    return {
      email: "",
      password: "",
      error: null,
    };
  },
  methods: {
    goToLogin() {
      this.$navigateTo(Login);
    },
    async register() {
      try {
        await axios.post("http://10.0.2.2:3000/auth/users", {
          email: this.email,
          password: this.password,
        });
        this.$navigateTo(Login);
      } catch (error) {
        this.error = "Error registering account";
      }
    },
  },
};
</script>
