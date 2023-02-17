<!-- map footer -->
<template>
    <v-footer app id="footerPos">
      <div id="footerCard" style="color:white"><div id="coordsPos">{{x}}, {{y}}</div>
        County: <b>{{county}}</b>&nbsp;&nbsp;|&nbsp;&nbsp;User Name: <b>{{userName}}</b>&nbsp;&nbsp;|&nbsp;&nbsp;Starting Mileage: <b style="color:white">{{countyTotal}}</b>&nbsp;&nbsp;|&nbsp;&nbsp;Mileage Change: <b :style="[mileageChange > 0 ? {'color':'#28F832'} : {'color': 'red'}, Number(mileageChange) ===0? {'color':'white'} : null]">{{Number(mileageChange)}}</b>&nbsp;&nbsp;|&nbsp;&nbsp;Updated Mileage: <b style="color:white">{{Number(countyTots.toFixed(1))}}</b>
      </div>
    </v-footer>
</template>

<script>
import {updateLength} from '../Map/edit'
import { ccWidget } from './map'

import * as webMercatorUtils from "@arcgis/core/geometry/support/webMercatorUtils";

export default {
  name:"mapFooter",
  data () {
    return {
      previousTotal: 0,
      modifyLength: 0,
      modifyLine: 0,
      mileageChange: 0,
      x:0,
      y:0
    }
  },
  mounted(){
    //coordinates watching property 'currentLocation'. Convert x/y to lat/long
    ccWidget.watch('currentLocation', (before,after)=>{
      if(before && after){
        let latLong = webMercatorUtils.xyToLngLat(after.x, after.y)
        this.x = Number(latLong[0].toFixed(6))
        this.y = Number(latLong[1].toFixed(6))
      }
    })
  },
  watch:{
    modifyLength:{
      handler: async function(){
        updateLength();
      },
      immediate: true, 
    },
    countyTots:{
      handler: function(){
        this.returnCountyTotal = Number(this.countyTotal) + Number(this.rdbdDeltaDist)

      },
      immediate: true, 
    },
    rdbdDeltaDist:{
      handler: function(){
        let dist = this.rdbdDeltaDist > -0.02 && this.rdbdDeltaDist < 0.02 ? 0 : this.rdbdDeltaDist
        this.mileageChange = dist

      },
      immediate:true
    }
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
        return Math.floor(this.$store.state.deltaDistance *100)/100
      }
    },
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
  #footerPos{
    left: 12rem !important;
    width: 100%; 
    height:3.5vh; 
    text-align: center;
    background: #4D4D4D
  }
  #coordsPos{
    position:fixed; 
    right: 4vw; 
    bottom: .7vh; 
    font-size: .7vw;
  }
</style>