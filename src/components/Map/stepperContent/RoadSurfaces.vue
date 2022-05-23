<template>
    <v-card height="100px">
        <div class="scroller"> 
        <!-- Loop through asset breaks assigned in rdbdSurf. Assign surface type lable and dfo values -->
            <v-col v-for="(item,index) in rdbdSurf" :key="index" >
                <v-select :items="surface" label="Road Surface" outlined v-model="item.SRFC_TYPE_ID" :disabled="graphic ? disabled : ''"></v-select> <!-- //v-model="roadbedSurface" -->
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
                    </v-row>
                    <!-- Deletes asset break in the form -->
            </v-col>
          <!-- Adds new asset breaks to form based on mileInfo array (populated by user click addRoadSurface function) -->
            <v-card v-for="(item,index) in mileInfo" :key="index" >
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
            </v-card>
        </div>
        <v-btn color="pink" @click="addRoadSurface">add additional Road Surface Types</v-btn>
    </v-card>
</template>

<script>
import {applyMToAsset, updateAsset, sketchCompete, getGraphic} from '../editFunc'
export default {
    components: {},
    name: 'roadSurface',
    data(){
      return{
        mileInfo:[],
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
        async executeDFOgraph(x,y){
        console.log(x,y)
        // console.log(this.rdbdSurf)
        sketchCompete();
        const dfoAssets = [];
        // if(dfoAssets.length){
        //   dfoAssets.length = 0
        // }
        // console.log(dfoAssets)
        if(x==='point'){
          console.log(this.rdbdSurf)
          for(let b in this.rdbdSurf){
            let srfcType = {SRFC_TYPE_ID: this.rdbdSurf[b].SRFC_TYPE_ID, ASSET_LN_BEGIN_DFO_MS: this.rdbdSurf[b].ASSET_LN_BEGIN_DFO_MS, ASSET_LN_END_DFO_MS: this.rdbdSurf[b].ASSET_LN_END_DFO_MS, objectid: this.objid, edit: false}
            dfoAssets.push(srfcType)
          }
          for(let i in this.mileInfo){
            console.log(this.mileInfo[i])
            let array = {SRFC_TYPE_ID: this.mileInfo[i].SRFC_TYPE_ID, ASSET_LN_BEGIN_DFO_MS: this.mileInfo[i].ASSET_LN_BEGIN_DFO_MS, ASSET_LN_END_DFO_MS: this.mileInfo[i].ASSET_LN_END_DFO_MS,objectid: this.objid, edit: this.mileInfo[i].EDIT}
            dfoAssets.push(array)
          }
          this.newDfo = applyMToAsset(dfoAssets)
          this.executeDfoPts = null
          //addAssetBreakPts(dfoAssets)
        }
        // if(x==='point' && this.feature===false){
        //   for(let b in this.rdbdSurf){
        //     console.log(this.fRdbdSurf[b])
        //     let srfcType = {srfcType: this.rdbdSurf[b].SRFC_TYPE_ID, AssetBeginDfo: Number(this.rdbdSurf[b].ASSET_LN_BEGIN_DFO_MS), AssetEndDfo: Number(this.rdbdSurf[b].ASSET_LN_END_DFO_MS), objectid: this.objectid}
        //     dfoAssets.push(srfcType)
        //   }
        //   for(let i in this.mileInfo){
        //     console.log(this.mileInfo[i])
        //     let array = {srfcType: this.mileInfo[i].SRFC_TYPE_ID, AssetBeginDfo: Number(parseFloat(this.mileInfo[i].ASSET_LN_BEGIN_DFO_MS)), AssetEndDfo: Number(parseFloat(this.mileInfo[i].ASSET_LN_END_DFO_MS)),objectid: this.objectid, edit: this.mileInfo[i].EDIT}
        //     dfoAssets.push(array)
        //   }
        //   console.log(dfoAssets)
        //   //console.log(applyMToAsset(dfoAssets))
        //   this.newDfo = applyMToAsset(dfoAssets)
        // }
        // else if(x==='line'){
        //   for(let z in this.rdbdSurf){
        //     console.log(this.rdbdSurf[z])
        //     let array = {srfcType: this.rdbdSurf[z].SRFC_TYPE_ID, AssetBeginDfo: parseFloat(this.rdbdSurf[z].ASSET_LN_BEGIN_DFO_MS), AssetEndDfo: parseFloat(this.rdbdSurf[z].ASSET_LN_END_DFO_MS),objectid: this.objectid}
        //     dfoAssets.push(array)
        //   }
        //   addAssetBreakPts(dfoAssets)
        // }
        else if(x==='draw'){
          console.log(y)
          
          for(let z in this.rdbdSurf){
            if(this.rdbdSurf[z].ASSET_LN_END_DFO_MS === y){
              let array = {SRFC_TYPE_ID: this.rdbdSurf[z].SRFC_TYPE_ID, ASSET_LN_BEGIN_DFO_MS: parseFloat(this.rdbdSurf[z].ASSET_LN_BEGIN_DFO_MS), ASSET_LN_END_DFO_MS: parseFloat(this.rdbdSurf[z].ASSET_LN_END_DFO_MS),objectid: this.objid}
              dfoAssets.push(array)
            }
          }
           for(let i in this.mileInfo){
             if(Number(parseFloat(this.mileInfo[i].ASSET_LN_END_DFO_MS)) === Number(y)){
                console.log(this.mileInfo[i])
                let array = {SRFC_TYPE_ID: this.mileInfo[i].SRFC_TYPE_ID, ASSET_LN_BEGIN_DFO_MS: Number(parseFloat(this.mileInfo[i].ASSET_LN_BEGIN_DFO_MS)), ASSET_LN_END_DFO_MS: Number(parseFloat(this.mileInfo[i].ASSET_LN_END_DFO_MS)),objectid: this.objid}
                dfoAssets.push(array)
              }
            }
          console.log(dfoAssets)
          let uptDFO = await updateAsset(dfoAssets)
          console.log(uptDFO)
          this.newDfo = uptDFO
        //   //editAsstObj[0].asset_ln_end_dfo_ms = uptDFO
        //   //editAsstObj[1].asset_ln_begin_dfo_ms = uptDFO
        }
      },
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
        this.mileInfo.push({
            SRFC_TYPE_ID:'',
            ASSET_LN_BEGIN_DFO_MS: 0,
            ASSET_LN_END_DFO_MS:0,
            EDIT: true
        })
      },
    },
    watch:{
        objectid:{
          handler: async function(){
            let countG = await getGraphic()
            console.log(countG)
            this.feature = false;
            this.graphic = true;
            this.graphicObj = countG
            //this.numLane = roadInfo.getLan
            this.stepperClose = true;
            this.rdbdSurf
          }, 
          immediate: true,
        }, 
        executeDfoPts:{
            handler: function(){
                console.log(this.executeDfoPts)
                this.executeDfoPts === 'point' ? this.executeDFOgraph('point') : null
            },
            immediate: true,
        },
    },
    computed:{
        rdbdSurf:{
            get(){
                console.log(this.$store.state.roadbedSurface)
                return JSON.parse(this.$store.state.roadbedSurface)
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
        executeDfoPts:{
            get(){
                console.log(this.$store.state.executeDfoPts)
                return this.$store.state.executeDfoPts
            },
            set(point){
              console.log(point)
              this.$store.commit('setExecuteDfoPts', point)
            }
        }
    }
}
</script>