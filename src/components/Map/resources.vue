<template>
  <v-container>
    <v-list class="outlineColor" style="position: absolute; bottom: 3vh; width: 98%">
      <v-list-item-group v-model="clearEditBtn" color="#15648C">
        <v-list-item v-for="(item,i) in items" :key="i" @click="item.action" :disabled="item.disabled" :id="item.id">
          <v-list-item-icon>
            <v-icon v-text="item.icon" color="black" :disabled="item.disabled"></v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title v-text="item.title"></v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list-item-group>
    </v-list>
     <v-dialog
      v-model="display"
      max-width="400"
      persistent>
        <v-card v-model="display" height="150" style="border-radius:0%; overflow-y: hidden; overflow-x: hidden;">
          <v-card-title class="surfaceTitle"><p style="bottom: .7rem; position:relative; right: .5rem;">Temporarily Unavailable</p></v-card-title>
            <v-card-text style="text-align:left; color: black; top: 1rem; position: relative; right: .5rem;">
              This functionality is under development and temporarily unavailable.
            </v-card-text>
            <v-btn outlined tile @click="display = false" color="#14375A" style="left: 9rem; top: 0rem; border: 1px solid black">
              <u>Close</u>
            </v-btn>
        </v-card>
      </v-dialog>
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
          { title: 'Advanced', icon: 'mdi-cog', action: ()=>{
              this.display = true
              this.clearEditBtn = true
              this.removeBtnFocus();
            }},
          { title: 'Criteria', icon: 'mdi-clipboard-text', action: ()=>{
              window.open('https://www.txdot.gov/data-maps/roadway-inventory/county-road-criteria.html', '_blank')
              this.removeBtnFocus();
            }
          },
          { title: 'Help & Training', icon: 'mdi-help-circle', action: ()=>{
              window.open('https://youtube.com/playlist?list=PLyLWQADRroOUeiQ8sXX3JMVQeu87sgig2', '_blank')
              this.clearEditBtn = true
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
.surfaceTitle{
  position: relative;
  background-color: #14375A;
  text-align: left;
  top:0%;
  color: white;
  bottom:40px;
  height:40px;
  padding: none;
  width: 100%;
  font-size: 16px;
}
</style>