<template>
  <v-row>
    <v-col cols="12" sm="8" md="8" class="indigo lighten-5">
      <v-row>
        <v-col cols="12" class="headline"> Ujian Komprehensif </v-col>
        <v-col cols="12">
          <v-divider></v-divider>
        </v-col>
        <v-col cols="2" sm="1" md="1" xl="1">
          <v-chip label color="primary" dark v-text="soal.no"></v-chip>
        </v-col>
        <v-col cols="10" sm="11" md="11" xl="11">
          <span v-text="soal.pertanyaan"></span>
        </v-col>
        <v-col cols="12">
          <v-chip-group
            :value="jawaban"
            column
            @change="setJawaban(i)"
            v-for="(item, i) in soal.jawaban"
            :key="i"
          >
            <v-col cols="2" xl="3">
              <v-chip
                active-class="primary"
                color="grey lighten-1"
                :value="i"
                v-text="i"
                filter
              >
              </v-chip>
            </v-col>
            <v-col cols="10" xl="9" class="my-auto ml-sm-n14">
              <span v-text="item"></span>
            </v-col>
          </v-chip-group>
        </v-col>
        <v-col cols="12">
          <v-divider></v-divider>
        </v-col>
        <v-col cols="6" sm="2" md="2">
          <v-btn :disabled="!(soalActive - 1)" @click="setSoal(soalActive - 1)">
            <v-icon left>mdi-arrow-left</v-icon>
            Kembali
          </v-btn>
        </v-col>
        <v-col cols="6" sm="10" md="10">
          <v-btn v-if="!isSubmit" @click="setSoal(soalActive + 1)">
            Selanjutnya
            <v-icon right>mdi-arrow-right</v-icon>
          </v-btn>
          <v-btn v-else color="blue" dark @click="$emit('dialogSelesai')">
            SUBMIT
            <v-icon right>mdi-send</v-icon>
          </v-btn>
        </v-col>
      </v-row>
    </v-col>
    <v-col cols="12" sm="4" md="4" class="blue lighten-3">
      <v-row>
        <v-col cols="12" class="headline"> Soal </v-col>
        <v-col cols="12">
          <v-divider></v-divider>
        </v-col>
        <v-col cols="12" style="max-height: 260px" class="overflow-y-auto">
          <v-chip-group :value="soalActive" column @change="setSoal">
            <v-chip
              v-for="(item, i) in soals"
              :key="i"
              label
              dark
              active-class="primary"
              :color="getColorSoal(item.no)"
              class="text-overline justify-center"
              style="min-width: 41px"
              :value="item.no"
              v-text="item.no"
            >
            </v-chip>
          </v-chip-group>
        </v-col>

        <v-col cols="6">
          <v-chip color="black" small label></v-chip>
          &nbsp;
          <span class="text-overline">Belum Dilihat</span>
        </v-col>
        <v-col cols="6">
          <v-chip color="green" small label></v-chip>
          &nbsp;
          <span class="text-overline">Dijawab</span>
        </v-col>
        <v-col cols="6">
          <v-chip color="orange" small label></v-chip>
          &nbsp;
          <span class="text-overline">Dilewati</span>
        </v-col>
        <v-col cols="12">
          <v-divider></v-divider>
        </v-col>
        <v-col cols="12" class="d-flex justify-center">
          <span class="text-h2 grey--text text--darken-3" v-text="waktu"></span>
        </v-col>
        <v-col cols="12" class="d-flex justify-center text-overline mt-n7">
          SISA WAKTU
        </v-col>
      </v-row>
    </v-col>
  </v-row>
</template>

<script>
import { mapState, mapGetters, mapMutations } from "vuex";

export default {
  data() {
    return {
      waktu: null,
    };
  },
  created() {
    this.initCountDown();
  },
  beforeDestroy() {
    clearInterval(this.countDown);
  },
  computed: {
    ...mapGetters("ujianModule", {
      soal: "getSoal",
      jawaban: "getJawaban",
    }),
    ...mapState("ujianModule", [
      "jawabans",
      "waktuMulai",
      "soals",
      "soalActive",
    ]),
    isSubmit() {
      return this.soalActive == this.soals.length;
    },
  },
  methods: {
    ...mapMutations("ujianModule", {
      setSoal: "setSoalActive",
      setJawaban: "setJawabans",
    }),
    getColorSoal(nomor) {
      if (nomor in this.jawabans) {
        if (this.jawabans[nomor] == "") {
          return "orange";
        }
        return "green";
      }

      return "black";
    },
    initCountDown() {
      this.waktuSelesai = new Date(this.waktuMulai);
      this.waktuSelesai.setHours(this.waktuSelesai.getHours() + 1);

      this.countDown = setInterval(() => {
        let now = new Date().getTime();

        let distance = this.waktuSelesai - now;

        let minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        let seconds = Math.floor((distance % (1000 * 60)) / 1000);

        this.waktu = `${minutes}:${seconds >= 10 ? "" : "0"}${seconds}`;

        if (distance < 0) {
          this.waktu = "SELESAI";
          clearInterval(this.countDown);
          this.$emit("selesai");
        }
      }, 1000);
    },
  },
};
</script>