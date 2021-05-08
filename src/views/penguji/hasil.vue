<template>
  <v-row>
    <v-col cols="12" sm="3" md="3">
      Jumlah Mahasiswa Uji : <v-chip color="secondary" dark> 10 </v-chip></v-col
    >
    <v-col sm="3" md="3"> Telah Ujian : </v-col>
    <v-col sm="6" md="6"> Belum Ujian : </v-col>
    <v-col cols="12" class="mt-n10 mb-n10">
      <v-slide-group class="py-10 mb-15">
        <v-slide-item
          v-for="item in [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]"
          :key="item"
        >
          <v-card
            max-width="150"
            elevation="5"
            shaped
            class="mx-2 mb-1"
            v-ripple="{ class: `primary--text` }"
            @click="setSelectedMahasiswa"
          >
            <v-img
              src="https://cdn.vuetifyjs.com/images/cards/sunshine.jpg"
              height="100px"
            ></v-img>

            <v-card-title> Abd Rahman </v-card-title>

            <v-card-subtitle> 214280187</v-card-subtitle>
          </v-card>
        </v-slide-item>
      </v-slide-group>
    </v-col>
    <v-col cols="12" class="mt-n16">
      <v-divider></v-divider>
    </v-col>
    <v-col cols="4" class="amber lighten-4 mt-n12">
      <v-row>
        <v-col cols="3"> NAMA</v-col>
        <v-col cols="1"> :</v-col>
        <v-col cols="8"> ABD RAHMAN </v-col>
        <!--  -->
        <!--  -->
        <v-col cols="3"> NIM</v-col>
        <v-col cols="1"> :</v-col>
        <v-col cols="8"> 214280187 </v-col>
        <!--  -->
        <v-col cols="3"> NILAI</v-col>
        <v-col cols="1"> :</v-col>
        <v-col cols="8">
          <v-chip small color="green" dark> 100 </v-chip>
        </v-col>
      </v-row>
    </v-col>
    <!-- <v-col>
      <v-row>
        <v-col> NAMA : ABD RAHMAN </v-col>
      </v-row>
      <v-row>
        <v-col> NIM : 214280187 </v-col>
      </v-row>
      <v-row>
        <v-col> NILAI : 100</v-col>
      </v-row>
    </v-col> -->
  </v-row>
</template>

<script>
export default {
  methods: {
    setSelectedMahasiswa() {},
  },
};
</script>