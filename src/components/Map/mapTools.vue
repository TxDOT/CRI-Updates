<template>
    <v-card style="top:4vh">
        <!-- <v-card-title id="mapTools">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Map Tools</v-card-title> -->
        <v-list class="outlineColor" max-width="99%">
          <v-list-item-group v-model="stepIn" color="#15648C">
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
      </v-card>
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
        stepIn: null,
        display:false,
        items: [
          { title: 'Jump To Google', disabled: false, icon: 'mdi-run',action: ()=>{
            this.stepIn = true
            jumpToGoogle();
            setTimeout(()=>{
              this.stepIn = null
            },1000)
            }
          },
          { title: 'Undo Edit', disabled: true, icon: 'mdi-undo', action: ()=>{
              this.stepIn = true
              undoSketch();
              setTimeout(()=>{
                this.stepIn = null
              },500)
              
            }
          },
          { title: 'Redo Edit', disabled: true, icon: 'mdi-redo', action:() =>{
            this.stepIn = true
            redoSketch();
            setTimeout(()=>{
              this.stepIn = null
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

    }
     
  }
</script>
<style scoped>
#mapTools{
  position: absolute;
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

/* .outlineColor .v-list-item-group .v-list-item--active{
  outline: #15648C solid 2px;
} */
.outlineColor .v-list-item-group .v-list-item--active{
  outline: #15648C solid 2px;
}
</style>