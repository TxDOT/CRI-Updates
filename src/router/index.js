import Vue from 'vue'
import VueRouter from 'vue-router'
import MapHome from '../views/mapHome.vue'
import errorPage from '../views/errorPage.vue'
import MileSign from '../views/mileSign.vue'
import Login from '../views/Login.vue'
Vue.use(VueRouter)

const routes = [
  {
    path: '/:id(\\d{0,3})', //uses Path-to-RegExp (https://github.com/pillarjs/path-to-regexp/tree/v1.7.0)
    name: 'MileSign',
    component: MileSign,
    props: true
  },
  {
    path: '/map',
    name: 'MapHome',
    component: MapHome,
    props:true

  },
  {
    path:'/login',
    name:'Login',
    component: Login,
    props:true
  },
  {
    path: "/catchAll(.*)",
    component: errorPage
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router


