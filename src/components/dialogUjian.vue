<template>
  <v-dialog v-model="dialog" max-width="500px" persistent>
    <v-card>
      <v-card-title>
        <v-spacer></v-spacer>
        <v-icon x-large color="warning">mdi-chat-alert</v-icon>
        <v-spacer></v-spacer>
      </v-card-title>
      <v-card-text class="headline">
        Anda yakin menyelesaikan ujian?
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
        <v-btn color="red darken-1" outlined text @click="$emit('selesai')">
          OK
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  props: {
    dialog: Boolean,
  },
};
</script>