<!-- Main stepper component -->
<template>
<v-container>
  <div id="stepper">
    <v-stepper
    style="margin-bottom:unset; border-radius: 0px;"
    v-model="e1"
    vertical
    non-linear
    class="mb-12;"
    max-width="486"
    min-width="0"
    :height="imageHeight"
    >
    <v-stepper-header class="stepHead" v-if="!forMod && !forInfo">Add a new Road</v-stepper-header>
    <v-stepper-header class="stepHead" v-if="forMod && !forInfo">Edit Road</v-stepper-header>
    <v-stepper-header class="stepHead" v-if="forInfo">Road Information</v-stepper-header>
    <v-stepper-step
      :editable="setAssetCover[0]"
      step="1"
      color="#204E70"
      @click="showGIDVerts(); removeAsstPt();"
      class="font-weight-regular; body-1;">
      Length: <strong>{{fetchLength}} Miles</strong>
    </v-stepper-step>

    <v-stepper-content step="1">
      <editVerts/>
      <!-- Disabled -- dictates whether fields in the stepper form are editable or not.  -->
    </v-stepper-content>

    <v-stepper-step 
      :editable="setAssetCover[0] === true || setAssetCover[0] === undefined ? true: setAssetCover[0]"
      step="2"
      color="#204E70"
      @click="complete()"
      >
      Road Name: <strong>{{fetchRoadName.toUpperCase()}}</strong>
    </v-stepper-step>
    
    <v-stepper-content step="2">
      <!-- Ternery statement if disabled property = true and graphic property = true then disable the v-select tag -->
      <roadName/>
    </v-stepper-content>

    <v-stepper-step step="3" color="#204E70" :editable="setAssetCover[0] === null || setAssetCover[0] === undefined ? true: setAssetCover[0]" v-on="setAssetCover[0] === true ? {'click' : () =>{removeAsstPt();complete();initLoadAsset('surface')}} : {}" >
      Road Surface: <strong>{{fetchRoadSurface}}</strong>
    </v-stepper-step>
    <v-stepper-content step="3" >
      <roadSurface/>
    </v-stepper-content>

    <v-stepper-step
      color="#204E70"
      :editable="setAssetCover[0] === null || setAssetCover[0] === undefined ? true: setAssetCover[0]"
      step="4"
      v-on="setAssetCover[0] === true ? {'click' : () =>{removeAsstPt(); complete();initLoadAsset('design')}} : {}"
      ><!-- Get asset breaks and draw graphic points -->
      Road Design: <strong>{{fetchRoadDesign}}</strong>
    </v-stepper-step>
     <v-stepper-content step="4">
      <roadDesign/>
    </v-stepper-content>

    <v-stepper-step color="#204E70" step="5" :editable="setAssetCover[0] === null || setAssetCover[0] === undefined ? true: setAssetCover[0]" v-on="setAssetCover[0] === true ? {'click' : () =>{removeAsstPt(); complete();initLoadAsset('numLane')}} : {}">
      Number of Lanes: <strong>{{fetchNumLanes}}</strong>
    </v-stepper-step>
    <v-stepper-content step="5">
      <numOfLane/>
    </v-stepper-content>
      
    <v-btn v-if="!forInfo" id="cnclBtnEdit" depressed tile text color="#204E70" @click="firstAddToMap ? discardAlertQuest = true : cancel(); cancelStepper();"><u>Cancel</u></v-btn>
    <v-btn v-if="!forInfo" tile id="saveBtnEdit" depressed :disabled="!setAssetCover[0] || this.geomChecks > 0" color="#204E70" text @click="saveAttri();"><u>Save</u></v-btn>
      
    <v-btn v-if="!forInfo" depressed tile color ="#E64545" text id="discardBtnEdit" @click="discardAlertQuest = true">Discard Edit</v-btn>
    <v-btn v-else id="cancelInfo" tile outlined text color="#204E70" @click="cancel()"><u>Cancel</u></v-btn>

    <a v-if="!forInfo" @click="dialog=true" id="addCommentBtn">Add An Optional Comment</a>
    <v-card elevation="0" class="overflow-y-auto" id="comment" v-if="!forInfo" v-scroll.self="onScroll" >
      <div>
        <v-card-text id="commentTxt">{{comment}}</v-card-text>
      </div>
    </v-card>
    <v-dialog v-model="dialog" persistent>
      <v-card id="dialogComment">
        <v-card-title class="surfaceTitle">
          <v-card-text id="dialogCommentTxt">Comments</v-card-text>
        </v-card-title>
        <v-row no-gutters id="dialogCommentBox">
          <v-textarea v-model="comment"></v-textarea>
        </v-row>
        <v-btn outlined tile color="#204E70" @click="dialog=false; saveComment()" id="dialogSaveBtn"><u>Save</u></v-btn>
        <v-btn text tile color="#204E70" @click="dialog=false; cancelComment()" id="dialogCancelBtn"><u>Cancel</u></v-btn>
      </v-card>
    </v-dialog>
  </v-stepper>

  <v-footer v-if="steppClose && editorInfo" style="position: absolute; background: #204E70; height: 3%; width: 97%;">
    <p style="color: white; font-size: .8rem; position:relative; bottom: .6vh; left: .4rem;">Editor Name: {{editName}}</p>
    <p style="color: white; font-size: .8rem; position:relative; bottom: .6vh; left: 5rem;">Edit Date: {{editDt}}</p>
  </v-footer>

  </div>
  <!-- alert used to confirm that the sketch has been removed -->
  <sketchAlert v-if="discardAlert"/>
  <v-dialog persistent v-model="discardAlertQuest">
    <v-card id="discardSketch" v-model="discardAlertQuest" elevation="10">
      <v-card-title class="cardTitle"><p id="discardTitleTxt">Confirm Discard</p></v-card-title>
      <v-card-text id="discardTxt">Are you sure you want to discard this edit?</v-card-text>
      <v-btn id="discardYesBtn" tile outlined color="#14375A" @click="discardAlert=true; discardAlertQuest = false; delGraphic(); cancel()"><u>YES</u></v-btn>
      <v-btn id="discardNoBtn" depressed tile text color="#14375A" @click="discardAlertQuest = false"><u>NO</u></v-btn>
    </v-card>
  </v-dialog>
  <confirmAlertSuccess v-if="successAlert"/>
  <finalCheck v-if="finalCheck === true"/>

  </v-container>
</template>

<script>
//importing functions
import { stopEditingPoint, showVerticies, removeHighlight, removeGraphic, sketchCompete, cancelEditStepper, saveToEditsLayer, geomCheck} from './Map/edit'
import { removeAsstPoints, initLoadAssetGraphic } from './Map/roadInfo'
import { geomToMiles } from './Map/helper'
import { gLayer } from './Map/map'
import * as geometryEngine from '@arcgis/core/geometry/geometryEngine'
//importing vue components
import roadName from '../components/Map/stepperContent/RoadName.vue'
import roadDesign from '../components/Map/stepperContent/RoadDesign.vue'
import roadSurface from './Map/stepperContent/RoadSurfaces.vue'
import numOfLane from './Map/stepperContent/NumberOfLanes.vue'
import editVerts from './Map/stepperContent/EditVerts.vue'
import confirmAlertSuccess from '../components/Map/stepperContent/confirmAlertsSUCCESS.vue'
import sketchAlert from '../components/Map/stepperContent/discardAlert.vue'
import finalCheck from '../components/Map/stepperContent/saveAssetCheck.vue'

export default {
    name:"stepper",
    components:{roadName,roadDesign, roadSurface, numOfLane, editVerts, confirmAlertSuccess, sketchAlert, finalCheck},
    props:{
      received: Boolean
    },
    data () {
      return {
        e1: 1,
        counter:0,
        beginDFO:null,
        endDFO:null,
        forMod: false,
        forEdit: true,
        graphicObj: {},
        graphic: false,
        feature: false,
        forInfo: false,
        clickCountF:0,
        cursor: false,
        bdfo: false,
        edfo: true,
        assetLnInfo: null,
        disabled: false,
        successAlert: false,
        discardAlertQuest: false,
        discardAlert: false,
        dialog: false,
        comment: '',
        oldComment: '',
        fetchLength:0,
        fetchRoadName: null,
        fetchRoadSurface: null,
        fetchRoadDesign: null,
        fetchNumLanes: null,
        scrollInvoked: 0,
        geomChecks: 0,
        editName: null,
        editDt: null,
         
        dfoRules:{
          DFO: value => !!value || 'Required',
          gather: value => {
            document.getElementsByTagName('input')
            return value
          }
        }
      }
    },
    watch:{
      discardAlert(bool){
        if(!bool) return
        setTimeout(()=>{this.discardAlert = false}, 3000)
      },
      successAlert(bool){
        if(!bool) return
        setTimeout(()=>{this.successAlert = false}, 3000)
      },
      returnStep:{
        handler: function(){
          this.e1 = this.returnStep
        },
        immediate: true,
      },
      nextStep:{
        handler:function(){
          return this.nextStep
        }
      },
      modifyRoad:{
        handler: function(){
          this.forMod = this.modifyRoad
        },
        immediate: true,
      },
      infoRoad:{
        handler: function(){
          this.forInfo = this.infoRoad
        },
        immediate: true,
      },
      editExistingRd:{
        handler: function(){
          this.forEdit = this.editExistingRd
        },
        immediate: true,
      },
      
      e1:{
        handler: function(){
          this.returnStep = this.e1

        },
        immediate: true,
      },
      roadGeometry: {
        handler: function(){
          if(this.roadGeometry.length === 0) return
          let miles = geomToMiles(this.roadGeometry, true, 3)
          this.fetchLength = `${miles}`
        },
        immediate: true
      },
      roadName: {
        handler: function(){
          if(!this.roadName){
            this.fetchRoadName = 'NAME HAS NOT BEEN DEFINED'
            return;
          }
          
          if (this.roadName.length){
            let prfx = reformatName(this.roadName[0].prefix);
            let name = reformatName(this.roadName[0].streetName);
            let sfx =  reformatName(this.roadName[0].suffix);
            let type = reformatName(this.roadName[0].streetType);
          
            this.fetchRoadName = `${prfx} ${name} ${type} ${sfx}`
          }
          
          function reformatName (attr){
              if (attr === "NOT APPLICABLE" || attr === "OTHER" || attr === null || attr === '') {
                return '';
              }
              return attr;
            }
        },
      immediate: true
      },
      rdbdSurf: {
        handler: function(){
          if(!this.rdbdSurf) return
          let surf = this.rdbdSurf[0].SRFC_TYPE_ID
          this.fetchRoadSurface = this.rdbdSurf.length > 1 ? "MULTIPLE" : `${surf}`
        },
        immediate: true
      },
      roadDesign: {
        handler: function(){
          if(!this.roadDesign) return
          let dsgn = this.roadDesign[0].SRFC_TYPE_ID
          this.fetchRoadDesign = this.roadDesign.length > 1 ? "MULTIPLE" : `${dsgn}`
        },
        immediate: true
      },
      numLane: {
        handler: function(){
          if(!this.numLane) return
          let lanes = this.numLane[0].SRFC_TYPE_ID
          this.fetchNumLanes = this.numLane.length > 1 ? "MULTIPLE" : `${lanes}`
        },
        immediate: true
      },
      editorInfo: {
        handler: function(){
          if(!this.editorInfo) return;
          if(!this.editorInfo[1]){
            this.editName = this.editorInfo[2]
            let ampm = this.editorInfo[3][1] >= 12 ? 'pm' : 'am'
            let editHour = this.editorInfo[3][1] > 12 ? this.editorInfo[3][1] - 12 : this.editorInfo[3][1]
            this.editDt = `${this.editorInfo[3][0]} ${editHour}:${String(this.editorInfo[3][2]).padStart(2,'0')} ${ampm}`
            return
          }
          let ampm = this.editorInfo[1][1] > 12 ? 'pm' : 'am'
          let editHour = this.editorInfo[1][1] > 12 ? this.editorInfo[1][1] - 12 : this.editorInfo[1][1]
          this.editName = this.editorInfo[0]
          this.editDt = `${this.editorInfo[1][0]} ${editHour}:${String(this.editorInfo[1][2]).padStart(2,'0')} ${ampm}`
        },
        immediate: true
      },

      newDfo(){
        this.emptyMileArr()
        let newRdbd = []
        for(let d in this.newDfo){
          newRdbd.push({ASSET_LN_BEGIN_DFO_MS: this.newDfo[d].ASSET_LN_BEGIN_DFO_MS, ASSET_LN_END_DFO_MS: this.newDfo[d].ASSET_LN_END_DFO_MS, objectid: this.newDfo[d].objectid, SRFC_TYPE_ID:this.newDfo[d].SRFC_TYPE_ID})
        }
        this.rdbdSurf = newRdbd
      },
      getComment:{
        handler: function(){
          this.comment = this.getComment
        },
        immediate: true
      },
      isGeomCheck:{
        handler: function(){
          this.geomChecks = this.isGeomCheck
        },
          immediate: true
      },
      steppClose:{
        handler: function(){
          if(this.steppClose === true && this.firstAddToMap === true && !this.forMod && !this.forInfo){
            let editGraphic = gLayer.graphics.items.find(x => x.attributes.objectid === this.objid)
            let getLength = geometryEngine.geodesicLength(editGraphic.geometry, "miles")
            this.deltaDis = [Number(getLength.toFixed(3)), 'Add']
            return;
          }
        }
      }
    },

    methods:{
      geometryChecks(){
        geomCheck()
      },
      saveComment(){
        this.oldComment = this.comment
      },
      cancelComment(){
        this.comment = this.oldComment
      },
      cancelStepper(){
        cancelEditStepper()
      },
      onScroll(){
        this.scrollInvoked++
      },
      delGraphic(){
        this.firstAddToMap = false
        removeGraphic();
        // removeHighlight()
      },
      showGIDVerts(){
        let getGraphic = gLayer.graphics.items.filter(x=> x.attributes.objectid === this.objid)
        showVerticies(getGraphic[0])
      },
      initLoadAsset(asset){
        initLoadAssetGraphic(asset)
      },
      startExecuteDfoPts(){
        this.exeDfoPts = 'point'
      },
      emptyMileArr(){
        if(this.mileInfo.length){
          this.mileInfo.length = 0
        }
      },
      removeAsstPt(){
        removeAsstPoints();
      },
      cancel(){
        this.isGeomCheck = 0;
        stopEditingPoint();
        sketchCompete();
        document.getElementById("stepper").style.width = '0px'
        this.steppClose = false;
        this.infoRoad = false;
        this.e1 = 1;
        removeAsstPoints();
        this.getDfoBool = false;
        removeHighlight()
        this.comment = ""
      },
      saveAttri(){
        let editGraphic = gLayer.graphics.items.find(x => x.attributes.objectid === this.objid)
        if(editGraphic.attributes.roadbedName === 'null' || JSON.parse(editGraphic.attributes.roadbedName)[0].streetName.length === 0){
          this.finalCheck = true
          return;
        }
        // if(!this.forMod && !this.forInfo){
        //   let getLength = geometryEngine.geodesicLength(editGraphic.geometry, "miles")
        //   this.deltaDis = [Number(getLength.toFixed(3)), 'Add']
        // }

        //add a field to Graphic to determine if graphic has been saved or not
        let timestamp = new Date().getTime()
      
        editGraphic.attributes.editDt = timestamp
        editGraphic.attributes.comment = this.comment
        editGraphic.attributes.editNm = this.userName
        this.getComment = this.comment
        
        this.firstAddToMap = false
        this.successAlert=true;
        saveToEditsLayer()
        this.cancel();
      },
      complete(){
        stopEditingPoint();
        sketchCompete();
      }
    },
    computed:{
      setAssetCover:{
        get(){
          return this.$store.state.assetCoverage
        },
        set(x){
          this.$store.commit('setAssetCoverage', x)
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
      getDfoBool:{
        get(){
          return this.$store.state.isDfoReturn
        },
        set(bool){
          this.$store.commit('setIsDfoReturn', bool)
        }
      }, //Used to work with the vue properties without modifying them
      deleteSketch:{
        get(){
          return this.$store.state.delSketch
        },
        set(sketch){
          this.$store.commit('setDelSketch', sketch)
        }
      },
      imageHeight(){
        let resize = {
          xs: () => {return '220px'},
          sm: () => {return '400px'},
          md: () => {return '80vh'},
          lg: () => {return '83vh'},
          xl: () => {return '83vh'}
        }
        return resize[`${this.$vuetify['breakpoint'].name}`]()
      },
      returnStep:{
        get(){
          return this.$store.state.stepNumber
        },
        set(x){
          this.$store.commit('setStepNumber', Number(x))
        }
      },
      numLane:{
        get(){
          console.log(this.$store.state.numLane)
          return JSON.parse(this.$store.state.numLane)
        }
      },
      rdbdSurf:{
        get(){
          if(typeof(this.$store.state.roadbedSurface) === 'string'){
            return JSON.parse(this.$store.state.roadbedSurface) 
          }
          else{
            return this.$store.state.roadbedSurface
          }
        },
        set(x){
          this.$store.commit('setRoadbedSurface',JSON.stringify(x))
        }
      },
      roadName:{
        get(){
          if(typeof(this.$store.state.roadbedName) === 'string'){
            return JSON.parse(this.$store.state.roadbedName)
          }
          return ''
        },
        set(name){
          this.$store.commit('setRoadbedName',JSON.stringify(name))
        }
      },
      roadDesign:{
        get(){
          return JSON.parse(this.$store.state.roadbedDesign)
        }
      },
      objid:{
        get(){
          return this.$store.state.objectid
        }
      },
      steppClose:{
        get(){
          return this.$store.state.stepperClose
        },
        set(stepClose){
          this.$store.commit('setStepperClose', stepClose)
        }
      },
      modifyRoad:{
        get(){
          return this.$store.state.modifyRd
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
      exeDfoPts:{
        get(){
          return this.$store.state.executeDfoPts
        },
        set(point){
          this.$store.commit('setExecuteDfoPts', point)
        }
      },
      editExistingRd:{
        get(){
          return this.$store.state.editExisting
        },
        set(edit){
          this.$store.commit('setEditExisting', edit)
        }
      },
      finalCheck:{
        get(){
          return this.$store.state.isFinalCheck
        },
        set(bool){
          this.$store.commit('setIsFinalCheck', bool)
        }
      },
      getComment:{
        get(){
          return this.$store.state.comment
        },
        set(comm){
          this.$store.commit('setComment', comm)
        }
      },
      firstAddToMap:{
        get(){
          return this.$store.state.isInitAdd
        },
        set(boolAdd){
          this.$store.commit('setIsInitAdd', boolAdd)
        }
      },
      isGeomCheck:{
        get(){
          return this.$store.state.geomCheck
        },
        set(check){
          this.$store.commit('setGeomCheck', check)
        }
      },
      editorInfo:{
        get(){
          return this.$store.state.editInfo
        },
        set(editIn){
          this.$store.commit('setEditInfo', editIn)
        }
      },
      userName:{
        get(){
          return this.$store.state.username
        },
        set(userName){
          this.$store.commit('setUserName', userName)
        }
      },
      deltaDis:{
        get(){
          return this.$store.state.deltaDistance
        },
        set(len){
          this.$store.commit('setDeltaDis', len)
        }
      }
    }
}
</script>
<style scoped>
.stepStyle{
  width:50%;
}
#cnclBtnEdit{
  border:none;
  bottom: .5rem;
  right:6rem;
  position: absolute;
}

#saveBtnEdit{
  border: black 1px solid;
  bottom: .5rem;
  right:1rem;
  position: absolute
}
#discardBtnEdit{
  bottom: .5rem; 
  left: 1rem; 
  position: absolute;
  z-index: 1;
}
#addCommentBtn{
  position: absolute;
  left: 1rem;
  bottom: 7rem; 
  z-index:1
}
#comment{
  position: absolute;
  left:1rem;
  bottom: 3rem;
  line-height:.5px;
  width:93%;
  overflow-y: scroll;
  max-height: 70px;
  text-align: left;
}
#dialogComment{
  width:30%;
  left: 44%;
  height: 70%;
  border-radius: 0px;
}
#dialogComment #dialogCommentTxt{
  bottom:28px;
  position: relative;
  font-size: 15px;
  text-align: left;
  left: -31px;
}
#dialogComment #dialogCommentBox{
  padding-left:1rem;
  padding-right: 1rem;
  padding-bottom:2rem;
}
#dialogSaveBtn{
  position: absolute;
  right:1rem;
  bottom: .5rem;
  border: 1px solid black
}
#dialogCancelBtn{
  position: absolute;
  right: 6rem;
  bottom: .5rem;
}
#commentTxt{
  font-size: .7rem;
  color:gray;
}
#cancelInfo{
  bottom: .5rem; 
  position: absolute; 
  right: 1rem; 
  border:black 1px solid;
}
#discardTitleTxt{
  position: relative;
  bottom: .7rem;
}
#discardTxt{
  color:black;
  top: 9%;
  position:relative;
  text-align: left;
}
#stepper{
  position: fixed;
  top: 5rem;
  left: 13.5rem;
  padding-bottom: 0%;
  font-size: 16px;
  z-index: 2;
}
.scroller {
  width: auto;
  height: 500px;
  overflow-y: auto;
  scrollbar-color: grey;
  scrollbar-width: thin;
}

::-webkit-scrollbar {
  width: 5px;
  background: lightgray;
}
.stepHead{
  padding-top:0.5%;
  padding-left:3%;
  background: #14375A;
  color: white;
  font-size: 20px;
  height: 35px;
  text-align: left;
  border-radius: 0px;
  }

.v-stepper--vertical{
  padding-bottom: unset;
}
.v-autocomplete >>> label{
  font-size: 15px;
}

.v-autocomplete >>> text{
  font-size: 10px;
}

.v-stepper__step--active{
  outline: #14375A solid 2px;
  background-color: rgba(32, 78, 112, .3)
}
.v-stepper__step{
  height: 15px;
}
.v-list-item--link{
  outline: none;
}

#discardSketch{
  position: relative;
  padding: 0%;
  top: 50%;
  left: 45%;
  width: 22rem;
  border-radius: 0px;
  height:7.7rem
}
.confirmationTitle{
  background: #14375A;
  color:white;
  font-size: 16px;
  height: 40px;
  padding-left: 15px;
  padding-top: 1%;
  text-align: left;
  top: 10%;
  width: 100%;
  left: 100%;
}
.surfaceTitle{
  background-color: #14375A;
  color: white;
  height:30px;
  width: 100%;
  font-size: 25px; 
}
#discardYesBtn{
  position: absolute; 
  right: .5rem;
}
#discardNoBtn{
  position: absolute; 
  right:5rem;
}


</style>
<style>
.v-dialog{
  box-shadow: none;
}
</style>