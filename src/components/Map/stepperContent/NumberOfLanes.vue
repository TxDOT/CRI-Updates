<!-- Number of Lanes asset card -->
<template>
  <div class="scroller; totalDiv"> 
  <v-card class="card" v-if="isAssetType=== true" elevation="0" tile>
    <v-card-title class="cardTitle assetTitle">
      <v-card-text class="cardText">What's the Number of Lanes?</v-card-text>
    </v-card-title>
    <v-flex v-for="(item, index) in assetTypeOpt" :key="index">
      <v-select v-model="assetType" :items="item.types" outlined dense placeholder="Pick a number of lanes" @change="selectAssetType"></v-select>
    </v-flex>
    <v-btn class="cancelButton1" text tile color="#204E70" @click="isAssetType = isAssetStart = isAssetEnd = false; isAssetFinished = true; cancelNewAsset()">
      <u>Cancel</u>
    </v-btn>
    <v-btn class="skipButton1" tile absolute outlined color="#204E70" @click="isAssetType = isAssetEnd = isAssetFinished = isAssetStart = false; isAssetFullLen = true;">
      <u>Skip</u>
    </v-btn>
  </v-card>

  <v-card class="card" v-if="isAssetFullLen === true" height="80" elevation="0" tile>
    <v-card-title class="cardTitle assetTitle">
      <v-card-text class="cardText">Is the {{assetType}} Lane segment full length?</v-card-text>
    </v-card-title>
    <div class="divSrfcFullLen">
      <v-btn class="backButton" depressed text tile color="#204E70" @click= "isAssetFinished = isAssetStart = isAssetEnd = isAssetFullLen = false;  isAssetType= true;">
        Back
      </v-btn>
      <v-btn class="cancelButton" depressed text tile color="#204E70" @click= "isAssetType = isAssetStart = isAssetEnd = isAssetFullLen = false; isAssetFinished = true; cancelNewAsset()">
        <u>Cancel</u>
      </v-btn>
      <v-btn class="yesButton" tile absolute outlined color="#204E70" @click="isAssetType = isAssetEnd = isAssetStart = isAssetFullLen = false; isAssetFinished = true; atBegin(); atEnd(); updateMileInfo(); updateGraphic();">
        <u>Yes</u>
      </v-btn>
      <v-btn class="noButton" tile absolute outlined color="#204E70" @click="isAssetType = isAssetEnd = isAssetFinished = isAssetFullLen = false; isAssetStart = true;">
        <u>No</u>
      </v-btn>
    </div>
  </v-card>    

  <v-card class="card" v-if="isAssetStart === true" elevation="0" tile>
    <v-card-title class="cardTitle assetTitle">
      <v-card-text class="cardText">Where Does the {{assetType}} lanes Start?</v-card-text>
    </v-card-title>
    <v-flex v-for="(item, i) in selectionBegin" :key="i">
      <v-select placeholder="Select an option" outlined dense v-model="assetStartDfo" :items="item.types" @input="selectAssetDFO" ></v-select>
    </v-flex>
    <v-btn class="cnclBtnSrfc" text tile color="#204E70" absolute @click="isAssetType = isAssetEnd = isAssetStart = isAssetFullLen = false; isAssetFinished = true; isCanceled = true; cancelDfoLocation(); resetAsset();">
      <u>Cancel</u>
    </v-btn>
    <v-btn class="cancelButton1" text tile color="#204E70" @click="isAssetStart = isAssetEnd = isAssetFinished = isAssetType = false; isAssetFullLen = true; cancelDfoLocation()">
      Back
    </v-btn>
  </v-card>

  <v-card class="card" v-if="isAssetEnd === true" elevation="0" tile>
    <v-card-title class="cardTitle assetTitle">
      <v-card-text class="cardText">Where Does the {{assetType}} lanes <span id="assetEnd">End</span>?</v-card-text>
    </v-card-title>
    <v-flex v-for="(item, i) in selectionEnd" :key="i">
      <v-select placeholder="Select an option" outlined dense v-model="assetEndDfo" :items="item.types" @input="selectAssetDFO" item-color="none"></v-select>
    </v-flex>
    <v-btn class="cnclBtnSrfc" text tile color="#204E70" absolute @click="isAssetType = isAssetEnd = isAssetStart = isAssetFullLen = false; isAssetFinished = true; isCanceled = true; cancelDfoLocation(); resetAsset();">
      <u>Cancel</u>
    </v-btn>
    <v-btn class="cancelButton1" text tile color="#204E70" @click="isAssetEnd = isAssetFinished = isAssetType = isAssetFullLen = false; isAssetStart = true; cancelDfoLocation()">
      Back
    </v-btn>
  </v-card>
    
  <v-card v-if="isAssetFinished=== true" absolute left flat>
    <assetAlert/>
    <v-col v-for="(item,index) in mileInfo" :key="index">
      <v-row class="assetPosFinish" width="800px"> <!-- add for loop to display items; previous button should create an object, which can be displayed below info -->
        <v-card-text class="assetTxtFinish">This road is <em style="color:white" :style="{backgroundColor:`${assetColorTable[item.SRFC_TYPE]}`}">{{item.SRFC_TYPE}}</em> lanes between {{item.ASSET_LN_BEGIN}} miles<br> and {{item.ASSET_LN_END}} miles</v-card-text>
        <v-btn v-if="!infoRoad" text color="#204E70" class="btnPencil" @click="editAsset(index)"><v-icon>mdi-pencil</v-icon></v-btn>
        <small v-if="!infoRoad" class="penciTxt">EDIT</small>
        <v-btn v-if="!infoRoad" text class="btnDelete" @click="deleteSurface(index);updateMileInfo();updateGraphic();cancelDfoLocation();" :disabled="mileInfo.length === 1"><v-icon color="red" >mdi-delete</v-icon></v-btn>
        <small v-if="!infoRoad" class="deleteTxt" :style="[mileInfo.length === 1 ? {'color':'grey'} : {'color':'red'}]">DELETE</small>
      </v-row>
      <v-spacer></v-spacer>
    </v-col>
    <a v-if="!infoRoad" @click="isAssetFinished = isAssetFullLen = false; isAssetType = true; addRoadSurface(); isAddNew = true;" class="addSegment"><v-icon color="#204E70">mdi-plus-thick</v-icon><u class="addSegColor">Add another segment</u></a>
  </v-card>
  </div>
</template>

<script>

import { getSelectedDFO, applyMToAsset } from '../roadInfo'
import { mouseHoverDfoDisplay, stopEditingPoint } from '../edit'
import { geomToMiles } from '../helper'
import {criConstants} from '../../../common/cri_constants'
import {gLayer} from '../map'
import assetAlert from '../stepperContent/assetAlert.vue'
export default {
  components: {assetAlert},
  name: 'numOfLane',
  data(){
    return{
      mileInfo:[],
      assetNull: null,
      assetType: null,
      assetStartDfo: null,
      assetEndDfo: null,
      assetFinished: [],
      isAssetType: true,
      isAssetFullLen: false,
      isAssetStart: false,
      isAssetEnd: false,
      isAssetFinished: false,
      isAssetEndDisable: false,
      isAssetStartDisable: false,
      isCanceled: false,
      isAddNew: false,
      assetTypeOpt: [{
        types:[{text: '1'},
               {text: '2'},
               {text: '3'},
               {text: '4'},
               {text: '5'},
               {text: '6'}
        ]
      }],
      emptyValues:[v => !!v || 'Road Design is required'],
      selectionBegin:[{
        types:[
          {text: 'At the beginning of the road'},
          {text: 'Choose the beginning point on the map'}
        ]
      }],
      selectionEnd:[{
        types:[
          {text: 'At the end of the road'},
          {text: 'Choose the ending point on the map'}
        ]
      }],
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
    resetDfoValue(){
      this.resetDfo = 0
    },
    cancelNewAsset(){
      if(this.isAddNew === true){
        this.deleteSurface(-1)
        return;
      }
      return;
    },
    resetAsset(){
      this.cancelNewAsset();
      let getCurrentItem = this.mileInfo.at(this.editIndex)
      this.assetType = getCurrentItem.SRFC_TYPE
      this.assetStartDfo = getCurrentItem.ASSET_LN_BEGIN
      this.assetEndDfo = getCurrentItem.ASSET_LN_END
    },
    returnDFO(){
      this.getDfoBool = true;
      mouseHoverDfoDisplay('dfo')
    },
    selectAssetDFO(text){
      let type = {
        'At the beginning of the road': ()=>{
          this.atBegin();
          this.isAssetStart = this.isAssetType = this.isAssetFinished = this.isAssetFullLen = false;
          this.isAssetEnd = true; 
          this.cancelDfoLocation()
        },
        'Choose the beginning point on the map': async ()=>{
          this.isAssetEndDisable=false;
          this.returnDFO();  
          await this.getDfoLocation('start')
          this.isCanceled === true ? this.isAssetStart = this.isAssetType = this.isAssetFullLen = this.isAssetEnd = false : this.isAssetStart = this.isAssetType = this.isAssetFinished = this.isAssetFullLen = false;
          this.isCanceled === true ? this.isAssetFinished = true : this.isAssetEnd = true 
          this.cancelDfoLocation()
          this.resetDfoValue()
          this.getDfoBool = false
        },
        'At the end of the road': ()=>{
          this.atEnd();
          this.isAssetEnd = this.isAssetStart = this.isAssetType = this.isAssetFullLen = false;
          this.isAssetFinished = true;
          this.updateMileInfo();
          this.updateGraphic();
          this.cancelDfoLocation()
          this.isAddNew = false
        },
        'Choose the ending point on the map': async ()=>{
          this.isAssetStartDisable=false;
          this.returnDFO();  
          await this.getDfoLocation('end')
          this.isCanceled === true ? this.isAssetStart = this.isAssetType = this.isAssetFullLen = this.isAssetEnd = false : this.isAssetStart = this.isAssetType = this.isAssetEnd = this.isAssetFullLen = false;
          this.isCanceled === true ? this.isAssetFinished = true : this.isAssetFinished = true;
          this.updateMileInfo();
          this.updateGraphic();
          this.cancelDfoLocation()
          this.resetDfoValue()
          this.isAssetFinished = true;
          this.getDfoBool = false
          this.isAddNew = false
        }
      }
        type[`${text}`]()
      },

    selectAssetType(text){
      this.assetType = text
      this.assetNull = null
      this.isAssetType = this.isAssetEnd = this.isAssetFinished = this.isAssetStart = false;
      this.isAssetFullLen = true;
    },
    nextStep(x){
      this.getDfoBool = false;
      this.returnStep = x
    },
    cancelDfoLocation(){
      stopEditingPoint()
    },
    editAsset(index){
      let getCurrentItem = this.mileInfo.at(index)
        this.assetType = getCurrentItem.SRFC_TYPE
        this.assetStartDfo = getCurrentItem.ASSET_LN_BEGIN
        this.assetEndDfo = getCurrentItem.ASSET_LN_END
        this.isAssetType = true
        this.isAssetFinished = false
        this.editIndex = index
        this.isCanceled = false
        this.isAddNew = false
      },
    async getDfoLocation(type){
      let returnSelectedDFO = await getSelectedDFO(this.objid);
      if(!returnSelectedDFO) return
      type === 'start' ? this.assetStartDfo = Number(returnSelectedDFO[0].toFixed(3)) : this.assetEndDfo = Number(returnSelectedDFO[0].toFixed(3))
    },

    atBegin(){
      this.cancelDfoLocation();
      let id = gLayer.graphics.items.filter(x=>x.attributes.objectid === this.objid);
      this.assetStartDfo = Number(id[0].geometry.paths[0][0][2].toFixed(3))
    },

    atEnd(){
      this.cancelDfoLocation();
      let id = gLayer.graphics.items.filter(x=>x.attributes.objectid === this.objid);
      this.assetEndDfo = Number(id[0].geometry.paths[0].at(-1)[2].toFixed(3))
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
      this.mileInfo.sort((a,b)=>(a.ASSET_LN_BEGIN > b.ASSET_LN_BEGIN)? 1:-1)
      this.mileInfo.forEach(function(x){
        beginEndArr.push([x.ASSET_LN_BEGIN, x.ASSET_LN_END])
      })
      beginEndArr.sort((a,b)=>(a[0] > b[0])? 1:-1)
      this.setAssetCover = beginEndArr
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
          this.rdbdDesign = JSON.parse(gLayer.graphics.items[z].attributes.numLane)
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
    },
  },

  watch:{
    objid:{
      handler: async function(){
        this.resetItems();
         if(this.mileInfo.length){
            this.mileInfo.length = 0
            this.addRoadSurface()
          }
      }, 
      immediate: true,
    },
    numLanes:{
      handler: function(){
        if(this.mileInfo.length){
          this.mileInfo.length = 0
        }

        if(this.numLanes){
          for(let i=0; i < this.numLanes.length; i++){
            this.mileInfo.push({
              SRFC_TYPE: this.numLanes[i].SRFC_TYPE_ID,
              ASSET_LN_BEGIN: Number(this.numLanes[i].ASSET_LN_BEGIN_DFO_MS.toFixed(3)),
              ASSET_LN_END: Number(this.numLanes[i].ASSET_LN_END_DFO_MS.toFixed(3)),
              EDIT: true,
              OBJECTID: this.objid
            })
          }
          this.isAssetFinished = true
          this.isAssetType = this.isAssetStart = this.isAssetEnd = this.isAssetFullLen = false
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
    roadGeometry:{
      handler: function(){
        console.log(this.roadGeometry)
        let len = geomToMiles(this.roadGeometry, true, 3)
        this.$set(this.mileInfo.at(-1), 'ASSET_LN_END', Number(len))
        console.log(this.mileInfo.at(-1))
      }
    }
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
    newHeight(x){
      return x+76
    },
    returnStep:{
      get(){
        return this.$store.state.stepNumber
      },
      set(x){
        this.$store.commit('setStepNumber', Number(x))
      }
    },
    numLanes:{
      get(){
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
    infoRoad:{
      get(){
        return this.$store.state.infoRd
      },
      set(info){
        this.$store.commit('setInfoRd', info)
      }
    },
    resetDfo:{
      get(){
        return this.$store.state.dfoReturn
      },
      set(dfo){
        this.$store.commit('setDfoReturn', dfo)
      }
    },
    roadGeometry: {
        get(){
          return this.$store.state.roadGeometry
        },
        set(geom){
          this.$store.commit('setRoadGeom', geom)
        }
      },
  }
}
</script>

<style scoped>


.scroller {
  width: auto;
  height: 500px;
  overflow-y: scroll;
  scrollbar-color: grey;
  scrollbar-width: thin;
}
</style>