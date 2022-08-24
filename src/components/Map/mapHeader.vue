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
            max-width="500">
            <v-card v-model="submitCertify" height="300">
                <v-img><img style="position:relative; top:0%;" src="@/assets/favicon-32x32.png"></v-img>
                <v-card-actions>
                    <div style="position:absolute; top:20%; left: 5%" class="black--text mb-3">
                        <v-card-text >
                            You are about to submit and certify county mileage for {{countyName}} County.<br>
                            The previous years mileage was <b>{{countyTotal}} miles</b>.<br>The new total mileage is <b>{{Number(returnCountyTotal.toFixed(3))}} miles.</b>
                        </v-card-text>
                    </div>
                    <div style="position:absolute; left: 10%; bottom: 5%;">
                        <div style="position:relative; left:70%; top:0%">
                            <v-btn elevation="2" color="primary">
                                Submit & Certify
                            </v-btn>
                        </div>
                    </div>
                </v-card-actions>
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
                console.log(Number(parseFloat(result.toFixed(3))) )
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
                console.log(this.$store.state.cntyEndingMiles)
                return this.$store.state.cntyEndingMiles
            },
        },
        setLogOut:{
            get(){
                console.log(this.$store.state.isLoggedOut)
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
    .h1-text{
        position: relative;
    }
</style>