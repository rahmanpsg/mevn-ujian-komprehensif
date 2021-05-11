<template>
  <v-col cols="12" sm="4" md="4" class="mt-n11">
    <v-row class="amber lighten-4">
      <v-col cols="3"> Nama</v-col>
      <v-col cols="1"> :</v-col>
      <v-col cols="8"> {{ nama }} </v-col>
      <!--  -->
      <v-col cols="3"> Nim</v-col>
      <v-col cols="1"> :</v-col>
      <v-col cols="8"> {{ nim }} </v-col>
      <!--  -->
      <v-col cols="3"> Nilai</v-col>
      <v-col cols="1"> :</v-col>
      <v-col cols="8">
        <v-chip v-if="nilai >= 0" small :color="getColors" dark>
          {{ nilai }}
        </v-chip>
        <v-chip v-else small color="red" dark> Belum Ujian </v-chip>
      </v-col>
    </v-row>
  </v-col>
</template>

<script>
export default {
  props: {
    nama: String,
    nim: Number,
    nilai: Number,
  },
  computed: {
    getColors() {
      try {
        if (this.nilai >= 80) {
          return "green";
        }

        if (this.nilai >= 60) {
          return "blue";
        }

        if (this.nilai >= 40) {
          return "secondary";
        }

        if (this.nilai >= 20) {
          return "yellow";
        }
      } catch (error) {}

      return "red";
    },
  },
};
</script>