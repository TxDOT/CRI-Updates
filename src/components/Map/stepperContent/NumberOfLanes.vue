<template>
<!-- <v-card height="200px" flat> -->
  <div class="scroller" style="height:200px;"> 
  <!-- Loop through asset breaks assigned in rdbdSurf. Assign surface type lable and dfo values -->
  <!-- <v-col v-for="(item,index) in rdbdSurf" :key="index" > -->
    <v-card v-if="isAssetType=== true" >
        <v-card-title class="surfaceTitle">
          <v-card-text style="bottom:30px; position:relative; font-size: 15px; text-align: left;">What's the Number of Lanes?</v-card-text>
        </v-card-title>
        <v-select v-model="assetType" :items="assetTypeOpt" outlined dense placeholder="Pick an asset type"></v-select>
        <v-btn style="bottom: 10px; padding:0px; left:50px;" depressed plain>
          Cancel
        </v-btn>
        <v-btn style="bottom: 10px; padding:0px; right:1px;" absolute outlined @click="isAssetType = false; isAssetStart = true;">
          <u>Continue</u>
        </v-btn>
    </v-card>

    <v-card v-if="isAssetStart === true">
      <v-card-title class="surfaceTitle">
        <v-card-text style="padding: 0%; bottom:13px; position:relative; font-size: 14px; text-align: left;">Where Does the {{assetType}} Surface Start?</v-card-text>
      </v-card-title>
        <v-btn plain absolute left small @click="atBegin(); isAssetStartDisable=false; cancelDfoLocation()">
          <v-icon style="padding:0px;">mdi-map-marker</v-icon>At The beginning of the Road?
        </v-btn>
        <v-btn plain absolute left style="top:75px;" small @click="isAssetStartDisable=true; cancelDfoLocation()">
          <v-icon style="padding:0px;">mdi-plus</v-icon>At this mile: 
        </v-btn>
        <v-text-field v-model="assetStartDfo" :disabled="!isAssetStartDisable" dense absolute outlined label="Enter Mile" style="width:100px; top:38px; left:150px; height:160px;"></v-text-field>
          <v-btn plain absolute left style="top:120px;" small @click="getDfoLocation('start'); isAssetStartDisable=false">
            <v-icon style="padding:0px;">mdi-map-plus</v-icon>Choose on the Map
          </v-btn>
          <v-btn style="bottom: 50px; left: 40px; padding:0px;" depressed plain>
            Cancel
          </v-btn>
          <v-btn style="bottom: 50px; padding:0px; right:1px;" absolute outlined @click="isAssetStart = false; isAssetEnd = true; ">
            <u>Continue</u>
          </v-btn>
    </v-card>

    <v-card v-if="isAssetEnd === true">
      <v-card-title class="surfaceTitle">
        <v-card-text style="padding: 0%; bottom:13px; position:relative; font-size: 14px; text-align: left;">Where Does the {{assetType}} Surface End?</v-card-text>
      </v-card-title>
      <v-btn plain absolute left small @click="atEnd(); isAssetEndDisable=false; cancelDfoLocation()">
        <v-icon style="padding:0px;">mdi-map-marker</v-icon>At The End of the Road?
      </v-btn>
      <v-btn plain absolute left style="top:75px;" small @click="isAssetEndDisable=true; cancelDfoLocation()">
        <v-icon style="padding:0px;">mdi-plus</v-icon>At this mile: 
      </v-btn>
      <v-text-field v-model="assetEndDfo" :disabled="!isAssetEndDisable" dense absolute outlined label="Enter Mile" style="width:100px; top:38px; left:150px; height:160px;"></v-text-field>
        <v-btn plain absolute left style="top:120px;" small @click="getDfoLocation('end'); isAssetEndDisable=false">
          <v-icon style="padding:0px;">mdi-map-plus</v-icon>Choose on the Map
        </v-btn>
        <v-btn style="bottom: 50px; left: 40px; padding:0px;" depressed plain>
          Cancel
        </v-btn>
        <v-btn style="bottom: 50px; padding:0px; right:1px;" absolute outlined @click="isAssetEnd = false; isAssetFinished = true; updateMileInfo(assetEndDfo); updateGraphic();">
          <u>Continue</u>
        </v-btn>
    </v-card>
    
    <v-card v-if="isAssetFinished=== true" absolute left flat>
      <assetAlert/>
      <v-col  v-for="(item,index) in mileInfo" :key="index">
        <v-row style="border: 1px solid #204E70; height: 70px;" width="800px"> <!-- add for loop to display items; previous button should create an object, which can be displayed below info -->
          <v-card-text style="position: relative; left:1px; text-align: left;" >This road is <em style="color:white" :style="{backgroundColor:`${assetColorTable[item.SRFC_TYPE]}`}">{{item.SRFC_TYPE}}</em> lanes between {{item.ASSET_LN_BEGIN}} miles<br> and {{item.ASSET_LN_END}} miles</v-card-text>
            <v-btn plain color="#15648C" style="left:270px; bottom: 43px;" @click="editAsset(index)"><v-icon small>mdi-pencil</v-icon>Edit</v-btn>
            <v-btn plain style="left:200px; bottom:73px;" @click="deleteSurface(index)"><v-icon color="red" >mdi-delete</v-icon></v-btn>
        </v-row>
        <v-spacer></v-spacer>
      </v-col>
      <a @click="isAssetFinished = false; isAssetType = true; addRoadSurface();" style="position: relative; text-align:justify; text-justify: inter-word; right:60px; font-size: small; top: 10px; padding-bottom: 5px;"><u>Click here to add another segment</u> with<br> a different surface type.</a>
    </v-card>
  </div>
</template>

<script>

import {getGraphic, getSelectedDFO, applyMToAsset, stopEditingPoint} from '../editFunc'
import {criConstants} from '../../../common/cri_constants'
import {gLayer} from '../map'
import assetAlert from '../stepperContent/assetAlert.vue'
export default {
  components: {assetAlert},
  name: 'numOfLane',
  data(){
    return{
      mileInfo:[],
      assetType: null,
      assetStartDfo: null,
      assetEndDfo: null,
      assetFinished: [],
      isAssetType: true,
      isAssetStart: false,
      isAssetEnd: false,
      isAssetFinished: false,
      isAssetEndDisable: false,
      isAssetStartDisable: false,
      assetTypeOpt: ['1','2','3','4','5','6'],
      emptyValues:[v => !!v || 'Road Design is required'],
      graphic: true,
      disabled: false,
      newDfo: 0,
      countG: null,
      objectids:0,
      editIndex: -1,
      assetColorTable: criConstants.colorTable
    }
  },
  methods:{
    cancelDfoLocation(){
      stopEditingPoint()
    },
    editAsset(index){
      let getCurrentItem = this.mileInfo.at(index)
        console.log(getCurrentItem)
        this.assetType = getCurrentItem.SRFC_TYPE
        this.assetStartDfo = getCurrentItem.ASSET_LN_BEGIN
        this.assetEndDfo - getCurrentItem.ASSET_LN_END
        this.isAssetType = true
        this.isAssetFinished = false
        this.editIndex = index
      },
    async getDfoLocation(type){
      let returnSelectedDFO = await getSelectedDFO(this.objid);
      type === 'start' ? this.assetStartDfo = Number(returnSelectedDFO[0].toFixed(3)) : this.assetEndDfo = Number(returnSelectedDFO[0].toFixed(3))
      console.log(returnSelectedDFO)
    },

    atBegin(){
      this.cancelDfoLocation();
      console.log(this.objid)
      let id = gLayer.graphics.items.filter(x=>x.attributes.objectid === this.objid);
      console.log(id)
      this.assetStartDfo = Number(id[0].geometry.paths[0][0][2].toFixed(3))
      //this.$set(this.mileInfo[0], 'ASSET_LN_BEGIN_DFO_MS', id[0].geometry.paths[0][0][2])
    },

    atEnd(){
      this.cancelDfoLocation();
      let id = gLayer.graphics.items.filter(x=>x.attributes.objectid === this.objid);
      this.assetEndDfo = Number(id[0].geometry.paths[0].at(-1)[2].toFixed(3))
      //this.$set(this.mileInfo[0], 'ASSET_LN_END_DFO_MS', Number(id[0].geometry.paths[0].at(-1)[2]).toFixed(3))
    },

    updateMileInfo(){
      this.$set(this.mileInfo.at(this.editIndex), 'SRFC_TYPE', this.assetType)
      this.$set(this.mileInfo.at(this.editIndex), 'ASSET_LN_BEGIN', Number(this.assetStartDfo))
      this.$set(this.mileInfo.at(this.editIndex), 'ASSET_LN_END', Number(this.assetEndDfo))
      this.$set(this.mileInfo.at(this.editIndex), 'OBJECTID', this.objid)
      
      this.checkFullCoverage();
      this.executeDFOgraph('point')
    },

    checkFullCoverage(){
      let beginEndArr = []
      this.mileInfo.forEach(function(x){
        beginEndArr.push(x.ASSET_LN_BEGIN + x.ASSET_LN_END)
      })
      let initValue = 0
      let diff = beginEndArr.reduce((prevValue, currentValue) => 
        currentValue - prevValue, initValue
      )
      console.log(diff, beginEndArr)
      this.setAssetCover = Number(diff.toFixed(3))
    },

    updateGraphic(){
      let x=[];
      for(let i=0; i < this.mileInfo.length; i++){
        x.push({
          SRFC_TYPE_ID: this.mileInfo[i].SRFC_TYPE,
          ASSET_LN_BEGIN_DFO_MS: Number(this.mileInfo[i].ASSET_LN_BEGIN),
          ASSET_LN_END_DFO_MS: Number(this.mileInfo[i].ASSET_LN_END),
          OBJECTID: this.objid
        })
      }
      for(let z=0; z < gLayer.graphics.items.length; z++){
        if(gLayer.graphics.items[z].attributes.objectid === this.objid){
          gLayer.graphics.items[z].attributes.numLane = JSON.stringify(x)
        }
      }
    },

    resetItems(){
      this.assetType=this.assetStartDfo=this.assetEndDfo = null;
      this.isAssetFinished = false
      this.isAssetType = true
      this.editIndex = -1
    },

    async executeDFOgraph(){
      this.newDfo = applyMToAsset(this.mileInfo)
    },

    deleteSurface(index){
      console.log(index)
      this.mileInfo.splice(index, 1)
      applyMToAsset(this.mileInfo)
    },
      
    addRoadSurface(){
      this.mileInfo.push({
        SRFC_TYPE:'',
        ASSET_LN_BEGIN: 0,
        ASSET_LN_END:0,
        EDIT: true,
        OBJECTID: this.objid
      })
      this.editIndex = -1
      console.log(this.mileInfo)
    },
  },

  watch:{
    objid:{
      handler: async function(){
        console.log('change', this.objid)
        this.resetItems();
        let countG = await getGraphic()
        console.log(countG)
        this.feature = false;
        this.graphic = true;
        this.graphicObj = countG
        this.stepperClose = true;
      }, 
      immediate: true,
    },
    numLanes:{
      handler: function(){
        if(this.mileInfo.length){
          this.mileInfo.length = 0
        }

        if(this.numLanes){
          console.log(this.numLanes)
          for(let i=0; i < this.numLanes.length; i++){
            console.log(this.mileInfo)
            this.mileInfo.push({
              SRFC_TYPE: this.numLanes[i].SRFC_TYPE_ID,
              ASSET_LN_BEGIN: this.numLanes[i].ASSET_LN_BEGIN_DFO_MS,
              ASSET_LN_END: this.numLanes[i].ASSET_LN_END_DFO_MS,
              EDIT: true,
              OBJECTID: this.objid
            })
          }

          console.log(this.mileInfo)
          this.isAssetFinished = true
          this.isAssetType = this.isAssetStart = this.isAssetEnd = false
        }
        else{
          this.resetItems()
          this.mileInfo.push({
            SRFC_TYPE: '',
            ASSET_LN_BEGIN: 0,
            ASSET_LN_END: 0,
            EDIT: true,
            OBJECTID: this.objid
          })
        }
      }, 
      immediate: true,
    }, 
  },
  computed:{
    numLanes:{
      get(){
        console.log(this.$store.state.numLane)
        if(typeof(this.$store.state.numLane) === 'string'){
          return JSON.parse(this.$store.state.numLane) 
        }
        else{
          return this.$store.state.numLane
        }
      },
      set(x){
        this.$store.commit('setNumLane',JSON.stringify(x))
      }   
    },
    objid:{
      get(){
        console.log(this.$store.state.objectid)
        return this.$store.state.objectid
      }
    },
    setAssetCover:{
      get(){
        return this.$store.state.assetCoverage
      },
      set(x){
        this.$store.commit('setAssetCoverage', x)
      }
    },
  }
}
</script>

<style scoped>
.surfaceTitle{
  background-color: #204E70;
  color: white;
  height:30px;
  width: 100%;
  font-size: 25px; 
}
</style>