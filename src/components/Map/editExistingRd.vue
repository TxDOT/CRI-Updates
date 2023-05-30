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
        <v-btn tile outlined depressed id="cancelBtn" v-if="edit===true || addR === true || deleteR === true" text color="#204E70" @click="cancelEditAction(); clearEditBtn=false;"><u>Cancel</u></v-btn>
        </v-card>
    <v-card id="delWarn" v-if="deleteSecond === true || deleteClick" :style = "deleteClick ? {'height' : '11rem'} : {}"> <!-- //&& this.modifyR === false -->
        <v-card-title class="delRdTitle">
            Delete a Road
        </v-card-title>
        <v-card-text class="textSymb" id="bodyTxt" :style="deleteClick ? {'text-align': 'left', 'top':'35px', 'position': 'relative'} : {'text-align': 'left', 'bottom':'10px', 'position': 'relative'}">
            <b>{{roadName[0].streetName}} {{roadName[0].streetType !== 'NOT APPLICABLE' ? roadName[0].streetType : null}}</b> {{ delTxt }}
        </v-card-text>
        <v-alert color="orange" height="35" dense outlined id="infoAlert" v-if="!deleteClick" >
            <v-icon color="orange" id="icon">
                mdi-information
            </v-icon>
            Edit may be discarded later if you change your mind
        </v-alert>
         <!-- <a v-if="!deleteClick"  id="comment">Comment</a> -->
         <!-- <v-checkbox class="textSymb" v-if="!deleteClick" id="checkbox" :label="'Is this deletion the result of a city annexation?'" color="black" @click="comment=true"></v-checkbox> -->
        <v-row v-if="!deleteClick">
            <v-select @change="updateComment($event)" label="Why are you deleting this road?" outlined class="rdDelSelc" v-model="delReason" dense :items="cityAnnexReason">
                <template v-slot:item="data">
                    <v-tooltip right max-width="200" color="#204E70">
                        <template slot="activator" slot-scope="{ on }" id="tooltip">
                            <v-list-item-content>
                                <v-list-item-title v-html="data.item.text" v-on="on"></v-list-item-title>
                            </v-list-item-content>
                        </template>
                        <span>{{data.item.tooltip}}</span>
                    </v-tooltip>
                </template>
            </v-select>
        </v-row>
    
        <div id="moveRadio">
            <v-radio-group v-model="radioBtnSel">
            <v-radio class="radioBtn" v-if="upldCity" @click="isUpldShapefile = true; isLinkExplain = false" label="I can provide documentation (e.g. Shapefile, PDF, etc.)" value="0"></v-radio>
                <v-card v-if="isUpldShapefile" flat class="radioResponse">
                    <v-card-text id="dragDrop" v-if="upldCity">
                        <div class="fileContainer">
                            <label id="output">
                                <form id="attachedForm">
                                    <input type="file" name="attachment" @change="dropItem($event)"/>Upload Document
                                </form>
                                
                            </label>
                            <label>&nbsp;&nbsp;&nbsp;{{ fileName }}</label>
                            <p v-if="upldDocSpinner === true"><v-progress-circular id="upldDocSpin" :value="10" indeterminate></v-progress-circular></p>
                            <p v-if="isDocUpload !== null" :style="isDocUpload === true ? {'color':'green'} : {'color' : 'red'}">
                                {{ upldDocStatus }}
                            </p>
                        </div>
                    </v-card-text>
                </v-card>
            <v-radio class="radioBtn" v-if="upldCity" @click="isLinkExplain = true; isUpldShapefile = false;" label="I have a link, or can explain" value="1"></v-radio>
            <v-card v-if="isLinkExplain" flat class="radioResponse" id="explainTxt">
                <v-textarea outlined label="Please Explain" v-model="commentText">{{ commentText }}</v-textarea>
            </v-card>
        </v-radio-group>
        </div>
        <v-btn depressed text color="#14375A" @click="deleteClick ? keepDelete() : cancelDelete()" :style="deleteClick ? {'top':'.2rem', 'left':'.5rem', 'border-color':'black', 'width':'5rem'} : {'bottom':'.92rem', 'left':'55.5%', 'border-color':'black', 'width':'5rem', 'text-decoration':'underline'}"> 
          Cancel
        </v-btn>
        <v-btn :disabled="deleteClick ? null : commentText.length === 0" :outlined="deleteClick ? outlined = false : outlined = true" depressed text color="#14375A" :style="deleteClick ? {'bottom':'1rem', 'left':'12.5rem', 'border-color':'black', 'width':'5rem'}:{'bottom':'1rem', 'left':'76%', 'border-color':'black'}" tile elevation="0" @click="deleteClick ? restartDeleteSeq() : continueEdit()" class="continueBtn"> 
          <u>Continue</u>
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
import {addAttachment} from '../Map/crud'

export default {
    name: 'editExistingRd',
    components: {confirmationAlert, sketchAlert},
    data (){
      return {
        radioSelect: false,
        upldCity: false,
        isUpldShapefile: false,
        isLinkExplain: false,
        edit:false,
        deleteR: false,
        deleteSecond: false,
        delReason: '',
        delTxt: '',
        modifyR: false,
        addR: false,
        stepper: false,
        deleteConfirm: false,
        discardEdits: false,
        comment: false,
        commentText: '',
        radioBtnSel: '',
        radioBtns: [{value: 0, text: "I can provide documentation (e.g. Zipped Shapefile, PDF, etc.)"}, {value: 1, text: "I have a link, or can explain"}],
        cityAnnexReason: [{value: 0, text: "City Annexation", tooltip: "A public road that is now physically located inside the city limits due to an annexation."},
                          {value: 1, text: "Private Road", tooltip: "A private road will typically have a sign that says “No Trespassing”, “Private Property”, or “Do Not Enter”, etc. They may also be gated or locked."},
                          {value: 2, text: "Federal Road", tooltip: "A public road that is physically located within the boundaries of federal lands (e.g. military reservation, national forest, national park) and owned by a federal agency."},
                          {value: 3, text:"Not a Road", tooltip: "No road present or road was obliterated."}, {value: 4, text: "Other", tooltip: "Please provide an explanation."}],
        cityAnnexResp: '',
        fileName:'',
        upldDocStatus: '',
        upldDocSpinner: false,
        restartSeq: false,
        prevComment: [],
        initialVal: null
      }
    },
    methods:{
        restartDeleteSeq(){
            this.restartSeq = true
            this.deleteSecond = true
            this.deleteClick = false
            
            let splitNm = this.commentText ? this.commentText.split("Delete Reason:"): ["Not a Road"]
            
            
            this.prevComment = splitNm
            let txt = splitNm.length > 1 ? this.cityAnnexReason.find(x => x.text === splitNm[1].trim()) : this.cityAnnexReason.find(x => x.text === splitNm[0]) ? this.cityAnnexReason.find(x => x.text === splitNm[0]) : {value: 3, text:"Not a Road"}

            this.delReason = this.initialVal = txt.value
            
            this.commentText = splitNm[0]
            this.updateComment()
            if(this.delReason === 0 || this.delReason ===2){
                this.radioBtnSel = "1"
                this.isLinkExplain = true
                return;
            }

            return;

        },
        cancelDelete(){
            if(this.restartSeq){
                this.keepDelete()
                return;
            }
            this.deleteRoadClick();
            this.deleteSecond=this.upldCity=this.isLinkExplain=this.deleteClick=false;
            this.delReason=null;
            this.isDocUpload=null;
            return;
        },
        keepDelete(){
            this.updateGraphicComment(this.prevComment[0], this.prevComment[1])
            this.resetDefault();
            //this.commentText = this.prevComment[0]
            //this.delReason = this.initialVal
        },

        getDeleteReason(){
            return this.cityAnnexReason.find(x=> x.value === this.delReason)
        },
        dropItem(x){
            this.upldDocSpinner = false
            this.isDocUpload = null
            //this.delReason = null
            this.upldDocSpinner = true
            this.fileName = x.target.files[0].name
            let reason = this.getDeleteReason().text
            addAttachment(reason)
            this.commentText = `${this.fileName} uploaded.`
        },
        updateComment(x){
            this.radioBtnSel = null
            this.isDocUpload = null
            this.isLinkExplain = false
            if(this.delReason === 0 || this.delReason === 2){
                //pop up upload city street shapefile
                this.commentText = x === undefined ? this.prevComment[0] : ''
                this.fileName = ''
                this.upldCity = true
                this.isUpldShapefile = false
                return;
            }
            else if(this.delReason === 4){
                this.commentText = x === undefined ? this.prevComment[0] : ''
                this.fileName = ''
                this.isLinkExplain = true
                this.upldCity = false
                this.isUpldShapefile = false
                
                return;
            }
            this.commentText = ' '
            this.upldCity = this.isLinkExplain = this.isUpldShapefile = false
            return;
        },
        //create anothor function - one for Keeping Delete and one for Continue (all when restartSeq is true). 
        //seperate items being reset back to default into function
        //
        resetDefault(){
            this.radioBtnSel = null
            this.isDocUpload = null
            this.deleteClick = false
            //this.commentText = ''
            this.comment = false
            this.restartSeq = false
            this.prevComment = []
            this.deleteSecond =this.upldCity =this.isLinkExplain =this.isUpldShapefile = false;
            this.deleteConfirm=true;
            this.delReason=null;
            this.isDocUpload=null;
        },
        updateGraphicComment(cmnt, delReason){
            let editGraphic = gLayer.graphics.items.find(x => x.attributes.objectid === this.objid)
            editGraphic.attributes.comment = `${cmnt} Delete Reason:${delReason}`
        },
        continueEdit(){
            this.updateGraphicComment(this.commentText, this.getDeleteReason().text)
            this.resetDefault()
            saveToEditsLayer()
        },
        deleteRoadClick(){
            this.radioBtnSel = false
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
                this.returnDFOValue=0
            }
        }
    },
    watch:{
        // radioBtnSel:{
        //     handler: function(){
        //         console.log(this.radioBtnSel)
        //     },
        //     immediate:true,
        // },
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
                this.stepper = this.steppClose
            },
            immediate:true,
        },
        editStatus:{
            handler: function(){
                this.edit = this.editStatus
            },
            immediate:true,
        },
        deleteRoad:{
            handler: function(){
                this.deleteR = this.deleteRoad
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
        deleteClick:{
            handler: function(){
                if(this.deleteClick){
                    this.delTxt = 'is marked for deletion.'
                    return;
                }
                this.delTxt = 'will be deleted.'
            },  
            immediate: true 
        },
        isDocUpload:{
            handler: function(){
                if(this.isDocUpload === null){
                    return;
                }
                else if(this.isDocUpload === true){
                    this.upldDocSpinner = false
                    this.upldDocStatus = 'Document Uploaded!'
                    return;
                }
                this.upldDocSpinner = false
                this.upldDocStatus = 'Issue with uploading! Try again.'
                return
       
                
            },  
            immediate: true 
        },
        getComment:{
            handler: function(){
                if(!this.getComment){
                    this.commentText = ''
                    return;
                }
                let beginWhitespaceCheck = /^\s*/g 
                let s = this.getComment.replace(beginWhitespaceCheck, '')
                console.log(s)
                this.commentText = s
                return;
            },
            immediate: true
        }
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
        returnDFOValue:{
            get(){
                return this.$store.state.dfoReturn
            },
            set(x){
                this.$store.commit('setDfoReturn', x)
            }
        },
        isDocUpload:{
            get(){
                return this.$store.state.isDocumentUploaded
            },
            set(x){
                this.$store.commit('setIsDocumentUploaded', x)
            }
        },
        getComment:{
            get(){
                return this.$store.state.comment
            },
            set(comm){
                this.$store.commit('setComment', comm)
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

    /* @media only screen and (max-width: 500px){
        #delWarn{
        left: 9.4rem;

        }
    } */
    #delWarn{
        position: fixed;
        display: flex;
        flex-direction: column;
        min-height: 0rem;
        max-height: 34rem;
        top:5rem;
        left: 13.4rem;
        width: 30.4rem;
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
        width: 91%;
        left: 3.6%; 
        text-align: left; 
        font-size: 84%; 
        border-radius: 0px;
    }
    #icon{
        right:5px;
        bottom: 3px;
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
        left: 12.5vw;
        top: 1.8rem;
        width: 5vw;
    }
    #discardBtn{
        position: relative;
        left: 19rem;
        bottom:2rem;
        width: 10rem;
    }
    .rdDelSelc{
        position: inherit;
        padding-top: .5rem;
        padding-right: 7.3%;
        padding-left : 5.8%;
        height: 3rem;
    }
    .radioResponse{
        position: relative;
        bottom: .1rem;
    }
    #moveRadio{
        position: relative;
        top: .3rem;
        padding-left: .6rem;
    }
    #explainTxt{
        padding-left: .5rem;
        padding-right: 1rem;
    }
    input[type=file]{
        display: none;
    }
    #output{
        border: 1.5px solid #204E70;
        display: inline-block;
        padding: 6px 12px;
        cursor: pointer;
        color: black
    }
    #upldDocSpin{
        position: relative;
        top: 1rem;
        left: 2rem;
    }
    .continueBtn{
        position: absolute;
        padding-left: 1% !important;
        padding-right: 1% !important;
    }
</style>
