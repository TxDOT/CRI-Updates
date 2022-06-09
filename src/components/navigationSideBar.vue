<template>
  
    <v-card>
      <v-navigation-drawer app style="top:59px;">
      <!-- <alert v-if="display === true"/> -->
        <!-- <v-alert v-model="display" color="green" @click="display = false">
          Click on the Map to start Drawing!
        </v-alert> -->
        <v-card-title id="testTitle">What Do You Want To Do?</v-card-title>
        <v-list class="outlineColor"> 
          <v-list-item-group v-model="stepIn" color="#15648C">
            <v-list-item v-for="(item,i) in items" :key="i" @click="item.action" :disabled="graphic" ripple :style="{}">
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
            this.editExistingRd = false;
            this.addRoad();
            this.display=true;
            this.addRdBoolean = true
            
            // setTimeout(()=>{
            //   this.editExistingRd = null;
            //   this.display = false;
            // },5000)

            }
          },
          { title: 'Edit Road', icon: 'mdi-pencil', action: async ()=>{
            stopEditing();
            this.editExistingRd = true;
            document.body.style.cursor = 'pointer'
            // setTimeout(()=>{
            //   this.editExistingRd = null;
            // },5000)
            await modifyRoadbed('click')
            this.openStepper();
            this.addRdBoolean = false;
            
          }},
          { title: 'Delete Road', icon: 'mdi-close-circle'},
          // { title: 'Road Form', icon: 'mdi-form-select', action: ()=>{this.openStepper()}}
        ],
      }
    },
    mounted(){
      console.log(this.graphic)
    },
    methods:{
      async addRoad(){
        addRoadbed()
          .then((result) => {
            console.log(result)
            this.openStepper();
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

        // modifyLine:{
    //   handler: async function(){
    //     let modify = await modifyRoadbed("click")
    //     this.modifyLine += parseFloat(geometryEngine.geodesicLength(modify.features[0].geometry, "miles").toFixed(3))
    //     console.log(modify.features[0].geometry)
    //   },
    //   immediate:true,
    // },
    watch:{
      steppClose:{
        handler: function(){
          if(this.steppClose === true){
            document.getElementById('stepper').style.width = '500px'
          }
          console.log(this.steppClose)
          this.stepDisplay = this.steppClose
          this.graphic = this.steppClose
          console.log(this.graphic)
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
          console.log(edit)
          this.$store.commit('setEditExisting', edit)
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

.outlineColor .v-list-item-group .v-list-item--active{
  outline: #15648C solid 2px;
}

</style>