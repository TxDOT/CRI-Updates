<!-- Left Nav side bar component -->
<template>
    <v-container style="height:100%; min-width: 50%;">
      <v-card id="newEditPopup" v-if="isNewEdit" >
            <v-card-title class="editRdTitle">
                <v-card-text class="editActionType">
                    What would you like to do?
                </v-card-text>
                
            </v-card-title>
            <v-select outlined dense label="Select an edit type"  :items="itemsDropdown" :menu-props="{ top: false, offsetY: true }" style="padding-top: 15px; width: 98%; justify-self: center;" v-model="toolSelection">
                    
                </v-select>
            <div class="buttonPositioning">
                <v-btn text style=" text-decoration: underline; color: #0056a9" @click="isNewEdit = false; clearEditBtn = false">Cancel</v-btn>
                <v-btn text outined style=" text-decoration: underline; color: #0056a9; border: solid black 1px; border-radius: 0px;" @click="pickTool()" :disabled="toolSelection == null">Continue</v-btn>
            </div>
        </v-card>
      <v-navigation-drawer app disable-resize-watcher disable-route-watcher id="navSideBarPos" permanent> 
        <v-card-title id="testTitle"><v-card-text id="navTxPos">To begin editing, select a road from the map or click New Edit below.</v-card-text></v-card-title>
          <v-list id="navList"> 
            <v-list-item-group id="tester" v-model="clearEditBtn" color="#15648C" active-class="border">
              <v-list-item v-for="(item,i) in newedititems" :key="i" @click="item.action" :disabled="isNewEdit || addRdBoolean || editExistingRd || nextDeleteRoadForm || deleteRoad " ripple color="black">
                <v-list-item-icon>
                  <v-icon v-text="item.icon" color="black" :disabled="graphic"></v-icon>
                </v-list-item-icon>
                <v-list-item-content>
                  <v-list-item-title v-text="item.title">
                  </v-list-item-title>
                </v-list-item-content>
              </v-list-item>
            </v-list-item-group>
          </v-list>
          <mapTools style="top: 4rem; position: relative;"/>
          <aboutHelp style="top: 7rem; position: relative;"/>
      </v-navigation-drawer>
    </v-container>
</template>
<script>
  import { addRoadbed, modifyRoadbed, stopEditing} from "./Map/edit"
  import {search} from './Map/map.js'
  import mapTools from "../components/Map/mapTools.vue"
  import aboutHelp from "../components/Map/resources.vue"
  import {gLayer} from './Map/map'
  import {store} from '../store'
  import {basemapDisplayOnEditType} from './Map/mapNav.js'

  export default {
    name: 'navSideBar',
    components: {mapTools, aboutHelp},
    data (){
      return {
        graphic: false,
        display: false,
        stepDisplay: true,
        edit: false,
        toolSelection: null,
        isNewEdit: false,
        disablebtn: false,
        itemsDropdown: [{value: 0, text:"Add a new or missing road"}, {value: 1, text: "Remove a road from the county network"}, {value: 2, text:"Change the name of an existing road"},{value: 3, text: "Extend, shorten or realign an existing road"}],
        newedititems:[
          {
            title: 'New Edit', icon: 'mdi-pencil', action: async ()=>{
              this.isNewEdit = true
              // this.graphic = true
              // stopEditing();
              // this.clearEditBtn = true
              // this.editExistingRd = true;
              // this.nextDeleteRoadForm = false
              // this.addRdBoolean = false;
              // this.deleteRoad = false;
              // this.infoRoad = false
              // await modifyRoadbed('click', 'edit')
              // if(this.editExistingRd === true){
              //   this.receiveLoadStatus = false
              //   this.modifyRoad = true
              //   this.firstAddToMap = true
              //   this.openStepper();
              // }
            }
          }
        ],
        // items: [
        //   { title: 'Add Road', icon: 'mdi-plus', action: ()=>{
        //     const isZoomReq = basemapDisplayOnEditType()
        //     if(isZoomReq){
        //       this.infoRoad = false
        //       this.editExistingRd = false;
        //       this.deleteRoad = false
        //       this.clearEditBtn = true
        //       this.addRdBoolean = true
        //       this.modifyRoad = false
        //       return
        //     }
        //     this.infoRoad = false
        //     this.getDfoBool = true
        //     this.editExistingRd = false;
        //     this.deleteRoad = false
        //     this.clearEditBtn = true
        //     this.addRdBoolean = true
        //     this.addRoad();
        //     this.display=true;
        //     this.modifyRoad = false
        //     }
        //   },
        //   { title: 'Edit Road', icon: 'mdi-pencil', action: async ()=>{
        //       stopEditing();
        //       this.clearEditBtn = true
        //       this.editExistingRd = true;
        //       this.nextDeleteRoadForm = false
        //       this.addRdBoolean = false;
        //       this.deleteRoad = false;
        //       this.infoRoad = false
        //       await modifyRoadbed('click', 'edit')
        //       if(this.editExistingRd === true){
        //         this.receiveLoadStatus = false
        //         this.modifyRoad = true
        //         this.firstAddToMap = true
        //         this.openStepper();
        //       }
        //     }
        //   },
        //   { title: 'Delete Road', icon: 'mdi-close-circle', action: async ()=>{
        //     this.infoRoad = false
        //     this.modifyRoad = false
        //     this.clearEditBtn = true
        //     stopEditing();
        //     this.editExistingRd = false
        //     this.nextDeleteRoadForm = false
        //     this.addRdBoolean = false
        //     this.deleteRoad = true
  
        //     await modifyRoadbed('click', 'delete')
        //     if(this.deleteRoad === true){
        //       this.clearEditBtn = false
        //       this.receiveLoadStatus = false
        //       this.editExistingRd = false
        //       this.deleteRoad = false
        //       this.nextDeleteRoadForm = true
        //       let lastDelRd = gLayer.graphics.items.at(-1)
        //       store.commit('setDeltaDis',[lastDelRd.attributes.originalLength, 'Delete'])
        //     }
        //   }},
        // ],
      }
    },
    methods:{
      addRoad(){
        addRoadbed()
          .then(() => {
            this.openStepper();
            this.addRdBoolean = false
            this.graphic = false;
          })
          .catch(err => console.log(err))
      },
      openStepper(){
        this.steppClose = true;
        search.clear()
      },
      alertTest(){
        if(this.stepDisplay)
        this.display = this.alertStatus
      },
      pickTool(){
            this.isNewEdit = false
            this.disablebtn = true
            if (this.toolSelection === 0){
                this.addNewRoad()
            }
            else if (this.toolSelection === 1){
              this.removeRoad()
            }
            else if (this.toolSelection === 2){
              this.renameRoad(true)
            }
            else if (this.toolSelection === 3){
              this.editRoad()
            }
        },
        addNewRoad(){

        //     const isZoomReq = basemapDisplayOnEditType()
        //     if(isZoomReq){
        //       this.infoRoad = false
        //       this.editExistingRd = false;
        //       this.deleteRoad = false
        //       this.clearEditBtn = true
        //       this.addRdBoolean = true
        //       this.modifyRoad = false
        //       return
        //     }
        //     this.infoRoad = false
        //     this.getDfoBool = true
        //     this.editExistingRd = false;
        //     this.deleteRoad = false
        //     this.clearEditBtn = true
        //     this.addRdBoolean = true
        //     this.addRoad();
        //     this.display=true;
        //     this.modifyRoad = false


          const isZoomReq = basemapDisplayOnEditType()
          if(isZoomReq){
            this.infoRoad = false
            this.editExistingRd = false;
            this.deleteRoad = false
            //this.clearEditBtn = true
            this.addRdBoolean = true
            this.modifyRoad = false
            return
          }

          this.infoRoad = false
          this.getDfoBool = true
          this.editExistingRd = false;
          this.deleteRoad = false
          // this.clearEditBtn = true
          this.addRdBoolean = true
          this.addRoad();
          this.display=true;
          this.modifyRoad = false
        },
        async removeRoad(){
          this.infoRoad = false
          this.modifyRoad = false
          // this.clearEditBtn = true
          stopEditing();
          this.editExistingRd = false
          this.nextDeleteRoadForm = false
          this.addRdBoolean = false
          this.deleteRoad = true

          await modifyRoadbed('click', 'delete')
          if(this.deleteRoad === true){
            // this.clearEditBtn = false
            this.receiveLoadStatus = false
            this.editExistingRd = false
            this.deleteRoad = false
            this.nextDeleteRoadForm = true
            let lastDelRd = gLayer.graphics.items.at(-1)
            store.commit('setDeltaDis',[lastDelRd.attributes.originalLength, 'Delete'])
          }
        },
        async renameRoad(isRename){
          this.returnStep = 2
          this.editHeaderStr = 'Select a road from the map to edit the name|Change the name of an existing road'
          // this.editRoad()
          stopEditing();
          // this.clearEditBtn = true
          this.editExistingRd = true;
          this.nextDeleteRoadForm = false
          this.addRdBoolean = false;
          this.deleteRoad = false;
          this.infoRoad = true
          await modifyRoadbed('click', 'edit',isRename)
          this.infoRoad = false
          if(this.editExistingRd === true){
            this.receiveLoadStatus = false
            this.modifyRoad = true
            this.firstAddToMap = true
            this.openStepper();
          }

        },
        async editRoad(){ 
          this.returnStep = 1
          this.editHeaderStr = 'Select a road from the map to begin editing|Extend, shorten, or realign an existing road'
          stopEditing();
          //this.clearEditBtn = true
          this.editExistingRd = true;
          this.nextDeleteRoadForm = false
          this.addRdBoolean = false;
          this.deleteRoad = false;
          this.infoRoad = false
          await modifyRoadbed('click', 'edit')
          if(this.editExistingRd === true){
            this.receiveLoadStatus = false
            this.modifyRoad = true
            this.firstAddToMap = true
            this.openStepper();
          }
        }
        
    },
    watch:{ 
      addRdBoolean:{
        handler: function(){
          this.graphic = this.addRdBoolean
        },
        immediate: true,
      },
      editExistingRd:{
        handler: function(){
          this.graphic = this.editExistingRd
        },
        immediate: true,
      },
      deleteRoad:{
        handler: function(){
          this.graphic = this.deleteRoad
        },
        immediate: true,
      },
      steppClose:{
        handler: function(){
          if(this.steppClose === true){
            document.getElementById('stepper').style.width = '500px'
          } 
          if(this.steppClose === false){
            this.clearEditBtn = false
            
          }
          this.stepDisplay = this.steppClose
          this.graphic = this.steppClose
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
      editHeaderStr: {
            get(){
                return this.$store.state.editHeaderString
            },
            set(str){
                this.$store.commit('seteditHeader', str)
            }
        },
      getDfoBool:{
        get(){
          return this.$store.state.isDfoReturn
        },
        set(bool){
          this.$store.commit('setIsDfoReturn', bool)
        }
      },
      modifyRoad:{
        get(){
          return this.$store.state.modifyRd
        },
        set(mod){
          this.$store.commit('setModifyRd', mod)
        }
      },
      nextDeleteRoadForm:{
        get(){
          return this.$store.state.deleteRdSecond
        },
        set(secondStep){
          this.$store.commit('setDeleteRdSecond', secondStep)
        }
      },
      deleteRoad:{
        get(){
          return this.$store.state.deleteRd
        },
        set(del){
          this.$store.commit('setDeleteRd', del)
        }
      },
      steppClose:{
        get(){
          return this.$store.state.stepperClose
        },
        set(open){
          this.$store.commit('setStepperClose', open)
        }
      },
      addRdBoolean:{
        get(){
          return this.$store.state.addRd
        },
        set(bool){
          this.$store.commit('setAddRd', bool)
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
      receiveLoadStatus:{
        get(){
          return this.$store.state.activeLoader
        },
        set(load){
          this.$store.commit('setActiveLoader', load)
        }
      },
      clearEditBtn:{
        get(){
          return this.$store.state.isClearEditBtn
        },
        set(isBool){
          this.$store.commit('setIsClearEditBtn', isBool)
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
#testTitle{
  position: relative;
  background: #014e96;
  color:white;
  height: auto;
  width: 100%;
  padding-left: 0px;
  padding-bottom: 5%;
  text-align: left;
  padding-bottom: 0;
  padding-top: 0;
}
#nav{
  flex: auto;
  position: absolute;
  top:6.6%;
  height:90%;
  width:12%;
  background: white;
  padding:0px;
}
.container{
  padding: 0px;
}
.v-sheet.v-card:not(.v-sheet--outlined){
  box-shadow: unset;
}
.v-list-item{
  display: flex;
  text-align: left;
}
.v-application--is-ltr .v-list-item__action:first-child, .v-application--is-ltr .v-list-item__icon:first-child{
  margin-right: 16px;
}
.border{
  border: #15648C solid 2px;
}
body.select{
  cursor: pointer
}

#navSideBarPos{
  top:3.7rem !important;
  /* max-height: 100%; */
  width: 13rem !important;
  /* min-width: 12rem; */
  overflow-y: auto !important;
}
#navTxPos{
  position:relative; 
  /* bottom:22px;  */
  font-size: 12.2px;
  word-break:keep-all;
  padding-top: 5px;
  padding-bottom: 5px;
}
#navList{
  /* position: fixed; 
  top: 5%; 
  width: 100%;
  min-height: 45rem;
  overflow-y: auto; */
}

#newEditPopup{
        position: absolute;
        top: 5rem;
        left: 13.4rem;
        width: 25.3vw;
        color: #014e96;
        /* #004180 */
        border-radius: 0px;
        height: auto ;
    }


.buttonPositioning{
        justify-self: end;
        padding-right: 5px;
        margin-bottom: 5px;

    }
</style>