<template>
  <v-dialog v-model="dialogDelete" max-width="500px" persistent>
    <v-card>
      <v-card-title>
        <v-spacer></v-spacer>
        <v-icon x-large color="warning">mdi-alert</v-icon>
        <v-spacer></v-spacer>
      </v-card-title>
      <v-card-text class="headline">
        Anda yakin untuk menghapus data ini?
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn
          color="blue darken-1"
          outlined
          text
          @click="$emit('closeDialog')"
        >
          Cancel
        </v-btn>
        <v-btn color="red darken-1" outlined text @click="$emit('hapus')">
          OK
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  props: {
    dialogDelete: Boolean,
  },
};
</script>