<template>
  <v-stepper
    id="stepper"
    v-model="e1"
    vertical
    non-linear
    class="mb-12">
    <v-stepper-step
      editable
      :complete="e1 > 1"
      step="1"
      @click="removeAsstPt()">
      Road Name: 
      <small>Fill out this form to complete editing your road.</small>
    </v-stepper-step>

    <v-stepper-content step="1">
      <!-- Disable dictates whether fields in the stepper form are editable or not.  -->
      <v-card><v-text-field v-model="roadbedName" label="Road Name" :disabled="graphic ? disabled : ''"></v-text-field>
      </v-card>
      <v-btn
        color="primary"
        @click="e1 = 2">
        Continue
      </v-btn>
      <v-btn @click="cancel()" text>
        Cancel
      </v-btn>
    </v-stepper-content>

    <v-stepper-step
      editable
      :complete="e1 > 2"
      step="2"
      @click="removeAsstPt()">
      Road Design
    </v-stepper-step>

    <v-stepper-content step="2">
      <!-- Ternery statement if disabled property = true and graphic property = true then disable the v-select tag -->
      <v-card><v-select v-model="roadbedDesign" :items="design" label="Design" outlined filled :disabled="graphic ? disabled : ''"></v-select>
      </v-card>
      <v-btn
        color="primary"
        @click="e1 = 3">
        Continue
      </v-btn>
      <v-btn @click="cancel()" text>
        Cancel
      </v-btn>
    </v-stepper-content>
    <v-stepper-step
      editable
      :complete="e1 > 3"
      step="3"
      @click="executeDFOgraph('point')"> <!-- Get asset breaks and draw graphic points -->
      Road Surface
    </v-stepper-step>
    <v-stepper-content step="3">
        <!-- If graphic is clicked (true), it presents this form -->
        <v-card  v-if='graphic===true'>
          <div class="scroller"> 
          <!-- Loop through asset breaks assigned in rdbdSurf. Assign surface type lable and dfo values -->
          <v-col v-for="(item,index) in rdbdSurf" :key="index" >
          <v-select :items="surface" label="Road Surface" outlined v-model="item.srfc_type_id"></v-select> <!-- //v-model="roadbedSurface" -->
          <v-row>
               <v-col sm="6">
                 <v-text-field label='A' v-model="item.asset_ln_begin_dfo_ms"></v-text-field>
               </v-col>
               <v-col sm="6">
                 <v-text-field label='B' v-model="item.asset_ln_end_dfo_ms"></v-text-field><v-btn id="editedfo" icon x-small elevation=0 @click="executeDFOgraph('draw',item.asset_ln_end_dfo_ms)"><v-icon>mdi-pencil</v-icon></v-btn>
               </v-col>
          </v-row>
          <!-- Deletes asset break in the form -->
          <v-btn id="currentSurf"><img src="..\assets\outline_delete_black_24dp.png" @click="deleteSurface()"></v-btn> 
          </v-col>
          <!-- Adds new asset breaks to form based on mileInfo array (populated by user click addRoadSurface function) -->
        <v-card v-for="(item,index) in mileInfo" :key="index" >
            <v-select :items="surface" label="Road Surface" outlined v-model="item.srfc_type_id"></v-select>
            <v-row>
               <v-col>
                 <v-text-field  label='A' v-model="item.asset_ln_begin_dfo_ms"></v-text-field>
               </v-col>
               <v-col sm="6">
                 <v-text-field label='B' v-model="item.asset_ln_end_dfo_ms"></v-text-field><v-btn id="editedfo1" icon x-small elevation=0 @click="executeDFOgraph('draw',item.asset_ln_end_dfo_ms)"><v-icon>mdi-pencil</v-icon></v-btn>
               </v-col>
            </v-row>
            <v-btn id="addSurf"><img src="..\assets\outline_delete_black_24dp.png" @click="deleteSurface()"></v-btn>
            <!-- <v-btn @click="deleteSurface()">Delete</v-btn> -->
        </v-card>
        </div>
        <v-btn color="pink" @click="addRoadSurface">add additional Road Surface Types</v-btn>
        </v-card>
        <!-- Form disabled on single click of reference layer in map (read only)  -->
        <v-card  v-if='graphic===false'>
          <div class="scroller">
          <v-col v-for="(item,index) in fRdbdSurf" :key="index">
            <v-select :items="surface" label="Road Surface" outlined v-model="item.srfc_type_id" disabled></v-select> 
              <v-row>
                <v-col sm="6">
                 <v-text-field label='A' v-model="item.asset_ln_begin_dfo_ms" disabled></v-text-field>
                </v-col>
                <v-col sm="6">
                 <v-text-field label='B' v-model="item.asset_ln_end_dfo_ms" disabled></v-text-field>
                </v-col>
              </v-row>
          </v-col>
          </div>
        </v-card>
        <v-btn
            color="primary"
           @click="e1 = 4;">
            Continue
        </v-btn>
        <v-btn @click="cancel()" text>
            Cancel
        </v-btn>
    </v-stepper-content>

    <v-stepper-step step="4" editable @click="removeAsstPt()">
      Number of Lanes
    </v-stepper-step>
    <v-stepper-content step="4">
      <v-card :disabled="graphic ? disabled : ''"><v-select v-model="numLane" :items="lanes" label="Number of Lanes" outlined filled></v-select>
      </v-card>
      <v-btn
        color="primary"
        @click="e1 = 5">
        Continue
      </v-btn>
      <v-btn @click="cancel()" text>
        Cancel
      </v-btn>
    </v-stepper-content>

    <v-stepper-step step="5" editable @click="removeAsstPt()">
      Completed?
    </v-stepper-step>
    <v-stepper-content step="5">
      <!-- Send Asset/geometry edits to editFunc.js function -->
      <v-btn
        color="primary" @click="saveAttri()" :disabled="graphic ? disabled : ''">
        Save Edits
      </v-btn>
      <v-btn @click="cancel()" text :disabled="graphic ? disabled : ''">
        Cancel
      </v-btn>
    </v-stepper-content>
    <!-- <Map @nm="bool"/> -->
  </v-stepper>
</template>

<script>
//import { criConstants } from '../common/cri_constants';
import { getGraphic, modifyRoadbed, saveInfo,getCoordsRange, updateAsset, addAssetBreakPts, removeAsstPoints} from '../components/Map/editFunc'
import {roadInfo} from '../store'
//import Map from '../components/Map/Map.vue'


export default {
    name:"stepper",
    props:{
      received: Boolean
    },
    //components: {Map},
    data () {
      return {
        mileInfo:[],
        e1: 1,
        design: ['One Way', 'Two-way', 'Boulevard'],
        surface: ['Paved','Brick','Dirt/Natural','Gravel','Concrete'],
        lanes:[1,2,3,4,5,6],
        counter:0,
        roadSurface:[],
        roadbedName: null,
        roadbedDesign:'',
        roadbedSurface:'',
        beginDFO:null,
        endDFO:null,
        numLane:null,
        editTest: false,
        clickCount: 0,
        graphic: false,
        feature: false,
        clickCountF:0,
        cursor: false,
        bdfo: false,
        edfo: true,
        assetLnInfo: null,
        disabled: false,
        objectid: 0,
        //working on form validation
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
    mounted(){
      document.getElementById('addBtn').onclick = this.clearTable
    },
    watch:{
      received(){
        console.log(this.received)
      },
      //Interacting with reference layer
      clickCountF:{ //roadbedName
        handler: async function(){
          const click = "immediate-click"
          let countF = await modifyRoadbed(click)
          this.feature = true;
          this.graphic = false;
          //this.assetLnInfo = roadInfo.getSurface
          this.roadbedName = roadInfo.getName
          this.roadbedDesign = roadInfo.getDesign
          this.numLane = roadInfo.getLane
          this.objectid = roadInfo.getObjectId
          this.clickCountF += countF
          document.getElementById("step").style.width='450px'
        },
        immediate: true,
      },
      //Interacting with Graphic layer
      clickCount:{
        handler: async function(){
          let countG = await getGraphic(false)
          console.log(countG)
          this.feature = false;
          this.graphic = true;
          this.objectid = roadInfo.getObjectId
          this.clickCount += countG
          this.roadbedName = roadInfo.getName
          this.roadbedDesign = roadInfo.getDesign
          this.numLane = roadInfo.getLane
          document.getElementById("step").style.width='450px'
        }, 
         immediate: true,
      },
      // clickCountF:{
      //   handler: async function(){
      //     let countF = await getFeature()
      //     this.feature = true;
      //     this.graphic = false;
      //     this.clickCountF += countF
      //     this.roadbedName = roadInfo.getName
      //     this.roadbedDesign = roadInfo.getDesign
      //     this.numLane = roadInfo.getLane
      //     document.getElementById("step").style.width='450px'
         
      //   }, 
      //    immediate: true,
      // },
    },

    methods:{
      removeAsstPt(){
        removeAsstPoints();
      },
      executeDFOgraph(x,y){
        console.log(x)
        const dfoAssets = [];
        if(dfoAssets.length){
          dfoAssets.length = 0
        }
        console.log(dfoAssets)
        if(x==='point'){
          for(let b in this.fRdbdSurf){
            let srfcType = {srfcType: this.fRdbdSurf[b].srfc_type_id, AssetBeginDfo: this.fRdbdSurf[b].asset_ln_begin_dfo_ms, AssetEndDfo: this.fRdbdSurf[b].asset_ln_end_dfo_ms, objectid: this.objectid}
            dfoAssets.push(srfcType)
          }
          console.log(dfoAssets)
          getCoordsRange(dfoAssets)
        }
        else if(x==='line'){
          for(let z in this.rdbdSurf){
            console.log(this.rdbdSurf[z])
            let array = {srfcType: this.rdbdSurf[z].srfc_type_id, AssetBeginDfo: parseFloat(this.rdbdSurf[z].asset_ln_begin_dfo_ms), AssetEndDfo: parseFloat(this.rdbdSurf[z].asset_ln_end_dfo_ms),objectid: this.objectid}
            dfoAssets.push(array)
          }
          addAssetBreakPts(dfoAssets)
        }
        else if(x==='draw'){
          console.log(y)
          for(let z in this.rdbdSurf){
            if(this.rdbdSurf[z].asset_ln_end_dfo_ms === y){
              console.log(this.rdbdSurf[z])
              let array = {srfcType: this.rdbdSurf[z].srfc_type_id, AssetBeginDfo: parseFloat(this.rdbdSurf[z].asset_ln_begin_dfo_ms), AssetEndDfo: parseFloat(this.rdbdSurf[z].asset_ln_end_dfo_ms),objectid: this.objectid}
              dfoAssets.push(array)
            }
          }
          console.log(dfoAssets)
          updateAsset(dfoAssets)
        }
      },
      getElement(){
        //delete - Does nothing
        if(document.getElementsByTagName('input') && document.getElementById('dfo')){
          console.log(document.getElementsByTagName('input'))
        }
      },
      cancel(){
        document.getElementById("step").style.width = '0px'
        console.log(this.getCount)
      },
      //pushes new blank object row into mileInfo asset form
      addRoadSurface(){
        this.mileInfo.push({
          srfc_type_id:'',
          asset_ln_begin_dfo_ms: 0,
          asset_ln_end_dfo_ms:0
        })
      },
      clearTable(){
        this.roadbedName = undefined
        this.roadbedDesign = undefined
        this.roadbedSurface = undefined
        this.numLane = undefined
      },
      deleteSurface(index){
        if(document.getElementById('addSurf')){
          this.mileInfo.splice(index, 1) 
        }
          // if(document.getElementById('currentSurf')){
          //   this.rdbdSurf.splice(index, 1) 
          // }
      },
      saveAttri(){
        const rdbdSurface = [];
        for(let i in this.rdbdSurf){
          let srfcType = {srfcType: this.rdbdSurf[i].srfc_type_id, AssetBeginDfo: this.rdbdSurf[i].asset_ln_begin_dfo_ms, AssetEndDfo: this.rdbdSurf[i].asset_ln_end_dfo_ms}
          rdbdSurface.push(srfcType)
        }
          
        for(let i in this.mileInfo){
          let array = {srfcType: this.mileInfo[i].srfc_type_id, AssetBeginDfo: parseInt(this.mileInfo[i].asset_ln_begin_dfo_ms), AssetEndDfo: parseInt(this.mileInfo[i].asset_ln_end_dfo_ms)}
          rdbdSurface.push(array)
        }
          
        let createObj = {
          objectid: this.objectid,
          numLanes: this.numLane,
          rdbdName: this.roadbedName,
          rdbdDes: this.roadbedDesign,
          rdbdSurfe: JSON.stringify(rdbdSurface),
          editNm: 'DPROSACK', //TODO needs to be dynamic
          editDt: new Date().getTime()
        }
        console.log(createObj)
        saveInfo(createObj)
      }
    },
    computed:{ //Used to work with the vue properties without modifying them
      rdbdSurf(){
        this.clickCount;
        let srfc = roadInfo.getSurface
        console.log(srfc)
        return srfc
      },
      fRdbdSurf(){
        this.clickCountF;
        let Fsrfc = roadInfo.getSurface
        console.log(Fsrfc)
        return Fsrfc
      },
    }
}
</script>
<style scoped>
.scroller {
  width: auto;
  height: 300px;
  overflow-y: scroll;
  scrollbar-color: grey;
  scrollbar-width: thin;
}

</style>

