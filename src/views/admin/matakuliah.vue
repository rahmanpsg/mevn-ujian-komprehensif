<template>
  <v-container>
    <v-row>
      <v-col cols="12" class="py-0">
        <h1 class="font-weight-light mb-0">Tabel Data Matakuliah</h1>
      </v-col>
      <v-col cols="12">
        <Table
          @tambah="tambah"
          @edit="edit"
          @hapus="showDialogHapus"
          :headers="headers"
          :items="items"
          :loading="loading"
          :dialogDelete="dialogDelete"
        >
          <template v-slot:modal>
            <v-dialog v-model="dialog" persistent max-width="600px">
              <v-card>
                <v-card-title>
                  <span class="text-h5" v-text="formTitle"></span>
                </v-card-title>
                <v-card-text>
                  <v-form ref="form">
                    <v-row>
                      <v-col cols="12">
                        <v-text-field
                          v-model="editedItem.matakuliah"
                          label="Matakuliah*"
                          :rules="[
                            (v) => !!v || 'Matakuliah tidak boleh kosong',
                          ]"
                          required
                        ></v-text-field>
                      </v-col>
                    </v-row>
                  </v-form>
                </v-card-text>
                <v-card-actions>
                  <v-spacer></v-spacer>
                  <v-btn color="blue darken-1" text @click="dialog = false">
                    Tutup
                  </v-btn>
                  <v-btn color="blue darken-1" text @click="simpan">
                    Simpan
                  </v-btn>
                </v-card-actions>
              </v-card>
            </v-dialog>

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
        { text: "Matakuliah", value: "matakuliah" },
        { text: "Aksi", value: "aksi", sortable: false },
      ],
      dialog: false,
      dialogDelete: false,
      editedIndex: -1,
      editedItem: { matakuliah: "" },
      defaultItem: { matakuliah: "" },
      valid: true,
      response: { show: false, text: "" },
    };
  },
  async created() {
    await this.getAll();
    this.loading = false;
  },
  computed: {
    ...mapState({
      items: (state) => state.matakuliahModule.matakuliahs,
    }),
    formTitle() {
      return this.editedIndex === -1
        ? "Tambah Data Matakuliah"
        : "Edit Data Matakuliah";
    },
  },
  methods: {
    ...mapActions("matakuliahModule", [
      "getAll",
      "addMatakuliah",
      "editMatakuliah",
      "deleteMatakuliah",
    ]),
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
      const res = await this.deleteMatakuliah({
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
        res = await this.editMatakuliah({
          index: this.editedIndex,
          matakuliah: { ...this.editedItem },
        });
      } else {
        res = await this.addMatakuliah({ ...this.editedItem });
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