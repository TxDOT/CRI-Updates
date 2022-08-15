import Vue from 'vue'
import VueRouter from 'vue-router'
//import { store } from '../store'
// import { store } from '../store'
import errorPage from '../views/errorPage.vue'
//import { store } from '../store'
Vue.use(VueRouter)

const routes = [
  {
    path: '/:id(\\d{0,3})', //uses Path-to-RegExp (https://github.com/pillarjs/path-to-regexp/tree/v1.7.0)
    name: 'MileSign',
    component: () =>  import(/* webpackChunkName: "MileSign" */ "../views/mileSign.vue"),
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
    path: "/catchAll(.*)",
    component: errorPage
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

// router.beforeEach((to, from, next)=>{
//   if(to.meta.requiresAuth){
//     console.log(store.getters.username)
//     if(!store.username){
//       next({
//         name: "Login"
//       })
//     }
//     else{
//       next({
//         name: "MapHome"
//       })
//     }
//   }
//   else{
//     next()
//   }

// })

export default router


