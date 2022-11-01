<template>
  <div class="totalDiv"> 
  <!-- Loop through asset breaks assigned in rdbdSurf. Assign surface type lable and dfo values -->
    <v-card class="card" v-if="isAssetType=== true" elevation="0" tile>
      <v-card-title class="cardTitle surfaceTitle">
        <v-card-text class="cardText">What's the Design Type?</v-card-text>
      </v-card-title>
      <v-flex v-for="(item, index) in assetTypeOpt" :key="index">
        <v-select v-model="assetType" :items="item.types" outlined dense placeholder="Pick a design type" @change="selectAssetType" ></v-select>          
      </v-flex>
      <v-btn class="cancelButton1" text tile color="#204E70" @click="isAssetType = isAssetStart = isAssetEnd = false; isAssetFinished = true; cancelNewAsset()">
        <u>Cancel</u>
      </v-btn>
      <v-btn class="skipButton1" tile absolute outlined color="#204E70" @click="isAssetType = isAssetEnd = isAssetFinished = isAssetStart = false; isAssetFullLen = true;">
        <u>Skip</u>
      </v-btn>
    </v-card>

    <v-card class="card" v-if="isAssetFullLen === true" height="80" elevation="0" tile>
      <v-card-title class="cardTitle surfaceTitle">
        <v-card-text class="cardText">Is the {{assetType}} Design full length?</v-card-text>
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
      <v-card-title class="cardTitle surfaceTitle">
        <v-card-text class="cardText">Where Does the {{assetType}} Start?</v-card-text>
      </v-card-title>
      <v-flex v-for="(item, i) in selectionBegin" :key="i">
        <v-select placeholder="Select an option" outlined dense v-model="assetStartDfo" :items="item.types" @input="selectAssetDFO" ></v-select>
      </v-flex>
      <v-btn class="cnclBtnSrfc" text tile color="#204E70" absolute @click="isAssetType = isAssetEnd = isAssetStart = isAssetFullLen = false; isAssetFinished = true; isCanceled = true; cancelDfoLocation(); resetAsset();">
        <u>Cancel</u>
      </v-btn>
      <v-btn class="contBtnSrfc" text tile color="#204E70" @click="isAssetStart = isAssetEnd = isAssetFinished = isAssetType = false; isAssetFullLen = true; cancelDfoLocation()">
        Back
      </v-btn>
    </v-card>

    <v-card class="card" v-if="isAssetEnd === true" elevation="0" tile>
      <v-card-title class="cardTitle surfaceTitle">
        <v-card-text class="cardText">Where Does the {{assetType}} <span id="assetEnd">End</span>?</v-card-text>
      </v-card-title>
      <v-flex v-for="(item, i) in selectionEnd" :key="i">
        <v-select placeholder="Select an Option" outlined dense v-model="assetEndDfo" :items="item.types" @input="selectAssetDFO" item-color="none"></v-select>
      </v-flex>
      <v-btn class="cnclBtnSrfc" text tile color="#204E70" absolute @click="isAssetType = isAssetEnd = isAssetStart = isAssetFullLen = false; isAssetFinished = true; isCanceled = true; cancelDfoLocation(); resetAsset();">
        <u>Cancel</u>
      </v-btn>
      <v-btn class="contBtnSrfc" text tile color="#204E70" @click="isAssetEnd = isAssetFinished = isAssetType = isAssetFullLen = false; isAssetStart = true; cancelDfoLocation()">
        Back
      </v-btn>
    </v-card>
    
    <v-card class="card" v-if="isAssetFinished === true" absolute left flat>
      <assetAlert/>
      <v-col  v-for="(item,index) in mileInfo" :key="index">
        <v-row class="assetPosFinish" width="800px"> <!-- add for loop to display items; previous button should create an object, which can be displayed below info -->
          <v-card-text class="assetTxtFinish">This road is <em style="color:white" :style="{backgroundColor:`${assetColorTable[item.SRFC_TYPE]}`}">{{item.SRFC_TYPE}}</em> between {{item.ASSET_LN_BEGIN}} miles<br> and {{item.ASSET_LN_END}} miles</v-card-text>
          <v-btn v-if="!infoRoad" text color="#204E70" class="btnPencil" @click="editAsset(index)"><v-icon>mdi-pencil</v-icon></v-btn>
          <small v-if="!infoRoad" class="penciTxt">EDIT</small>
          <v-btn v-if="!infoRoad" text class="btnDelete" @click="deleteSurface(index); updateMileInfo();updateGraphic();cancelDfoLocation();" :disabled="mileInfo.length === 1"><v-icon color="red" >mdi-delete</v-icon></v-btn>
          <small v-if="!infoRoad" class="deleteTxt" :style="[mileInfo.length === 1 ? {'color':'grey'} : {'color':'red'}]">DELETE</small>
        </v-row>
        <v-spacer></v-spacer>
      </v-col>
      <a v-if="!infoRoad" @click="isAssetFinished = isAssetFullLen = false; isAssetType = true; addRoadSurface(); isAddNew = true;" class="addSegment"><v-icon color="#204E70">mdi-plus-thick</v-icon><u class="addSegColor">Add another segment</u></a>

      <v-btn v-if="!infoRoad" outlined class="nextAssetBtns" tile @click="nextStep(5); initLoadAsset('numLane'); cancelDfoLocation()" color="#204E70" :disabled="!setAssetCover[0]"> 
        <u>Next Step</u>
      </v-btn>
    </v-card>
  </div>
</template>

<script>

import {mouseHoverDfoDisplay, getSelectedDFO, applyMToAsset, stopEditingPoint, initLoadAssetGraphic} from '../editFunc'
import {criConstants} from '../../../common/cri_constants'
import {gLayer} from '../map'
import assetAlert from '../stepperContent/assetAlert.vue'
export default {
    components: {assetAlert},
    name: 'roadDesign',
    data(){
      return{
        mileInfo:[],
        assetNull: null,
        assetType: null,
        assetStartDfo: null,
        assetEndDfo: null,
        assetFinished: [],
        isDisableBtn: false,
        isAssetType: true,
        isAssetFullLen: false,
        isAssetStart: false,
        isAssetEnd: false,
        isAssetFinished: false,
        isAssetEndDisable: false,
        isCanceled: false,
        isAddNew: false,
        isAssetStartDisable: false,
        assetTypeOpt: [{
          types:[{text: 'One Way'},
                 {text: 'Two-way'},
                 {text: 'Boulevard'}]
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
            // this.isAssetStart = this.isAssetType = this.isAssetFinished = this.isAssetFullLen = false; 
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
            this.cancelDfoLocation();
            this.isAddNew = false
          },
          'Choose the ending point on the map': async ()=>{
            this.isAssetStartDisable=false;
            this.returnDFO()
            await this.getDfoLocation('end')
            this.isCanceled === true ? this.isAssetStart = this.isAssetType = this.isAssetFullLen = this.isAssetEnd = false : this.isAssetStart = this.isAssetType = this.isAssetEnd = this.isAssetFullLen = false;
            // this.isAssetStart = this.isAssetType = this.isAssetFinished = this.isAssetFullLen = false; 
            this.isCanceled === true ? this.isAssetFinished = true : this.isAssetFinished = true;
            this.updateMileInfo();
            this.updateGraphic();
            this.cancelDfoLocation()
            this.resetDfoValue()
            this.isAddNew = false
            this.getDfoBool = false
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
      
      initLoadAsset(asset){
        initLoadAssetGraphic(asset)
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
            gLayer.graphics.items[z].attributes.roadbedDesign = JSON.stringify(x)
            this.rdbdDesign = JSON.parse(gLayer.graphics.items[z].attributes.roadbedDesign)
          }
        }
        //
        //id[0] = this.rdbdSurf
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
          // if(document.getElementById('currentSurf')){
          //   this.rdbdSurf.splice(index, 1) 
          // }
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
      // setAssetCover:{
      //   handler: function(){
      //     this.isDisableBtn = setAssetCover[0]
      //     //this.rdbdSurf
      //   }, 
      //   immediate: true,
      // },
      objid:{
        handler: async function(){
          this.resetItems();
          if(this.mileInfo.length){
            this.mileInfo.length = 0
            this.addRoadSurface()
          }
          //let countG = await getGraphic()
          //this.feature = false;
          //this.graphic = true;
          //this.graphicObj = countG
            //this.numLane = roadInfo.getLan
          //this.stepperClose = true;
            //this.rdbdSurf
        }, 
        immediate: true,
      },
      rdbdDesign:{
        handler: function(){
          if(this.mileInfo.length){
            this.mileInfo.length = 0
          }
          if(this.rdbdDesign){
            for(let i=0; i < this.rdbdDesign.length; i++){
              this.mileInfo.push({
                SRFC_TYPE: this.rdbdDesign[i].SRFC_TYPE_ID,
                ASSET_LN_BEGIN: this.rdbdDesign[i].ASSET_LN_BEGIN_DFO_MS,
                ASSET_LN_END: this.rdbdDesign[i].ASSET_LN_END_DFO_MS,
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
      returnStep:{
        get(){
          return this.$store.state.stepNumber
        },
        set(x){
          this.$store.commit('setStepNumber', Number(x))
        }
      },
      rdbdDesign:{
        get(){
          if(typeof(this.$store.state.roadbedDesign) === 'string'){
            return JSON.parse(this.$store.state.roadbedDesign) 
          }
          else{
            return this.$store.state.roadbedDesign
          }
        },
        set(x){
          this.$store.commit('setRoadbedDesign',JSON.stringify(x))
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
    }
}
</script>
<style scoped>
/* .card{
  border-radius: 0px;
  max-width: 99%;
} */
/* .surfaceTitle{
  background-color: #204E70;
  color: white;
  height:30px;
  width: 100%;
  font-size: 25px; 
} */

.enterMile{
  width:100px;
  top:38px;
  left:150px;
  height:160px;
}

/* .cancelButton{
  bottom: 10px;
  left: 300px;
  padding:0px;  
} */
/* .continueButton{
  bottom: 9px;
  padding:0px;
  right:160px;
} */

/* .cardText{
  position:relative;
  right: 18px;
  bottom:27px;
  font-size: 15px;
  text-align: left;
} */
/* .nextAssetBtns{
  position: absolute;
  right:0%;
  top: 106%;
} */
/* .mileButton{
  top:75px;
} */
/* .chooseMapBtn{
  top:120px;
} */
/* #assetEnd{
  font-weight: bold;
  text-decoration: underline;
  display: -moz-inline-stack;
  display: inline-block;
  animation: pulse-title 2s linear;
} */
/* @keyframes pulse-title{
  0%{
    transform: scale(0);
  }
  50%{
    transform: scale(1.3);
  }
  70%{
    transform: scale(1);
  }
  80%{
    transform: scale(.5);
  }
  90%{
    transform: scale(.1);
  }
  100%{
    transform: scale(.2)
  }
} */
</style>