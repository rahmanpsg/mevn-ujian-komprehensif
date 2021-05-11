<template>
  <v-app>
    <v-app-bar src="../../assets/banner.jpg" dark app>
      <!-- <v-app-bar-nav-icon @click.stop="drawer = !drawer"></v-app-bar-nav-icon> -->
      <v-toolbar-title>{{ nama }}</v-toolbar-title>
      <v-spacer></v-spacer>

      <v-btn icon @click="logout">
        <v-icon>mdi-logout</v-icon>
      </v-btn>
    </v-app-bar>

    <v-main>
      <v-container class="px-4 py-4">
        <transition name="fade">
          <v-row v-if="cek">
            <v-col v-if="!mulai" cols="12">
              <CardMulaiUjian @mulai="mulaiUjian" />
            </v-col>

            <v-col cols="12" v-else>
              <Ujian @selesai="selesai" @dialogSelesai="dialogSelesai" />
            </v-col>

            <v-col cols="12">
              <DialogUjian
                :dialog="dialog"
                @selesai="selesai"
                @closeDialog="dialog = false"
              />
            </v-col>
          </v-row>
          <v-row v-else>
            <v-col cols="12">
              <Hasil
                :image="image"
                :nama="nama"
                :nim="nim"
                :waktuMulai="waktuMulai"
                :waktuSelesai="waktuSelesai"
                :nilai="nilai"
              />
            </v-col>
          </v-row>
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
import CardMulaiUjian from "@/components/cardMulaiUjian.vue";
import Ujian from "@/components/ujian.vue";
import DialogUjian from "@/components/dialogUjian.vue";
import Hasil from "@/components/hasil.vue";
import { mapState, mapMutations, mapActions } from "vuex";

export default {
  components: {
    CardMulaiUjian,
    Ujian,
    DialogUjian,
    Hasil,
  },
  data() {
    return {
      cek: true,
      dialog: false,
    };
  },
  async created() {
    // Periksa jika telah melakukan ujian
    const { data } = await this.getDataUjian();

    if (!!data) {
      this.cek = false;
      this.waktuMulai = data.waktuMulai;
      this.waktuSelesai = data.waktuSelesai;
      this.nilai = data.nilai;
      return;
    }
    // ambil semua data soal
    await this.getAll();
  },
  computed: {
    ...mapState("userModule", ["nama", "nim", "image"]),
    ...mapState("ujianModule", ["mulai"]),
  },
  methods: {
    ...mapMutations("ujianModule", ["setMulai"]),
    ...mapActions("ujianModule", ["getDataUjian", "getAll", "sendHasil"]),
    mulaiUjian() {
      this.setMulai();
    },
    dialogSelesai() {
      this.dialog = true;
    },
    async selesai() {
      this.dialog = false;
      const res = await this.$store.dispatch("ujianModule/sendHasil");

      if (res.status == 200) {
        this.cek = false;
        this.waktuMulai = res.data.waktuMulai;
        this.waktuSelesai = res.data.waktuSelesai;
        this.nilai = res.data.nilai;
      }
    },
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