<template>
    <div class ="mapHeader flex" >
        <v-app-bar app color="#14375A" class="white--text" style="height:60px; top:0%; width:100%;" clipped-left>
            <!-- <img style="height: 50px; max-width: 100%; bottom: 20%; position: relative;" src="../../assets/TxDOT-logo.png"> -->
            <!-- <span style="position: relative; top:50%; right: 20.7%; font-size: 14px;"><i>Connecting you with Texas</i></span> -->
            <v-app-bar-title class="h1-text" style="text-align: left; top:8%; position: relative; width: 100%">
                <p>TxDOT County Road Inventory Map</p>
            </v-app-bar-title>
                    <!-- <div class="flex"> -->
                        <v-btn height="3vh" tile outlined color="white" class="mx-2" small @click="ExitDestroyLogIn()" style="position: relative; left:.8rem; bottom: .1rem"><u>Save & Exit</u></v-btn>
                        <v-btn height="3vh" tile style="color:white; background-color: green; border: 1px solid white; left: .6rem; bottom: .1rem; position: relative;" class="mx-3" small @click="submitCertify=true">Submit & Certify</v-btn>
                    <!-- </div> -->
        </v-app-bar>

        <!-- <v-toolbar color="#204E70" class="white--text">
            <v-toolbar-title class="h1-text">Welcome to DUSA - The County Road Inventory App</v-toolbar-title>
>
                <v-btn-toggle>
                    <v-btn color="green" small @click="submitCertify=true">Submit & Certify</v-btn>
                    <v-btn color="Black" small @click="ExitDestroyLogIn()">Save & Exit</v-btn>
                </v-btn-toggle>
            
            
        </v-toolbar> -->
        <div class="text-center">
            <v-snackbar style="bottom:50px;" v-model = snackbar timeout=-1>
                <v-btn dark color="pink" text @click="snackbar = false; cancelEditing()" width=600> Stop Editing </v-btn>
            </v-snackbar>
        </div>
        <v-dialog
            v-model="submitCertify"
            max-width="400"
            persistent>
            <v-card v-model="submitCertify" height="150" style="border-radius:0%; overflow-y: hidden; overflow-x: hidden;">
                <v-card-title class="surfaceTitle"><p style="bottom: .7rem; position:relative; right: .5rem;">Temporarily Unavailable</p></v-card-title>
                    <v-card-text style="text-align:left; color: black; top: 1rem; position: relative; right: .5rem;">
                        This functionality is under development and temporarily unavailable.
                    </v-card-text>
                    <v-btn outlined tile @click="submitCertify = false" color="#14375A" style="left: 9rem; top: 0rem; border: 1px solid black">
                        <u>Close</u>
                    </v-btn>

            </v-card>
        </v-dialog>
    </div> 
</template>

<script>
import {addRoadbed, stopEditing} from '../Map/editFunc';
import esriId from "@arcgis/core/identity/IdentityManager";
// import {roadInfo} from '../../store'
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
</style>