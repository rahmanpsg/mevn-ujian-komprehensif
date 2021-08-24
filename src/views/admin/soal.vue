<template>
  <v-container>
    <v-row>
      <v-col cols="12" class="py-0">
        <h1 class="font-weight-light mb-0">Tabel Data Soal</h1>
      </v-col>
      <v-col cols="12">
        <Table
          @tambah="tambah"
          @edit="edit"
          @hapus="showDialogHapus"
          :headers="headers"
          :items="items"
          itemKey="_id"
          :loading="loading"
          :getNamaMatakuliah="getNamaMatakuliah"
          expanded
        >
          <template v-slot:modal>
            <DialogForm
              :dialog="dialog"
              :formTitle="formTitle"
              @closeDialog="closeDialog"
              @simpan="simpan"
            >
              <template v-slot:form>
                <v-form ref="form" v-model="valid" lazy-validation>
                  <v-autocomplete
                    v-model="editedItem.matakuliah"
                    :items="matakuliahs"
                    item-text="matakuliah"
                    item-value="_id"
                    label="Matakuliah"
                  ></v-autocomplete>
                  <v-textarea
                    v-model="editedItem.pertanyaan"
                    label="Pertanyaan"
                    :rules="[(v) => !!v || 'Pertanyaan tidak boleh kosong']"
                  ></v-textarea>
                  <v-row v-for="item in formJawaban" :key="item.val">
                    <v-col cols="1">
                      <v-radio-group
                        v-model="editedItem.benar"
                        :rules="[(v) => !!v || '']"
                        column
                      >
                        <v-radio color="primary" :value="item.val"></v-radio>
                      </v-radio-group>
                    </v-col>
                    <v-col cols="11">
                      <v-text-field
                        v-model="$data['editedItem'].jawaban[item.val]"
                        :label="item.label"
                        :rules="[(v) => !!v || 'Jawaban tidak boleh kosong']"
                        required
                      ></v-text-field>
                    </v-col>
                  </v-row>
                </v-form>
              </template>
            </DialogForm>

            <DialogDelete
              :dialogDelete="dialogDelete"
              @hapus="hapus"
              @closeDialog="closeDialog"
            />
          </template>
        </Table>

        <SnackbarResponse :response="response" />
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import Table from "@/components/table.vue";
import DialogForm from "@/components/dialogForm.vue";
import DialogDelete from "@/components/dialogDelete.vue";
import SnackbarResponse from "@/components/snackbarResponse.vue";
import { mapState, mapActions } from "vuex";

export default {
  components: {
    Table,
    DialogForm,
    DialogDelete,
    SnackbarResponse,
  },
  data() {
    return {
      loading: true,
      headers: [
        { text: "", value: "data-table-expand", groupable: false },
        {
          text: "#",
          align: "start",
          sortable: false,
          groupable: false,
          value: "index",
        },
        {
          text: "Matakuliah",
          align: "start",
          sortable: true,
          value: "matakuliah.matakuliah",
        },
        { text: "Pertanyaan", value: "pertanyaan", groupable: false },
        {
          text: "Jawaban",
          value: "benar",
          groupable: false,
        },
        { text: "Aksi", value: "aksi", sortable: false, groupable: false },
      ],
      sortBy: "matakuliah",
      dialog: false,
      dialogDelete: false,
      editedIndex: -1,
      editedItem: { jawaban: { A: "", B: "", C: "", D: "" } },
      defaultItem: { jawaban: { A: "", B: "", C: "", D: "" } },
      formJawaban: [
        { val: "A", label: "Jawaban A*" },
        { val: "B", label: "Jawaban B*" },
        { val: "C", label: "Jawaban C*" },
        { val: "D", label: "Jawaban D*" },
      ],
      valid: true,
      response: { show: false, text: "" },
    };
  },
  async created() {
    await this.getAllMatakuliah();
    await this.getAll();
    this.loading = false;
  },
  computed: {
    ...mapState({
      items: (state) => state.soalModule.soals,
      matakuliahs: (state) => state.matakuliahModule.matakuliahs,
    }),
    formTitle() {
      return this.editedIndex === -1 ? "Tambah Data Soal" : "Edit Data Soal";
    },
    numberRules() {
      return [
        (v) => !!v || "Nomor tidak boleh kosong",
        (v) => {
          return (
            (this.editedIndex != -1 && this.items[this.editedIndex].no == v) ||
            !this.items.find((item) => item.no == v) ||
            "Nomor telah digunakan"
          );
        },
      ];
    },
  },
  methods: {
    ...mapActions("soalModule", [
      "getAll",
      "addSoal",
      "editSoal",
      "deleteSoal",
    ]),
    ...mapActions("matakuliahModule", {
      getAllMatakuliah: "getAll",
    }),
    getNamaMatakuliah(matakuliah) {
      if (typeof matakuliah === "object") return matakuliah.matakuliah;
      else {
        const findMatakuliah = this.matakuliahs.find(
          (v) => v._id == matakuliah
        );

        return findMatakuliah ? findMatakuliah.matakuliah : "-";
      }
    },
    tambah() {
      this.editedItem = JSON.parse(JSON.stringify(this.defaultItem));
      this.dialog = true;

      this.$nextTick(() => {
        this.$refs.form.reset();
      });
    },
    edit(item) {
      this.editedIndex = this.items.indexOf(item);
      this.editedItem = Object.assign({}, item);

      this.dialog = true;
    },
    showDialogHapus(item) {
      this.editedIndex = this.items.indexOf(item);
      this.editedItem = Object.assign({}, item);

      this.dialogDelete = true;
    },
    async hapus() {
      const res = await this.deleteSoal({
        index: this.editedIndex,
        id: this.editedItem._id,
      });

      this.response = { show: true, text: res.data.message };

      this.closeDialog();
    },
    async simpan() {
      console.log(this.editedItem);
      await this.$refs.form.validate();

      if (!this.valid) return;

      let res;
      if (this.editedIndex > -1) {
        res = await this.editSoal({
          index: this.editedIndex,
          soal: { ...this.editedItem },
        });
      } else {
        res = await this.addSoal({ ...this.editedItem });
      }

      this.response = { show: true, text: res.data.message };

      this.closeDialog();
    },
    closeDialog() {
      this.dialog = false;
      this.dialogDelete = false;

      this.$nextTick(() => {
        this.editedItem = JSON.parse(JSON.stringify(this.defaultItem));
        this.editedIndex = -1;
      });
    },
  },
};
</script>
