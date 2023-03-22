<!-- map header -->ubmitCertifyCd
<template>
    <div class="mapHeader flex" >
        <v-app-bar app color="#14375A" class="white--text" id="headerPos" clipped-left>
            <v-app-bar-title class="h1-text" id=headerTitle>
                <p>TxDOT County Road Inventory Map</p>
            </v-app-bar-title>
                <v-btn height="3vh" tile outlined color="white" class="mx-2" small @click="ExitDestroyLogIn()" id="saveExitBtn"><u>Save & Exit</u></v-btn>
                <v-btn height="3vh" tile id="submitCertifyBtn" class="mx-3" small @click="submitStepOne();"><u>Submit & Certify</u></v-btn>
        </v-app-bar>

        <!-- <div class="text-center">
            <v-snackbar style="bottom:50px;" v-model = snackbar timeout=-1>
                <v-btn dark color="pink" text @click="snackbar = false; cancelEditing()" width=600> Stop Editing </v-btn>
            </v-snackbar>
        </div> -->
        <v-dialog
            v-model="submitCertify"
            max-width="400"
            persistent>
            <v-card v-if="cancelSubmit" height="300" class="submitCertifyCd">
                <v-card-title class="surfaceTitle"><v-icon color="white" id="checkBox">mdi-email-send-outline</v-icon><p id="submitCertifyCdTitle">Submit and Certify</p></v-card-title>
                    <v-card-text class="textSymb" id="submitCertifyCdText">
                    <p>
                        Click Submit to send your updates to {{ this.judgeNameSend }} for certification.
                    </p>
                    </v-card-text>
                    <v-btn depressed tile @click="cancelSubmit = false; submitCertify = false" id="btnCloseCancelStep" text color="#14375A">
                        Close
                    </v-btn>
                    <v-btn outlined tile @click="cancelSubmit = false; submitCertifySuccess = true; submit('submit')" color="#14375A" id="btnNextStep">
                        <u>Submit</u>
                    </v-btn>
                    <v-alert id="cancelSubmitAlert" color="rgba(255,153,102,.4)">
                            <b>Note:</b> Edits in the app are still allowed up until August 31. However, any edits made after the judge has certified will need
                                         to be certified again by the judge in order for TxDOT to accept them.
                    </v-alert>
            </v-card>
            <v-card v-if="submitCertifySuccess" height="260" class="submitCertifyCd">
                <v-card-title class="surfaceTitle"><v-icon color="green" id="checkBox">mdi-check</v-icon><p id="submitCertifyCdTitle">Submit and Certify</p></v-card-title>
                    <v-card-text class="textSymb" id="submitCertifyCdText">
                    <p>
                        Thank you for submitting updates to your County Road Inventory.
                    </p>
                    <p>
                        {{ this.judgeNameSend }} will be receiving an email confirmation of this submission, with instructions to certify the updates.
                    </p>
                    </v-card-text>
                    <v-btn outlined tile @click="submitCertify = false; submitCertifySuccess = false" color="#14375A" text id="btnClose">
                        <u>Close</u>
                    </v-btn>
            </v-card>
        </v-dialog>
    </div> 
</template>

<script>
import {stopEditing} from '../Map/edit';
import esriId from "@arcgis/core/identity/IdentityManager";
import {sendJudgeEmail, updateTotalMileage} from '../Map/helper'

export default {
    name:"mapHeader",
    data () {
      return {
        submitCertify:false,
        previousTotal: 0,
        snackbar: false,
        cancelSubmit: false,
        submitCertifySuccess: false
      }
    },
    methods:{
        submitStepOne(){
            this.submitCertify = true
            this.cancelSubmit = true
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
            let totalMile = updateTotalMileage()
            sendJudgeEmail(step, [this.delUsername], [this.userEmail], null, this.judgeCntyOid, totalMile)
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
        judgeNameSend:{
            get(){
                return this.$store.state.judgeName
            }
        },
        delUsername:{
            get(){
                return this.$store.state.username
            }
        },
        userEmail:{
            get(){
                return this.$store.state.userEmail
            }
        },
        judgeCntyOid:{
            get(){
                return this.$store.state.judgeObjectId
            }
        }
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
    background-color: #207f74; 
    border: 1px solid white; 
    left: .6rem; 
    bottom: .1rem; 
    position: relative;
}
.submitCertifyCd{
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
    top: 2rem; 
    position: relative; 
    right: .3rem;
}
#btnClose{
    left: 8.5rem; 
    top: 0rem; 
    border: 1px solid black
}
#checkBox{
    position: relative;
    bottom: 1.2rem;
    right: 1rem;
}
#btnCloseCancelStep{
    position: relative;
    top: 2rem;
    left: 6rem;
}
#btnNextStep{
    position: relative;
    top: 2rem;
    left: 6rem;
}
#cancelSubmitAlert{
    position: relative;
    top: 3.3rem;
    left: 1.1rem;
    font-size: .7rem;
    text-align: left;
    width: 91.2%;
    border-radius: 0%;
    color: rgba(150,75,0,1)
}
</style>