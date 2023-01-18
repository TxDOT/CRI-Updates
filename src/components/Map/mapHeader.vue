<!-- map header -->
<template>
    <div class="mapHeader flex" >
        <v-app-bar app color="#14375A" class="white--text" id="headerPos" clipped-left>
            <v-app-bar-title class="h1-text" id=headerTitle>
                <p>TxDOT County Road Inventory Map</p>
            </v-app-bar-title>
                <v-btn height="3vh" tile outlined color="white" class="mx-2" small @click="ExitDestroyLogIn()" id="saveExitBtn"><u>Save & Exit</u></v-btn>
                <v-btn height="3vh" tile id="submitCertifyBtn" class="mx-3" small @click="submitCertify=true; submit('submit')"><u>Submit & Certify</u></v-btn>
        </v-app-bar>

        <div class="text-center">
            <v-snackbar style="bottom:50px;" v-model = snackbar timeout=-1>
                <v-btn dark color="pink" text @click="snackbar = false; cancelEditing()" width=600> Stop Editing </v-btn>
            </v-snackbar>
        </div>
        <v-dialog
            v-model="submitCertify"
            max-width="400"
            persistent>
            <v-card v-model="submitCertify" height="150" id="submitCertifyCd">
                <v-card-title class="surfaceTitle"><p id="submitCertifyCdTitle">Temporarily Unavailable</p></v-card-title>
                    <v-card-text class="textSymb" id="submitCertifyCdText">
                        This functionality is under development and temporarily unavailable.
                    </v-card-text>
                    <v-btn outlined tile @click="submitCertify = false" color="#14375A" id="btnClose">
                        <u>Close</u>
                    </v-btn>
            </v-card>
        </v-dialog>
    </div> 
</template>

<script>
import {addRoadbed, stopEditing} from '../Map/edit';
import esriId from "@arcgis/core/identity/IdentityManager";
import {sendJudgeEmail} from '../Map/helper'

export default {
    name:"mapHeader",
    data () {
      return {
        submitCertify:false,
        previousTotal: 0,
        snackbar: false,
      }
    },
    methods:{
        addRoad() {
            addRoadbed().then(result=>{
                this.previousTotal += Number(parseFloat(result.toFixed(3)))     
            })            
        },
        cancelEditing(){
            stopEditing()
        },
        ExitDestroyLogIn(){
            this.setLogOut = true
            esriId.checkSignInStatus("https://txdot.maps.arcgis.com/sharing")
                .then(()=>{
                    esriId.destroyCredentials()
                    localStorage.removeItem('county')
                    this.$router.push('/login')
                })
                .catch(()=>{
                    this.$router.push('/login')
                })
        },
        submit(step){
            sendJudgeEmail(step, [], [])
        }
    },
    computed:{
        countyName:{
            get(){
                return this.$store.state.cntyName
            }
        },
        countyTotal:{
            get(){
                return this.$store.state.cntyMiles
            }
        },
        returnCountyTotal:{
            get(){
                return this.$store.state.cntyEndingMiles
            },
        },
        setLogOut:{
            get(){
                return this.$store.state.isLoggedOut
            },
            set(bool){
                this.$store.commit('setIsLoggedOut', bool)
            }
        },
    }
}    
</script>
<style scoped>
.surfaceTitle{
  position: relative;
  background-color: #14375A;
  text-align: left;
  top:0%;
  color: white;
  bottom:40px;
  height:40px;
  padding-bottom: 1%;
  width: 100%;
  font-size: 16px;
}
#headerPos{
    height:3.7rem !important;
    top:0%;
    width:100%;
}
#headerTitle{
    text-align: left; 
    top:8%; 
    position: relative; 
    width: 100%
}
#saveExitBtn{
    position: relative;
    left:.8rem;
    bottom: .1rem
}
#submitCertifyBtn{
    color:white; 
    background-color: green; 
    border: 1px solid white; 
    left: .6rem; 
    bottom: .1rem; 
    position: relative;
}
#submitCertifyCd{
    border-radius:0%; 
    overflow-y: hidden; 
    overflow-x: hidden;
}
#submitCertifyCdTitle{
    bottom: .7rem;
    position:relative; 
    right: .5rem;
} 
#submitCertifyCdText{
    top: 1rem; 
    position: relative; 
    right: .5rem;
}
#btnClose{
    left: 9rem; 
    top: 0rem; 
    border: 1px solid black
}
</style>