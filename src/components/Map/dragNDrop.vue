<!-- Upload canvas for shapefile -->
<template>
    <v-container>
        <v-card tile id="dragNDrop" v-if="dragDropClick">
            <v-card-title class="cardTitle"><p id="titleText">Upload Files</p></v-card-title>
            <v-card-text style="z-index: 2;">
                <div class="fileContainer">
                    <form id="output" @dragover="dragOver()" @dragleave="dragLeave()" :disabled="this.isFmeRun">
                        <input :disabled="this.isFmeRun" type="file" name="file" @change="dropItem($event)"/>
                    </form>
                </div>
            </v-card-text>
            <v-card-text id="text" v-if="this.isFmeRun"><v-icon id="dragNDropTxt">mdi-upload</v-icon>{{fmeProcess}}</v-card-text>
            <v-card-text id="text" v-else><v-icon id="dragNDropTxt">mdi-upload</v-icon>{{uploadText}}</v-card-text>
            <v-progress-circular id="progress" indeterminate color="primary"></v-progress-circular>
            <v-btn @click="closeDialog()" outlined tile color="#14375A" id="btnClose"><u>close</u></v-btn>
        </v-card>
        <v-alert id="fmeResp" :color="this.isFmeRun === true ? '#cc7b29' : 'green'" tile v-if="serverResponse" style="color:white" :dismissible="this.isFmeRun === true ? false : true">{{serverCheck}}
            <v-progress-circular id="processIcon" indeterminate size="22" v-if="this.isFmeRun === true "></v-progress-circular>
        </v-alert><!-- update -->

        <v-alert v-if="isProcessUpload" id="continueUpload" border="left" color="#14375A">
            <p id="alertTxt">You are uploading {{ this.totalCount}} records. To proceed click Continue.</p>
            <v-btn class="btn" depressed id="ctnUpldBtn" @click="isAgree"><u>Continue</u></v-btn>
            <v-btn class="btn" depressed id="cnclUpldBtn" @click="isDisagree">Cancel</v-btn>
        </v-alert>
    </v-container>

    
</template>
<script>

import {retrieveFile, processUpload, uploadFail} from '../Map/advanced'
import {view} from './map'
import esriRequest from "@arcgis/core/request";


export default {
    name: 'dragndrop',
    data(){
        return{
            display: true,
            attrConv: false,
            serverCheck: '',
            serverChecks: 'Processing upload and performing additional checks.',//update
            serverDone: 'Process completed. If QC errors has been detected, be on the lookout for an email.',
            uploadText: 'Drop Shapefiles Here',
            fmeProcess: 'Cannot Upload while Process is Running',
            isProcessUpload: false,
            fileName: '',
            totalCount: 0,
            fileObj : null
        }
    },
    methods:{
        closeDialog(){
            this.dragDropClick = false;
            this.isFmeRun = false;

        },
        dragOver(){
            //console.log(event)
            document.getElementById('output').style.border = '2px dashed green'
        },
        dragLeave(){
            document.getElementById('output').style.border = '2px dashed #14375A'
        },
        drag(event){
            event.stopPropagation();
            event.preventDefault();
        },
        dropItem(event){
            this.fileName = retrieveFile(event)
            this.processUploadFile(this.fileName)
            this.isFmeRun = true
        },

        processUploadFile(file){
            let fileParams = {
                name: file,
                targetSR: view.spatialReference,
                maxRecordCount: 4000,
                enforceInputFileSizeLimit: true,
                enforceOutputJsonSizeLimit: true,
                generalize: false,
                maxAllowableOffset: 10,
                reducePrecision: false,
                numberOfDigitsAfterDecimal: 5
            }

            let content = {
                filetype: "shapefile",
                publishParameters: JSON.stringify(fileParams),
                f: "json"
            }

            const convShpToGraphic = esriRequest("https://www.arcgis.com/sharing/rest/content/features/generate",{
                query: content,
                body: document.getElementById('output'),
                responseType: "json",
                method: "post"
            })
            convShpToGraphic
                .then((res)=>{
                    this.totalCount =res.data.featureCollection.layers[0].featureSet.features.length
                    this.fileObj = res
                    this.dragDropClick = false
                    this.isProcessUpload = true
                })
                .catch((fail)=>{
                    uploadFail([fail])
                })

        },

        isAgree(){
            processUpload(this.fileObj)
            this.isProcessUpload = false
            this.dragDropClick = true
        },
        isDisagree(){
            this.isProcessUpload = false
            this.isFmeRun = false
        }
    },
    watch:{
        isFmeRun:{
           handler: function(){
            this.serverCheck = this.isFmeRun === true ? this.serverChecks : this.serverDone
            this.display = this.isFmeRun
           },
           immediate: true,
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
        position: relative;
        top: 0rem;
        left: 35%;
        width: 58vh;
        
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
        top: 5rem;
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
    #processIcon{
        position: relative;
        left: 1rem;
    }

    #continueUpload{
        position: relative;
        top: 17rem;
        border-radius: 0%;
        color: white;
        width: 29rem;
        left: 37%;
        height: 6.5rem;
    }
    .btn{
        border-radius: 0%;
    }

    #ctnUpldBtn{
        left: 12.5rem;
        color:#14375A;
    }

    #cnclUpldBtn{
        right: 1.3rem;
        color:#14375A;
    }
    #alertTxt{
        text-align: left;
    }
</style>