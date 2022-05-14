<template>
    <div id ="mapHeader">
        <v-toolbar color="#204E70" class="white--text">
            <v-toolbar-title class="h1-text">Welcome to DUSA - The County Road Inventory App</v-toolbar-title>
            <!-- <v-btn-toggle id="editBtns">
                <v-btn color="red" small>Delete Roads</v-btn>
                <v-btn color="primary" small @click="addRoad(); snackbar = true" id="addBtn">Add Roads</v-btn>
                <input id="upldFile" type="file" hidden @change="fileValid()"><v-btn @click="uploadFile()" color="blue-grey" small component="span" variant="contained">Upload Files</v-btn>
            </v-btn-toggle> -->
            <v-btn-toggle id="submitExitBtns">
                <v-btn color="green" small @click="submitCertify=true">Submit & Certify</v-btn>
                <v-btn color="Black" small @click="ExitDestroyLogIn()">Save & Exit</v-btn>
            </v-btn-toggle>
        </v-toolbar>
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
                            You are about to submit and certify county mileage for {{cntyName}} County.<br>
                            The previous years mileage was <b>{{countyTotal}} miles</b>.<br>The new total mileage is <b>{{countyTots}} miles.</b>
                        </v-card-text>
                    </div>
                    <div style="position:absolute; left: 10%; bottom: 5%; width=100%">
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
            esriId.checkSignInStatus("https://txdot.maps.arcgis.com/sharing")
                .then(()=>{
                    esriId.destroyCredentials()
                    this.$router.push('/Login')
                })
                .catch(()=>{
                    this.$router.push('/Login')
                })
        }
    },
    computed:{
        cntyName:{
            get(){
                return this.$store.state.cntyName
            }
        },
        countyTotal:{
            get(){
                return this.$store.state.cntyMiles
            }
        },

    }
}    
</script>
<style scoped>
    #mapHeader {
        position: absolute;
        left: 0%;
        width:100%;
    }
    #submitExitBtns {
        position: absolute;
        right: 2.5%;
    }
    .h1-text{
        position: relative;
        left:30%;
    }
</style>