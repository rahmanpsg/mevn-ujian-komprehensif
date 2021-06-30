import axios from 'axios'

export default {
    namespaced: true,
    state: () => ({
        matakuliahs: []
    }),
    mutations: {
        setMatakuliahs(state, matakuliahs) {
            state.matakuliahs = matakuliahs
        }
    },
    actions: {
        async getAll({ commit }) {
            try {
                const { data } = await axios.get('matakuliah')
                commit('setMatakuliahs', data)
            } catch (error) {
                console.log(error);
                return error.response
            }
        },
        async addMatakuliah({ commit, state, rootState }, matakuliah) {
            try {
                const res = await axios.post('matakuliah', matakuliah)

                if (res.status == 200)
                    commit('setMatakuliahs', [...state.matakuliahs, Object.assign({ _id: res.data.id }, matakuliah)])

                return res
            } catch (error) {
                return error.response
            }
        },
        async editMatakuliah({ commit, state }, { index, matakuliah }) {
            try {
                const res = await axios.put('matakuliah', matakuliah)

                if (res.status == 200)
                    Object.assign(state.matakuliahs[index], matakuliah);
                return res
            } catch (error) {
                return error.response
            }
        },
        async deleteMatakuliah({ commit, state }, { index, id }) {
            try {
                const res = await axios.delete(`matakuliah/${id}`)

                if (res.status == 200)
                    state.matakuliahs.splice(index, 1);

                return res
            } catch (error) {
                return error.response
            }
        }
    }
}