<template>
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
      <Hasil />
    </v-col>
  </v-row>
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
    const { cek } = await this.cekUjian();

    if (!cek) {
      this.cek = cek;
      return;
    }
    // ambil semua data soal
    await this.getAll();
  },
  computed: {
    ...mapState("ujianModule", ["mulai"]),
  },
  methods: {
    ...mapMutations("ujianModule", ["setMulai"]),
    ...mapActions("ujianModule", ["cekUjian", "getAll", "sendHasil"]),
    mulaiUjian() {
      this.setMulai();
    },
    dialogSelesai() {
      this.dialog = true;
    },
    async selesai() {
      this.dialog = false;
      const res = await this.$store.dispatch("ujianModule/sendHasil");
    },
  },
};
</script>