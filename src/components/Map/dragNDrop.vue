<template>
    <v-container>
        <v-card tile style="position:absolute; width: 30rem; left: 40%; top: 35%; height: 20rem;" v-if="dragDropClick">
            <v-card-title style="background-color:#14375A; color:white; height: 40px;"><p style="position:relative; bottom: 10px;">Upload Files</p></v-card-title>
            <v-card-text style="z-index: 2;">
                <div class="fileContainer">
                    <form id="output" style="min-height: 200px; max-width: 34rem; white-space: pre; position: absolute; left: 50%; top: 50%; z-index:1000; background-color: rgba(255, 255, 255, .4);" @dragover="dragOver()" @dragleave="dragLeave()" @drop="drop();">
                        <input type="file" name="file" @change="dropItem($event)"/>
                    </form>
                </div>
            </v-card-text>
            <v-card-text id="text" style="position: absolute; top: 7rem; z-index: 0;"><v-icon style="font-size:3rem; position:absolute; top: 3rem; right: 13.8rem;">mdi-upload</v-icon>Drop Shapefiles here</v-card-text>
            <v-progress-circular id="progress" indeterminate color="primary"></v-progress-circular>
            <v-btn @click="dragDropClick = false" outlined tile color="#14375A" style="position: relative; top: 13.5rem; left: 11rem;"><u>close</u></v-btn>
        </v-card>
        <v-alert id="fmeResp" color="primary" tile v-if="serverResponse" style="color:white">{{serverCheck}}</v-alert><!-- update -->
    </v-container>
    
</template>
<script>

import {retrieveFile} from '../Map/editFunc'
export default {
    name: 'dragndrop',
    data(){
        return{
            serverCheck: 'Waiting for Response from FME Server'//update
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
        drop(){
            document.getElementById('text').style.display = 'none'
            document.getElementById('progress').style.display = 'block'
            //document.getElementById('progress').style.display = 'block'
        },
        drag(event){
            event.stopPropagation();
            event.preventDefault();
        },
        dropItem(event){
            if(event.target.files[0].type !== 'application/zip'){
                document.getElementById('progress').style.display = 'none'
                document.getElementById('text').style.display = "block"
                document.getElementById('text').innerText = 'File is not a Zip File. Upload Only Zip Files.'
                document.getElementById('output').style.border = '2px solid red'
                document.getElementById('text').style.color = 'red'
                return;
            }
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
        serverResponse:{
            get(){
                return this.$store.state.serverResp
            },
            set(resp){
                this.$store.commite('setServerCheck', resp)
            }
        }
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
        position: absolute;
        top: 9.1rem;
        left: 14.5rem;
    }
    

</style>