<template>
  <v-row>
    <v-dialog v-model="dialog" width="800">
      <v-card>
        <v-card-title class="text-h5 grey lighten-2">
          Berita Acara
        </v-card-title>

        <v-card-text>
          <v-container style="height: 500px">
            <iframe :src="cetakUrl" frameborder="0" height="100%" width="100%">
            </iframe>
          </v-container>
        </v-card-text>

        <v-divider></v-divider>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="primary" text @click="$emit('closeDialog')">
            Tutup
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-row>
</template>

<script>
import axios from "axios";

export default {
  props: {
    dialog: Boolean,
  },
  computed: {
    cetakUrl() {
      return axios.defaults.baseURL || "" + "berita_acara";
    },
  },
};
</script>
