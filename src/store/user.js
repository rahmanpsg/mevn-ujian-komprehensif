import axios from 'axios'

export default {
    namespaced: true,
    state: () => ({
        id: '',
        login: false,
        username: '',
        nama: '',
        nim: '', //optional jika mahasiswa
        nbm: '', //optional jika penguji
        penguji: '', //optional jika mahasiswa
        image: '',
        role: ''
    }),
    mutations: {
        isLogin: (state, login) => {
            state.login = login
        },
        setData: (state, data) => {
            state.id = data._id
            state.username = data.username
            state.nama = data.nama
            state.nim = data.nim
            state.nbm = data.nbm
            state.penguji = data.penguji
            state.role = data.role
            if (data.role == 'admin') return
            state.image = data.image || data.images[0]
        }
    },
    actions: {
        async login({ commit, state }, { username, password }) {
            try {
                const res = await axios.post('login', { username, password })
                return res
            } catch (error) {
                return error.response
            }
        },
        logout({ commit }) {
            commit("isLogin", false);
            this.$router.push("/");
            localStorage.clear();
        }
    }
}