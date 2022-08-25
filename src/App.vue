<template>
  <v-app>
    <div id="app">
      <router-view/>
    </div>
  </v-app>
</template>

<script>
import {countyInfo} from './components/Map/editFunc'

export default {
    name: 'App',

    mounted(){
      countyInfo().then((result) =>{
        if(result.response === true){
          this.$router.push({name:'MileSign', params:{id: result.nbr}})
          return;
        }
        this.$router.push({name:'Login'})
      })
    }
}
</script>

<style lang="scss">
#app {
  font-family: Roboto, Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;

}

#nav {
  padding: 30px;

  a {
    font-weight: bold;
    color: #2c3e50;

    &.router-link-exact-active {
      color: #42b983;
    }
  }
}

.esri-view .esri-view-surface--inset-outline:focus::after{
  outline: none !important;
}
</style>
