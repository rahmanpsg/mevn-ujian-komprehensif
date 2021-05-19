import Vue from 'vue'
import axios from 'axios'
import VueAxios from 'vue-axios'

// axios.defaults.baseURL = `https://192.168.43.78:8000/`

Vue.use(VueAxios, axios)

export default new VueAxios()