import Vue from 'vue'
import App from './App.vue'
import '@arcgis/core/assets/esri/themes/light/main.css';

import vuetify from './plugins/vuetify'
import router from './router'
import {roadInfo} from './store'
Vue.config.productionTip = false

new Vue({
  vuetify,
  router,
  roadInfo,
  render: h => h(App)
}).$mount('#app')
