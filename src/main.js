import Vue from 'vue'
import App from './App.vue'
import '@arcgis/core/assets/esri/themes/light/main.css';
import './components/Map/css/main.css';
import vuetify from './plugins/vuetify'
import router from './router'
import {store} from './store'
Vue.config.productionTip = false

new Vue({
  vuetify,
  router,
  store,
  render: h => h(App),
  created(){

    // if(performance.navigation.type === 1){
    //   this.$router.push('/login')
    // }
  }
}).$mount('#app')