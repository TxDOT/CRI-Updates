<template>
    <v-container>
        <v-card id="edit"  v-if="edit===true || addR===true || deleteR===true">
            <v-card-title class="editRdTitle" v-if="edit===true">
                <v-card-text style="font-size:20px; text-align: left; padding-left: 3%; bottom: 2.6vh; position: relative;">Edit Road</v-card-text>
             </v-card-title>
            <v-card-title class="editRdTitle" v-if="addR===true">
                <v-card-text style="font-size:20px; text-align: left; padding-left: 3%; bottom: 2.6vh; position: relative;">Add Road</v-card-text>
            </v-card-title>
            <v-card-title class="editRdTitle" v-if="deleteR===true">
                <v-card-text style="font-size:20px; text-align: left; padding-left: 3%; bottom: 2.6vh; position: relative;">Delete Road</v-card-text>
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
        <v-btn tile outlined depressed style="right: 1%; top: 60%; position: absolute; border-color: black;" v-if="edit===true || addR === true || deleteR === true" text color="#204E70" @click="cancelEditAction(); clearEditBtn=false">Cancel</v-btn>
    </v-card>
    <v-card id="delWarn" v-if="deleteSecond === true || deleteClick"> <!-- //&& this.modifyR === false -->
        <v-card-title class="editRdTitle" style="width: 385px">
            <v-card-text style="font-size:20px; text-align: left; padding-left: 3%; bottom: 1.6rem; position: relative;">Delete a Road</v-card-text>
        </v-card-title>
        <v-card-text style="text-align: left; top:5px; position: relative; flex-wrap: wrap; color:black" :style="deleteClick ? {'text-align': 'left', 'top':'45px', 'position': 'relative'} : {'text-align': 'left', 'bottom':'10px', 'position': 'relative'}">
            <b>{{roadName[0].streetName}} {{roadName[0].streetType !== 'NOT APPLICABLE' ? roadName[0].streetType : null}}</b> will be deleted.
        </v-card-text>
        <v-alert color="orange" height="35" dense outlined style="width:100%; text-align: left; font-size: 13.3px; border-radius: 0px;" v-if="!deleteClick" >
            <v-icon color="orange" style="right:5px; bottom: 4px;">
                mdi-information
            </v-icon>
            You can discard this edit later if you change your mind
         </v-alert>
        <v-btn v-if="!deleteClick" depressed text color="black" style="left:69px;top:10px" @click="deleteRoadClick(); deleteSecond=false"> 
          Cancel
        </v-btn>
        <v-btn :outlined="deleteClick ? outlined = false : outlined = true" depressed text color="#15648C" :style="deleteClick ? {'top':'66px', 'left':'0px', 'border-color':'black'}:{'top':'10px', 'left':'73px', 'border-color':'black'}" tile elevation="0" @click="deleteSecond=false; deleteConfirm=true; setDeleteFalse()"> 
          <u :style="deleteClick ? {'text-decoration': 'none'} :{'text-decoration': 'underline'}">Continue</u>
        </v-btn>
        <v-btn v-if="deleteClick" dense tile outlined depressed plain style="left:00px;top:66px" color="#15648C" @click="deleteRoadClick(); discardEdits=true"><v-icon medium style="right:5px">mdi-trash-can</v-icon>
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
import {stopEditing, removeGraphic, saveToEditsLayer} from './editFunc'
export default {
    name: 'editExistingRd',
    components: {confirmationAlert, sketchAlert},
    data (){
      return {
        edit:false,
        deleteR: false,
        deleteSecond: false,
        modifyR: false,
        addR: false,
        stepper: false,
        deleteConfirm: false,
        discardEdits: false
      }
    },
    methods:{
        setDeleteFalse(){
            this.deleteClick = false
            saveToEditsLayer()
        },
        deleteRoadClick(){
            removeGraphic()
            this.deleteClick = false
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
                console.log(this.modifyRoad)
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
                this.deleteSecond =  this.nextDeleteRoadForm
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
        }
    }
}
</script>

<style scoped>
    .editRdTitle{
        background: #204E70;
        color:white;
        height: 35px;
        text-align: justify;
        top: 10%;
        width: 25.3vw;
        left: 100%;
    }
    .editRdInfo{
        position: relative;
        font-size: 16px;
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
        padding-top: .1vh;
        text-align: justify;
        right: 23vw;
    }
    #edit{
        position: absolute;
        top: 5rem;
        left: 16.4rem;
        width: 25.3vw;
        color: #204E70;
        border-radius: 0px;
        height: 15vh;
    }
    #delWarn{
        position: absolute;
        top:100px;
        left:260px;
        width: 385px;
        height: 200px;
        color: #204E70;
        border-radius: 0px;
    }
</style>
