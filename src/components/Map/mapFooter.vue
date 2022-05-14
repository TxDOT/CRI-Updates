<template>
    <div>
      <v-card color="#204E70" class="white--text" id="footerCard">
        <!-- <v-card-text justify="center" v-if="isNaN(countyTots)&&isNaN(modifyLine)&&isNaN(modifyLength) ? 0: countyTots"> -->
          <div class="f1-text">County: {{county}}&nbsp; &nbsp; &nbsp; User Name: {{userName}}
            &nbsp; &nbsp; &nbsp; Previous Total Mileage: {{countyTotal}}&nbsp;&nbsp;&nbsp; 
            Current Mileage: {{rdbdDeltaDist}}&nbsp;&nbsp;&nbsp; 
            New Total Miles: {{countyTots}}
          </div>
        <!-- </v-card-text> -->
        <!-- <v-btn style="right: 30%; bottom: 20%">Criteria</v-btn>
        <v-btn style="right: 40%; bottom: 20%">About</v-btn>
        <v-btn id="googleBtn" color="blue" @click="google()">Jump to Google</v-btn> -->
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
        await updateLength()
        this.modifyLength += this.rdbdDeltaDist
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
    userName:{
      get(){
        console.log(this.$store.state.username)
        return this.$store.state.username
      }
    },
    rdbdDeltaDist:{
      get(){
        return this.$store.state.deltaDistance
      }
    },
    currentMiles: function(){
      return Number(this.previousTotal) + Number(this.modifyLength)
    },
    countyTots: function(){
      return Number(this.countyTotal) + Number(this.rdbdDeltaDist)
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
    position: absolute;
    top: 94.8%;
    width:100%;
    height: 5.1%;
  }
  .f1-text{
    position: relative;
    top:30%;
  }

</style>