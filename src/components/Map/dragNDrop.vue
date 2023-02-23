<!-- Upload canvas for shapefile -->
<template>
    <v-container>
        <v-card tile id="dragNDrop" v-if="dragDropClick">
            <v-card-title class="cardTitle"><p id="titleText">Upload Files</p></v-card-title>
            <v-card-text style="z-index: 2;">
                <div class="fileContainer">
                    <form id="output" @dragover="dragOver()" @dragleave="dragLeave()" @drop="drop();" :disabled="this.isFmeRun">
                        <input :disabled="this.isFmeRun" type="file" name="file" @change="dropItem($event)"/>
                    </form>
                </div>
            </v-card-text>
            <v-card-text id="text" v-if="this.isFmeRun"><v-icon id="dragNDropTxt">mdi-upload</v-icon>{{fmeProcess}}</v-card-text>
            <v-card-text id="text" v-else><v-icon id="dragNDropTxt">mdi-upload</v-icon>{{uploadText}}</v-card-text>
            <v-progress-circular id="progress" indeterminate color="primary"></v-progress-circular>
            <v-btn @click="dragDropClick = false" outlined tile color="#14375A" id="btnClose"><u>close</u></v-btn>
        </v-card>
        <v-alert id="fmeResp" color="#cc7b29" tile v-if="serverResponse" style="color:white">{{serverCheck}}</v-alert><!-- update -->
    </v-container>

    
 
</template>
<script>

import {retrieveFile} from '../Map/advanced'

export default {
    name: 'dragndrop',
    data(){
        return{
            display: true,
            attrConv: false, 
            serverCheck: 'Additional Checks and Processing Upload',//update
            uploadText: 'Drop Shapefiles Here',
            fmeProcess: 'Cannot Upload while Process is Running'
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
            document.getElementById('output').style.width = '27rem'
        },
        drag(event){
            event.stopPropagation();
            event.preventDefault();
        },
        dropItem(event){
            console.log(event)
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
                this.$store.commit('setServerCheck', resp)
            }
        },
        isFmeRun:{
            get(){
                return this.$store.state.isFmeProcess
            },
            set(bool){
                this.$store.commit('setIsFmeProcess', bool)
            }
        }

    }

}
</script>
<style scoped>
    #fmeResp{
        position: fixed;
        top: 3.7rem;
        left: 75vh;
        width: 52vh;
        
    }
    .fileContainer{
        position: absolute;
        top: 4rem;
        right: 28.5rem;
        background-color: rgba(255,0,0,.4);
    }
    #titleText{
        position:relative;
        bottom: 10px;
    }
    #text{
        position: absolute;
        top: 7rem;
        z-index: 0;
    }
    #btnClose{
        position: relative;
        top: 13.5rem;
        left: 11rem;
    }
    #output{
        border: 2px dashed #14375A;
        color:#14375A;
        background-color: white;
        min-height: 200px;
        max-width: 27rem; 
        white-space: pre; 
        position: absolute; 
        left: 0rem; 
        top: 50%; 
        z-index:1000; 
        background-color: rgba(255, 255, 255, .4);
    }
    #dragNDropTxt{
        font-size:3rem;
        position:absolute;
        top: 3rem;
        right: 13.8rem;
    }
    .fileContainer input {
        max-width: 34rem;
        padding: 60px 0px 100px 190px;
        opacity: 0;
    }
    #output:-moz-drag-over{
        border: 2px dashed green;
        color:#14375A;
        padding: 60px 0px 100px 180px;
        background-color: white;
    }

    #progress{
        display:none;
        position: absolute;
        top: 9.1rem;
        left: 14.5rem;
    }
    #dragNDrop{
        position:absolute;
        width: 30rem;
        left: 40%;
        top: 35%;
        height: 20rem;
    }
</style>