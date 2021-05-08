<template>
  <v-container fluid fill-height class="bg">
    <transition name="flip">
      <v-card
        elevation="20"
        outlined
        :loading="loading"
        class="mx-auto my-12"
        max-width="500"
        v-bind:key="show"
      >
        <loginForm
          v-if="show"
          v-on:setLoading="setLoading"
          v-on:setShow="setShow"
        />
        <camera
          v-if="!show"
          v-on:setLoading="setLoading"
          v-on:setShow="setShow"
        />
      </v-card>
    </transition>
  </v-container>
</template>

<script>
import loginForm from "@/components/loginForm.vue";
import camera from "@/components/camera.vue";

export default {
  components: {
    loginForm,
    camera,
  },
  data: () => ({
    show: true,
    valid: true,
    loading: false,
    username: "",
    password: "",
  }),
  methods: {
    setLoading(loading) {
      this.loading = loading;
    },
    setShow(show) {
      this.show = show;
    },
  },
};
</script>

<style lang="scss" scoped>
.bg {
  background: rgb(2, 0, 36);
  background: linear-gradient(
    146deg,
    rgba(2, 0, 36, 1) 0%,
    rgba(10, 10, 125, 1) 35%,
    rgba(0, 212, 255, 1) 100%
  );
}

.flip-enter-active {
  transition: all 0.7s ease-in-out;
}

.flip-leave-active {
  display: none;
}

.flip-enter,
.flip-leave {
  transform: rotateY(-180deg);
  opacity: 0;
}
</style>