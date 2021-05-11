<template>
  <v-card class="mx-auto my-12 secondary" max-width="1000" dark elevation="7">
    <v-row>
      <v-col cols="12" sm="3" md="3" class="px-5 py-5">
        <v-avatar size="200">
          <v-img :src="image"></v-img>
        </v-avatar>
      </v-col>
      <v-col cols="12" sm="9" md="9">
        <v-card-title class="text-h5"> HASIL UJIAN </v-card-title>
        <v-card-text>
          <v-row class="text-overline">
            <v-col cols="3"> Nama</v-col>
            <v-col cols="1"> :</v-col>
            <v-col cols="8"> {{ nama }} </v-col>
            <!--  -->
            <v-col cols="3"> Nim</v-col>
            <v-col cols="1"> :</v-col>
            <v-col cols="8"> {{ nim }} </v-col>
            <!--  -->
            <v-col cols="3"> Waktu Ujian</v-col>
            <v-col cols="1"> :</v-col>
            <v-col cols="8"> {{ waktuConvert(waktuMulai) }} </v-col>
            <!--  -->
            <v-col cols="3"> Waktu Selesai</v-col>
            <v-col cols="1"> :</v-col>
            <v-col cols="8"> {{ waktuConvert(waktuSelesai) }} </v-col>
            <!--  -->
            <v-col cols="3"> Nilai</v-col>
            <v-col cols="1"> :</v-col>
            <v-col cols="8">
              <v-chip small :color="getColors" dark>
                {{ nilai }}
              </v-chip>
            </v-col>
          </v-row>
        </v-card-text>
      </v-col>
    </v-row>
  </v-card>
</template>

<script>
import moment from "moment";

export default {
  props: {
    image: String,
    nama: String,
    nim: Number,
    waktuMulai: String,
    waktuSelesai: String,
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
  methods: {
    waktuConvert(waktu) {
      moment.locale("id");
      return moment(waktu).format("llll");
    },
  },
};
</script>