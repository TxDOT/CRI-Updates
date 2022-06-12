<template>
    <v-container>
        <v-card  id="edit">
            <v-card-title class="editRdTitle" v-if="edit===true">
                Edit an Existing Road
             </v-card-title>
        <v-card-title class="editRdTitle" v-if="addR===true">
            Add a new Road
        </v-card-title>
        <v-card-title class="editRdTitle" v-if="deleteR===true">
            Delete a Road
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
                Click on the Map to add a new Road
        </v-card-text>
        <v-card-text v-if="deleteR === true" class="editRdInfo">
            <v-icon color="blue" class="editRdIcon" style="transform:rotate(330deg); top:0px">
                mdi-navigation
            </v-icon>Select a road to delete it
        </v-card-text>
    </v-card>
    <v-card id="delWarn" v-if="deleteSecond === true">
        <v-card-title class="editRdTitle" style="width: 385px">
            Delete a Road
        </v-card-title>
        <v-alert color="orange" height="60" dense outlined style="width:379px; text-align: left;">
            <v-icon color="orange" style="right:7px;">
                mdi-information
            </v-icon>
            You can discard this edit later if you change your mind
         </v-alert>
        <v-card-text style="text-align: left; bottom:10px; position: relative;">
            <b>{{roadName}}</b> will be deleted.
        </v-card-text>
        <v-btn depressed plain style="left:69px;bottom:16px"> 
          Cancel
        </v-btn>
        <v-btn outlined style="bottom:16px; left:73px;" tile @click="deleteSecond=false"> 
          <u>Continue</u>
        </v-btn>
    </v-card>
    </v-container>
       
</template>

<script>
export default {
    name: 'editExistingRd',
    data (){
      return {
        edit:false,
        deleteR: false,
        deleteSecond: false,
        modifyR: false,
        addR: false,
        stepper: false
      }
    },
    watch:{
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
                this.deleteSecond =  this.nextDeleteRoadForm
            },
        immediate:true,
        },
    },
    computed:{
        roadName:{
            get(){
                return this.$store.state.roadbedName
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
    }
}
</script>

<style scoped>
    .editRdTitle{
        background: #15648C;
        color:white;
        font-size: 16px;
        height: 40px;
        padding-left: 40px;
        padding-top: 1%;
        text-align: justify;
        top: 10%;
        width: 300px;
        left: 100%;
    }
    .editRdInfo{
        position: relative;
        font-size: 16px;
        height: 60px;
        padding-left: 35px;
        padding-top: 8px;
        text-align: left;
        overflow-wrap: break-word;
        top: 0px;
        width: 300px;
        left: 0px;
    }
    .editRdIcon{
        position: absolute;
        padding-right: 10px;
        padding-top: 8px;
        text-align: justify;
        right: 260px;
    }
    #edit{
        position: absolute;
        top:100px;
        left:300px;
        width: 300px;
        color: #15648C;
    }
    #delWarn{
        position: absolute;
        top:100px;
        left:260px;
        width: 385px;
        height: 200px;
        color: #15648C;
    }
</style>
