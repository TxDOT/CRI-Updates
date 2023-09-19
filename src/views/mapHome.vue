<!-- The Parent of the map ui (or the map ui warehouse).  All the components inside the template tags are children.  -->
<template>
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
    <Legend v-if="displayLegend === true"/>
    <geomCheck v-if="isGeomCheck === true"/>
    <!-- <isCertAdvanced v-if="returnMapAttr"/> -->
    <dragndrop/>
    <eoeWarning v-if="isEoEWarns === true"/>
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
import dfoBox from '../components/Map/dfoBoxMap.vue'
import about from '../components/Map/aboutApp.vue'
import Legend from '../components/Map/mapLegend.vue'
import geomCheck from '../components/Map/geomCheck.vue'
import dragndrop from '../components/Map/dragNDrop.vue'
import eoeWarning from '../components/Map/reminder.vue'
//import isCertAdvanced from '../components/Map/certAdvanced.vue'
import { highLightFeat } from '../components/Map/helper'
import { expandLegend, returnAlertInfo } from '../components/Map/map'

export default {
    components: {Map, mapHeader, mapFooter,navSideBar, stepper, editExistingRd, denyClickFeat, dfoBox, about, Legend, geomCheck, dragndrop, eoeWarning},
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
        isMapValues: false,
        displayLegend: false,
        isGeomCheck: true,
        isEoEWarns: false
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
    async mounted(){
      expandLegend.watch('expanded',(curr)=>{
          curr === false ? this.displayLegend = false : this.displayLegend = true
      });
      // basemapToggle.watch('activeBasemap',(curr)=>{
      //   curr.baseLayers.items[0].id === 'imagery' ? featLayer.renderer = criConstants.featLayerColorImagery : featLayer.renderer = criConstants.featLayerColorVector
      // });

      highLightFeat('pointer-move')
      
      const alertInfo = await returnAlertInfo()
      const dateEpoch = new Date().getTime()

      const returnItem = alertInfo.features.find(y => dateEpoch >= y.attributes.ALERT_DATE_BEGIN && dateEpoch <= y.attributes.ALERT_DATE_END)
      console.log(returnItem)
      this.isEoEWarn = returnItem ? true : false
    },
    watch:{
      isEoEWarn:{
        handler: function(){
         this.isEoEWarns = this.isEoEWarn
        },
        immediate: true
      },
      steppClose:{
        handler: function(){
          if(this.steppClose === true){
            this.displayLegend = true
            expandLegend.expanded = true
            return;
          }
          this.displayLegend = false
          expandLegend.expanded = false
          return;
        },
        immediate: true
      },
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
      returnFieldNames:{
        handler: function(){
          if(this.returnFieldNames.length){
            this.isMapValues = true
          }
        }
      }
    },
    computed:{
      isEoEWarn: {
        get(){
          console.log(this.$store.state.isEoEWarning)
          return this.$store.state.isEoEWarning
        },
        set(bool){
          this.$store.commit("setIsEoEWarning", bool)
        }
      },

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
      },
      returnFieldNames:{
        get(){ 
          return this.$store.state.uploadFields
        }
      },
      returnMapAttr:{
        get(){
          return this.$store.state.isMapAttr
        },
        set(bool){
          this.$store.commit('setIsMapAttr',bool)
        }
      },
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