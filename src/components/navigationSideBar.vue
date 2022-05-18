<template>
  <v-container id="nav">
    <v-card>
    <alert v-if="display === true"/>
        <!-- <v-alert v-model="display" color="green" @click="display = false">
          Click on the Map to start Drawing!
        </v-alert> -->
        <v-card-title id="testTitle">What Do You Want To Do?</v-card-title>
        <v-list flat>
          <v-list-item-group v-model="stepIn">
            <v-list-item v-for="(item,i) in items" :key="i" @click="item.action">
            <v-list-item-icon>
              <v-icon v-text="item.icon"></v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title v-text="item.title"></v-list-item-title>
            </v-list-item-content>
            </v-list-item>
          </v-list-item-group>
        </v-list>
      </v-card>
      <mapTools/>
      <aboutHelp/>
      <editExistingRd v-if="edit === true"/>
  </v-container>
</template>
<script>
  import { addRoadbed, modifyRoadbed} from "./Map/editFunc"
  import mapTools from "../components/Map/mapTools.vue"
  import aboutHelp from "../components/Map/resources.vue"
  import editExistingRd from "../components/Map/editExistingRd.vue"
  import alert from './Map/alert.vue'
  export default {
    name: 'navSideBar',
    components: {mapTools, aboutHelp, editExistingRd, alert},
    data (){
      return {
        stepIn:1,
        display: false,
        edit:false,
        items: [
          { title: 'Add Road', icon: 'mdi-plus', action: ()=>{
            setTimeout(()=>{
              this.display = false;
            },5000)
            this.addRoad();
            this.display=true;
            }
          },
          { title: 'Edit Road', icon: 'mdi-pencil', action: async ()=>{
            this.edit = true;
            setTimeout(()=>{
              this.edit = false;
            },5000)
            await modifyRoadbed('click')
          }},
          { title: 'Delete Road', icon: 'mdi-close-circle'},
          // { title: 'Road Form', icon: 'mdi-form-select', action: ()=>{this.openStepper()}}
        ],
      }
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
       
      },
      alertTest(){
        if(this.stepDisplay)
        this.display = this.alertStatus
      }
    },
    // watch:{
    //   stepDisplay(){
    //       this.stepDisplay = this.stepperClose
    //     }
    // },
    computed:{
      // stepperClose:{
      //   get(){
      //     return this.$store.state.stepperClose
      //   }
      // }
    }
  }
</script>

<style scoped>

#testTitle{
  position: relative;
  background: #15648C;
  color:white;
  font-size: 15px;
  height: 40px;
  padding-left: 10%;
  padding-top: 2%;
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

</style>