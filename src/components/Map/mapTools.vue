<template>
    <v-card style="top:10%">
        <!-- <v-card-title id="mapTools">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Map Tools</v-card-title> -->
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
</template>

<script>
  //import { addRoadbed } from "./Map/editFunc"
  //import stepper from "../components/stepperQuestion.vue"
  //import alert from './Map/alert.vue'
  export default {
    name: 'mapTools',
    data (){
      return {
        stepIn:1,
        display:false,
        drawer: true,
        items: [
          { title: 'Jump To Google', icon: 'mdi-run',action: ()=>{}},
          { title: 'Undo Edit', icon: 'mdi-undo'},
          { title: 'Redo Edit ', icon: 'mdi-redo'},
          // { title: 'Road Form', icon: 'mdi-form-select', action: ()=>{this.openStepper()}}
        ],
      }
    },
     
  }
</script>
<style scoped>
#mapTools{
    position: relative;
    background: #15648C;
    color:white;
    font-size: 16px;
    width: 100%;
    height: 40px;
    padding: 0px;
    text-align: center;
}

</style>