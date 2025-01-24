<template>
  <Page>
    <ActionBar title="Login" />
    <StackLayout>
      <TextField v-model="email" hint="Email" keyboardType="email" />
      <TextField v-model="password" hint="Password" secure="true" />
      <Button text="Login" @tap="login" />
      <Label v-if="error" text="Invalid credentials" class="error" />
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
  data() {
    return {
      email: "",
      password: "",
      error: null,
      userToken: null,
    };
  },
  methods: {
    async register() {
      this.$navigateTo(Register);
    },
    async login() {
      try {
        const response = await axios.post("http://10.0.2.2:3000/auth/login", {
          email: this.email,
          password: this.password,
        });
        if (response.data) {
          console.log(response.data);
          ApplicationSettings.setString("userToken", response.data.token);
          this.$navigateTo(TaskList);
        } else {
          console.log(response);
        }
      } catch (error) {
        console.log(error);
        this.error = "Invalid login credentials";
      }
    },
  },
  mounted() {
    this.userToken = ApplicationSettings.getString("userToken");
    if (this.userToken) this.$navigateTo(TaskList);
  },
};
</script>
