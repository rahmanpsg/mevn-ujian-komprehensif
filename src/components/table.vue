<template>
  <v-card elevation="5">
    <v-card-title>
      <v-btn color="primary" @click.stop="$emit('tambah')">
        <v-icon left> mdi-plus-circle </v-icon>
        Tambah Data
      </v-btn>
      <v-spacer></v-spacer>
      <v-text-field
        v-model="search"
        append-icon="mdi-magnify"
        label="Cari"
        single-line
        hide-details
      ></v-text-field>
    </v-card-title>
    <v-data-table
      :headers="headers"
      :items="items"
      :item-key="itemKey"
      :items-per-page="5"
      :search="search"
      :loading="loading"
      loading-text="Loading data..."
      :show-expand="expanded"
      :single-expand="true"
      :sort-by.sync="sortBy"
      :getNamaPenguji="getNamaPenguji"
    >
      <template v-slot:[`item.index`]="{ index }">
        {{ index + 1 }}
      </template>

      <template v-slot:[`item.penguji`]="{ item }">
        {{ getNamaPenguji(item.penguji) }}
      </template>

      <template v-slot:[`item.aksi`]="{ item }">
        <v-tooltip bottom>
          <template v-slot:activator="{ on, attrs }">
            <v-icon
              small
              class="mr-2"
              v-bind="attrs"
              v-on="on"
              @click.stop="$emit('edit', item)"
            >
              mdi-pencil
            </v-icon>
          </template>
          <span>Edit Data</span>
        </v-tooltip>

        <v-tooltip bottom>
          <template v-slot:activator="{ on, attrs }">
            <v-icon
              small
              v-bind="attrs"
              v-on="on"
              @click.stop="$emit('hapus', item)"
            >
              mdi-delete
            </v-icon>
          </template>
          <span>Hapus Data</span>
        </v-tooltip>
      </template>

      <template v-slot:expanded-item="{ headers, item }">
        <td :colspan="headers.length" class="py-4">
          <v-row>
            <v-col cols="12" v-for="(jawaban, i) in item.jawaban" :key="i">
              <v-row>
                <v-col
                  cols="1"
                  class="text-md-body-1 font-weight-bold text-uppercase"
                  v-text="i"
                ></v-col>
                <v-col cols="1">:</v-col>
                <v-col cols="10">{{ jawaban }}</v-col>
              </v-row>
            </v-col>
          </v-row>
        </td>
      </template>

      <template v-slot:top>
        <slot name="modal"></slot>
      </template>
    </v-data-table>
  </v-card>
</template>

<script>
export default {
  props: {
    headers: Array,
    items: Array,
    itemKey: String,
    sortBy: String,
    loading: Boolean,
    expanded: Boolean,
    btnImage: Boolean,
    getNamaPenguji: Function,
  },
  data: () => ({
    search: "",
  }),
};
</script>