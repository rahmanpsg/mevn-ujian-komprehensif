import axios from 'axios'

export default {
    namespaced: true,
    state: () => ({
        soals: []
    }),
    mutations: {
        setSoals(state, soals) {
            state.soals = soals
        }
    },
    actions: {
        async getAll({ commit }) {
            try {
                const { data } = await axios.get('soal')
                commit('setSoals', data)
            } catch (error) {
                return error.response
            }
        },
        async getAllByPenguji({ commit, rootState }) {
            try {
                const { data } = await axios.get(`soal/${rootState.userModule.id}`)
                commit('setSoals', data)
            } catch (error) {
                return error.response
            }
        },
        async addSoal({ commit, state, rootState }, soal) {
            try {
                if (rootState.userModule.role == 'penguji') {
                    soal = { ...soal, penguji: rootState.userModule.id }
                }

                const res = await axios.post('soal', soal)

                if (res.status == 200)
                    commit('setSoals', [...state.soals, Object.assign({ _id: res.data.id }, soal)])

                return res
            } catch (error) {
                return error.response
            }
        },
        async editSoal({ commit, state }, { index, soal }) {
            try {
                const res = await axios.put('soal', soal)

                if (res.status == 200)
                    Object.assign(state.soals[index], soal);
                return res
            } catch (error) {
                return error.response
            }
        },
        async deleteSoal({ commit, state }, { index, id }) {
            try {
                const res = await axios.delete(`soal/${id}`)

                if (res.status == 200)
                    state.soals.splice(index, 1);

                return res
            } catch (error) {
                return error.response
            }
        }
    }
}