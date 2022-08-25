import Vue from 'vue'
import App from './App.vue'
import '@arcgis/core/assets/esri/themes/light/main.css';
//import esriId from "@arcgis/core/identity/IdentityManager";
import vuetify from './plugins/vuetify'
import router from './router'
import {store} from './store'
Vue.config.productionTip = false

new Vue({
  vuetify,
  router,
  store,
  render: h => h(App),
  // mounted(){
    
  // },
  created(){
    // esriId.setOAuthRedirectionHandler(function(info){
    //   console.log(info)
    //   if(info.oAuthInfo.userId){
    //     return router.push('/load')
    //   }
    //   return router.push('/login')
    // })


    if(performance.navigation.type === 1){
      this.$router.push('/login')
      //this.$router.push('/login')
    }
  }
}).$mount('#app')