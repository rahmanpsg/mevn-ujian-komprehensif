import Vue from 'vue'
import VueRouter from 'vue-router'
import store from '@/store'

Vue.use(VueRouter)

const isLogin = (to, from, next) => {
  const { login, role } = store.state.userModule

  if (to.name == 'Login') {
    if (login)
      next(role)
  } else {
    if (!login)
      next('/')

    if (to.name.toLowerCase() != role) {
      next(role)
    }
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
      }, {
        path: 'hasil',
        name: 'adminHasil',
        component: () => import("../views/admin/hasil.vue")
      }
    ]
  }, {
    path: '/penguji',
    component: () => import('../views/penguji/index.vue'),
    beforeEnter: isLogin,
    children: [
      {
        path: '/',
        name: 'penguji',
        component: () => import('../views/penguji/hasil.vue')
      }, {
        path: 'soal',
        name: 'pengujiSoal',
        component: () => import('../views/penguji/soal.vue')
      }
    ]
  }, {
    path: '/mahasiswa',
    name: 'mahasiswa',
    component: () => import('../views/mahasiswa/index.vue'),
    beforeEnter: isLogin
  }, {
    path: '/:locale/*',
    beforeEnter(to) {
      window.location = `/`
    }
  }
]


const router = new VueRouter({
  // mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
