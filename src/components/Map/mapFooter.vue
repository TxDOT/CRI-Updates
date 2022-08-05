<template>
    <v-footer app style="left: 200px; width: 100%; height:3.5vh; text-align: center;background: #4D4D4D" >
      <!-- <v-card elevation="0" class="black--text" id="footerCard"> -->
        <!-- <v-card-text justify="center" v-if="isNaN(countyTots)&&isNaN(modifyLine)&&isNaN(modifyLength) ? 0: countyTots"> -->
          <div id="footerCard" class="f1-text" style="color:white"><div style="position:absolute; right: .1vw; bottom: .05vh; font-size: .7vw;">{{x}}, {{y}}</div>
            County: <b>{{county}}</b>&nbsp;&nbsp;|&nbsp;&nbsp;User Name: <b>{{userName}}</b>&nbsp;&nbsp;|&nbsp;&nbsp;Starting Mileage: <b style="color:white">{{countyTotal}}</b>&nbsp;&nbsp;|&nbsp;&nbsp;Mileage Change: <b :style="[rdbdDeltaDist > 0 ? {'color':'#28F832'} : {'color': 'red'}, Number(rdbdDeltaDist.toFixed(3)) ===0? {'color':'white'} : null]">{{Number(rdbdDeltaDist.toFixed(3))}}</b>&nbsp;&nbsp;|&nbsp;&nbsp;Updated Mileage: <b style="color:white">{{Number(countyTots.toFixed(4))}}</b>
          </div>
        <!-- </v-card-text> -->
        <!-- <v-btn style="right: 30%; bottom: 20%">Criteria</v-btn>
        <v-btn style="right: 40%; bottom: 20%">About</v-btn>
        <v-btn id="googleBtn" color="blue" @click="google()">Jump to Google</v-btn> -->
      <!-- </v-card>    -->
    </v-footer>
</template>

<script>
import {updateLength} from '../Map/editFunc'
import {jumpToGoogle} from '../Map/mapNav'
import { ccWidget } from './map'

import * as webMercatorUtils from "@arcgis/core/geometry/support/webMercatorUtils";
// import {roadInfo} from '../../store'
// import{addRoad} from '../Map/Map.vue'
//import * as geometryEngine from "@arcgis/core/geometry/geometryEngine";
export default {
  name:"mapFooter",
  data () {
    return {
      previousTotal: 0,
      modifyLength: 0,
      modifyLine: 0,
      x:0,
      y:0
    }
  },
  mounted(){
    ccWidget.watch('currentLocation', (before,after)=>{
      if(before && after){
        let latLong = webMercatorUtils.xyToLngLat(after.x, after.y)
        this.x = Number(latLong[0].toFixed(6))
        this.y = Number(latLong[1].toFixed(6))
      }
    })
  },
  methods: {
    google() {
      jumpToGoogle();
    }      
  },
  watch:{
    modifyLength:{
      handler: async function(){
        updateLength();
        // \this.modifyLength += this.rdbdDeltaDist
      },
      immediate: true, 
    },
    countyTots:{
      handler: function(){
        this.returnCountyTotal = Number(this.countyTotal) + Number(this.rdbdDeltaDist.toFixed(3))
        // \this.modifyLength += this.rdbdDeltaDist
      },
      immediate: true, 
    },
    rdbdDeltaDist:{
      handler: function(){
        console.log(Number(this.countyTotal), Number(this.rdbdDeltaDist))
        this.returnCountyTotal = Number(this.countyTotal) + Number(this.rdbdDeltaDist.toFixed(3))
        // \this.modifyLength += this.rdbdDeltaDist
      },
      immediate: true, 
    },
    // modifyLine:{
    //   handler: async function(){
    //     let modify = await modifyRoadbed("click")
    //     this.modifyLine += parseFloat(geometryEngine.geodesicLength(modify.features[0].geometry, "miles").toFixed(3))
    //     console.log(modify.features[0].geometry)
    //   },
    //   immediate:true,
    // },
  },
  computed:{
    county:{
      get(){
        return this.$store.state.cntyName
      }
    },
    countyTotal:{
      get(){
        return this.$store.state.cntyMiles
      }
    },
    userName:{
      get(){
        return this.$store.state.username
      }
    },
    rdbdDeltaDist:{
      get(){
        return this.$store.state.deltaDistance
      }
    },
    // currentMiles: function(){
    //   return 0 + Number(this.rdbdDeltaDist)
    // },
    countyTots: function(){
      return Number(this.countyTotal) + Number(this.rdbdDeltaDist)
    },
    returnCountyTotal:{
      get(){
        return this.$store.state.cntyEndingMiles
      },
      set(mi){
        this.$store.commit('setCntyEndingMiles', mi)
      }
    },
  }
  
} 
</script>

<style scoped>

  #googleBtn {
    bottom: 20px;
    left: 600px;
  }
  #footerCard{
    position: relative;
    bottom: .1vh;
    width:90%;
    height:100%;
    right: 3%;
    text-align: center;
    font-size: .8vw;
  }
  /* @media screen and (max-width: 1444px){
    #footerCard {
      font-size: 1vw;
    }
  }  */
  /* .f1-text{
    position: relative;
    top:10%;
  } */

</style>