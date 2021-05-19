import * as faceapi from 'face-api.js'
import axios from 'axios'

export default {
    namespaced: true,
    state: () => ({
        faces: [],
        loading: false,
        load: false,
        faceMatcher: null,
        options: new faceapi.SsdMobilenetv1Options({
            minConfidence: 0.8,
            // maxResults: 100,
        })
        // options: new faceapi.TinyFaceDetectorOptions({
        //     inputSize: 160,
        //     scoreThreshold: 0.5
        // })
    }),

    mutations: {
        loading(state, loading = true) {
            state.loading = loading
        },

        load(state) {
            state.loading = false
            state.load = true
        },

        setFaces(state, faces) {
            state.faces = faces
        },

        setFaceMatcher(state, matcher) {
            state.faceMatcher = matcher
        }
    },

    actions: {
        async load({ commit, state }) {
            const MODEL_URL = './models'
            if (!state.loading && !state.load) {
                commit('loading')
                return Promise.all([
                    faceapi.loadSsdMobilenetv1Model(MODEL_URL),
                    faceapi.loadFaceRecognitionModel(MODEL_URL),
                    faceapi.loadFaceLandmarkModel(MODEL_URL),
                    // faceapi.loadTinyFaceDetectorModel(MODEL_URL),
                    // faceapi.nets.faceLandmark68TinyNet.loadFromUri(MODEL_URL),
                ])
                    .then(() => {
                        commit('load')
                    })
            }
        },
        async getAll({ commit, rootState }) {
            const { data } = await axios.get('face')
            commit('setFaces', data)
        },
        async save({ commit, rootState }, faces) {
            const { data } = await axios.post('face', { faces })
            commit('setFaces', data)
        },
        async getFaceMatcher({ commit, state }) {
            const labeledDescriptors = await Promise.all(
                state.faces.map(async (face, index) => {
                    const images = face.images

                    const descriptions = await Promise.all(images.map(async image => {
                        const img = await faceapi.fetchImage(image)
                        const detections = await faceapi.detectSingleFace(img, state.options).withFaceLandmarks().withFaceDescriptor()

                        return detections.descriptor
                    }))

                    // const descriptions = face.descriptions.map((desc) => {
                    //     const descArray = []
                    //     for (const i in desc) {
                    //         descArray.push(parseFloat(desc[i]))
                    //     }
                    //     return new Float32Array(descArray)
                    // })

                    return new faceapi.LabeledFaceDescriptors(`${index}`, descriptions)
                })
            );

            const matcher = new faceapi.FaceMatcher(labeledDescriptors)
            commit('setFaceMatcher', matcher)
            return matcher
        },
        async getFaceDetections({ commit, state }, { video }) {
            const detections = await faceapi
                .detectSingleFace(video, state.options)
                .withFaceLandmarks()
                .withFaceDescriptor();

            return detections
        },
        async recognize({ commit, state }, descriptor) {
            const bestMatch = await state.faceMatcher.findBestMatch(descriptor)
            return bestMatch
        },

        draw({ commit, state }, { singleResult, displaySize, bestMatch, canvas }) {
            const resizedDetection = faceapi.resizeResults(
                singleResult,
                displaySize
            );
            const box = resizedDetection.detection.box;
            let boxColor = 'rgba(12, 237, 94)'

            if (bestMatch.label == 'unknown') {
                boxColor = 'rgba(255, 192, 18)'
            }

            const drawBox = new faceapi.draw.DrawBox(box, {
                boxColor,
                lineWidth: 5
            });

            drawBox.draw(canvas);
        },
        async createCanvas({ commit, state }, { video, displaySize }) {
            const canvas = await faceapi.createCanvasFromMedia(video)

            faceapi.matchDimensions(canvas, displaySize);

            return canvas
        }
    }
}