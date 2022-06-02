<template>
    <!-- <v-card height="200px" flat> -->
        <div class="scroller" style="height:200px;"> 
        <!-- Loop through asset breaks assigned in rdbdSurf. Assign surface type lable and dfo values -->
            <!-- <v-col v-for="(item,index) in rdbdSurf" :key="index" > -->
              <v-card v-if="isAssetType=== true" >
                <v-card-title class="surfaceTitle">
                  <v-card-text style="bottom:30px; position:relative; font-size: 15px; text-align: left;">What's the Surface Type?</v-card-text>
                </v-card-title>
                <v-select v-model="assetType" :items="surface" outlined dense placeholder="Pick a surface Type"></v-select>
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
              <v-btn plain absolute left small @click="atBegin()">
                <v-icon style="padding:0px;">mdi-map-marker</v-icon>At The beginning of the Road?
              </v-btn>
              <v-btn plain absolute left style="top:75px;" small @click="isAssetStartDisable=true">
                <v-icon style="padding:0px;">mdi-plus</v-icon>At this mile: 
              </v-btn>
              <v-text-field v-model="assetStartDfo" :disabled="!isAssetStartDisable" dense absolute outlined label="Enter Mile" style="width:100px; top:38px; left:150px; height:160px;"></v-text-field>
              <v-btn plain absolute left style="top:120px;" small>
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
            <v-btn plain absolute left small @click="atEnd()">
              <v-icon style="padding:0px;">mdi-map-marker</v-icon>At The End of the Road?
            </v-btn>
            <v-btn plain absolute left style="top:75px;" small @click="isAssetEndDisable=true">
              <v-icon style="padding:0px;">mdi-plus</v-icon>At this mile: 
            </v-btn>
            <v-text-field v-model="assetEndDfo" :disabled="!isAssetEndDisable" dense absolute outlined label="Enter Mile" style="width:100px; top:38px; left:150px; height:160px;"></v-text-field>
            <v-btn plain absolute left style="top:120px;" small>
              <v-icon style="padding:0px;">mdi-map-plus</v-icon>Choose on the Map
            </v-btn>
            <v-btn style="bottom: 50px; left: 40px; padding:0px;" depressed plain>
              Cancel
            </v-btn>
            <v-btn style="bottom: 50px; padding:0px; right:1px;" absolute outlined @click="isAssetEnd = false; isAssetFinished = true; updateGraphic(); updateMileInfo(assetEndDfo)">
              <u>Continue</u>
            </v-btn>
          </v-card>

          
                <!-- <v-select :items="surface" label="Road Surface" outlined v-model="item.SRFC_TYPE_ID" :disabled="graphic ? disabled : ''"></v-select>
                    <v-row>
                        <v-col sm="6">
                            <v-text-field label='Begin' v-model="item.ASSET_LN_BEGIN_DFO_MS" :disabled="graphic ? disabled : ''"></v-text-field> 
                        </v-col>
                        <v-col sm="6">
                            <v-text-field label='End' v-model="item.ASSET_LN_END_DFO_MS" :disabled="graphic ? disabled : ''"></v-text-field>
                                <v-btn id="editedfo" icon x-small elevation=0 @click="executeDFOgraph('draw',item.ASSET_LN_END_DFO_MS)" :disabled="graphic ? disabled : ''">
                                    <v-icon color="blue">mdi-pencil</v-icon>
                                </v-btn>
                                <v-btn id="currentSurf" small @click="deleteSurface(index)" elevation=0 :disabled="graphic ? disabled : ''"><v-icon color="red">mdi-delete</v-icon>
                                </v-btn> 
                        </v-col>
                    </v-row> -->
                    <!-- Deletes asset break in the form -->
            <!-- </v-col> -->
          <v-card v-if="isAssetFinished=== true" absolute left flat>
          <assetAlert/>
          <v-col  v-for="(item,index) in rdbdSurf" :key="index">
          <v-row style="border: 1px solid #204E70; height: 70px;" width="800px"> <!-- add for loop to display items; previous button should create an object, which can be displayed below info -->
            <v-card-text style="position: relative; left:1px; text-align: left;" >This road is {{item.SRFC_TYPE_ID}} between {{item.ASSET_LN_BEGIN_DFO_MS}} miles<br> and {{item.ASSET_LN_END_DFO_MS}} miles</v-card-text>
              <v-btn plain color="#15648C" style="left:270px; bottom: 43px;"><v-icon small>mdi-pencil</v-icon>Edit</v-btn>
              <v-btn plain style="left:200px; bottom:73px;" ><v-icon color="red" >mdi-delete</v-icon></v-btn>
          </v-row>
          <v-spacer></v-spacer>
          </v-col>
          <a @click="isAssetFinished = false; isAssetType = true; addRoadSurface();" style="position: relative; text-align:justify; text-justify: inter-word; right:65px; font-size: small; top: 10px; ;"><u>Click here to add another segment</u> with<br> a different surface type.</a>
          </v-card>
          <!-- Adds new asset breaks to form based on mileInfo array (populated by user click addRoadSurface function) -->
            <!-- <v-card v-for="(item,index) in mileInfo" :key="index" >
                <v-select :items="surface" label="Road Surface" outlined v-model="item.SRFC_TYPE_ID"></v-select>
                    <v-row>
                        <v-col>
                            <v-text-field  label='Begin' v-model="item.ASSET_LN_BEGIN_DFO_MS"></v-text-field>
                        </v-col>
                        <v-col sm="6">
                            <v-text-field label='End' v-model="item.ASSET_LN_END_DFO_MS"></v-text-field>
                                <v-btn id="editedfo1" icon x-small elevation=0 @click="executeDFOgraph('draw',item.ASSET_LN_END_DFO_MS)">
                                    <v-icon color="blue">mdi-pencil</v-icon>
                                </v-btn>
                                <v-btn id="addSurf" small @click="deleteSurface()" elevation=0>
                                    <v-icon color="red">mdi-delete</v-icon>
                                </v-btn>
                        </v-col>
                    </v-row>
            </v-card> -->
        </div>
    <!-- </v-card> -->
</template>

<script>
import {getGraphic} from '../editFunc'
import {gLayer} from '../map'
import assetAlert from '../stepperContent/assetAlert.vue'
export default {
    components: {assetAlert},
    name: 'roadSurface',
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
        isAssetStartDisable: false,
        isAssetEndDisable: false,
        surface: ['Paved','Brick','Dirt/Natural','Gravel','Concrete'],
        emptyValues:[v => !!v || 'Road Name is required'],
        graphic: true,
        disabled: false,
        newDfo: 0,
        countG: null,
        objectids:0
        
      }
    },
    methods:{
      atBegin(){
        console.log(this.objid)
        let id = gLayer.graphics.items.filter(x=>x.attributes.objectid === this.objid);
        console.log(id)
        this.assetStartDfo = Number(id[0].geometry.paths[0][0][2].toFixed(3))
        //this.$set(this.mileInfo[0], 'ASSET_LN_BEGIN_DFO_MS', id[0].geometry.paths[0][0][2])
      },
      atEnd(){
        let id = gLayer.graphics.items.filter(x=>x.attributes.objectid === this.objid);
        this.assetEndDfo = Number(id[0].geometry.paths[0].at(-1)[2]).toFixed(3)
        //this.$set(this.mileInfo[0], 'ASSET_LN_END_DFO_MS', Number(id[0].geometry.paths[0].at(-1)[2]).toFixed(3))
      },
      updateMileInfo(){
        this.rdbdSurf.at(-1).SRFC_TYPE_ID = this.assetType
        this.rdbdSurf.at(-1).ASSET_LN_BEGIN_DFO_MS = this.assetStartDfo
        this.rdbdSurf.at(-1).ASSET_LN_END_DFO_MS = this.assetEndDfo
        let beginEndArr = []
        beginEndArr.push(this.rdbdSurf.at(0).ASSET_LN_BEGIN_DFO_MS, this.rdbdSurf.at(-1).ASSET_LN_END_DFO_MS)
        this.setAssetCoverage = beginEndArr
        console.log(this.rdbdSurf)
        //this.updateRoad = this.mileInfo
      },
      updateGraphic(){
        let id = gLayer.graphics.items.filter(x=>x.attributes.objectid === this.objid)
        console.log(id)

        id[0].attributes.roadbedSurface = this.mileInfo
        console.log(this.mileInfo)
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
      //       let srfcType = {SRFC_TYPE_ID: this.rdbdSurf[b].SRFC_TYPE_ID, ASSET_LN_BEGIN_DFO_MS: this.rdbdSurf[b].ASSET_LN_BEGIN_DFO_MS, ASSET_LN_END_DFO_MS: this.rdbdSurf[b].ASSET_LN_END_DFO_MS, objectid: this.objid, edit: false}
      //       dfoAssets.push(srfcType)
      //     }
      //     for(let i in this.mileInfo){
      //       console.log(this.mileInfo[i])
      //       let array = {SRFC_TYPE_ID: this.mileInfo[i].SRFC_TYPE_ID, ASSET_LN_BEGIN_DFO_MS: this.mileInfo[i].ASSET_LN_BEGIN_DFO_MS, ASSET_LN_END_DFO_MS: this.mileInfo[i].ASSET_LN_END_DFO_MS,objectid: this.objid, edit: this.mileInfo[i].EDIT}
      //       dfoAssets.push(array)
      //     }
      //     this.newDfo = applyMToAsset(dfoAssets)
      //     this.executeDfoPts = null
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
      //         let array = {SRFC_TYPE_ID: this.rdbdSurf[z].SRFC_TYPE_ID, ASSET_LN_BEGIN_DFO_MS: parseFloat(this.rdbdSurf[z].ASSET_LN_BEGIN_DFO_MS), ASSET_LN_END_DFO_MS: parseFloat(this.rdbdSurf[z].ASSET_LN_END_DFO_MS),objectid: this.objid}
      //         dfoAssets.push(array)
      //       }
      //     }
      //      for(let i in this.mileInfo){
      //        if(Number(parseFloat(this.mileInfo[i].ASSET_LN_END_DFO_MS)) === Number(y)){
      //           console.log(this.mileInfo[i])
      //           let array = {SRFC_TYPE_ID: this.mileInfo[i].SRFC_TYPE_ID, ASSET_LN_BEGIN_DFO_MS: Number(parseFloat(this.mileInfo[i].ASSET_LN_BEGIN_DFO_MS)), ASSET_LN_END_DFO_MS: Number(parseFloat(this.mileInfo[i].ASSET_LN_END_DFO_MS)),objectid: this.objid}
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
      deleteSurface(index){
        console.log(index)
        if(document.getElementById('currentSurf')){
            console.log(this.mileInfo.splice(index, 1))
        }
          // if(document.getElementById('currentSurf')){
          //   this.rdbdSurf.splice(index, 1) 
          // }
      },
      addRoadSurface(){
        this.rdbdSurf.push({
            SRFC_TYPE_ID:'',
            ASSET_LN_BEGIN_DFO_MS: 0,
            ASSET_LN_END_DFO_MS:0,
            EDIT: true
        })
        console.log(this.mileInfo)
      },
    },
    watch:{
        objid:{
          handler: async function(){
            let countG = await getGraphic()
            console.log(countG)
            this.feature = false;
            this.graphic = true;
            this.graphicObj = countG
            //this.numLane = roadInfo.getLan
            this.stepperClose = true;
            //this.rdbdSurf
          }, 
          immediate: true,
        }, 
        // executeDfoPts:{
        //     handler: function(){
        //         console.log(this.executeDfoPts)
        //         this.executeDfoPts === 'point' ? this.executeDFOgraph('point') : null
        //     },
        //     immediate: true,
        // },
    },
    computed:{
        rdbdSurf:{
            get(){
                console.log(this.$store.state.roadbedSurface)
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
        objid:{
          get(){
            console.log(this.$store.state.objectid)
            return this.$store.state.objectid
          }
        },
        // executeDfoPts:{
        //     get(){
        //         console.log(this.$store.state.executeDfoPts)
        //         return this.$store.state.executeDfoPts
        //     },
        //     set(point){
        //       console.log(point)
        //       this.$store.commit('setExecuteDfoPts', point)
        //     }
        // },
        setAssetCoverage:{
          get(){
            return this.$store.state.assetCoverage
          },
          set(x){
            this.$store.commit('setAssetCoverage', x)
          }
        },
        // updateRoad:{
        //   get(){
        //     return JSON.parse(this.$store.state.roadInfoUpdate)
        //   },
        //   set(x){
        //     this.$store.commit('setRoadInfoUpdate', JSON.stringify(x))
        //   }
        // }
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