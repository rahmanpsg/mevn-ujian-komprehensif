<template>
  <v-col cols="12" sm="8" md="8" class="mt-md-n14">
    <v-data-table
      :headers="headers"
      :items="items"
      :items-per-page="5"
      item-key="no"
      sort-by="no"
      class="elevation-4"
      show-group-by
    >
      <template v-slot:[`item.index`]="{ index }">
        {{ index + 1 }}
      </template>

      <template v-slot:[`item.hasil`]="{ item }">
        <v-chip small :color="getHasil(item) ? 'green' : 'red'" dark>
          {{ getHasil(item) ? "BENAR" : "SALAH" }}
        </v-chip>
      </template>
    </v-data-table>
  </v-col>
</template>

<script>
export default {
  props: {
    headers: Array,
    items: Array,
  },
  methods: {
    getHasil(item) {
      return item.jawab == item.soal.benar;
    },
  },
};
</script>