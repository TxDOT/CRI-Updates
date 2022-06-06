
import {getGraphic, getSelectedDFO, applyMToAsset} from '../editFunc'
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
        assetTypeOpt: ['Paved','Brick','Dirt_Natural','Gravel','Concrete'],
        emptyValues:[v => !!v || 'Road Name is required'],
        graphic: true,
        disabled: false,
        newDfo: 0,
        countG: null,
        objectids:0,
        editIndex: -1,
        assetColorTable:{
          Paved: "#FF6700",
          Brick: "#FF0800",
          Gravel: "#36454F",
          Concrete: "#CFCFC4",
          Dirt_Natural:"#CF71AF"
        }
        
      }
    },
    methods:{
      editAsset(index){
        let getCurrentItem = this.mileInfo.at(index)
        console.log(getCurrentItem)
        this.assetType = getCurrentItem.SRFC_TYPE
        this.assetStartDfo = getCurrentItem.ASSET_LN_BEGIN
        this.assetEndDfo - getCurrentItem.ASSET_LN_END
        this.isAssetType = true
        this.isAssetFinished = false
        this.editIndex = index
        
      },
      async getDfoLocation(type){
        let returnSelectedDFO = await getSelectedDFO(this.objid);
        type === 'start' ? this.assetStartDfo = Number(returnSelectedDFO[0].toFixed(3)) : this.assetEndDfo = Number(returnSelectedDFO[0].toFixed(3))
        console.log(returnSelectedDFO)
      },

      atBegin(){
        console.log(this.objid)
        let id = gLayer.graphics.items.filter(x=>x.attributes.objectid === this.objid);
        console.log(id)
        this.assetStartDfo = Number(id[0].geometry.paths[0][0][2].toFixed(3))
        //this.$set(this.mileInfo[0], 'ASSET_LN_BEGIN_DFO_MS', id[0].geometry.paths[0][0][2])
      },

      atEnd(){
        let id = gLayer.graphics.items.filter(x=>x.attributes.objectid === this.objid);
        this.assetEndDfo = Number(id[0].geometry.paths[0].at(-1)[2].toFixed(3))
        //this.$set(this.mileInfo[0], 'ASSET_LN_END_DFO_MS', Number(id[0].geometry.paths[0].at(-1)[2]).toFixed(3))
      },

      updateMileInfo(){
        this.$set(this.mileInfo.at(this.editIndex), 'SRFC_TYPE', this.assetType)
        this.$set(this.mileInfo.at(this.editIndex), 'ASSET_LN_BEGIN', Number(this.assetStartDfo))
        this.$set(this.mileInfo.at(this.editIndex), 'ASSET_LN_END', Number(this.assetEndDfo))
        this.$set(this.mileInfo.at(this.editIndex), 'OBJECTID', this.objid)
        // this.rdbdSurf.at(-1).SRFC_TYPE_ID = this.assetType
        // this.rdbdSurf.at(-1).ASSET_LN_BEGIN_DFO_MS = this.assetStartDfo
        // this.rdbdSurf.at(-1).ASSET_LN_END_DFO_MS = this.assetEndDfo
       
        // beginEndArr.push(this.mileInfo.at(0).ASSET_LN_BEGIN, this.mileInfo.at(-1).ASSET_LN_END)
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
        console.log(diff, beginEndArr)
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
            gLayer.graphics.items[z].attributes.roadbedSurface = JSON.stringify(x)
          }
        }
        //
        //id[0] = this.rdbdSurf
        console.log(gLayer)
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
        console.log(index)
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
        console.log(this.mileInfo)
      },
    },

    watch:{
        objid:{
          handler: async function(){
            console.log('change', this.objid)
            this.resetItems();
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
        rdbdSurf:{
          handler: function(){
            if(this.mileInfo.length){
              this.mileInfo.length = 0
            }
            if(this.rdbdSurf){
              //let lenghtArr = this.rdbdSurf.length
              console.log(this.rdbdSurf)
              for(let i=0; i < this.rdbdSurf.length; i++){
                console.log(this.mileInfo)
                this.mileInfo.push({
                  SRFC_TYPE: this.rdbdSurf[i].SRFC_TYPE_ID,
                  ASSET_LN_BEGIN: this.rdbdSurf[i].ASSET_LN_BEGIN_DFO_MS,
                  ASSET_LN_END: this.rdbdSurf[i].ASSET_LN_END_DFO_MS,
                  EDIT: true,
                  OBJECTID: this.objid
                })
              }
              console.log(this.mileInfo)
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
        setAssetCover:{
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