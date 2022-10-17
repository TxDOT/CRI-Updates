<template>
    <v-card tile style="position:absolute; width: 30rem; left: 40%; top: 35%; height: 18rem;" v-if="dragDropClick">
        <v-card-title style="background-color:#14375A; color:white; height: 40px;"><p style="position:relative; bottom: 10px;">Upload Files</p></v-card-title>
        <v-card-text style="z-index: 2;">
            <div class="fileContainer">
                <form id="output" style="min-height: 200px; min-width: 15%; white-space: pre; position: absolute; left: 50%; top: 50%; z-index:1000; background-color: rgba(255, 255, 255, .4);" @dragover="dragOver()" @dragleave="dragLeave()" @drop="drop($event);">
                    <input type="file" name="file" @change="dropItem($event)"/>
                </form>
            </div>
        </v-card-text>
        <v-card-text id="text" style="position: absolute; top: 7rem; z-index: 0;">Drag zip shapfiles here</v-card-text>
        <v-progress-circular id="progress" indeterminate color="primary"></v-progress-circular>
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
        dragOver(){
            //console.log(event)
            document.getElementById('output').style.border = '2px dashed green'
        },
        dragLeave(){
            document.getElementById('output').style.border = '2px dashed #14375A'
        },
        drop($event){
            document.getElementById('text').style.display = 'none'
            document.getElementById('progress').style.display = 'block'
            console.log($event)
            //document.getElementById('progress').style.display = 'block'
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
        background-color: rgba(255,0,0,.4);
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
    #output:-moz-drag-over{
        border: 2px dashed green;
        color:#14375A;
        background-color: white;
    }

    #progress{
        display:none;
        position: relative;
        top: 5rem;
        left: 13.5rem;
    }

</style>