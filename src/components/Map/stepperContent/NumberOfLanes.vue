<template>
<!-- <v-card height="200px" flat> -->
  <div class="scroller" style="height:250px;"> 
  <!-- Loop through asset breaks assigned in rdbdSurf. Assign surface type lable and dfo values -->
  <!-- <v-col v-for="(item,index) in rdbdSurf" :key="index" > -->
    <v-card v-if="isAssetType=== true" >
        <v-card-title class="surfaceTitle">
          <v-card-text style="bottom:30px; position:relative; font-size: 15px; text-align: left;">What's the Number of Lanes?</v-card-text>
        </v-card-title>
        <v-select v-model="assetType" :items="assetTypeOpt" outlined dense placeholder="Pick number of lanes ?"></v-select>
        <v-btn style="bottom: 10px; padding:0px; left:50px;" depressed plain @click="isAssetType = isAssetStart = isAssetEnd = false; isAssetFinished = true;">
          Cancel
        </v-btn>
        <v-btn style="bottom: 10px; padding:0px; right:1px;" tile absolute outlined @click="isAssetType = isAssetEnd = isAssetFinished = false; isAssetStart = true;">
          <u>Continue</u>
        </v-btn>
    </v-card>

    <v-card v-if="isAssetStart === true">
      <v-card-title class="surfaceTitle">
        <v-card-text class="cardText">Where Does the {{assetType}} Start?</v-card-text>
      </v-card-title>
        <v-btn absolute left small @click="atBegin(); isAssetStartDisable=false; cancelDfoLocation()" color="#15648C" text active-class="border" style="top:35px;" elevation="0">
          <v-icon style="padding:0px;">mdi-map-marker</v-icon>At The beginning of the Road
        </v-btn>
        <v-col style="position:absolute; right: 80px; top:50px; font-size: 13px;">OR</v-col>
        <v-btn tile class="mileButton" absolute left small @click="isAssetStartDisable=true; cancelDfoLocation()" color="#15648C" text active-class="border" style="top: 80px; width: 130px;">
          <v-icon style="padding:0px;">mdi-plus</v-icon>At this mile: 
        </v-btn>
        <v-text-field @click="isAssetStartDisable=true;" :solo="isAssetStartDisable ? false: true" :flat="isAssetStartDisable ? false: true" class="enterMile" v-model="assetStartDfo" :disabled="!isAssetStartDisable" dense absolute :outlined="isAssetStartDisable" :label="isAssetStartDisable ? 'Enter Mile' : ''" :style="[isAssetStartDisable ? {'position': 'relative', 'top':'44px', 'left':'160px'} : {'position': 'relative', 'top':'42px', 'left':'140px'}]"></v-text-field>
        <v-col style="position:absolute; right: 80px; top:95px; font-size: 13px;">OR</v-col>
          <v-btn tile class="chooseMapBtn" absolute left small @click="getDfoLocation('start'); isAssetStartDisable=false" color="#15648C" text active-class="border" style="top:130px">
            <v-icon style="padding:0px;">mdi-map-plus</v-icon>Choose on the Map
          </v-btn>
          <v-btn class="cancelButton" depressed plain @click="isAssetStart = isAssetEnd = isAssetFinished = false; isAssetType = true;" style="bottom: 20px; right:10px;">
            Cancel
          </v-btn>
          <v-btn class="continueButton" absolute outlined tile @click="isAssetStart =  isAssetType = isAssetFinished= false; isAssetEnd = true;" style="bottom: 20px; right:10px;">
            <u>Continue</u>
          </v-btn>
    </v-card>

    <v-card v-if="isAssetEnd === true">
      <v-card-title class="surfaceTitle" style="border: #E64545 2px solid">
        <v-card-text class="cardText">Where Does the {{assetType}} End?</v-card-text>
      </v-card-title>
      <v-btn absolute left small @click="atEnd(); isAssetEndDisable=false; cancelDfoLocation()" color="#15648C" text active-class="border" style="top:35px;">
        <v-icon style="padding:0px;">mdi-map-marker</v-icon>At The End of the Road
      </v-btn>
      <v-col style="position:absolute; right: 80px; top:50px; font-size: 13px;">OR</v-col>
      <v-btn class="mileButton" absolute left small @click="isAssetEndDisable=true; cancelDfoLocation()" color="#15648C" text active-class="border" style="top: 80px; width: 130px;">
        <v-icon style="padding:0px;">mdi-plus</v-icon>At this mile: 
      </v-btn>
      <v-text-field  @click="assetEndDfo=true;" :solo="isAssetEndDisable ? false: true" :flat="isAssetEndDisable ? false: true" class="enterMile" v-model="assetEndDfo" :disabled="!isAssetEndDisable" dense absolute :outlined="isAssetEndDisable" :label="isAssetEndDisable ? 'Enter Mile' : ''" :style="[isAssetEndDisable ? {'position': 'relative', 'top':'44px', 'left':'160px'} : {'position': 'relative', 'top':'42px', 'left':'140px'}]"></v-text-field>
        <v-col style="position:absolute; right: 80px; top:95px; font-size: 13px;">OR</v-col>
        <v-btn class="chooseMapBtn" absolute left small @click="getDfoLocation('end'); isAssetEndDisable=false" color="#15648C" text active-class="border" style="top:130px">
          <v-icon style="padding:0px;">mdi-map-plus</v-icon>Choose on the Map
        </v-btn>
        <v-btn class="cancelButton" depressed plain @click="isAssetEnd = isAssetType = isAssetFinished = false; isAssetStart = true" style="bottom: 20px; right:10px;">
          Cancel
        </v-btn>
        <v-btn class="continueButton" absolute outlined tile @click="isAssetEnd = isAssetStart = isAssetType = false;  isAssetFinished = true; updateMileInfo(); updateGraphic();" style="bottom: 20px; right:10px;">
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
      <a @click="isAssetFinished = false; isAssetType = true; addRoadSurface();" style="position: relative; right:20px; font-size: small; top: 10px; padding-bottom: 5px;"><u>Click here to add another segment</u></a>
  
      <!-- <v-btn depressed plain class="nextAssetBtns" @click="isAssetEnd = false; isAssetStart = true; isAssetFinished=false; isAssetType = false; nextStep(3)"> 
        Cancel
      </v-btn> -->
      <!-- <v-btn outlined class="nextAssetBtns" tile @click="nextStep(5)" color="#15648C"> 
        <u>Continue</u>
      </v-btn> -->
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
    nextStep(x){
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
      },
    async getDfoLocation(type){
      let returnSelectedDFO = await getSelectedDFO(this.objid);
      type === 'start' ? this.assetStartDfo = Number(returnSelectedDFO[0].toFixed(3)) : this.assetEndDfo = Number(returnSelectedDFO[0].toFixed(3))
    },

    atBegin(){
      this.cancelDfoLocation();
      let id = gLayer.graphics.items.filter(x=>x.attributes.objectid === this.objid);
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
              console.log('numLanes cleared')
              this.mileInfo.length = 0
              this.addRoadSurface()
            }
        let countG = await getGraphic()
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
          for(let i=0; i < this.numLanes.length; i++){
            this.mileInfo.push({
              SRFC_TYPE: this.numLanes[i].SRFC_TYPE_ID,
              ASSET_LN_BEGIN: this.numLanes[i].ASSET_LN_BEGIN_DFO_MS,
              ASSET_LN_END: this.numLanes[i].ASSET_LN_END_DFO_MS,
              EDIT: true,
              OBJECTID: this.objid
            })
          }
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
.border{
  border: #15648C solid 2px;
}

.enterMile{
  width:100px;
  top:38px;
  left:150px;
  height:160px;
}

.cancelButton{
  bottom: 50px;
  left: 20px;
  padding:0px;  
}
.continueButton{
  bottom: 50px;
  padding:0px;
  right:1px;
}
.cardText{
  position:relative;
  padding: 0%;
  bottom:13px;
  font-size: 14px;
  text-align: left;
}
.nextAssetBtns{
  left:3px;
  top:30px;
}
.mileButton{
  top:75px;
}
.chooseMapBtn{
  top:120px;
}
</style>