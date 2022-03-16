<template>
  <div class="MapHome">
    <Map/>
  </div>
</template>

<script>
import Map from '../components/Map/Map.vue'
//import {countyInfo} from '../components/Map/editFunc'
import {roadInfo} from '../store'
export default {
    name: 'MapHome',
    components: {Map},
    props:["id"],
    mounted(){
      roadInfo
    }
}
</script>