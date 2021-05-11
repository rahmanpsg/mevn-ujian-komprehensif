<template>
  <v-row>
    <v-col cols="12" sm="4" md="4">
      Jumlah Mahasiswa Uji :
      <v-chip color="primary" small dark>
        {{ totalMahasiswa.total }}
      </v-chip></v-col
    >
    <v-col sm="3" md="3">
      Telah Ujian :
      <v-chip color="green" small dark>
        {{ totalMahasiswa.telah }}
      </v-chip></v-col
    >
    <v-col sm="3" md="3">
      Belum Ujian :
      <v-chip color="warning" small dark>
        {{ totalMahasiswa.belum }}
      </v-chip></v-col
    >
    <CardMahasiswa
      :listMahasiswa="listMahasiswa"
      @setSelectedMahasiswa="setSelectedMahasiswa"
    />
    <v-col cols="12" class="mt-n16">
      <v-divider></v-divider>
    </v-col>
    <v-col v-show="!show" cols="12" class="mx-auto text-center overline"
      >Silahkan pilih mahasiswa untuk melihat data</v-col
    >
    <Info
      v-show="show"
      :nama="selected.nama"
      :nim="selected.nim"
      :nilai="selected.hasil.nilai"
    />
    <TableHasil
      v-show="show"
      :headers="headers"
      :items="selected.hasil.jawaban"
    />
  </v-row>
</template>

<script>
import CardMahasiswa from "@/components/cardMahasiswa.vue";
import Info from "@/components/infoHasil.vue";
import TableHasil from "@/components/tableHasil.vue";
import { mapState, mapActions } from "vuex";

export default {
  components: {
    CardMahasiswa,
    Info,
    TableHasil,
  },
  data: () => ({
    headers: [
      {
        text: "Nomor",
        align: "start",
        value: "soal.no",
        sortable: true,
        groupable: false,
      },
      { text: "Pertanyaan", value: "soal.pertanyaan", groupable: false },
      { text: "Jawab", value: "jawab", groupable: false },
      { text: "Hasil", value: "hasil", align: "right" },
    ],
    items: [],
    show: false,
    selected: { hasil: {} },
    defaultSelected: { hasil: {} },
  }),
  async created() {
    await this.getAll();

    // const a = Object.keys(this.listMahasiswa);
    // console.log(a);
  },
  computed: {
    ...mapState("hasilModule", { listMahasiswa: "mahasiswas" }),
    totalMahasiswa() {
      let telah = 0;
      let belum = 0;

      this.listMahasiswa.forEach((el) => {
        if (el.hasOwnProperty("hasil")) telah++;
        else belum++;
      });

      return {
        total: this.listMahasiswa.length,
        telah,
        belum,
      };
    },
  },
  methods: {
    ...mapActions("hasilModule", ["getAll"]),
    setSelectedMahasiswa(item) {
      this.selected = Object.assign(
        JSON.parse(JSON.stringify(this.defaultSelected)),
        JSON.parse(JSON.stringify(item))
      );

      this.show = true;
    },
  },
};
</script>