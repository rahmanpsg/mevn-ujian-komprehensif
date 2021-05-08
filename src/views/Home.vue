<template>
  <v-container>
    {{ username }}

    <v-btn @click="logout">LOGOUT</v-btn>
  </v-container>
</template>

<script>
import { mapGetters } from "vuex";

export default {
  name: "Home",
  computed: {
    ...mapGetters("userModule", { username: "getUsername" }),
  },
  methods: {
    logout() {
      this.$store.commit("userModule/isLogin", false);
      this.$router.push("/");
      localStorage.clear();
    },
  },
};
</script>
