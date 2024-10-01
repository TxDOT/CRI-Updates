<template>
  <v-app>
    <div id="app">
      <router-view/>
    </div>
  </v-app>
</template>

<script>
import {countyInfo} from './components/Map/login'
///Needs to wait for URL query to complete before initiaiting.
export default {
    name: 'App',
    async mounted (){
      countyInfo().then((result) =>{
        if(result.response === true){
          this.$router.push({name:'JudgeIntro', params:{id: result.nbr}})
          return;
        }
        this.$router.push({name:'Login'})
      })
    },
}
</script>

<style>
/* @import './components/Map/css/main.css'; */

#app {
  font-family: Roboto, Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

/* #nav {
  padding: 30px;

  a {
    font-weight: bold;
    color: #2c3e50;

    &.router-link-exact-active {
      color: #42b983;
    }
  }
} */

.esri-view .esri-view-surface--inset-outline:focus::after{
  outline: none !important;
}
.v-text-field--outlined.v-input--dense .v-label{
  font-size: 14px !important;
}

.esri-basemap-toggle__container{
  height: 30.5px !important;
  width: 32px !important;
}
</style>
