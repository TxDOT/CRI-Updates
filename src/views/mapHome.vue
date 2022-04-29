<template>
<!-- <Map/> -->
  <div class="MapHome">
    <mapHeader/>
    <Map/>
    <mapFooter/>
  </div>
</template>

<script>
import Map from '../components/Map/Map.vue'
import mapHeader from '../components/Map/mapHeader.vue'
import mapFooter from '../components/Map/mapFooter.vue'
//import {countyInfo} from '../components/Map/editFunc'
import {roadInfo} from '../store'
export default {
    name: 'MapHome',
    components: {Map, mapHeader, mapFooter},
    props:["id"],
    methods:{
      expand(){
        if (document.getElementById("step").style.width==='0px'){
          document.getElementById("step").style.width='450px'
        }
        else{
          document.getElementById("step").style.width='0px'
        }
      },
    },
    mounted(){
      roadInfo
    }
}
</script>

<style scoped>
#viewDiv {
    position: absolute;
    top: 4.9%;
    right: 0;
    height: 90%;
    width: 100%;
    }
</style>