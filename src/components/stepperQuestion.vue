<template>
  <div id="stepper">
    <!-- <v-stepper-header class="stepHead" v-if="forAdd">Add a New Road</v-stepper-header>
    <v-stepper-header class="stepHead" v-if="forEdit">Edit an Existing Road</v-stepper-header> -->
    <v-stepper
    style="margin-bottom:unset;"
    v-model="e1"
    vertical
    non-linear
    class="mb-12; scroller"
    max-width="460"
    min-width="0"
    height="820"
    >
    <v-stepper-header class="stepHead" v-if="!forMod">Add a New Road</v-stepper-header>
    <v-stepper-header class="stepHead" v-if="forMod">Edit an Existing Road</v-stepper-header>
    <v-stepper-step
      editable
      step="1"
      @click="removeAsstPt(); showGIDVerts()"
      class="font-weight-regular; body-1;">
      Road Name:
    </v-stepper-step>

    <v-stepper-content step="1">
      <!-- Disabled -- dictates whether fields in the stepper form are editable or not.  -->
      <roadName/>
      <!-- <v-btn
        color="primary"
        @click="e1 = 2"
        :disabled="!roadName">
        Continue
      </v-btn> -->
    </v-stepper-content>

    <v-stepper-step 
      editable
      step="2"
      @click="removeAsstPt(); complete(); initLoadAsset('design');">
      Road Design
    </v-stepper-step>
    
    <v-stepper-content step="2">
      <!-- Ternery statement if disabled property = true and graphic property = true then disable the v-select tag -->
      <roadDesign/>
      <!-- <v-btn
        color="primary"
        @click="e1 = 3">
        Continue
      </v-btn> -->
    </v-stepper-content>

    <v-stepper-step
      class="stepStyle"
      editable
      step="3"
      @click="startExecuteDfoPts(); complete(); initLoadAsset('surface')" 
      ><!-- Get asset breaks and draw graphic points -->
      Road Surface
    </v-stepper-step>
    <v-stepper-content step="3">
        <!-- If graphic is clicked (true), it presents this form -->
      <roadSurface/>
        <!-- Form disabled on single click of reference layer in map (read only)  -->
        <!-- <v-card  v-if='graphic===false'>
          <div class="scroller">
          <v-col v-for="(item,index) in fRdbdSurf" :key="index">
            <v-select :items="surface" label="Road Surface" outlined v-model="item.SRFC_TYPE_ID" disabled></v-select> 
              <v-row>
                <v-col sm="6">
                 <v-text-field label='A' v-model="item.ASSET_LN_BEGIN_DFO_MS" disabled></v-text-field>
                </v-col>
                <v-col sm="6">
                 <v-text-field label='B' v-model="item.ASSET_LN_END_DFO_MS" disabled></v-text-field>
                </v-col>
              </v-row>
          </v-col>
          </div>
        </v-card> -->
         <!-- <v-btn
            color="primary"
            @click="complete();"
          >
            Draw Surface Graphic
        </v-btn> -->
        <!-- <v-btn
            color="primary"
           @click="e1 = 4;">
            Continue
        </v-btn> -->
    </v-stepper-content>

    <v-stepper-step step="4" editable @click="removeAsstPt();complete();initLoadAsset('numLane');">
      Number of Lanes
    </v-stepper-step>
    <v-stepper-content step="4">
      <numOfLane/>
      <!-- <v-btn
        color="primary"
        @click="e1 = 5">
        Continue
      </v-btn> -->
    </v-stepper-content>

    <v-stepper-step step="5" editable @click="removeAsstPt(); complete();">
      Comments
    </v-stepper-step>
    <v-stepper-content step="5">
      <!-- Send Asset/geometry edits to editFunc.js function -->
      <comment/>
      <v-btn
        color="primary" @click="saveAttri()" :disabled="graphic ? disabled : ''">
        Save Edits
      </v-btn>
      <v-btn @click="cancel()" text :disabled="graphic ? disabled : ''">
        Close Form
      </v-btn>
    </v-stepper-content>
    <!-- <Map @nm="bool"/> -->
    <v-btn-toggle style="top:100px; left:100px;">
      <v-btn small @click="cancel()">Cancel</v-btn>
      <v-btn small color="#15648C" text @click="saveAttri()"><u>Save</u></v-btn>
    </v-btn-toggle>

  </v-stepper>

  </div>
  
</template>

<script>
//import { criConstants } from '../common/cri_constants';
import {removeAsstPoints, sketchCompete, initLoadAssetGraphic, showVerticies} from '../components/Map/editFunc'
import roadName from '../components/Map/stepperContent/RoadName.vue'
import roadDesign from '../components/Map/stepperContent/RoadDesign.vue'
import roadSurface from './Map/stepperContent/RoadSurfaces.vue'
import numOfLane from './Map/stepperContent/NumberOfLanes.vue'
import comment from './Map/stepperContent/Comment.vue'
import { gLayer } from './Map/map'
//import {roadInfo} from '../store'a
//import Map from '../components/Map/Map.vue'


export default {
    name:"stepper",
    components:{roadName,roadDesign, roadSurface, numOfLane, comment},
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
        forMod: true,
        forEdit: true,
        graphicObj: {},
        graphic: false,
        feature: false,
        clickCountF:0,
        cursor: false,
        bdfo: false,
        edfo: true,
        assetLnInfo: null,
        disabled: false,
        //objectid: 0,
        // newDfo:0,
        //working on form validation
        //emptyValues:[v => !!v || 'Road Name is required'],
         
        dfoRules:{
          DFO: value => !!value || 'Required',
          gather: value => {
            document.getElementsByTagName('input')
            console.log(value)
            return value
          }
        }
      }
    },
    watch:{
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


      //Interacting with Graphic layer
      // objectid:{
      //   handler: async function(){
      //     let countG = await getGraphic()
      //     console.log(countG)
      //     this.feature = false;
      //     this.graphic = true;
      //     this.graphicObj = countG
      //     //this.numLane = roadInfo.getLan
      //     this.stepperClose = true;
      //     this.rdbdSurf
      //     this.roadbedName
      //     this.roadbedDesign
      //   }, 
      //    immediate: true,
      // }, 
      newDfo(){
        console.log(this.newDfo)
        
        this.emptyMileArr()
        let newRdbd = []
        for(let d in this.newDfo){
          newRdbd.push({ASSET_LN_BEGIN_DFO_MS: this.newDfo[d].ASSET_LN_BEGIN_DFO_MS, ASSET_LN_END_DFO_MS: this.newDfo[d].ASSET_LN_END_DFO_MS, objectid: this.newDfo[d].objectid, SRFC_TYPE_ID:this.newDfo[d].SRFC_TYPE_ID})
        }
        this.rdbdSurf = newRdbd
      },
    },

    methods:{
      showGIDVerts(){
        let getGraphic = gLayer.graphics.items.filter(x=> x.attributes.objectid === this.objid)
        console.log(getGraphic)
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
      // async executeDFOgraph(x,y){
      //   console.log(x,y)
      //   // console.log(this.rdbdSurf)
      //   sketchCompete();
      //   const dfoAssets = [];
      //   // if(dfoAssets.length){
      //   //   dfoAssets.length = 0
      //   // }
      //   // console.log(dfoAssets)
      //   if(x==='point'){
      //     console.log(this.rdbdSurf)
      //     for(let b in this.rdbdSurf){
      //       let srfcType = {SRFC_TYPE_ID: this.rdbdSurf[b].SRFC_TYPE_ID, ASSET_LN_BEGIN_DFO_MS: this.rdbdSurf[b].ASSET_LN_BEGIN_DFO_MS, ASSET_LN_END_DFO_MS: this.rdbdSurf[b].ASSET_LN_END_DFO_MS, objectid: this.objectid, edit: false}
      //       dfoAssets.push(srfcType)
      //     }
      //     for(let i in this.mileInfo){
      //       console.log(this.mileInfo[i])
      //       let array = {SRFC_TYPE_ID: this.mileInfo[i].SRFC_TYPE_ID, ASSET_LN_BEGIN_DFO_MS: this.mileInfo[i].ASSET_LN_BEGIN_DFO_MS, ASSET_LN_END_DFO_MS: this.mileInfo[i].ASSET_LN_END_DFO_MS,objectid: this.objectid, edit: this.mileInfo[i].EDIT}
      //       dfoAssets.push(array)
      //     }
      //     this.newDfo = applyMToAsset(dfoAssets)
      //     //addAssetBreakPts(dfoAssets)
      //   }
      //   // if(x==='point' && this.feature===false){
      //   //   for(let b in this.rdbdSurf){
      //   //     console.log(this.fRdbdSurf[b])
      //   //     let srfcType = {srfcType: this.rdbdSurf[b].SRFC_TYPE_ID, AssetBeginDfo: Number(this.rdbdSurf[b].ASSET_LN_BEGIN_DFO_MS), AssetEndDfo: Number(this.rdbdSurf[b].ASSET_LN_END_DFO_MS), objectid: this.objectid}
      //   //     dfoAssets.push(srfcType)
      //   //   }
      //   //   for(let i in this.mileInfo){
      //   //     console.log(this.mileInfo[i])
      //   //     let array = {srfcType: this.mileInfo[i].SRFC_TYPE_ID, AssetBeginDfo: Number(parseFloat(this.mileInfo[i].ASSET_LN_BEGIN_DFO_MS)), AssetEndDfo: Number(parseFloat(this.mileInfo[i].ASSET_LN_END_DFO_MS)),objectid: this.objectid, edit: this.mileInfo[i].EDIT}
      //   //     dfoAssets.push(array)
      //   //   }
      //   //   console.log(dfoAssets)
      //   //   //console.log(applyMToAsset(dfoAssets))
      //   //   this.newDfo = applyMToAsset(dfoAssets)
      //   // }
      //   // else if(x==='line'){
      //   //   for(let z in this.rdbdSurf){
      //   //     console.log(this.rdbdSurf[z])
      //   //     let array = {srfcType: this.rdbdSurf[z].SRFC_TYPE_ID, AssetBeginDfo: parseFloat(this.rdbdSurf[z].ASSET_LN_BEGIN_DFO_MS), AssetEndDfo: parseFloat(this.rdbdSurf[z].ASSET_LN_END_DFO_MS),objectid: this.objectid}
      //   //     dfoAssets.push(array)
      //   //   }
      //   //   addAssetBreakPts(dfoAssets)
      //   // }
      //   else if(x==='draw'){
      //     console.log(y)
          
      //     for(let z in this.rdbdSurf){
      //       if(this.rdbdSurf[z].ASSET_LN_END_DFO_MS === y){
      //         let array = {SRFC_TYPE_ID: this.rdbdSurf[z].SRFC_TYPE_ID, ASSET_LN_BEGIN_DFO_MS: parseFloat(this.rdbdSurf[z].ASSET_LN_BEGIN_DFO_MS), ASSET_LN_END_DFO_MS: parseFloat(this.rdbdSurf[z].ASSET_LN_END_DFO_MS),objectid: this.objectid}
      //         dfoAssets.push(array)
      //       }
      //     }
      //      for(let i in this.mileInfo){
      //        if(Number(parseFloat(this.mileInfo[i].ASSET_LN_END_DFO_MS)) === Number(y)){
      //           console.log(this.mileInfo[i])
      //           let array = {SRFC_TYPE_ID: this.mileInfo[i].SRFC_TYPE_ID, ASSET_LN_BEGIN_DFO_MS: Number(parseFloat(this.mileInfo[i].ASSET_LN_BEGIN_DFO_MS)), ASSET_LN_END_DFO_MS: Number(parseFloat(this.mileInfo[i].ASSET_LN_END_DFO_MS)),objectid: this.objectid}
      //           dfoAssets.push(array)
      //         }
      //       }
      //     console.log(dfoAssets)
      //     let uptDFO = await updateAsset(dfoAssets)
      //     console.log(uptDFO)
      //     this.newDfo = uptDFO
      //   //   //editAsstObj[0].asset_ln_end_dfo_ms = uptDFO
      //   //   //editAsstObj[1].asset_ln_begin_dfo_ms = uptDFO
      //   }
      // },
      cancel(){
        document.getElementById("stepper").style.width = '0px'
        this.steppClose = false;
        this.e1 = 1;
        sketchCompete();
        removeAsstPoints();
        console.log(gLayer)
      },
      //pushes new blank object row into mileInfo asset form
      // addRoadSurface(){
      //   this.mileInfo.push({
      //     SRFC_TYPE_ID:'',
      //     ASSET_LN_BEGIN_DFO_MS: 0,
      //     ASSET_LN_END_DFO_MS:0,
      //     EDIT: true
      //   })
      // },
      clearTable(){
        // this.roadbedName = undefined
        // this.roadbedDesign = undefined
        // this.roadbedSurface = undefined
        // this.numLane = undefined
      },
      // deleteSurface(index){
      //   console.log(index)
      //   if(document.getElementById('currentSurf')){
      //     console.log(this.mileInfo.splice(index, 1))
      //   }
      //     // if(document.getElementById('currentSurf')){
      //     //   this.rdbdSurf.splice(index, 1) 
      //     // }
      // },
      saveAttri(){
        // for(let z=0; z < gLayer.graphics.items.length; z++){
        //   if(gLayer.graphics.items[z].attributes.objectid === this.objid){
        //     gLayer.graphics.items[z].attributes.roadbedName = this.roadName
        //   }
        // } 
        // const rdbdSurface = [];
        // console.log(this.rdbdSurf)
        // for(let i in this.rdbdSurf){
        //   let srfcType = {srfcType: this.rdbdSurf[i].SRFC_TYPE_ID, AssetBeginDfo: this.rdbdSurf[i].ASSET_LN_BEGIN_DFO_MS, AssetEndDfo: this.rdbdSurf[i].ASSET_LN_END_DFO_MS}
        //   rdbdSurface.push(srfcType)
        // }
          
        // for(let i in this.mileInfo){
        //   let array = {srfcType: this.mileInfo[i].SRFC_TYPE_ID, AssetBeginDfo: parseInt(this.mileInfo[i].ASSET_LN_BEGIN_DFO_MS), AssetEndDfo: parseInt(this.mileInfo[i].ASSET_LN_END_DFO_MS)}
        //   rdbdSurface.push(array)
        // }
          
        // let createObj = {
        //   objectids: this.objid,
        //   numLanes: this.numLane,
        //   rdbdName: this.roadbedName,
        //   rdbdDes: this.roadbedDesign,
        //   rdbdSurfe: JSON.stringify(rdbdSurface),
        //   editNm: 'DPROSACK', //TODO needs to be dynamic
        //   editDt: new Date().getTime()
        // }
        //console.log(createObj)
        // console.log(this.graphicObj)
        // for(let z=0; z < gLayer.graphics.items.length; z++){
        //   if(gLayer.graphics.items[z].attributes.objectid === this.objid){
        //     gLayer.graphics.items[z].attributes.roadbedSurface = JSON.stringify(this.rdbdSurf)
        //   }
        // }
        //console.log(this.rdbdSurf)
        this.cancel();
        // this.graphicObj.attributes.roadbedName = createObj.rdbdName
        //saveInfo(createObj)
      },
      complete(){
        sketchCompete();
      }
    },
    computed:{ //Used to work with the vue properties without modifying them
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
          return this.$store.state.numLane
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
          return this.$store.state.roadbedName
        },
        set(name){
          this.$store.commit('setRoadbedName', name)
        }
      },
      roadDesign:{
        get(){
          return this.$store.state.roadbedDesign
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
    }
}
</script>
<style scoped>

#stepper{
  position: fixed;
  top: 65px;
  left: 260px;
  padding-bottom: 0%;
  font-size: 16px;
  width:0%;
}
.scroller {
  width: auto;
  height: 500px;
  overflow-y: scroll;
  scrollbar-color: grey;
  scrollbar-width: thin;
}
.stepHead{
  padding-top:1%;
  padding-left:25%;
  background: #15648C;
  color: white;
  font-size: 20px;
  height: 35px;;
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

.v-list-item--link{
  outline: none;
}
</style>