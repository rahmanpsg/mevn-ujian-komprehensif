import axios from 'axios'

export default {
    namespaced: true,
    state: () => ({
        mulai: false,
        waktuMulai: null,
        jawabans: { 1: '' },
        jawaban: '',
        soals: [],
        soalActive: 1
    }),
    getters: {
        getSoal: state => state.soals[state.soalActive - 1],
        getJawaban: state => state.jawabans[state.soalActive]
    },
    mutations: {
        setSoals: (state, soal) => {
            state.soals = soal
        },
        setJawabans: (state, jawaban) => {
            state.jawabans = { ...state.jawabans, [state.soalActive]: jawaban }
        },
        setMulai: (state) => {
            state.mulai = true
            state.waktuMulai = new Date().getTime()
        },
        setSelesai: state => {
            state.mulai = false
            state.waktuMulai = null
            state.jawabans = { 1: '' }
            state.jawaban = ''
            state.soals = []
            state.soalActive = 1
        },
        setSoalActive: (state, nomor) => {
            state.soalActive = nomor
            state.jawabans[nomor] = state.jawabans[nomor] || ''
        }
    },
    actions: {
        async getDataUjian({ rootState }) {
            try {
                const res = await axios.get(`hasil/cek/${rootState.userModule.id}`)
                return res.data
            } catch (error) {
                return error.response
            }
        },
        async getAll({ commit, rootState }) {
            try {
                const res = await axios.get(`soal/mahasiswa/${rootState.userModule.penguji}`)
                commit('setSoals', res.data)
                return res
            } catch (error) {
                return error.response
            }
        },
        async sendHasil({ commit, state, rootState }) {
            try {
                const data = {
                    mahasiswa: rootState.userModule.id,
                    penguji: rootState.userModule.penguji,
                    jawaban: state.jawabans,
                    waktuMulai: state.waktuMulai,
                    waktuSelesai: new Date().getTime()
                }

                const res = await axios.post(`hasil`, data)

                if (res.status == 200)
                    commit('setSelesai')

                return res
            } catch (error) {
                return error.response
            }
        }
    }
}