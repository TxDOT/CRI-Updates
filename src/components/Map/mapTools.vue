<!-- tools in sidebar nav -->
<template>
  <v-list class="outlineColor" id="toolsList" >
    <v-list-item-group v-model="clearEditBtn" color="#15648C" >
      <v-list-item v-for="(item,i) in items" :key="i" @click="item.action" :disabled="item.disabled">
        <v-list-item-icon>
          <v-icon v-text="item.icon" color="black" :disabled="item.disabled"></v-icon>
        </v-list-item-icon>
        <v-list-item-content>
          <v-list-item-title v-text="item.title" class="navFontSize"></v-list-item-title>
        </v-list-item-content>
      </v-list-item>
    </v-list-item-group>
  </v-list>
</template>

<script>
import { jumpToGoogle, undoSketch, redoSketch } from './mapNav'
import { criEditsLayer } from './map'
  export default {
    name: 'mapTools',
    data (){
      return {
        display:false,
        items: [
          { title: 'Last Year\'s Edits', disabled: false, icon: 'mdi-history', action: ()=>{
            criEditsLayer.definitionExpression = `COUNTY_NAME = '${this.countyName}'`
            criEditsLayer.visible = !criEditsLayer.visible
            this.isLastYearEdits = criEditsLayer.visible
            // criEditsLayer.visible = true
            }
          },
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
        ],
      }
    },
    methods:{



    },
    watch:{
      undoEdits:{
        handler: function(){
          this.items[2].disabled = this.undoEdits
          this.stepIn = null;
        },
        immediate: true
      },
      redoEdits:{
        handler: function(){
          this.items[3].disabled = this.redoEdits
          this.stepIn = null;
        },
        immediate: true
      }
    },
    computed:{
      isLastYearEdits:{
        get(){
          return this.$store.state.isLastYearEdits
        },
        set(bool){
          this.$store.commit('setIsLastYearEdits', bool)
        }
      },
      countyName:{
        get(){
          return this.$store.state.cntyName
        }
      },
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

.v-application--is-ltr .v-list-item__action:first-child, .v-application--is-ltr .v-list-item__icon:first-child{
  margin-right: 16px;
}

#toolsList{
  /* position: fixed;
  top: 19rem;
  bottom: 45%; 
  width: 100%; */
}
</style>