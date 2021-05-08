import Vue from 'vue'
import Vuex from 'vuex'
import createPersistedState from "vuex-persistedstate";
import SecureLS from "secure-ls";
const ls = new SecureLS({ isCompression: false });

import userModule from './user'
import faceModule from './face'
import soalModule from './soal'
import mahasiswaModule from './mahasiswa'
import pengujiModule from './penguji'

Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    userModule,
    faceModule,
    soalModule,
    mahasiswaModule,
    pengujiModule
  },
  plugins: [createPersistedState({
    paths: ['userModule'],
    storage: {
      getItem: key => ls.get(key),
      setItem: (key, value) => ls.set(key, value),
      removeItem: key => ls.remove(key)
    }
  })],
})
