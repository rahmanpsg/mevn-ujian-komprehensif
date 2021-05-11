<template>
  <v-card class="mx-auto" max-width="1000" outlined>
    <v-list-item three-line>
      <v-list-item-content>
        <v-list-item-title class="overline text-h6 mb-1">
          Selamat Datang
        </v-list-item-title>
        <div class="subtitle-1">
          Silahkan klik pada tombol mulai untuk memulai ujian. Anda memiliki
          waktu selamat 60 menit untuk menyelesai ujian anda.
        </div>
      </v-list-item-content>
    </v-list-item>

    <v-card-actions class="blue lighten-3">
      <v-btn rounded @click="$emit('mulai')"> Mulai </v-btn>
    </v-card-actions>
  </v-card>
</template>