<template>
  <v-container>
    <v-list class="outlineColor" style="position: absolute; bottom: 3vh; width: 98%">
      <v-list-item-group v-model="clearEditBtn" color="#15648C">
        <v-list-item v-for="(item,i) in items" :key="i" @click="item.action">
          <v-list-item-icon>
            <v-icon v-text="item.icon" color="black" :disabled="item.disabled"></v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title v-text="item.title"></v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list-item-group>
    </v-list>
  </v-container>
</template>

<script>
  //import { addRoadbed } from "./Map/editFunc"
  //import stepper from "../components/stepperQuestion.vue"
  //import alert from './Map/alert.vue'
  export default {
    name: 'aboutHelp',
    data (){
      return {
        display:false,
        drawer: true,
        items: [
          { title: 'Advanced', icon: 'mdi-cog',action: ()=>{
              this.clearEditBtn = true
              this.removeBtnFocus();
            }},
          { title: 'Criteria', icon: 'mdi-clipboard-text', action: ()=>{
              window.open('https://www.txdot.gov/apps/statewide_mapping/dusa/resources/COUNTY_ROAD_CRITERIA.pdf', '_blank')
              this.removeBtnFocus();
            }
          },
          { title: 'Help & Training', icon: 'mdi-help-circle', action: ()=>{
              console.log('help and training')
              this.removeBtnFocus();
            }
          },
          { title: 'About', icon: 'mdi-home', action: ()=>{
              this.aboutClick = true
            }
          }
        ],
      }
    },
    methods:{
      removeBtnFocus(){
        setTimeout(()=>{
          this.clearEditBtn = false
        },1000)
      }
    },
    computed:{
      aboutClick:{
        get(){
          return this.$store.state.isAbout
        },
        set(bool){
          this.$store.commit('setIsAbout', bool)
        }
      },
      clearEditBtn:{
        get(){
          return this.$store.state.isClearAboutHelpTools
        },
        set(isBool){
          this.$store.commit('setIsAboutHelpTools', isBool)
        }
      },
    }
  }
</script>
<style scoped>
.v-list-item{
  display: flex;
  text-align: left;
}

.outlineColor .v-list-item-group .v-list-item--active{
  outline: #15648C solid 2px;
}

.v-application--is-ltr .v-list-item__action:first-child, .v-application--is-ltr .v-list-item__icon:first-child{
  margin-right: 16px;
}
</style>