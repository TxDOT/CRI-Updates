<template>
  <v-app>
    <div id="app">
      <router-view/>
    </div>
  </v-app>
</template>

<script>
import {countyInfo} from './components/Map/editFunc'
//import Login from './views/Login.vue'
// import {roadInfo} from './store.js'
export default {
    name: 'App',
    //components: {Login},
    //props: [roadInfo],
    mounted(){
      //this.$router.push('/login')
      countyInfo().then(result => {result.response === true ? this.$router.push({ name: 'MileSign', params: { id: result.nbr}}) : this.$router.push('/catchAll(.*)')})
      //roadInfo();
    }
}
</script>

<style lang="scss">
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
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
</style>
