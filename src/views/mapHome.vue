<!-- The Parent of the map ui (or the map ui warehouse).  All the components inside the template tags are children.  -->
<template>
  <div>
    <mapHeader/>
    <Map/>
    <v-alert type="warning" v-if="overlay" tile style="position: relative; top: 3.7rem; width: fit-content; left: 50%;">Zoom in to add a road</v-alert>
    <mapFooter/>
    <navSideBar/>
    <stepper v-if="display === true"/>
    <editExistingRd/>
    <denyClickFeat v-if="denyClick === true"/>
    <v-progress-circular indeterminate color="primary" style="top:400px;" v-if="loading===true"></v-progress-circular>
    <dfoBox v-if="isDfoRead===true"/>
    <about v-if="aboutClick === true"/>
    <div id="legend-flex">
      <Legend v-if="this.isLegend === true"/>
      <LastYearsEditLegend v-if="this.lastYearEdit === true"/>
    </div>
    
    <geomCheck v-if="isGeomCheck === true"/>
    <!-- <isCertAdvanced v-if="returnMapAttr"/> -->
    <dragndrop/>
    <eoeWarning v-if="isEoEWarns === true"/>
    <v-card id="tourBeginCard" v-if="isTourCard">
      <v-card-title id="loginBannerTxt"><p style="position: relative; bottom: 13px;">Welcome to the County Road Inventory Map</p></v-card-title>
      <v-card-text style="position: relative; top: 15px; color: black; text-align: left; margin-bottom: 10px;">
        Whether you're a seasoned editor or this is your first time here, let us give you a tour of some of the features of this application
      </v-card-text>
      <div>
        <v-btn color="#14375A" text tile id="tourBtn" @click="isTour = true; isTourCard = false;">Take a Tour</v-btn>
      </div>
      <div id="isTour">
        <v-btn style="float: right; margin-right: 15px; margin-bottom: 15px;" color="#14375A" text tile @click="isTourCard=false">Exit</v-btn>
        <v-checkbox dense v-model="isNoTour" @change="updateLocalStorage" label="Don't show me this again." style="margin-left: 15px;" class="checkboxSize"></v-checkbox>
      </div>
    </v-card>
    <div>
      <cycleIntro v-if="isTour"/>
    </div>
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
import LastYearsEditLegend from '../components/Map/mapLastYearsEditLegend.vue'
import cycleIntro from '../components/Map/cyclePopup.vue'
import {basemapDisplayOnZoom} from '../components/Map/mapNav.js'
import {getGraphic} from '../components/Map/roadInfo.js'

export default {
    components: {Map, mapHeader, mapFooter,navSideBar, stepper, editExistingRd, denyClickFeat, dfoBox, about, Legend, geomCheck, dragndrop, eoeWarning, LastYearsEditLegend, cycleIntro},
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
        isEoEWarns: false,
        isTourCard: localStorage.getItem('disableTour') ? false : true,
        isNoTour: false,
        overlay: false
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
          curr === false ?  this.isLegend = false : this.isLegend = true
          // this.isLegend = this.displayLegend
      });
      // basemapToggle.watch('activeBasemap',(curr)=>{
      //   curr.baseLayers.items[0].id === 'imagery' ? featLayer.renderer = criConstants.featLayerColorImagery : featLayer.renderer = criConstants.featLayerColorVector
      // });

      highLightFeat('pointer-move')
      getGraphic()
      const alertInfo = await returnAlertInfo()
      const dateEpoch = new Date().getTime()

      const returnItem = alertInfo.features.find(y => dateEpoch >= y.attributes.ALERT_DATE_BEGIN && dateEpoch <= y.attributes.ALERT_DATE_END)
      this.isEoEWarn = returnItem ? true : false

      basemapDisplayOnZoom()
    },
    methods:{
      updateLocalStorage(){
        localStorage.getItem('disableTour') ? localStorage.removeItem('disableTour') : localStorage.setItem('disableTour', true)
      },
      turnOverlayOff(){
        this.isOverlay = false
      }
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
      },
      lastYearEdit:{
        handler: function(){
          this.displayLegend = this.lastYearEdit
        }
      },
      isOverlay:{
        handler: function(){
          this.overlay = this.isOverlay
        }
      }
    },
    computed:{
      isEoEWarn: {
        get(){
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
      lastYearEdit:{
        get(){
          return this.$store.state.isLastYearEdits
        },
        set(bool){
          this.$store.commit('setIsLastYearEdits', bool)
         }
      },
      isLegend:{
        get(){
          return this.$store.state.isLegend
        },
        set(bool){
          this.$store.commit('setIsLegend', bool)
        }
      },
      isTour:{
        get(){
          return this.$store.state.isTour
        },
        set(bool){
          this.$store.commit('setShowTour', bool)
        }
      },
      isOverlay:{
        get(){
          return this.$store.state.isOverlay
        },
        set(bool){
          this.$store.commit('setIsOverlay', bool)
        }
      }
    }
}
</script>

<style scoped>
#isTour{
  position: relative;
  top: 10px;
}
#isTour >>> .v-icon.v-icon{
  font-size: 16px !important;
}
#isTour >>> .v-label{
  font-size: 12px !important;
}
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

#legend-flex{
  display: flex; 
  gap: 10px; 
  flex-direction: column-reverse; 
  bottom: 3rem; 
  right: 1rem; 
  height: 26rem; 
  position: absolute;
}
#tourBeginCard{
  position: absolute;
  width: 444px;
  justify-content: center;
  align-items: center;
  left: 40vw;
  top: 200px;
  border-radius: 0%;
  /* min-height: 100vh; */
}
#loginBannerTxt{
  border-radius: 0px; 
  text-align: left;
  background-color: #14375A;
  color: white;
  height: 40px;
}

#tourBtn{
  text-decoration: underline;
  border: 1px black solid;
}
</style>