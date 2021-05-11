<template>
  <v-snackbar
    v-model="response.show"
    :timeout="2000"
    color="blue darken-4"
    absolute
    centered
  >
    {{ response.text }}
  </v-snackbar>
</template>

<script>
export default {
  props: {
    response: Object,
  },
};
</script>