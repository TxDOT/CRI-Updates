<template>
    <v-card style="top:20%">
        <!-- <v-card-title id="mapTools">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Resources</v-card-title> -->
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
    name: 'aboutHelp',
    data (){
      return {
        stepIn:1,
        display:false,
        drawer: true,
        items: [
          { title: 'Advanced', icon: 'mdi-cog',action: ()=>{}},
          { title: 'Criteria', icon: 'mdi-clipboard-text'},
          { title: 'Help & Training', icon: 'mdi-help-circle'},
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