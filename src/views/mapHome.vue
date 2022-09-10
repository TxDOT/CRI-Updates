<template>
<!-- <Map/> -->
  <div class="MapHome">
    <mapHeader/>
    <Map/>
    <mapFooter/>
    <navSideBar/>
    <stepper v-if="display === true"/>
    <editExistingRd/>
    <denyClickFeat v-if="denyClick === true"/>
    <v-progress-circular indeterminate color="primary" style="top:400px;" v-if="loading===true"></v-progress-circular>
    <dfoBox v-if="isDfoRead===true"/>
    <about v-if="aboutClick === true"/>
    <Legend/>
  </div>
</template>

<script>
import Map from '../components/Map/Map.vue'
import mapHeader from '../components/Map/mapHeader.vue'
import mapFooter from '../components/Map/mapFooter.vue'
import navSideBar from '../components/navigationSideBar.vue'
import stepper from '../components/stepperQuestion.vue'
import editExistingRd from "../components/Map/editExistingRd.vue"
import denyClickFeat from '../components/Map/clickOnFeatureAlert.vue'
import dfoBox from '../components/Map/stepperContent/dfoBoxMap.vue'
import about from '../components/Map/aboutApp.vue'
import Legend from '../components/Map/mapLegend.vue'
import {hightlightFeat} from '../components/Map/editFunc'
//import esriId from "@arcgis/core/identity/IdentityManager";

export default {
    components: {Map, mapHeader, mapFooter,navSideBar, stepper, editExistingRd, denyClickFeat, dfoBox, about, Legend},
    props:["id"],
    name: 'MapHome',
    data(){
      return{
        display:true,
        edit: false,
        denyClick: false,
        loading: false,
        success: true,
        isDfoRead: false,
      }
    },
    beforeRouteLeave(to, from, next){
      to, from
      if(this.setLogOut){
        next()
        return;
      }
      
      next(false)
    },
    mounted(){
      hightlightFeat('pointer-move')
    },
    watch:{
      denyFeature:{
        handler: function(){
          this.denyClick = this.denyFeature
        },
        immediate: true,
      },
      editStatus:{
        handler: function(){
          this.edit = this.editStatus
        },
        immediate: true,
      },
      receiveLoadStatus:{
        handler: function(){
          this.loading = this.receiveLoadStatus
        },
        immediate: true,
      },
      getDfoBool:{
        handler: function(){
          this.isDfoRead = this.getDfoBool
        },
        immediate: true,
      },
    },
    computed:{
      getDfoBool:{
        get(){
          return this.$store.state.isDfoReturn
        },
        set(bool){
          this.$store.commit('setIsDfoReturn', bool)
        }
      },
      deleteClick:{
        get(){
          return this.$store.state.deleteGraphClick
        },
        set(x){
          this.$store.commit('setdeleteGraphClick', x)
        }
      },
      editStatus:{
        get(){
          return this.$store.state.editExisting
        },
      },
      denyFeature:{
        get(){
          return this.$store.state.denyFeatClick
        },
        set(deny){
          this.$store.commit('setdenyFeatClick', deny)
        }
      },
      receiveLoadStatus:{
        get(){
          return this.$store.state.activeLoader
        },
        set(load){
          this.$store.commit('setActiveLoader', load)
        }
      },
      steppClose:{
        get(){
          return this.$store.state.stepperClose
        },
        set(open){
          this.$store.commit('setStepperClose', open)
        }
      },
      setLogOut:{
        get(){
          return this.$store.state.isLoggedOut
        },
        set(bool){
          this.$store.commit('setIsLoggedOut', bool)
        }
      },
      aboutClick:{
        get(){
          return this.$store.state.isAbout
        },
        set(bool){
          this.$store.commit('setIsAbout', bool)
        }
      }
    }
}
</script>

<style scoped>
#viewDiv {
  position: absolute;
  top: 6%;
  /* right: 0%; */
  left:10%;
  height: 94%;
  width: 90%;
}
#dfoBox{
  position: absolute;
  bottom: 10%;
  left: 25%;
  z-index: 3;
  height: 15px;
}
/* .MapHome{
  width:100%;
  height:100%;
  background-color:rgba(0,0,0,0.65);
} */
</style>