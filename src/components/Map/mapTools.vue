<template>
  <v-list class="outlineColor" style="position: absolute; bottom: 41vh; width: 100%;" >
    <v-list-item-group v-model="clearEditBtn" color="#15648C">
      <v-list-item v-for="(item,i) in items" :key="i" @click="item.action" :disabled="item.disabled">
        <v-list-item-icon>
          <v-icon v-text="item.icon"></v-icon>
        </v-list-item-icon>
        <v-list-item-content>
          <v-list-item-title v-text="item.title"></v-list-item-title>
        </v-list-item-content>
      </v-list-item>
    </v-list-item-group>
  </v-list>
</template>

<script>
import { jumpToGoogle, undoSketch, redoSketch } from './mapNav'
  //import { addRoadbed } from "./Map/editFunc"
  //import stepper from "../components/stepperQuestion.vue"
  //import alert from './Map/alert.vue'
  export default {
    name: 'mapTools',
    data (){
      return {
        display:false,
        items: [
          { title: 'Jump To Google', disabled: false, icon: 'mdi-run',action: ()=>{
            this.clearEditBtn = true
            jumpToGoogle();
            setTimeout(()=>{
              this.clearEditBtn = false
            },1000)
            }
          },
          { title: 'Undo Edit', disabled: true, icon: 'mdi-undo', action: ()=>{
              this.clearEditBtn = true
              undoSketch();
              setTimeout(()=>{
                this.clearEditBtn = false
              },500)
              
            }
          },
          { title: 'Redo Edit', disabled: true, icon: 'mdi-redo', action:() =>{
            this.clearEditBtn = true
            redoSketch();
            setTimeout(()=>{
              this.clearEditBtn = false
            },1000)
          }},
          // { title: 'Road Form', icon: 'mdi-form-select', action: ()=>{this.openStepper()}}
        ],
      }
    },
    watch:{
      undoEdits:{
        handler: function(){
          this.items[1].disabled = this.undoEdits
          this.stepIn = null;
        },
        immediate: true
      },
      redoEdits:{
        handler: function(){
          this.items[2].disabled = this.redoEdits
          this.stepIn = null;
        },
        immediate: true
      }
    },
    computed:{
      undoEdits:{
        get(){
          return this.$store.state.isUndoDisable
        },
        set(undo){
          this.$store.commit('setIsUndoDisable', undo)
        }
      },
      redoEdits:{
        get(){
          return this.$store.state.isRedoDisable
        },
        set(redo){
          this.$store.commit('setIsRedoDisable', redo)
        }
      },
      clearEditBtn:{
        get(){
          return this.$store.state.isClearMapTools
        },
        set(isBool){
          this.$store.commit('setIsClearMapTools', isBool)
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
</style>