<!-- User prompt when selecting Add, Edit, or Delete from left nav -->
<template>
    <v-container>
        <v-card id="edit"  v-if="edit===true || addR===true || deleteR===true">
            <v-card-title class="editRdTitle" v-if="edit===true">
                <v-card-text class="editActionType">Edit Road</v-card-text>
             </v-card-title>
            <v-card-title class="editRdTitle" v-if="addR===true">
                <v-card-text class="editActionType" >Add Road</v-card-text>
            </v-card-title>
            <v-card-title class="editRdTitle" v-if="deleteR===true">
                <v-card-text class="editActionType">Delete Road</v-card-text>
            </v-card-title>
    

        <v-card-text v-if="edit===true" class="editRdInfo">
            <v-icon color="blue" class="editRdIcon">
                 mdi-plus
            </v-icon>
            Select a road from the map to begin editing
        </v-card-text>
        <v-card-text v-if="addR === true" class="editRdInfo">
            <v-icon color="blue" class="editRdIcon">
                mdi-cursor-default
            </v-icon>
            Click on the map to start digitizing a new road
        </v-card-text>
        <v-card-text v-if="deleteR === true" class="editRdInfo">
            <v-icon color="blue" class="editRdIcon" style="transform:rotate(330deg); top:0px">
                mdi-navigation
            </v-icon>Select a road from the map to delete it
        </v-card-text>
        <v-btn tile outlined depressed id="cancelBtn" v-if="edit===true || addR === true || deleteR === true" text color="#204E70" @click="cancelEditAction(); clearEditBtn=false"><u>Cancel</u></v-btn>
    </v-card>
    <v-card id="delWarn" v-if="deleteSecond === true || deleteClick" :style="deleteClick ? {'height': '200px'} : {}"> <!-- //&& this.modifyR === false -->
        <v-card-title class="delRdTitle" style="width: 385px">
            Delete a Road
        </v-card-title>
        <v-card-text class="textSymb" id="bodyTxt" :style="deleteClick ? {'text-align': 'left', 'top':'45px', 'position': 'relative'} : {'text-align': 'left', 'bottom':'10px', 'position': 'relative'}">
            <b>{{roadName[0].streetName}} {{roadName[0].streetType !== 'NOT APPLICABLE' ? roadName[0].streetType : null}}</b> will be deleted.
        </v-card-text>
        <v-alert color="orange" height="35" dense outlined id="infoAlert" v-if="!deleteClick" >
            <v-icon color="orange" id="icon">
                mdi-information
            </v-icon>
            Edit may be discarded later if you change your mind
         </v-alert>
         <!-- <a v-if="!deleteClick"  id="comment">Comment</a> -->
         <!-- <v-checkbox class="textSymb" v-if="!deleteClick" id="checkbox" :label="'Is this deletion the result of a city annexation?'" color="black" @click="comment=true"></v-checkbox> -->
         <v-select @change="updateComment()" label="Why are you deleting this road?" v-if="!deleteClick" outlined :items="cityAnnexReason" v-model="commentText" class="rdDelSelc" dense></v-select>
         <v-dialog persistent v-model="comment">
            <v-card id="delRdComment">
                <v-card-title class="surfaceTitle">
                    <v-card-text id="comntText" v-if="upldCity">Upload City Shapefile</v-card-text>
                    <v-card-text id="comntText" v-else>Reason for Road Deletion</v-card-text>
                </v-card-title>
        
                 <v-row id="txtArea">
                    <v-file-input prepend-icon="mdi-file" v-if="upldCity" label="Upload City Shapefile"></v-file-input>
                    <v-textarea v-model="commentText" v-else></v-textarea>
                </v-row>
                
                <v-btn outlined tile color="#204E70" @click="comment=upldCity=false;" id="saveBtn"><u>Save</u></v-btn>
            </v-card>
        </v-dialog>
        <v-btn v-if="!deleteClick" depressed text color="#14375A" id="cnclBtn" @click="deleteRoadClick(); deleteSecond=false"> 
          <u>Cancel</u>
        </v-btn>
        <v-btn :disabled="commentText.length === 0" :outlined="deleteClick ? outlined = false : outlined = true" depressed text color="#14375A" :style="deleteClick ? {'top':'5rem', 'left':'2rem', 'border-color':'black'}:{'top':'1.8rem', 'left':'73px', 'border-color':'black'}" tile elevation="0" @click="deleteSecond=false; deleteConfirm=true; setDeleteFalse()"> 
          <u :style="deleteClick ? {'text-decoration': 'underline'} :{'text-decoration': 'underline'}">Continue</u>
        </v-btn>
        <v-btn v-if="deleteClick" tile outlined depressed id="discardBtn" color="#14375A" @click="deleteRoadClick(); discardEdits=true"><v-icon medium style="right:5px">mdi-trash-can</v-icon>
          <u>Discard Edit</u>
        </v-btn>
    </v-card>
    <sketchAlert v-if="discardEdits"/>
    <confirmationAlert v-if="deleteConfirm"/>
    </v-container>

       
</template>

<script>
import confirmationAlert from './stepperContent/confirmationAlertsDEL.vue'
import sketchAlert from '../Map/stepperContent/discardAlert.vue'
import {stopEditing, removeGraphic, saveToEditsLayer, removeHighlight} from './edit'
import { gLayer } from '../Map/map'
export default {
    name: 'editExistingRd',
    components: {confirmationAlert, sketchAlert},
    data (){
      return {
        upldCity: false,
        edit:false,
        deleteR: false,
        deleteSecond: false,
        modifyR: false,
        addR: false,
        stepper: false,
        deleteConfirm: false,
        discardEdits: false,
        comment: false,
        commentText: '',
        cityAnnexReason: ["City Annexation", "Private Road", "Public Road", "Not a Road", "Other"],
        cityAnnexResp: ''
      }
    },
    methods:{
        updateComment(){
            if(this.commentText === 'City Annexation'){
                //pop up upload city street shapefile
                this.upldCity=this.comment = true
                return;
            }
            else if(this.commentText === 'Other'){
                this.comment = true
                return
            }
        },
        setDeleteFalse(){
            let editGraphic = gLayer.graphics.items.find(x => x.attributes.objectid === this.objid)
            editGraphic.attributes.comment = this.commentText
            this.deleteClick = false
            this.commentText = null
            this.comment = false
            saveToEditsLayer()
        },
        deleteRoadClick(){
            removeGraphic()
            removeHighlight()
            this.deleteClick = false
            this.commentText = ''
        },
        cancelEditAction(){
            if(this.edit === true){
                this.getDfoBool = false
                document.body.style.cursor = 'context-menu'
                this.editStatus = false
            }
            else if(this.deleteR === true){
                this.getDfoBool = false
                document.body.style.cursor = 'context-menu'
                this.deleteRoad = false
            }
            else if(this.modifyR === true){
                this.getDfoBool = false
                this.modifyRoad = false
            }
            else if(this.addR === true){
                this.getDfoBool = false
                stopEditing();
                this.addRdBoolean = false
            }
        }
    },
    watch:{
        discardEdits(del){
            if(!del) return;
            setTimeout(()=>{ this.discardEdits = false},3000)
        },
        deleteConfirm(del){
            if(!del) return;
            setTimeout(()=>{ this.deleteConfirm = false},3000)
        },
        steppClose:{
            handler: function(){
                this.stepper =  this.steppClose
            },
            immediate:true,
        },
        editStatus:{
            handler: function(){
                this.edit =  this.editStatus
            },
            immediate:true,
        },
        deleteRoad:{
            handler: function(){
                this.deleteR =  this.deleteRoad
            },
            immediate:true,
        },
        modifyRoad:{
            handler: function(){
                this.modifyR =  this.modifyRoad
            },
            immediate:true,
        },
        addRdBoolean:{
            handler: function(){
                this.addR =  this.addRdBoolean
            },
            immediate:true,
        },
        nextDeleteRoadForm:{
            handler: function(){
                this.deleteSecond = this.nextDeleteRoadForm
            },
            immediate:true,
        },
    },
    computed:{
        getDfoBool:{
            get(){
                return this.$store.state.isDfoReturn
            },
            set(bool){
                this.$store.commit('setIsDfoReturn', bool)
            }
        },
        deleteClick:{
            get(){
                return this.$store.state.deleteGraphClick
            },
            set(x){
                this.$store.commit('setdeleteGraphClick', x)
            }
        },
        roadName:{
            get(){
                return JSON.parse(this.$store.state.roadbedName)
            }
        },
        modifyRoad:{
            get(){
                return this.$store.state.modifyRd
            },
            set(mod){
                this.$store.commit('setModifyRd', mod)
            }
        },
        editStatus:{
            get(){
                return this.$store.state.editExisting
            },
            set(edit){
                this.$store.commit('setEditExisting',edit)
            }
        },
        deleteRoad:{
            get(){
                return this.$store.state.deleteRd
            },
            set(del){
                this.$store.commit('setDeleteRd', del)
            }
        },
        addRdBoolean:{
            get(){
                return this.$store.state.addRd
            },
            set(bool){
                this.$store.commit('setAddRd', bool)
            }
        },
        nextDeleteRoadForm:{
            get(){
                return this.$store.state.deleteRdSecond
            },
            set(secondStep){
                this.$store.commit('setDeleteRdSecond', secondStep)
            }
        },
        steppClose:{
            get(){
                return this.$store.state.stepperClose
            },
            set(open){
                this.$store.commit('setStepperClose', open)
            }
        },
        clearEditBtn:{
            get(){
                return this.$store.state.isClearEditBtn
            },
            set(isBool){
                this.$store.commit('setIsClearEditBtn', isBool)
            }
        },
        objid:{
            get(){
                return this.$store.state.objectid
            }
      },
    }
}
</script>

<style scoped>
    .editRdTitle{
        background: #14375A;
        color:white;
        height: 40px;
        text-align: left;
        top: 10%;
        width: 25.3vw;
        left: 100%;
    }
    .delRdTitle{
        background: #14375A;
        color:white;
        font-size: 16px;
        height: 40px;
        text-align: left;
        padding-top: 1%;
        top: 10%;
        width: 100%;
        left: 100%;
    }
    .editRdInfo{
        position: relative;
        font-size: 14px;
        height: 60px;
        padding-left: 35px;
        padding-top: 8px;
        text-align: left;
        top: 0px;
        width: 100%;
        left: 0px;
        color: black !important;
    }
    .editRdIcon{
        position: absolute;
        padding-right: .7vw;
        padding-top: 0vh;
        text-align: justify;
        right: 23vw;
    }
    #edit{
        position: absolute;
        top: 5rem;
        left: 13.4rem;
        width: 25.3vw;
        color: #204E70;
        border-radius: 0px;
        height: 15vh;
    }
    #delWarn{
        position: absolute;
        top:5rem;
        left: 13.4rem;
        width: 385px;
        height: 250px;
        color: #204E70;
        border-radius: 0px;
    }
    .surfaceTitle{
        background-color: #14375A;
        color: white;
        height:30px;
        width: 100%;
        font-size: 25px; 
    }

    #cancelBtn{
        right: 2%;
        top: 63%;
        position: absolute;
        border-color: black;
    }
    #bodyTxt{
        top:5px;
        position: relative;
        flex-wrap: wrap;
    }
    #infoAlert{
        width:91%; 
        left:16px; 
        text-align: left; 
        font-size: 12.09px; 
        border-radius: 0px;
    }
    #icon{
        right:5px;
        bottom: 4px;
    }
    /* #comment{
        position: absolute;
        left:1vw;
        bottom: 2vh; 
        z-index:1
    } */
    #comntText{
        bottom:28px;
        position: relative; 
        font-size: 15px; 
        text-align: left; 
        left: -31px;
    }
    #checkbox{
        position: absolute;
        left: 1rem
    }
    #delRdComment{
        position: absolute;
        width:30%;
        left: 43rem;
        height: 27%; 
        border-radius: 0px;
    }
    #comment{
        bottom:1rem;
        position: absolute;
        font-size: 15px;
        text-align: left;
        left: 1rem;
    }
    #txtArea{
        padding-left:1.4rem;
        padding-right: 1.4rem;
    }
    #saveBtn{
        position: absolute;
        right:2%;
        top: 13rem;
        border: 1px solid black
    }
    #cnclBtn{
        left:4rem;
        top:1.8rem
    }
    #discardBtn{
        left: 2.5rem;
        top:5rem;
    }
    .rdDelSelc{
        padding-right: 1rem;
        padding-left : 1rem;
        height: 3rem;
    }
</style>
