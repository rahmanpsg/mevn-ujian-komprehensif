<template>
  <v-main>
    <v-card-title>
      <v-alert
        :value="error"
        dense
        outlined
        border="left"
        type="error"
        elevation="2"
      >
        <v-row align="center">
          <v-col class="grow"> {{ alert }} </v-col>
          <v-col class="shrink">
            <v-btn v-show="btnErr" @click="startCamera">aktifkan</v-btn>
          </v-col>
        </v-row>
      </v-alert>

      <v-alert
        :value="alertDetection.show"
        :type="alertDetection.type"
        transition="scale-transition"
        dense
        outlined
        border="left"
        elevation="2"
      >
        <span v-html="alertDetection.text"></span>
      </v-alert>

      <v-row
        v-if="showLoading"
        class="fill-height"
        align-content="center"
        justify="center"
      >
        <v-col class="subtitle-1 text-center" cols="12">
          {{ loadingText }}
        </v-col>
        <v-col cols="10">
          <v-progress-linear
            color="deep-purple accent-4"
            indeterminate
            rounded
            height="6"
          ></v-progress-linear>
        </v-col>
      </v-row>
    </v-card-title>
    <v-card-text>
      <v-container>
        <v-row ref="container" align-content="center" justify="center">
          <video
            ref="video"
            :width="videoSize"
            :height="videoSize"
            muted
          ></video>
        </v-row>
      </v-container>
    </v-card-text>
    <v-card-actions class="justify-center">
      <v-btn color="warning" @click="back" block>
        <v-icon left> mdi-arrow-left </v-icon>
        Login dengan username & password
      </v-btn>
    </v-card-actions>
  </v-main>
</template>

<script>
import { mapState, mapActions } from "vuex";

export default {
  data() {
    return {
      error: false,
      btnErr: true,
      alert: "Silahkan aktifkan kamera terlebih dahulu!",
      loadingText: "Loading Model...",
      alertDetection: {
        show: false,
        type: "warning",
        text: "Tidak ada wajah yang terdeteksi",
      },
      detect: false,
    };
  },
  created() {
    navigator.getUserMedia =
      navigator.getUserMedia ||
      navigator.webkitGetUserMedia ||
      navigator.mozGetUserMedia ||
      navigator.msGetUserMedia;
  },
  async mounted() {
    if (!this.loaded) {
      try {
        await this.loadFaceDetectModels();

        this.loadingText = "Loading data...";
        this.$store.commit("faceModule/loading");

        console.time("loading data");
        await this.getAll();
        await this.getFaceMatcher();
        console.timeEnd("loading data");
      } catch (error) {
        this.$store.commit("faceModule/loading", false);
        this.alertDetection = {
          show: true,
          type: "error",
          text: "Terjadi masalah saat meload data",
        };
      }

      this.$store.commit("faceModule/loading", false);
    }

    this.startCamera();
    this.checkPermission();
    this.$refs.video.onplaying = this.startDetection;
  },
  beforeDestroy() {
    if (!this.error) this.stop();
    clearInterval(this.detectionInterval);
  },
  computed: {
    ...mapState({
      showLoading: (state) => state.faceModule.loading,
      loaded: (state) => state.faceModule.load,
    }),
    videoSize() {
      switch (this.$vuetify.breakpoint.name) {
        case "xs":
          return "400px";
        default:
          return "450px";
      }
    },
  },
  methods: {
    ...mapActions("faceModule", {
      loadFaceDetectModels: "load",
      getAll: "getAll",
      getFaceMatcher: "getFaceMatcher",
      getFaceDetections: "getFaceDetections",
      recognize: "recognize",
      createCanvas: "createCanvas",
      draw: "draw",
      fetchImage: "fetchImage",
    }),
    checkPermission() {
      navigator.permissions
        .query({ name: "camera" })
        .then((permissionObj) => {
          const self = this;
          permissionObj.onchange = function () {
            console.log(this.state);

            if (this.state == "denied") {
              self.error = true;
              return;
            }

            self.startCamera(this.state == "prompt");
            self.error = false;
          };
        })
        .catch((error) => {
          console.log("Got error :", error);
        });
    },
    startCamera(isPrompt = false) {
      navigator.mediaDevices
        .getUserMedia({
          audio: false,
          video: {
            width: {
              ideal: this.$refs.video.width,
            },
            height: {
              ideal: this.$refs.video.height,
            },
            facingMode: "user",
          },
        })
        .then((stream) => {
          this.error = false;
          if (!isPrompt) {
            this.$refs.video.srcObject = stream;
            this.$refs.video.play();

            this.stop = () => {
              stream.getVideoTracks().forEach((track) => {
                track.stop();
              });
            };
          }
        })
        .catch((err) => {
          this.error = true;
          this.alert =
            "Kamera telah di blok, silahkan aktifkan kamera secara manual!";
          this.btnErr = false;
          console.log(err);
        });
    },
    async startDetection() {
      const container = this.$refs.container;
      const video = this.$refs.video;

      const displaySize = {
        width: video.width,
        height: video.height,
      };

      const canvas = await this.createCanvas({ video, displaySize });
      canvas.style.position = "absolute";
      container.append(canvas);

      this.alertDetection.show = true;

      let totalDetection = 0;
      let currentDetection = null;

      this.detectionInterval = setInterval(async () => {
        const singleResult = await this.getFaceDetections({ video });

        canvas.getContext("2d").clearRect(0, 0, canvas.width, canvas.height);

        this.alertDetection.type = "warning";
        this.alertDetection.text = "Tidak ada wajah yang terdeteksi";

        if (!singleResult) return;

        const bestMatch = await this.recognize(singleResult.descriptor);

        this.draw({ singleResult, displaySize, bestMatch, canvas });

        if (bestMatch.label == "unknown") {
          this.alertDetection.text = "Wajah tidak terdaftar";
          return;
        }

        if (this.detect) {
          clearInterval(this.detectionInterval);
          return;
        }

        const user = this.$store.state.faceModule.faces[bestMatch.label];

        console.log(currentDetection, user._id);
        console.log(totalDetection);

        if (currentDetection == user._id) {
          totalDetection++;
        } else {
          totalDetection = 0;
        }

        currentDetection = user._id;

        this.alertDetection.text = "Sedang mengenali wajah...";

        if (totalDetection < 5) return;

        this.alertDetection.type = "success";
        this.alertDetection.text = `Wajah berhasil dideteksi. <br/> Anda berhasil login sebagai ${user.nama}`;

        this.$store.commit("userModule/setData", user);
        this.$emit("setLoading", true);
        this.detect = true;

        setTimeout(() => {
          this.$store.commit("userModule/isLogin", true);
          this.$router.push(user.role);
        }, 2000);
      }, 800);
    },
    back() {
      this.$emit("setShow", true);
    },
  },
};
</script>

<style lang="scss" scoped>
video {
  width: 100%;
  min-width: 300px;
  background-color: rgb(131, 128, 128);
}
</style>