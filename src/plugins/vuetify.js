import Vue from 'vue'
import Vuetify from 'vuetify'
import 'vuetify/dist/vuetify.min.css'
import '@mdi/font/css/materialdesignicons.css'

Vue.use(Vuetify)

const opts = {}

export default new Vuetify({
    opts,
    icons: {
        iconfont: 'mdi', // default - only for display purposes
      },
    breakpoint:{
      name:{
        xs: 0,
        sm:600,
        md:960,
        lg:1264,
        xl:1904
      }
    }
    })



    // thresholds:{
    //   xs: 0,
    //   sm:600,
    //   md:960,
    //   lg:1500,
    //   xl:1800
    // }