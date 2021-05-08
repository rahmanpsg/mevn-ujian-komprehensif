<template>
  <v-container>
    <v-row>
      <v-col cols="12" sm="12" md="12" class="pb-2">
        <v-card elevation="5">
          <v-row class="no-gutters">
            <div class="col-auto">
              <div class="cyan fill-height d-flex pa-2">
                <v-icon color="white"> mdi-account-group </v-icon>
              </div>
            </div>
            <div class="col pa-3 py-4 cyan--text">
              <h5 class="text-truncate text-uppercase">Total Mahasiswa</h5>
              <h1>{{ totalMahasiswa }}</h1>
            </div>
          </v-row>
        </v-card>
      </v-col>
      <v-col cols="12" sm="12" md="12" class="pb-2">
        <v-card elevation="5">
          <v-row class="no-gutters">
            <div class="col-auto">
              <div class="primary fill-height d-flex pa-2">
                <v-icon color="white"> mdi-account-multiple </v-icon>
              </div>
            </div>
            <div class="col pa-3 py-4 primary--text">
              <h5 class="text-truncate text-uppercase">Total Penguji</h5>
              <h1>{{ totalPenguji }}</h1>
            </div>
          </v-row>
        </v-card>
      </v-col>
      <v-col cols="12" sm="12" md="12" class="pb-2">
        <v-card elevation="5">
          <v-row class="no-gutters">
            <div class="col-auto">
              <div class="success fill-height d-flex pa-2">
                <v-icon color="white"> mdi-book </v-icon>
              </div>
            </div>
            <div class="col pa-3 py-4 success--text">
              <h5 class="text-truncate text-uppercase">Total Soal</h5>
              <h1>{{ totalSoal }}</h1>
            </div>
          </v-row>
        </v-card>
      </v-col>
      <!-- <v-col cols="12" class="mt-5">
        <v-card elevation="5" shaped>
          <v-card-title> Selamat Datang </v-card-title>
          <v-card-text> Halo </v-card-text>
        </v-card>
      </v-col> -->
    </v-row>
  </v-container>
</template>

<script>
import axios from "axios";

export default {
  data: () => ({
    totalMahasiswa: 0,
    totalPenguji: 0,
    totalSoal: 0,
  }),
  async created() {
    this.loadData();
  },
  methods: {
    async loadData() {
      const res = await axios("totalData");

      const { totalMahasiswa, totalPenguji, totalSoal } = res.data;

      this.totalMahasiswa = totalMahasiswa;
      this.totalPenguji = totalPenguji;
      this.totalSoal = totalSoal;
    },
  },
};
</script>