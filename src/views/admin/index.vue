<template>
  <v-app>
    <v-app-bar src="../../assets/banner.jpg" dark app>
      <v-app-bar-nav-icon @click.stop="drawer = !drawer"></v-app-bar-nav-icon>
      <v-toolbar-title>{{ items[selectedItem].text }}</v-toolbar-title>
      <v-spacer></v-spacer>

      <v-btn icon @click="logout">
        <v-icon>mdi-logout</v-icon>
      </v-btn>
    </v-app-bar>

    <v-navigation-drawer v-model="drawer" app>
      <v-list>
        <v-list-item link>
          <v-list-item-content>
            <v-list-item-title class="title"> {{ nama }} </v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
      <v-divider></v-divider>
      <v-list nav dense>
        <v-list-item-group
          v-model="selectedItem"
          active-class="primary--text text--accent-4"
        >
          <v-list-item
            v-for="(item, i) in items"
            :key="i"
            :to="item.href"
            link
            exact
          >
            <v-list-item-icon>
              <v-icon v-text="item.icon"></v-icon>
            </v-list-item-icon>
            <v-list-item-title v-text="item.text"></v-list-item-title>
          </v-list-item>
        </v-list-item-group>
      </v-list>
    </v-navigation-drawer>

    <v-main>
      <v-container class="px-4 py-4">
        <transition name="fade">
          <router-view></router-view>
        </transition>
      </v-container>
    </v-main>

    <v-footer dark padless>
      <v-card class="flex" flat tile>
        <v-card-text class="py-2 white--text text-center">
          &copy; {{ new Date().getFullYear() }} —
          <strong>Aplikasi Ujian Komprehensif Berbasis Client Server</strong>
        </v-card-text>
      </v-card>
    </v-footer>
  </v-app>
</template>

<script>
import { mapState } from "vuex";

export default {
  data() {
    return {
      drawer: true,
      selectedItem: 0,
      items: [
        { text: "Dashboard", href: "/admin/", icon: "mdi-home" },
        {
          text: "Data Mahasiswa",
          href: "/admin/mahasiswa",
          icon: "mdi-account-group",
        },
        {
          text: "Data Matakuliah",
          href: "/admin/matakuliah",
          icon: "mdi-school",
        },
        {
          text: "Data Soal",
          href: "/admin/soal",
          icon: "mdi-book",
        },
        // { text: "Data Soal", href: "/admin/soal", icon: "mdi-book" },
        {
          text: "Hasil Ujian",
          href: "/admin/hasil",
          icon: "mdi-checkbox-multiple-marked",
        },
      ],
    };
  },
  computed: {
    ...mapState("userModule", { nama: "nama" }),
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

<style lang="scss" scoped>
.fade-enter-active,
.fade-leave-active {
  transition-property: opacity;
  transition-duration: 0.25s;
}

.fade-enter-active {
  transition-delay: 0.25s;
}

.fade-enter,
.fade-leave-active {
  opacity: 0;
}
</style>