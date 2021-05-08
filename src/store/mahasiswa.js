import axios from 'axios'

export default {
    namespaced: true,
    state: () => ({
        mahasiswas: [],
        listPenguji: []
    }),
    mutations: {
        setMahasiswas(state, mahasiswas) {
            state.mahasiswas = mahasiswas
        },
        setListPenguji(state, listPenguji) {
            state.listPenguji = listPenguji
        }
    },
    actions: {
        async getAll({ commit }) {
            try {
                const { data } = await axios.get('mahasiswa')
                commit('setMahasiswas', data)
            } catch (error) {
                return error.response
            }
        },
        async getListPenguji({ commit }) {
            try {
                const { data } = await axios.get('penguji?select=nama')
                commit('setListPenguji', data)
            } catch (error) {
                return error.response
            }
        },
        async addMahasiswa({ commit, state }, mahasiswa) {
            try {
                const res = await axios.post('mahasiswa', mahasiswa)

                if (res.status == 200)
                    commit('setMahasiswas', [...state.mahasiswas, Object.assign({ _id: res.data.id }, mahasiswa)])

                return res
            } catch (error) {
                return error.response
            }
        },
        async editMahasiswa({ commit, state }, { index, mahasiswa }) {
            try {
                const res = await axios.put('mahasiswa', mahasiswa)

                if (res.status == 200)
                    Object.assign(state.mahasiswas[index], mahasiswa);
                return res
            } catch (error) {
                return error.response
            }
        },
        async deleteMahasiswa({ commit, state }, { index, id }) {
            try {
                const res = await axios.delete(`mahasiswa/${id}`)

                if (res.status == 200)
                    state.mahasiswas.splice(index, 1);

                return res
            } catch (error) {
                return error.response
            }
        }
    }
}