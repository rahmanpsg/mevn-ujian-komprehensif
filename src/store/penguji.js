import axios from 'axios'

export default {
    namespaced: true,
    state: () => ({
        pengujis: []
    }),
    mutations: {
        setPengujis(state, pengujis) {
            state.pengujis = pengujis
        }
    },
    actions: {
        async getAll({ commit }) {
            try {
                const { data } = await axios.get('penguji')
                commit('setPengujis', data)
            } catch (error) {
                return error.response
            }
        },
        async addPenguji({ commit, state }, penguji) {
            try {
                const res = await axios.post('penguji', penguji)

                if (res.status == 200)
                    commit('setPengujis', [...state.pengujis, Object.assign({ _id: res.data.id }, penguji)])

                return res
            } catch (error) {
                return error.response
            }
        },
        async editPenguji({ commit, state }, { index, penguji }) {
            try {
                const res = await axios.put('penguji', penguji)

                if (res.status == 200)
                    Object.assign(state.pengujis[index], penguji);
                return res
            } catch (error) {
                return error.response
            }
        },
        async deletePenguji({ commit, state }, { index, id }) {
            try {
                const res = await axios.delete(`penguji/${id}`)

                if (res.status == 200)
                    state.pengujis.splice(index, 1);

                return res
            } catch (error) {
                return error.response
            }
        }
    }
}