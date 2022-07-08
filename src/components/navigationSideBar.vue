<template>
    <v-card>
      <v-navigation-drawer app style="top:59px;">
      <!-- <alert v-if="display === true"/> -->
        <!-- <v-alert v-model="display" color="green" @click="display = false">
          Click on the Map to start Drawing!
        </v-alert> -->
        <v-card-title id="testTitle">What Do You Want To Do?</v-card-title>
        <v-list class="outlineColor"> 
          <v-list-item-group id="tester" v-model="stepIn" color="#15648C" active-class="border">
            <v-list-item v-for="(item,i) in items" :key="i" @click="item.action" :disabled="graphic" ripple>
            <v-list-item-icon>
              <v-icon v-text="item.icon"></v-icon>
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
      </v-card>
</template>
<script>
  import { addRoadbed, modifyRoadbed, stopEditing} from "./Map/editFunc"
  import mapTools from "../components/Map/mapTools.vue"
  import aboutHelp from "../components/Map/resources.vue"
  //import alert from './Map/alert.vue'

  export default {
    name: 'navSideBar',
    components: {mapTools, aboutHelp},
    data (){
      return {
        stepIn:null,
        graphic: false,
        display: false,
        stepDisplay: true,
        edit: false,
        items: [
          { title: 'Add Road', icon: 'mdi-plus', action: ()=>{
            this.getDfoBool = true
            this.editExistingRd = false;
            this.deleteRoad = false
            this.addRoad();
            this.display=true;
            this.addRdBoolean = true
            this.modifyRoad = false
            //this.graphic = false;
            
            // setTimeout(()=>{
            //   this.editExistingRd = null;
            //   this.display = false;
            // },5000)

            }
          },
          { title: 'Edit Road', icon: 'mdi-pencil', action: async ()=>{
            stopEditing();
            this.editExistingRd = true;
            this.nextDeleteRoadForm = false
            this.addRdBoolean = false;
            this.deleteRoad = false
            // setTimeout(()=>{
            //   this.editExistingRd = null;
            // },5000)
            await modifyRoadbed('click', 'edit')
            if(this.editExistingRd === true){
              this.receiveLoadStatus = false
              this.modifyRoad = true
              this.openStepper();
            }

            //hightlightFeat();
            
            
          }},
          { title: 'Delete Road', icon: 'mdi-close-circle', action: async ()=>{
            this.modifyRoad = false
            stopEditing();
            this.editExistingRd = false
            this.nextDeleteRoadForm = false
            this.addRdBoolean = false
            this.deleteRoad = true
  
            await modifyRoadbed('click', 'delete')
            if(this.deleteRoad === true){
              this.receiveLoadStatus = false
              this.editExistingRd = false
              this.deleteRoad = false
              this.nextDeleteRoadForm = true
              this.stepIn = null
            }
          }},
          // { title: 'Road Form', icon: 'mdi-form-select', action: ()=>{this.openStepper()}}
        ],
      }
    },
    methods:{
      async addRoad(){
        addRoadbed()
          .then(() => {
            this.openStepper();
            this.addRdBoolean = false
            this.graphic = false;
          })
      },
      editRoad(){

      },
      openStepper(){
        this.steppClose = true;
        this.editExistingRd = null;
      },
      alertTest(){
        if(this.stepDisplay)
        this.display = this.alertStatus
      },
    },
    watch:{ 
      addRdBoolean:{
        handler: function(){
          if(this.addRdBoolean === false){
            this.stepIn = null
          }
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
          else if(this.steppClose == false){
            this.stepIn = null
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
      }
    }
  }
</script>

<style scoped>

#testTitle{
  position: relative;
  background: #15648C;
  color:white;
  font-size: 17px;
  height: 60px;
  padding-left: 10px;
  padding-top: 5%;
  text-align: center;
  z-index:1;
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


.border{
  border: #15648C solid 2px;
}


body.select{
  cursor: pointer
}
/* #navButtons:active{
  outline: #15648C solid 2px;
} */

</style>