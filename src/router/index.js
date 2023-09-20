import Vue from 'vue'
import VueRouter from 'vue-router'
// import { store } from '../store'
import errorPage from '../views/errorPage.vue'
Vue.use(VueRouter)

const routes = [
  {
    path: '/:id(\\d{0,3})', //uses Path-to-RegExp (https://github.com/pillarjs/path-to-regexp/tree/v1.7.0)
    name: 'JudgeIntro',
    component: () =>  import(/* webpackChunkName: "MileSign" */ "../views/judgeIntro.vue"),
    props: true
  },
  {
    path: '/map',
    name: 'MapHome',
    component: () =>  import(/* webpackChunkName: "Map" */ "../views/mapHome.vue"),
    props:true,
    meta:{requiresAuth: true}
  },
  {
    path:'/index#',
    redirect: {name: '/login'}
  },
  {
    path:'/login',
    name:'Login',
    component: () =>  import(/* webpackChunkName: "Login" */ "../views/Login.vue"),
    props:true,
  },
  {
    path:'/load',
    name:'Loading',
    component: () =>  import(/* webpackChunkName: "Load" */ "../views/loadingPage.vue"),
    props:true,
  },
  {
    path:'/pickCounty',
    name:'PickCounty',
    component: () =>  import(/* webpackChunkName: "PickCounty" */ "../views/pickCounty.vue"),
    props:true
  },
  {
    path:'/EOY',
    name:'EOY',
    component: () =>  import(/* webpackChunkName: "PickCounty" */ "../views/eoyCertifyPage.vue"),
    props:true
  },
  {
    path: "/catchAll(.*)",
    name: "error",
    component: errorPage
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router


