<template>
<!-- <Map/> -->
  <div class="MapHome">
    <mapHeader/>
    <Map/>
    <mapFooter/>
    <navSideBar/>
    <stepper v-if="display === true"/>
  </div>
</template>

<script>
import Map from '../components/Map/Map.vue'
import mapHeader from '../components/Map/mapHeader.vue'
import mapFooter from '../components/Map/mapFooter.vue'
import navSideBar from '../components/navigationSideBar.vue'
import stepper from '../components/stepperQuestion.vue'
//import {countyInfo} from '../components/Map/editFunc'
export default {
    name: 'MapHome',
    data(){
      return{
        display:true
      }
    },
    components: {Map, mapHeader, mapFooter,navSideBar, stepper},
    props:["id"],
}
</script>

<style scoped>
#viewDiv {
    position: absolute;
    top: 0%;
    right: 0%;
    height: 100%;
    width: 100%;
    }
</style>