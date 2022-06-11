<template>
<!-- <Map/> -->
  <div class="MapHome">
    <mapHeader/>
    <Map/>
    <mapFooter/>
    <navSideBar/>
    <stepper v-if="display === true"/>
    <editExistingRd/>
    <!-- <denyClickFeat/> -->
  </div>
</template>

<script>
import Map from '../components/Map/Map.vue'
import mapHeader from '../components/Map/mapHeader.vue'
import mapFooter from '../components/Map/mapFooter.vue'
import navSideBar from '../components/navigationSideBar.vue'
import stepper from '../components/stepperQuestion.vue'
import editExistingRd from "../components/Map/editExistingRd.vue"
//import denyClickFeat from '../components/Map/clickOnFeature.vue'
//import {countyInfo} from '../components/Map/editFunc'
export default {
    components: {Map, mapHeader, mapFooter,navSideBar, stepper, editExistingRd},
    props:["id"],
    name: 'MapHome',
    data(){
      return{
        display:true,
        edit: false
      }
    },
    watch:{
      editStatus:{
        handler: function(){
          this.edit = this.editStatus
        },
        immediate: true,
      }
    },
    computed:{
      editStatus:{
        get(){
          return this.$store.state.editExisting
        },
      }
    }
}
</script>

<style scoped>
#viewDiv {
  position: absolute;
  top: 6%;
  right: 0%;
  height: 94%;
  width: 100%;
}
</style>