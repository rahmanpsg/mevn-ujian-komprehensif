<template>
  <v-container>
    <v-row>
      <v-col cols="12" class="py-0">
        <h1 class="font-weight-light mb-0">Tabel Data Mahasiswa</h1>
      </v-col>
      <v-col cols="12">
        <Table
          @tambah="tambah"
          @edit="edit"
          @hapus="showDialogHapus"
          :headers="headers"
          :items="items"
          itemKey="nim"
          sortBy="nim"
          :loading="loading"
          :dialogDelete="dialogDelete"
          :getNamaPenguji="getNamaPenguji"
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
                  <v-row>
                    <v-col cols="12" sm="6" md="6">
                      <v-text-field
                        v-model="editedItem.nim"
                        type="number"
                        label="Nim*"
                        :rules="nimRules"
                        required
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12" sm="6" md="6">
                      <v-text-field
                        v-model="editedItem.nama"
                        label="Nama*"
                        :rules="[(v) => !!v || 'Nama tidak boleh kosong']"
                        required
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12" sm="6" md="6">
                      <v-text-field
                        v-model="editedItem.username"
                        label="Username*"
                        :rules="usernameRules"
                        required
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12" sm="6" md="6">
                      <v-text-field
                        v-model="editedItem.password"
                        type="password"
                        label="Password*"
                        :rules="[(v) => !!v || 'Password tidak boleh kosong']"
                        required
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12" sm="12" md="12">
                      <v-select
                        label="Penguji*"
                        v-model="editedItem.penguji"
                        :items="listPenguji"
                        item-text="nama"
                        item-value="_id"
                        dense
                        :rules="[(v) => !!v || 'Penguji belum dipilih']"
                        required
                      ></v-select>
                    </v-col>
                    <v-col cols="12" sm="2" md="2">
                      <v-btn
                        color="primary"
                        :disabled="editedItem.images.length >= 3"
                        @click="$refs.uploader.click()"
                      >
                        Tambah Image
                        <v-icon right> mdi-plus </v-icon>
                      </v-btn>
                      <input
                        ref="uploader"
                        class="d-none"
                        type="file"
                        accept="image/*"
                        multiple
                        @change="onFileChanged"
                      />
                    </v-col>
                    <v-col cols="12" sm="10" md="10">
                      *Anda dapat menambahkan hingga 3 image untuk digunakan
                      sebagai deteksi wajah.
                      <br />
                      Silahkan upload foto dengan wajah yang jelas.
                    </v-col>
                    <v-alert :value="alertImage" dense outlined type="error">
                      Anda hanya dapat menambahkan maksimal
                      <strong>3 foto</strong>
                    </v-alert>
                  </v-row>

                  <v-row justify="space-around">
                    <v-col
                      cols="4"
                      v-for="(image, i) in editedItem.images"
                      :key="i"
                    >
                      <div class="title mb-1">
                        <v-btn
                          small
                          color="error"
                          @click="editedItem.images.splice(i, 1)"
                        >
                          Hapus
                          <v-icon right> mdi-delete </v-icon>
                        </v-btn>
                      </div>
                      <v-img :src="image" aspect-ratio="1.1"></v-img>
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
        {
          text: "#",
          align: "start",
          sortable: false,
          value: "index",
        },
        { text: "Nim", value: "nim" },
        { text: "Nama", value: "nama" },
        { text: "Username", value: "username" },
        { text: "Penguji", value: "penguji" },
        { text: "Aksi", value: "aksi", sortable: false },
      ],
      dialog: false,
      dialogDelete: false,
      dialogDelete: false,
      editedIndex: -1,
      editedItem: { images: [] },
      defaultItem: { images: [] },
      valid: true,
      response: { show: false, text: "" },
      alertImage: false,
    };
  },
  async created() {
    await this.getListPenguji();
    await this.getAll();
    this.loading = false;
  },
  computed: {
    ...mapState("mahasiswaModule", {
      items: "mahasiswas",
      listPenguji: "listPenguji",
    }),
    formTitle() {
      return this.editedIndex === -1
        ? "Tambah Data Mahasiswa"
        : "Edit Data Mahasiswa";
    },
    nimRules() {
      return [
        (v) => !!v || "Nim tidak boleh kosong",
        (v) => {
          return (
            (this.editedIndex != -1 && this.items[this.editedIndex].nim == v) ||
            !this.items.find((item) => item.nim == v) ||
            "Nim telah digunakan"
          );
        },
      ];
    },
    usernameRules() {
      return [
        (v) => !!v || "Username tidak boleh kosong",
        (v) => (v && v.length >= 6) || "Username minimal 6 karakter",
        (v) => {
          return (
            (this.editedIndex != -1 &&
              this.items[this.editedIndex].username == v) ||
            !this.items.find((item) => item.username == v) ||
            "Username telah digunakan"
          );
        },
      ];
    },
  },
  methods: {
    ...mapActions("mahasiswaModule", [
      "getAll",
      "getListPenguji",
      "addMahasiswa",
      "editMahasiswa",
      "deleteMahasiswa",
    ]),
    getNamaPenguji(penguji) {
      if (!penguji || !this.listPenguji.length) return "-";

      return this.listPenguji.find((v) => v._id == penguji).nama;
    },
    onFileChanged(e) {
      const files = e.target.files;
      const total = this.editedItem.images.length + files.length;

      if (total > 3) {
        this.alertImage = true;

        setTimeout(() => {
          this.alertImage = false;
        }, 2500);
        return;
      }

      for (const image of e.target.files) {
        this.createBase64(image);
      }
    },
    createBase64(file) {
      const reader = new FileReader();

      reader.onload = (e) => {
        this.editedItem.images.push(e.target.result);
      };

      reader.readAsDataURL(file);
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
      this.editedItem = JSON.parse(JSON.stringify(item));

      this.dialog = true;
    },
    showDialogHapus(item) {
      this.editedIndex = this.items.indexOf(item);
      this.editedItem = Object.assign({}, item);

      this.dialogDelete = true;
    },
    async hapus() {
      const res = await this.deleteMahasiswa({
        index: this.editedIndex,
        id: this.editedItem._id,
      });

      this.response = { show: true, text: res.data.message };

      this.closeDialog();
    },
    async simpan() {
      await this.$refs.form.validate();

      if (!this.valid) return;

      let res;
      if (this.editedIndex > -1) {
        res = await this.editMahasiswa({
          index: this.editedIndex,
          mahasiswa: { ...this.editedItem },
        });
      } else {
        res = await this.addMahasiswa({ ...this.editedItem });
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