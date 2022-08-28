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
      @click="showGIDVerts()"
      class="font-weight-regular; body-1;">
      Length: <strong>{{fetchLength}} Miles</strong>
    </v-stepper-step>
    <!-- <v-stepper-step
      :editable="setAssetCover[0]"
      step="1"
      @click="showGIDVerts()"
      color="#204E70"
      class="font-weight-regular; body-1;" v-else>
      Length: <strong>{{fetchLength}} Miles</strong>
    </v-stepper-step> -->

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
         <!-- If graphic is clicked (true), it presents this form -->
      <roadDesign/>
    </v-stepper-content>

    <v-stepper-step color="#204E70" step="5" :editable="setAssetCover[0] === null || setAssetCover[0] === undefined ? true: setAssetCover[0]" v-on="setAssetCover[0] === true ? {'click' : () =>{removeAsstPt(); complete();initLoadAsset('numLane')}} : {}">
      Number of Lanes: <strong>{{fetchNumLanes}}</strong>
    </v-stepper-step>
    <v-stepper-content step="5">
      <!-- Send Asset/geometry edits to editFunc.js function -->
      <numOfLane/>
    </v-stepper-content>
    <!-- <Map @nm="bool"/> -->
    <!-- <div style="position:relative; bottom: 70px; left: 90px;"> -->
      
      <v-btn v-if="!forInfo" depressed style="border:none; bottom: 1vh; right:6rem; position: absolute" tile text color="#204E70" @click="firstAddToMap ? discardAlertQuest = true : cancel(); cancelStepper();"><u>Cancel</u></v-btn>
      <v-btn v-if="!forInfo" tile style="border: black 1px solid;bottom: 1vh; right:1vw; position: absolute" depressed :disabled="!setAssetCover[0]" color="#204E70" text @click="saveAttri();"><u>Save</u></v-btn>
      
      <v-btn v-if="!forInfo" depressed tile color ="#E64545" text style="bottom:1vh; left:1vw; position: absolute;z-index: 1;" @click="discardAlertQuest = true">Discard Edit</v-btn>
      <v-btn v-else style="bottom: 2vh; position: absolute; right: 1vw; border:black 1px solid;" tile outlined text color="#204E70" @click="cancel()"><u>Cancel</u></v-btn>
    <!-- </div> -->
    <!-- card used to display discard alert information -->
    <!-- <v-card id="discardSketch" v-if="discardAlertQuest" elevation="10">
        <v-card-title class="confirmationTitle">Are you sure you want to discard this item?</v-card-title>
        
        <v-btn tile outlined color="#15648C" @click="discardAlert=true; discardAlertQuest = false; delGraphic(); cancel()"><u>YES</u></v-btn>
        <v-btn tile outlined color="#15648C" @click="discardAlertQuest = false"><u>NO</u></v-btn>
    </v-card> -->
    <a v-if="!forInfo" @click="dialog=true" style="position: absolute; left:1vw; bottom: 13vh; z-index:1">Add An Optional Comment</a>
    <v-card elevation="0" class="overflow-y-auto" v-if="!forInfo" v-scroll.self="onScroll" style="position: absolute; left:1vw; bottom: 3rem; line-height:.5px; width:93%; overflow-y: scroll; max-height: 70px; text-align: left;">
      <div>
        <v-card-text style="font-size: .7rem; color:gray;">{{comment}}</v-card-text>
      </div>
    </v-card>
    <!-- <v-textarea v-if="!forInfo" style="position: absolute; left:1vw; bottom: 6vh; font-size: .7rem; line-height:.5px; width:93%;" height="5vh" disabled solo no-resize flat dense v-model="comment">'{{comment}}'</v-textarea> -->
      <v-dialog v-model="dialog" persistent>
        <v-card style="width:30%; left: 30%; height: 70%; border-radius: 0px;">
          <v-card-title class="surfaceTitle">
            <v-card-text style="bottom:28px; position: relative; font-size: 15px; text-align: left; left: -31px;">Comments</v-card-text>
          </v-card-title>
          <v-textarea v-model="comment" style="padding-left:10px; padding-right: 10px;padding-bottom: 5%;"></v-textarea>
          <v-btn outlined tile color="#204E70" @click="dialog=false" style="position: absolute; right:2%; bottom: 2%; border: 1px solid black"><u>Save</u></v-btn>
        </v-card>
      </v-dialog>
  </v-stepper>
  
  </div>
  <!-- alert used to confirm that the sketch has been removed -->
  <sketchAlert v-if="discardAlert"/>
    <!-- <v-alert v-if="discardAlert" type="warning" prominent border="left" style="height: 80px; top: 30px; width:550px; left: 30%;">
      Sketch has been removed.
    </v-alert> -->
    <v-card id="discardSketch" v-if="discardAlertQuest" elevation="10">
      <v-card-title class="confirmationTitle">Confirm Discard</v-card-title>
      <v-card-text style="color:black; top: 9%; position:relative; text-align: left;">Are you sure you want to discard this edit?</v-card-text>
      <v-btn style="position: absolute; right: .5rem;" tile outlined color="#14375A" @click="discardAlert=true; discardAlertQuest = false; delGraphic(); cancel()"><u>YES</u></v-btn>
      <v-btn style="position: absolute; right:5rem;" depressed tile text color="#14375A" @click="discardAlertQuest = false"><u>NO</u></v-btn>
    </v-card>
  <confirmAlertSuccess v-if="successAlert"/>
  <finalCheck v-if="finalCheck === true"/>

  </v-container>
</template>

<script>
//import { criConstants } from '../common/cri_constants';
import {removeHighlight, geomToMiles,removeAsstPoints, stopEditingPoint, sketchCompete,initLoadAssetGraphic, showVerticies, removeGraphic, saveToEditsLayer, cancelEditStepper} from '../components/Map/editFunc'
//import {initGraphicCheck} from '../components/Map/crud'
import roadName from '../components/Map/stepperContent/RoadName.vue'
import roadDesign from '../components/Map/stepperContent/RoadDesign.vue'
import roadSurface from './Map/stepperContent/RoadSurfaces.vue'
import numOfLane from './Map/stepperContent/NumberOfLanes.vue'
import editVerts from './Map/stepperContent/EditVerts.vue'
import { gLayer } from './Map/map'
import confirmAlertSuccess from '../components/Map/stepperContent/confirmAlertsSUCCESS.vue'
import sketchAlert from '../components/Map/stepperContent/discardAlert.vue'
import finalCheck from '../components/Map/stepperContent/saveAssetCheck.vue'
//import {roadInfo} from '../store'a
//import Map from '../components/Map/Map.vue'


export default {
    name:"stepper",
    components:{roadName,roadDesign, roadSurface, numOfLane, editVerts, confirmAlertSuccess, sketchAlert, finalCheck},
    props:{
      received: Boolean
    },
    //components: {Map},
    data () {
      return {
        // mileInfo:[],
        //prefix: false,
        //suffix: false,
        e1: 1,
        // design: ['One Way', 'Two-way', 'Boulevard'],
        // surface: ['Paved','Brick','Dirt/Natural','Gravel','Concrete'],
        // lanes:[1,2,3,4,5,6],
        //roadType: ['ALLEY','ANEX','ARCADE','AVENUE','BAYOU','BEACH','BEND','BLUFF','BLUFFS','BOTTOM','BOULEVARD','BRANCH','BRIDGE','BROOK','BROOKS','BURG','BURGS','BYPAS','CAMP','CANYON','CAPE','CAUSEWAY','CENTER','CENTERS','CIRCLE','CIRCLES','CLIFF','CLIFFS','CLUB','COMMON','COMMONS','CORNER','CORNERS','COURSE','COURT','COURTS','COVE','COVES','CREEK','CRESCENT','CREST','CROSSING','CROSSROAD','CROSSROADS','CURVE','DALE','DAM','DIVIDE','DRIVE','DRIVES','ESTATE','ESTATES','EXPRESSWAY','EXTENSION','EXTENSIONS','FALL','FALLS','FERRY','FIELD','FIELDS','FLAT','FLATS','FORD','FORDS','FOREST','FORGE','FORGES','FORK','FORKS','FORT','FREEWAY','GARDEN','GARDENS','GATEWAY','GLEN','GLENS','GREEN','GREENS','GROVE','GROVES','HARBOR','HARBORS','HAVEN','HEIGHTS','HIGHWAY','HILL','HILLS','HOLLOW','INLET','ISLAND','ISLANDS','ISLE','JUNCTION','JUNCTIONS','KEY','KEYS','KNOLL','KNOLLS','LAKE','LAKES','LAND','LANDING','LANE','LIGHT','LIGHTS','LOAF','LOCK','LOCKS','LODGE','LOOP','MALL','MANOR','MANORS','MEADOW','MEADOWS','MEWS','MILL','MILLS','MISSION','MOTORWAY','MOUNT','MOUNTAIN','MOUNTAINS','NECK','NOT APPLICABLE','ORCHARD','OTHER','OVAL','OVERPASS','PARKS','PARKWAYS','PASS','PASSAGE','PATH','PIKE','PINE','PINES','PLACE','PLAIN','PLAINS','PLAZA','POINT','POINTS','PORT','PORTS','PRAIRIE','RADIAL','RAMP','RANCH','RAPID','RAPIDS','REST','RIDGE','RIDGES','RIVER','ROAD','ROADS','ROUTE','ROW','RUE','RUN','SHOAL','SHOALS','SHORE','SHORES','SKYWAY','SPRING','SPRINGS','SPURS','SQUARE','SQUARES','STATION','STRAVENUE','STREAM','STREET','STREETS','SUMMIT','TERRACE','THROUGHWAY','TRACE','TRACK','TRAFFICWAY','TRAIL','TRAILER','TUNNEL','TURNPIKE','UNDERPASS','UNION','UNIONS','VALLEY','VALLEYS','VIADUCT','VIEW','VIEWS','VILLAGE','VILLAGES','VILLE','VISTA','WALKS','WALL','WAY','WAYS','WELL','WELLS'],
        counter:0,
        //prefixSuffixList: ['East','North','Northeast','Northwest','Not Applicable','South','Southeast','Southwest','West'],
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
        comment:'',
        fetchLength:0,
        fetchRoadName: null,
        fetchRoadSurface: null,
        fetchRoadDesign: null,
        fetchNumLanes: null,
        scrollInvoked: 0,
        //objectid: 0,
        // newDfo:0,
        //working on form validation
        //emptyValues:[v => !!v || 'Road Name is required'],
         
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
          }
          
          if (this.roadName.length){
            let prfx = reformatName(this.roadName[0].prefix);
            let name = reformatName(this.roadName[0].streetName);
            let sfx =  reformatName(this.roadName[0].suffix);
            let type = reformatName(this.roadName[0].streetType);
          
            this.fetchRoadName = `${prfx} ${name} ${type} ${sfx}`
          }
          function reformatName (attr){
              if (attr === "NOT APPLICABLE" || attr === "OTHER" || attr === null) {
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
      }
    },

    methods:{
      cancelStepper(){
        cancelEditStepper()
      },
      onScroll(){
        this.scrollInvoked++
      },
      delGraphic(){
        this.firstAddToMap = false
        removeGraphic();
        removeHighlight()
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
        stopEditingPoint();
        sketchCompete();
        document.getElementById("stepper").style.width = '0px'
        this.steppClose = false;
        this.infoRoad = false;
        this.e1 = 1;
        removeAsstPoints();
        this.getDfoBool = false;
        removeHighlight()
      },
      saveAttri(){
        let editGraphic = gLayer.graphics.items.find(x => x.attributes.objectid === this.objid)
        editGraphic.attributes.comment = this.comment
        this.getComment = this.comment
        if(editGraphic.attributes.roadbedName === 'null' || JSON.parse(editGraphic.attributes.roadbedName)[0].streetName.length === 0){
          this.finalCheck = true
          return;
        }
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
      }
    }
}
</script>
<style scoped>
.stepStyle{
  width:50%;
}

#stepper{
  position: fixed;
  top: 5rem;
  left: 13.5rem;
  padding-bottom: 0%;
  font-size: 16px;
  z-index: 2
}
.scroller {
  width: auto;
  height: 500px;
  overflow-y: scroll;
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
  background: #204E70;
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
  outline: #204E70 solid 2px;
  background-color: rgba(32, 78, 112, .3)
}
.v-stepper__step{
  height: 15px;
}
.v-list-item--link{
  outline: none;
}

#discardSketch{
    position: absolute;
    width: 22rem;
    left: 57rem;
    top: 25rem;
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

</style>
<style>
.v-dialog{
  box-shadow: none;
}
</style>