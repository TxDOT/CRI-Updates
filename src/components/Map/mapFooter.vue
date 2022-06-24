<template>
    <v-footer app style="left: 243px;width: 100%;height:35px; text-align: center;background: rgba(192,192,192,1)" >
      <!-- <v-card elevation="0" class="black--text" id="footerCard"> -->
        <!-- <v-card-text justify="center" v-if="isNaN(countyTots)&&isNaN(modifyLine)&&isNaN(modifyLength) ? 0: countyTots"> -->
          <div  id="footerCard" class="f1-text">County: <b>{{county}}</b>&nbsp; &nbsp;&nbsp; User Name: <b>Tester_TXDOT</b> 
            &nbsp; &nbsp; &nbsp;Starting Mileage: <b>{{countyTotal}}</b>&nbsp;&nbsp;&nbsp; 
            Mileage Change: <b>{{Number(rdbdDeltaDist.toFixed(4))}}</b>&nbsp;&nbsp;&nbsp; 
            Updated Mileage: <b>{{Number(countyTots.toFixed(4))}}</b>
          </div>
          <div style="position: absolute; font-size: 10px; bottom: 10%;">
            Build v1.4
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
import {jumpToGoogle} from '../Map/mapNav';
// import {roadInfo} from '../../store'
// import{addRoad} from '../Map/Map.vue'
//import * as geometryEngine from "@arcgis/core/geometry/geometryEngine";
export default {
  name:"mapFooter",
  data () {
    return {
      previousTotal: 0,
      modifyLength: 0,
      modifyLine: 0
    }
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
        this.returnCountyTotal = Number(this.countyTotal) + Number(this.rdbdDeltaDist)
        // \this.modifyLength += this.rdbdDeltaDist
      },
      immediate: true, 
    },
    rdbdDeltaDist:{
      handler: function(){
        this.returnCountyTotal = Number(this.countyTotal) + Number(this.rdbdDeltaDist)
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
    top: 0%;
    width:90%;
    height:100%;
  }
  /* .f1-text{
    position: relative;
    top:10%;
  } */

</style>