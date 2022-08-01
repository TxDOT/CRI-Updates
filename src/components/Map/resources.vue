<template>
    <v-card style="top:8vh">
        <!-- <v-card-title id="mapTools">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Resources</v-card-title> -->
        <v-list class="outlineColor" max-width="99%">
          <v-list-item-group v-model="stepIn" color="#15648C">
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
        stepIn:null,
        display:false,
        drawer: true,
        items: [
          { title: 'Advanced', icon: 'mdi-cog'},
          { title: 'Criteria', icon: 'mdi-clipboard-text', action: (()=>{
              window.open('https://www.txdot.gov/apps/statewide_mapping/dusa/resources/COUNTY_ROAD_CRITERIA.pdf', '_blank')
            })
          },
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
.v-list-item{
  display: flex;
  text-align: left;
}

.outlineColor .v-list-item-group .v-list-item--active{
  outline: #15648C solid 2px;
}

</style>