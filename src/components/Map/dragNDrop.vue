<template>
    <v-card tile style="position:absolute; width: 30rem; left: 40%; top: 35%; height: 18rem;" v-if="dragDropClick">
        <v-card-title style="background-color:#14375A; color:white; height: 40px;"><p style="position:relative; bottom: 10px;">Upload Files</p></v-card-title>
        <v-card-text id="hover">
            <div class="fileContainer">
                <form id="output" style="min-height: 200px; min-width: 15%; white-space: pre; position: absolute; left: 50%; top: 50%;">
                    <input type="file" name="file" @change="dropItem($event)"/>
                </form>
            </div>
        </v-card-text>
        <v-card-text style="position: absolute; top: 7rem; z-index: -1;">Drag zip shapfiles here</v-card-text>
    </v-card>

 
</template>
<script>

import {retrieveFile} from '../Map/editFunc'
export default {
    name: 'dragndrop',
    data(){
        return{

        }
    },
    methods:{
        dragOver(event){
            //console.log(event)
            event.stopPropagation();
            event.preventDefault();
            event.dataTransfer.dropEffect = "move";
        },
        drag(event){
            event.stopPropagation();
            event.preventDefault();
        },
        dropItem(event){
            retrieveFile(event)

        }
    },
    computed:{
        dragDropClick:{
            get(){
            return this.$store.state.isDragDrop
            },
            set(isBool){
            this.$store.commit('setIsDragDrop', isBool)
            }
      },
    }

}
</script>
<style scoped>
    .fileContainer{
        position: absolute;
        top: 4rem;
        right: 28.5rem;
    }
    #output{
        border: 2px dashed #14375A;
        color:#14375A;
        background-color: white;
    }
    .fileContainer input {
        padding: 60px 0px 100px 190px;
        opacity: 0;
    }

</style>