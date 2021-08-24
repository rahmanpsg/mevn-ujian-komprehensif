import * as faceapi from "face-api.js";
import axios from "axios";

export default {
  namespaced: true,
  state: () => ({
    faces: [],
    loading: false,
    load: false,
    faceMatcher: null,
    model: "ssd", //ssd || tiny
  }),
  getters: {
    options: (state) =>
      state.model == "ssd"
        ? new faceapi.SsdMobilenetv1Options({
            minConfidence: 0.8,
            maxResults: 10,
          })
        : new faceapi.TinyFaceDetectorOptions({
            inputSize: 416,
            scoreThreshold: 0.5,
          }),
  },

  mutations: {
    loading(state, loading = true) {
      state.loading = loading;
    },

    load(state) {
      state.loading = false;
      state.load = true;
    },

    setFaces(state, faces) {
      state.faces = faces;
    },

    setFaceMatcher(state, matcher) {
      state.faceMatcher = matcher;
    },
  },

  actions: {
    async load({ commit, state }) {
      const MODEL_URL = "./models";
      if (!state.loading && !state.load) {
        commit("loading");

        const model =
          state.model == "ssd"
            ? [
                faceapi.loadSsdMobilenetv1Model(MODEL_URL),
                faceapi.loadFaceLandmarkModel(MODEL_URL),
                faceapi.loadFaceRecognitionModel(MODEL_URL),
              ]
            : [
                faceapi.loadTinyFaceDetectorModel(MODEL_URL),
                faceapi.nets.faceLandmark68TinyNet.loadFromUri(MODEL_URL),
                faceapi.loadFaceRecognitionModel(MODEL_URL),
              ];

        return Promise.all(model).then(() => {
          commit("load");
        });
      }
    },
    async getAll({ commit, rootState }) {
      const { data } = await axios.get("face");
      commit("setFaces", data);
    },
    async save({ commit, rootState }, faces) {
      const { data } = await axios.post("face", { faces });
      commit("setFaces", data);
    },
    async getFaceMatcher({ commit, state, getters }) {
      try {
        const labeledDescriptors = await Promise.all(
          state.faces.flatMap(async (face, index) => {
            const images = face.images;

            const descriptions = await Promise.all(
              images.map(async (image) => {
                const img = await faceapi.fetchImage(image);
                const detections = await faceapi
                  .detectSingleFace(img, getters.options)
                  .withFaceLandmarks(state.model == "tiny")
                  .withFaceDescriptor();

                return detections ? detections.descriptor : null;
              })
            );

            // const descriptions = face.descriptions.map((desc) => {
            //     const descArray = []
            //     for (const i in desc) {
            //         descArray.push(parseFloat(desc[i]))
            //     }
            //     return new Float32Array(descArray)
            // })

            const descriptionsFilter = descriptions.filter((v) => v);

            if (!descriptionsFilter.length) return;

            return new faceapi.LabeledFaceDescriptors(
              `${index}`,
              descriptionsFilter
            );
          })
        );

        const labeledDescriptorsFilter = labeledDescriptors.filter((v) => v);

        console.log(labeledDescriptorsFilter);

        const matcher = new faceapi.FaceMatcher(labeledDescriptorsFilter, 0.5);
        commit("setFaceMatcher", matcher);
      } catch (error) {
        console.log(error);
      }
    },
    async getFaceDetections({ state, getters }, { video }) {
      const detections = await faceapi
        .detectSingleFace(video, getters.options)
        .withFaceLandmarks(state.model == "tiny")
        .withFaceDescriptor();

      return detections;
    },
    async recognize({ commit, state }, descriptor) {
      const bestMatch = await state.faceMatcher.findBestMatch(descriptor);
      return bestMatch;
    },

    draw({ commit, state }, { singleResult, displaySize, bestMatch, canvas }) {
      const resizedDetection = faceapi.resizeResults(singleResult, displaySize);
      const box = resizedDetection.detection.box;
      let boxColor = "rgba(12, 237, 94)";

      if (bestMatch.label == "unknown") {
        boxColor = "rgba(255, 192, 18)";
      }

      const drawBox = new faceapi.draw.DrawBox(box, {
        boxColor,
        lineWidth: 5,
      });

      drawBox.draw(canvas);
    },
    async createCanvas({ commit, state }, { video, displaySize }) {
      const canvas = await faceapi.createCanvasFromMedia(video);

      faceapi.matchDimensions(canvas, displaySize);

      return canvas;
    },
  },
};
