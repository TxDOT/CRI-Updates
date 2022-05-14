<template>
  <v-container id="nav">
    <v-card>
    <!-- <alert/> -->
      <stepper/>
        <v-alert v-model="display" color="green" @click="display = false">
          Click on the Map to start Drawing!
        </v-alert>
        <v-card-title id="testTitle">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;What Do You Want To Do?</v-card-title>
        <v-list>
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
  </v-container>
</template>

<script>
  import { addRoadbed } from "./Map/editFunc"
  import mapTools from "../components/Map/mapTools.vue"
  import aboutHelp from "../components/Map/resources.vue"
  import stepper from "../components/stepperQuestion.vue"
  //import alert from './Map/alert.vue'
  export default {
    name: 'navSideBar',
    components: {mapTools, aboutHelp, stepper},
    data (){
      return {
        stepIn:1,
        display:false,
        drawer: true,
        items: [
          { title: 'Add Road', icon: 'mdi-plus', action: ()=>{
            setTimeout(()=>{
              this.display = false
            },5000)
            this.addRoad(); 
            this.display=true
            }
          },
          { title: 'Edit Road', icon: 'mdi-pencil', action: ()=>{this.addRoad()}},
          { title: 'Delete Road', icon: 'mdi-close-circle', action: ()=>{this.addRoad()} },
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
        if(document.getElementById("stepper").style.width === '0px'){
          document.getElementById("stepper").style.width='450px'
        }
        else{
          document.getElementById("stepper").style.width='0px'
        }
      }
    },
    // computed:{
    //   alertStatus:{
    //     get(){
    //       return this.$store.state.alertDisplay
    //     },
    //     set(status){
    //       console.log(status)
    //       this.$store.commit('setAlertDisplay',status)
    //     }
    //   }
    // }
  }
</script>

<style scoped>
#testTitle{
  position: relative;
  background: #15648C;
  color:white;
  font-size: 16px;
  height: 40px;
  padding: 0px;
  text-align: center;
}
#nav{
    position: absolute;
    top:6%;
    left:.5%;
    height:88%;
    width:15%;
    background: white;
    padding:0px;
}
.container{
  padding: 0px;
}

.v-sheet.v-card:not(.v-sheet--outlined){
  box-shadow: unset;
}

</style>