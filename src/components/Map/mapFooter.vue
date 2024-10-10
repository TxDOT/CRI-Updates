<!-- map footer -->
<template>
    <v-footer app id="footerPos">
      <div id="footerCard" style="color:white"><div id="coordsPos">{{x}}, {{y}}</div>
        County: <b>{{county}}</b>&nbsp;&nbsp;|&nbsp;&nbsp;User Name: <b>{{userName}}</b>&nbsp;&nbsp;|<span @mouseover="mileagePopup = true" @mouseleave="handlemileagePopup">&nbsp;&nbsp;Starting Mileage: <b style="color:white">{{countyTotal}}</b>&nbsp;&nbsp;</span>|&nbsp;&nbsp;Mileage Change: <b :style="[mileageChange > 0 ? {'color':'#28F832'} : {'color': 'red'}, Number(mileageChange) ===0? {'color':'white'} : null]">{{Number(mileageChange)}}</b>&nbsp;&nbsp;|&nbsp;&nbsp;Updated Mileage: <b style="color:white">{{Number(countyTots.toFixed(1))}}</b>
      </div>
      <div class="container" v-if="mileagePopup" >
        <div class="callout" @mouseover="popupHoverStatus = true" @mouseleave="handlemileagePopupleave">
          <span>
            <p style="color:white; text-align: left; font-size: .8vw; margin: 5px;">
              From September 1st to December 31st the starting mileage below is updated monthly and may fluctuate as TxDOT applies the county's edits received through August 31st. 
              Check the status of the edits by clicking the 'Last Year's Edits' layer on the left.
            </p>
          </span>
          <div id="buttonPos">
            <v-btn
                height="3vh" 
                tile 
                outlined 
                color="white" 
                class="mx-2" 
                small
                @click="mileagePopup = false; exitClick = true"
            >
              <u>
                EXIT
              </u>
            
            </v-btn>
          </div>
          
        </div>
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
      y:0,
      mileagePopup: true,
      popupHoverStatus: false,
      exitClick : false,
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
  },
  methods: {
    handlemileagePopup(){
      setTimeout(() => {
        if (this.popupHoverStatus === false ){
          this.mileagePopup = false
        }
      }, 1500);
    },
    handlemileagePopupleave(){
      if (this.exitClick === true){
        this.popupHoverStatus = false
        this.mileagePopup = false
      }
      

    }
  }
  
} 
</script>

<style scoped>
  #footerCard{
    position: relative;
    top: 5%;
    width:90%;
    height:100%;
    right: 3%;
    text-align: center;
    font-size: .8vw;
  }
  #footerPos{
    left: 12rem !important;
    width: 100%; 
    height:2.05vw; 
    text-align: center;
    background: #4D4D4D;
    
  }
  #coordsPos{
    position:fixed; 
    right: 4vw;  
    font-size: .8vw;
  }
  .container{
    position: absolute; 
    bottom: calc(100% + 0.5rem); 
    left: 44%;
    transform: translateX(-50%);
    display: flex;
    align-items: center; 
    justify-content: center; 
    width: auto;
   
    
  }

  .callout{
    position: relative;
    height: auto;
    width: auto;
    max-width: 480px;
    border: 3px solid #204E70;
    background-color: #204E70;
    

  }
  .callout::before, .callout::after{
    content: ' ';
    position: absolute;
    display: block;
    height: 0;
    width: 0;
  }

  .callout::before{
    border: 15px solid transparent;
    border-top-color: #204E70;
    bottom: -30px;
    left: 45%;
  }
  #buttonPos{
    display: flex;
    justify-content: end;
    margin-right: 5px;
    margin-bottom: 5px;
  }
</style>