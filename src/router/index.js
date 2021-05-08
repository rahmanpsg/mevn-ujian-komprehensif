import Vue from 'vue'
import VueRouter from 'vue-router'
import store from '@/store'

Vue.use(VueRouter)

const isLogin = (to, from, next) => {
  if (to.name == 'Login') {
    if (store.state.userModule.login)
      next('home')
  } else {
    if (!store.state.userModule.login)
      next('/')
  }

  next()
}

const routes = [
  {
    path: '/',
    name: 'Login',
    component: () => import('../views/Login.vue'),
    beforeEnter: isLogin
  }, {
    path: '/home',
    name: 'Home',
    component: () => import('../views/Home.vue'),
    beforeEnter: isLogin
  }, {
    path: '/admin',
    component: () => import('../views/admin/index.vue'),
    beforeEnter: isLogin,
    children: [
      {
        path: '',
        name: 'Admin',
        component: () => import('../views/dashboard.vue')
      }, {
        path: 'soal',
        name: 'adminSoal',
        component: () => import('../views/admin/soal.vue')
      }, {
        path: 'mahasiswa',
        name: 'adminMahasiswa',
        component: () => import("../views/admin/mahasiswa.vue")
      }, {
        path: 'penguji',
        name: 'adminPenguji',
        component: () => import("../views/admin/penguji.vue")
      }
    ]
  }, {
    path: '/penguji',
    component: () => import('../views/penguji/index.vue'),
    beforeEnter: isLogin,
    children: [
      {
        path: '',
        name: 'Penguji',
        component: () => import('../views/dashboard.vue')
      }, {
        path: 'soal',
        name: 'pengujiSoal',
        component: () => import('../views/penguji/soal.vue')
      }, {
        path: 'hasil',
        name: 'pengujiHasil',
        component: () => import('../views/penguji/hasil.vue')
      }
    ]
  }
]


const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
