import Vue from 'vue'
import axios from 'axios'
import VueAxios from 'vue-axios'

// axios.defaults.baseURL = `http://localhost:5000/`

Vue.use(VueAxios, axios)

export default new VueAxios()