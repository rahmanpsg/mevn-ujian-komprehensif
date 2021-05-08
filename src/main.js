import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import vuetify from './plugins/vuetify'
import vueaxios from './plugins/axios'

Vue.config.productionTip = false

new Vue({
  router,
  store,
  vuetify,
  vueaxios,
  render: function (h) { return h(App) }
}).$mount('#app')
