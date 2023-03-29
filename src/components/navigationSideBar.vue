<!-- Left Nav side bar component -->
<template>
    <v-container style="height:100% min-width: 50%;">
      <v-navigation-drawer app disable-resize-watcher disable-route-watcher id="navSideBarPos" permanent> 
        <v-card-title id="testTitle"><v-card-text id="navTxPos">What Do You Want To Do?</v-card-text></v-card-title>
          <v-list id="navList"> 
            <v-list-item-group id="tester" v-model="clearEditBtn" color="#15648C" active-class="border">
              <v-list-item v-for="(item,i) in items" :key="i" @click="item.action" :disabled="graphic" ripple color="black">
                <v-list-item-icon>
                  <v-icon v-text="item.icon" color="black" :disabled="graphic"></v-icon>
                </v-list-item-icon>
                <v-list-item-content>
                  <v-list-item-title v-text="item.title"></v-list-item-title>
                </v-list-item-content>
              </v-list-item>
            </v-list-item-group>
          </v-list>
          <mapTools/>
          <aboutHelp/>
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

  export default {
    name: 'navSideBar',
    components: {mapTools, aboutHelp},
    data (){
      return {
        graphic: false,
        display: false,
        stepDisplay: true,
        edit: false,
        items: [
          { title: 'Add Road', icon: 'mdi-plus', action: ()=>{
            this.infoRoad = false
            this.getDfoBool = true
            this.editExistingRd = false;
            this.deleteRoad = false
            this.clearEditBtn = true
            this.addRdBoolean = true
            this.addRoad();
            this.display=true;
            
            this.modifyRoad = false

            }
          },
          { title: 'Edit Road', icon: 'mdi-pencil', action: async ()=>{
            stopEditing();
            this.clearEditBtn = true
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
          }},
          { title: 'Delete Road', icon: 'mdi-close-circle', action: async ()=>{
            this.infoRoad = false
            this.modifyRoad = false
            this.clearEditBtn = true
            stopEditing();
            this.editExistingRd = false
            this.nextDeleteRoadForm = false
            this.addRdBoolean = false
            this.deleteRoad = true
  
            await modifyRoadbed('click', 'delete')
            if(this.deleteRoad === true){
              this.clearEditBtn = false
              this.receiveLoadStatus = false
              this.editExistingRd = false
              this.deleteRoad = false
              this.nextDeleteRoadForm = true
              let lastDelRd = gLayer.graphics.items.at(-1)
              store.commit('setDeltaDis',[lastDelRd.attributes.originalLength, 'Delete'])
              console.log(lastDelRd.attributes.originalLength)
            }
          }},
        ],
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
          .catch((x)=>console.log(x))
      },
      openStepper(){
        this.steppClose = true;
        this.editExistingRd = null;
        search.clear()
      },
      alertTest(){
        if(this.stepDisplay)
        this.display = this.alertStatus
      },
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
      // editExistingRd:{
      //   handler: function(){
      //     this.edit = this.editExistingRd
      //   },
      //   immediate: true,
      // }
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
  background: #204E70;
  color:white;
  height: 5%;
  width: 100%;
  padding-left: 0px;
  padding-bottom: 5%;
  text-align: left;
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
  height:100%;
  width: 12rem !important;
  min-width: 12rem;
}
#navTxPos{
  position:relative; 
  bottom:22px; 
  font-size: 12.2px;
}
#navList{
  position: absolute; 
  top: 4.5vh; 
  width: 100%
}
</style>