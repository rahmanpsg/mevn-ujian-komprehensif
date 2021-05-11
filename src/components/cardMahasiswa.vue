<template>
  <v-col cols="12" class="mt-n10 mb-n10">
    <v-slide-group class="py-10 mb-15">
      <v-slide-item v-for="item in listMahasiswa" :key="item.id">
        <v-card
          max-width="150"
          elevation="3"
          shaped
          class="mx-2 mb-1"
          v-ripple="{ class: `primary--text` }"
          @click="$emit('setSelectedMahasiswa', item)"
        >
          <v-avatar class="profile" color="grey lighten-1" size="150">
            <v-img :lazy-src="item.image" :src="item.image"></v-img>
          </v-avatar>

          <v-card-title
            class="blue lighten-5"
            v-text="item.nama"
          ></v-card-title>

          <v-card-subtitle
            class="blue lighten-5"
            v-text="item.nim"
          ></v-card-subtitle>
        </v-card>
      </v-slide-item>
    </v-slide-group>
  </v-col>
</template>

<script>
export default {
  props: {
    listMahasiswa: Array,
  },
};
</script>