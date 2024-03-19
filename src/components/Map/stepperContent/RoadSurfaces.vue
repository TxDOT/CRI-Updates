<!-- Road Surface asset card -->
<template>
  <div class="totalDiv">
    <!-- each v-card has a property assigned to it. isAssetType, isAssetFullLen, isAssetStart, isAssetEnd or isAssetFinished  -->
    <!-- Loop through asset breaks assigned in rdbdSurf. Assign surface type lable and dfo values -->
    <v-card class="card" v-if="isAssetType=== true" elevation="0" tile>
      <v-card-title class="cardTitle assetTitle">
        <v-card-text class="cardText">What's the Surface Type?</v-card-text>
      </v-card-title>
      <!-- loop through assetTypeOpt and list items -->
      <v-flex v-for="(item, index) in assetTypeOpt" :key="index">
        <v-select v-model="assetType" :items="item.types" outlined dense placeholder="Pick a Surface type"
          @change="selectAssetType"></v-select>
      </v-flex>
      <v-btn class="cancelButton1" text tile color="#204E70"
        @click="isAssetType = isAssetStart = isAssetEnd = false; isAssetFinished = true; cancelNewAsset()">
        <u>Cancel</u>
      </v-btn>
      <v-btn class="skipButton1" tile absolute outlined color="#204E70"
        @click="isAssetType = isAssetEnd = isAssetFinished = isAssetStart = false; isAssetFullLen = true;">
        <u>Skip</u>
      </v-btn>
    </v-card>
    <!-- if isAssetFullLen is true, it will be displayed. All other cards will be hidden -->
    <v-card class="card" v-if="isAssetFullLen === true" height="80" elevation="0" tile>
      <v-card-title class="cardTitle assetTitle">
        <v-card-text class="cardText">Is the {{assetType}} Surface full length?</v-card-text>
      </v-card-title>
      <div class="divSrfcFullLen">
        <!-- if back is clicked, all card display properties will be set to false, except for isAssetType.  -->
        <v-btn class="backButton" depressed text tile color="#204E70"
          @click="isAssetFinished = isAssetStart = isAssetEnd = isAssetFullLen = false;  isAssetType= true;">
          Back
        </v-btn>
        <!-- if Cancel is clicked all card display properties will be set to false, except for isAssetFinished. and cancelNewAsset() will execute-->
        <v-btn class="cancelButton" depressed text tile color="#204E70"
          @click="isAssetType = isAssetStart = isAssetEnd = isAssetFullLen = false; isAssetFinished = true; cancelNewAsset()">
          <u>Cancel</u>
        </v-btn>
        <!-- if Yes is clicked all card display properties will be set to false, except for isAssetFinished. and atBegin, atEnd, updateMileInfo, updateGraphic functions will execute. -->
        <v-btn class="yesButton" tile absolute outlined color="#204E70"
          @click="isAssetType = isAssetEnd = isAssetStart = isAssetFullLen = false; isAssetFinished = true; atBegin(); atEnd(); updateMileInfo(); updateGraphic();">
          <u>Yes</u>
        </v-btn>
        <!-- if No is clicked all card display properties will be set to false, except for isAssetStart. -->
        <v-btn class="noButton" tile absolute outlined color="#204E70"
          @click="isAssetType = isAssetEnd = isAssetFinished = isAssetFullLen = false; isAssetStart = true;">
          <u>No</u>
        </v-btn>
      </div>
    </v-card>
    <!-- if isAssetStart is true, this card will be displayed. All other cards will be hidden -->
    <v-card class="card" v-if="isAssetStart === true" elevation="0" tile>
      <v-card-title class="cardTitle assetTitle">
        <v-card-text class="cardText">Where Does the {{assetType}} Surface Start?</v-card-text>
      </v-card-title>
      <!-- displays selectionBegin options in v-select -->
      <v-flex v-for="(item, i) in selectionBegin" :key="i">
        <!-- on selection of item selectAssetDFO will run the associated method -->
        <v-select placeholder="Select an option" outlined dense v-model="assetStartDfo" :items="item.types"
          @input="selectAssetDFO"></v-select>
      </v-flex>
      <!-- if Cancel is clicked all card display properties will be set to false, except for isAssetFinished. and cancelDfoLocation() and resetAsset will execute-->
      <v-btn class="cnclBtnSrfc" text tile color="#204E70" absolute
        @click="isAssetType = isAssetEnd = isAssetStart = isAssetFullLen = false; isAssetFinished = true; isCanceled = true; cancelDfoLocation(); resetAsset();">
        <u>Cancel</u>
      </v-btn>
      <!-- if Back is clicked all card display properties will be set to false, except for isAssetFullLen. and cancelDfoLocation() and resetAsset will execute-->
      <v-btn class="cancelButton1" text tile color="#204E70"
        @click="isAssetStart = isAssetEnd = isAssetFinished = isAssetType = false; isAssetFullLen = true; cancelDfoLocation()">
        Back
      </v-btn>
    </v-card>
    <!-- if isAssetEnd is true, this card will be displayed. All other cards will be hidden -->
    <v-card class="card" v-if="isAssetEnd === true" elevation="0" tile>
      <v-card-title class="cardTitle assetTitle">
        <v-card-text class="cardText">Where Does the {{assetType}} Surface <span id="assetEnd">End</span>?</v-card-text>
      </v-card-title>
      <!-- displays selectionEnd options in v-select -->
      <v-flex v-for="(item, i) in selectionEnd" :key="i">
        <!-- on selection of item selectAssetDFO will run the associated method -->
        <v-select placeholder="Select an option" outlined dense v-model="assetEndDfo" :items="item.types"
          @input="selectAssetDFO" item-color="none" validate-on-blur></v-select>
      </v-flex>
      <!-- if Cancel is clicked all card display properties will be set to false, except for isAssetFinished. and cancelDfoLocation() and resetAsset will execute-->
      <v-btn class="cnclBtnSrfc" text tile color="#204E70" absolute
        @click="isAssetType = isAssetEnd = isAssetStart = isAssetFullLen = false; isAssetFinished = true; isCanceled = true; cancelDfoLocation(); resetAsset(); ">
        <u>Cancel</u>
      </v-btn>
      <!-- if Back is clicked all card display properties will be set to false, except for isAssetStart. and cancelDfoLocation() and resetAsset will execute-->
      <v-btn class="cancelButton1" text tile color="#204E70"
        @click="isAssetEnd = isAssetFinished = isAssetType = isAssetFullLen = false; isAssetStart = true; cancelDfoLocation()">
        Back
      </v-btn>
    </v-card>
    <v-card class="card" v-if="isAssetFinished=== true" absolute left flat>
      <assetAlert />
      <!-- mileInfo is an array that contains SRFC_TYPE, ASSET_LN_BEGIN, ASSET_LN_END for each asset segment -->
      <v-col v-for="(item,index) in mileInfo" :key="index">
        <v-row class="assetPosFinish" width="800px">
          <v-card-text class="assetTxtFinish">This road is <em style="color:white"
              :style="{backgroundColor:`${assetColorTable[item.SRFC_TYPE]}`}">{{item.SRFC_TYPE}}</em> between
            {{item.ASSET_LN_BEGIN}} miles<br> and {{item.ASSET_LN_END}} miles</v-card-text>
          <!-- if user is in info mode, mdi-pencil icon, EDIT text, mdi-delete icon, add another segment and DELETE text will be hidden -->
          <v-btn v-if="!infoRoad" text color="#204E70" class="btnPencil" @click="editAsset(index)">
            <v-icon>mdi-pencil</v-icon>
          </v-btn>
          <small v-if="!infoRoad" class="penciTxt">EDIT</small>
          <v-btn v-if="!infoRoad" text class="btnDelete"
            @click="deleteSurface(index);updateGraphic(); cancelDfoLocation()" :disabled="mileInfo.length === 1">
            <v-icon color="red">mdi-delete</v-icon>
          </v-btn>
          <small v-if="!infoRoad" class="deleteTxt"
            :style="[mileInfo.length === 1 ? {'color':'grey'} : {'color':'red'}]">DELETE</small>
        </v-row>
        <v-spacer></v-spacer>
      </v-col>
      <a v-if="!infoRoad"
        @click="isAssetFinished = isAssetFullLen = false; isAssetType = true; addRoadSurface(); isAddNew = true;" class="addSegment">
        <v-icon color="#204E70">mdi-plus-thick</v-icon><u class="addSegColor">Add another segment</u>
      </a>
      <v-btn v-if="!infoRoad" outlined class="nextAssetBtns" tile @click="nextStep(4); initLoadAsset('design')" color="#204E70" :disabled="!setAssetCover[0]">
        <u>Next Step</u>
      </v-btn>
    </v-card>
  </div>
</template>

<script>

import { getSelectedDFO, applyMToAsset, initLoadAssetGraphic, getGraphic } from '../roadInfo'
import { geomToMiles } from '../helper'
import { mouseHoverDfoDisplay, stopEditingPoint } from '../edit'
import {criConstants} from '../../../common/cri_constants'
import {gLayer} from '../map'
import assetAlert from '../stepperContent/assetAlert.vue'

export default {
    components: {assetAlert},
    name: 'roadSurface',
    data(){
      return{
        mileInfo:[],
        assetType: null,
        assetNull: null,
        assetStartDfo: null,
        assetEndDfo: null,
        assetFinished: [],
        isAssetType: true,
        isAssetFullLen: false,
        isAssetStart: false,
        isAssetEnd: false,
        isAssetFinished: false,
        isAssetStartDisable: false,
        isAssetEndDisable: false,
        isCanceled: false,
        isAddNew: false,
        // dropdown list of surface types
        assetTypeOpt: [{
          types:[{text: 'Paved'},
                 {text: 'Brick'},
                 {text: 'Dirt/Natural'},
                 {text: 'Gravel'},
                 {text: 'Concrete'},
                 ]
        }],
        emptyValues:[v => !!v || 'Road Name is required'],
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
        assetColorTable: criConstants.colorTable,
        
      }
    },
    methods:{
      // sets asset dfo value on cancel
      resetDfoValue(){
        this.resetDfo = 0
      },
      // deletes previous asset edit
      cancelNewAsset(){
        if(this.isAddNew === true){
          this.deleteSurface(-1)
          return;
        }
        return;
      },
      // revert assets back to previous values on cancel of edit
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
      // takes user input and runs appropriate workflow when asset is not full length
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
            this.returnDFO() 
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
            this.returnDFO()
            await this.getDfoLocation('end')
            this.isCanceled === true ? this.isAssetStart = this.isAssetType = this.isAssetFullLen = this.isAssetEnd = false : this.isAssetStart = this.isAssetType = this.isAssetEnd = this.isAssetFullLen = false;
            this.isCanceled === true ? this.isAssetFinished = true : this.isAssetFinished = true;
            this.updateMileInfo();
            this.updateGraphic();
            this.cancelDfoLocation()
            this.resetDfoValue()
            this.isAddNew = false
            this.getDfoBool = false
          }
        }
        // running the method with user input
        type[`${text}`]()
      },

      // reset card values when user changes asset value
      selectAssetType(text){
        this.assetType = text
        this.assetNull = null
        this.isAssetType = this.isAssetEnd = this.isAssetFinished = this.isAssetStart = false;
        this.isAssetFullLen = true;
      },
      // display asset graphic in map
      initLoadAsset(asset){
        initLoadAssetGraphic(asset)
      },
      // stepper advance
      nextStep(x){
        this.returnStep = x
      },
      // cancel editing 
      cancelDfoLocation(){
        stopEditingPoint()
      },
      // update asset value and description displayed in card
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
      // returns m-value of user click on map (both start and end of route selection)
      async getDfoLocation(type){
        try{
          let returnSelectedDFO = await getSelectedDFO(this.objid);
          if(!returnSelectedDFO) return;
          type === 'start' ? this.assetStartDfo = Number(returnSelectedDFO[0].toFixed(3)) : this.assetEndDfo = Number(returnSelectedDFO[0].toFixed(3))
        }
        catch{
          console.log("canceled")
        }
       
      },

      // both methods below get m-value from graphic when user not selecting from map
      atBegin(){
        this.cancelDfoLocation();
        let id = gLayer.graphics.items.filter(x=>x.attributes.objectid === this.objid);
        this.assetStartDfo = Number(id[0].geometry.paths[0][0][2].toFixed(3))
      },

      atEnd(){
        this.cancelDfoLocation();
        let id = gLayer.graphics.items.filter(x=>x.attributes.objectid === this.objid);
        this.assetEndDfo = Number(id[0].geometry.paths[0].at(-1)[2].toFixed(3))
        this.getDfoBool = false
      },
      // redraw graphic on completion of asset change
      updateMileInfo(){
        this.$set(this.mileInfo.at(this.editIndex), 'SRFC_TYPE', this.assetType)
        this.$set(this.mileInfo.at(this.editIndex), 'ASSET_LN_BEGIN', Number(this.assetStartDfo))
        this.$set(this.mileInfo.at(this.editIndex), 'ASSET_LN_END', Number(this.assetEndDfo))
        this.$set(this.mileInfo.at(this.editIndex), 'OBJECTID', this.objid)
        this.checkFullCoverage();
        applyMToAsset(this.mileInfo) // TODO -- replace this with getCoordsRange (need to import)
      },
      // asset(s) must cover entire route
      checkFullCoverage(){
        let beginEndArr = []
        this.mileInfo.sort((a,b)=>(a.ASSET_LN_BEGIN > b.ASSET_LN_BEGIN)? 1:-1)
        this.mileInfo.forEach(function(x){
          beginEndArr.push([x.ASSET_LN_BEGIN, x.ASSET_LN_END])
        })
        beginEndArr.sort((a,b)=>(a[0] > b[0])? 1:-1)
        this.setAssetCover = beginEndArr
      },
      // updates graphic object in store which gets pushed to EDITS layer on save
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
            gLayer.graphics.items[z].attributes.roadbedSurface = JSON.stringify(x)
            this.rdbdSurf = JSON.parse(gLayer.graphics.items[z].attributes.roadbedSurface)
          }
        }
      },
      // reset card presentation when a new road is selected 
      // TODO -- may be duplicated in watcher; need to check
      resetItems(){
        this.assetType=this.assetStartDfo=this.assetEndDfo = null;
        this.isAssetFinished = false
        this.isAssetType = true
        this.editIndex = -1
      },
      // deletes an asset break from containing array (on user click 'delete')
      deleteSurface(index){
        this.mileInfo.splice(index, 1)
        this.checkFullCoverage()
        applyMToAsset(this.mileInfo)
      },
      // adds new item to asset array when users selects 'Add another segment'
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
          getGraphic()
          this.feature = false;
          this.graphic = true;
          //this.numLane = roadInfo.getLan
          this.stepperClose = true;
          //this.rdbdSurf
        }, 
        immediate: true,
      },
      rdbdSurf:{
      handler: function () {
        if (this.mileInfo.length) {
          this.mileInfo.length = 0
        }
        if (this.rdbdSurf) {
          //let lenghtArr = this.rdbdSurf.length
          for (let i = 0; i < this.rdbdSurf.length; i++) {
            this.mileInfo.push({
              SRFC_TYPE: this.rdbdSurf[i].SRFC_TYPE_ID,
              ASSET_LN_BEGIN: Number(this.rdbdSurf[i].ASSET_LN_BEGIN_DFO_MS.toFixed(3)),
              ASSET_LN_END: Number(this.rdbdSurf[i].ASSET_LN_END_DFO_MS.toFixed(3)),
              EDIT: true,
              OBJECTID: this.objid
            })
          }
          this.isAssetFinished = true
          this.isAssetType = this.isAssetStart = this.isAssetEnd = this.isAssetFullLen = false
        }
        else {
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
        let len = geomToMiles(this.roadGeometry, true, 3).toFixed(3)
        this.$set(this.mileInfo.at(-1), 'ASSET_LN_END', Number(len))
      }
    }
  },
    computed:{
      getDfoBool: {
        get() {
          return this.$store.state.isDfoReturn
        },
        set(bool) {
          this.$store.commit('setIsDfoReturn', bool)
        }
      },
    // newHeight(x){
    //   return x+76
    // },
    returnStep: {
      get() {
        return this.$store.state.stepNumber
      },
      set(x) {
        this.$store.commit('setStepNumber', Number(x))
      }
    },
    rdbdSurf: {
      get() {
        if (typeof (this.$store.state.roadbedSurface) === 'string') {
          return JSON.parse(this.$store.state.roadbedSurface)
        }
        else {
          return this.$store.state.roadbedSurface
        }
      },
      set(x) {
        this.$store.commit('setRoadbedSurface', JSON.stringify(x))
      }
    },
    objid: {
      get() {
        return this.$store.state.objectid
      }
    },
    setAssetCover: {
      get() {
        return this.$store.state.assetCoverage
      },
      set(x) {
        this.$store.commit('setAssetCoverage', x)
      }
    },
    infoRoad: {
      get() {
        return this.$store.state.infoRd
      },
      set(info) {
        this.$store.commit('setInfoRd', info)
      }
    },
    resetDfo: {
      get() {
        return this.$store.state.dfoReturn
      },
      set(dfo) {
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
/* .card {
  border-radius: 0px;
  max-width: 99%;
} */

/* .assetTitle {
  background-color: #204E70;
  color: white;
  height: 30px;
  width: 100%;
  font-size: 25px;
} */

/* .cancelButton {
  bottom: 10px;
  left: 300px;
  padding: 0px;
} */

/* .continueButton {
  bottom: 9px;
  padding: 0px;
  right: 160px;
} */

/* .cardText {
  position: relative;
  right: 18px;
  bottom: 27px;
  font-size: 15px;
  text-align: left;
} */

/* .nextAssetBtns {
  position: absolute;
  right: 0%;
  top: 106%;
} */

/* .mileButton {
  top: 75px;
} */

/* .chooseMapBtn {
  top: 120px;
} */

/* #assetEnd {
  font-weight: bold;
  text-decoration: underline;
  display: -moz-inline-stack;
  display: inline-block;
  animation: pulse-title 2s linear;
} */

/* @keyframes pulse-title {
  0% {
    transform: scale(0);
  }

  50% {
    transform: scale(1.3);
  }

  70% {
    transform: scale(1);
  }

  80% {
    transform: scale(.5);
  }

  90% {
    transform: scale(.1);
  }

  100% {
    transform: scale(.2)
  }
} */
</style>