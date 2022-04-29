<template>
    <div id="mapFooter">
      <v-card dark height="50">
        <!-- <v-card-text justify="center" v-if="isNaN(countyTots)&&isNaN(modifyLine)&&isNaN(modifyLength) ? 0: countyTots"> -->
          <div class="font-weight-regular">County: {{county}}&nbsp; &nbsp; &nbsp; User Name: {{this.username}}
            &nbsp; &nbsp; &nbsp; Previous Total Mileage: {{countyTotal}}&nbsp;&nbsp;&nbsp; 
            Current Mileage: {{currentMiles}}&nbsp;&nbsp;&nbsp; 
            New Total Miles: {{countyTots}}
          </div>
        <!-- </v-card-text> -->
        <v-btn style="right: 30%; bottom: 20%">Criteria</v-btn>
        <v-btn style="right: 40%; bottom: 20%">About</v-btn>
        <v-btn id="googleBtn" color="blue" @click="google()">Jump to Google</v-btn>
      </v-card>   
    </div>
</template>

<script>
import {updateLength,modifyRoadbed} from '../Map/editFunc'
import {jumpToGoogle} from '../Map/mapNav';
// import {roadInfo} from '../../store'
// import{addRoad} from '../Map/Map.vue'
import * as geometryEngine from "@arcgis/core/geometry/geometryEngine";
export default {
  name:"mapFooter",
  data () {
    return {
      previousTotal: 0,
      modifyLength: 0,
      modifyLine: 0,
      username: 'DPROSACK',
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
        let updateMile = await updateLength()
        console.log(updateMile)
        this.modifyLength += updateMile
      },
      immediate: true, 
    },
    modifyLine:{
      handler: async function(){
        let modify = await modifyRoadbed("click")
        this.modifyLine += parseFloat(geometryEngine.geodesicLength(modify.features[0].geometry, "miles").toFixed(3))
        console.log(modify.features[0].geometry)
      },
      immediate:true,
    },
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
    currentMiles: function(){
      return Number(this.previousTotal) + Number(this.modifyLength)
    },
    countyTots: function(){
      return Number(this.countyTotal) + Number(this.previousTotal) + Number(this.modifyLength)
    },
  }
  
} 
</script>

<style scoped>
  #mapFooter {
    position: absolute;
    bottom: 0px;
    width: 100%;
  }
  #googleBtn {
    bottom: 20px;
    left: 600px;
  }
</style>