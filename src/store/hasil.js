import axios from 'axios'

export default {
    namespaced: true,
    state: () => ({
        mahasiswas: [],
    }),
    mutations: {
        setMahasiswas(state, mahasiswas) {
            state.mahasiswas = mahasiswas
        },
    },
    actions: {
        async getAll({ commit, rootState }) {
            try {
                const { data } = await axios.get(`hasil`)
                commit('setMahasiswas', data)
            } catch (error) {
                return error.response
            }
        },
        async getAllByPenguji({ commit, rootState }) {
            try {
                const { data } = await axios.get(`hasil/${rootState.userModule.id}`)
                commit('setMahasiswas', data)
            } catch (error) {
                return error.response
            }
        },
    }
}