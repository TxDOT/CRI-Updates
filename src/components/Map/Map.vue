<template>
    <div id="viewDiv" class="main">
        
        <div class="banner">
            <v-toolbar dark>
            <v-app-bar-nav-icon @click="expand"></v-app-bar-nav-icon>
            <v-toolbar-title justify="center">Welcome to DUSA</v-toolbar-title>
            <v-btn-toggle id="delBtn">
                <v-btn color="red" small>Delete Roads</v-btn>
                <v-btn color="primary" small @click="addRoad(); snackbar = true" id="addBtn">Add Roads</v-btn>
                <input id="upldFile" type="file" hidden @change="fileValid()"><v-btn @click="uploadFile()" color="blue-grey" small component="span" variant="contained">Upload Files</v-btn>
            </v-btn-toggle>
            <v-btn-toggle id="Recertify">
                <v-btn color="green" small @click="submitCertify=true">Submit & Certify</v-btn>
                <v-btn color="Black" small>Save & Exit</v-btn>
            </v-btn-toggle>
            </v-toolbar>
        </div>
            <div class="text-center">
                <v-snackbar style="bottom:50px;" v-model = snackbar timeout=-1>
                    <v-btn dark color="pink" text @click="snackbar = false; cancelEditing()" width=600> Stop Editing </v-btn>
                </v-snackbar>
            </div>
            
             <div class="mileInfo">
                <v-card dark height="50">
                <v-card-text justify="center" v-if="isNaN(countyTots)&&isNaN(modifyLine)&&isNaN(modifyLength) ? 0: countyTots" v-cloak><p class="font-weight-regular">County: {{county}}&nbsp; &nbsp; &nbsp; User Name: {{username}}
                &nbsp; &nbsp; &nbsp; Previous Total Mileage: {{countyTotal}}&nbsp;&nbsp;&nbsp; 
                Current Mileage: {{currentMiles}}&nbsp;&nbsp;&nbsp; 
                New Total Miles: {{countyTots}}</p></v-card-text>
                <v-btn elevation=0 style="bottom:65px; right:44%">Criteria</v-btn>
                <v-btn elevation=0 style="bottom:65px; right:43%">About</v-btn>
                </v-card>
            </div>
        <div id="step"><stepper :received="editTest"/></div>
       <v-dialog
        v-model="submitCertify"
        max-width="500">
            <v-card v-model="submitCertify" height="300">
            <v-img><img style="position:relative; top:0%;" src="@/assets/favicon-32x32.png"></v-img>
            <v-card-actions>
            <div style="position:absolute; top:20%; left: 5%" class="black--text mb-3">
            <v-card-text >
                 You are about to submit and certify county mileage for {{county}} County.<br>
                 The previous years mileage was <b>{{this.countyTotal}} miles</b>.<br>The new total mileage is <b>{{countyTots}} miles.</b>
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
import {addRoadbed, updateLength, zoomExtents, hightlightFeat, stopEditing, modifyRoadbed} from '../Map/editFunc'
import stepper from '../../components/stepperQuestion.vue'
//import mapFooter from '../Map/mapFooter.vue'
import {roadInfo} from '../../store'
//import { gLayer } from '../Map/map';
//import Graphic from "@arcgis/core/Graphic";
import * as geometryEngine from "@arcgis/core/geometry/geometryEngine";

export default {
    name: 'Map',
    components: {stepper},
    data(){
        return{
            submitCertify:false,
            snackbar: false,
            stepper: false,
            addButton: "add Road",
            previousTotal: 0,
            county:  roadInfo.getcntyName,
            username: 'DPROSACK', //TODO Dynamic
            countyTotal: roadInfo.getcntyMiles,
            lineLength: {},
            newMiles: '',
            modifyLine: 0,
            modifyLength: 0,
            editTest: false,
        }
    },
    async mounted() { //async waits for map to load
        const app = await import('../Map/map');
        app.initialize(this.$el); //assigns esri map to the container
        zoomExtents();
        hightlightFeat();
        //console.log(this.captureMiles)
        
    },
    methods: {
        addRoad() {
            addRoadbed().then(result=>{
            this.previousTotal += parseFloat(result.toFixed(3))
    
            //this.editTest = false
            console.log(this.editTest)
            })            
        },
        cancelEditing(){
            stopEditing();
            //this.editTest = true
            console.log(this.editTest)
        },
        expand(){
            if (document.getElementById("step").style.width==='0px'){
                document.getElementById("step").style.width='450px'
            }
            else{
                document.getElementById("step").style.width='0px'
            }
        },
        uploadFile(){
            document.getElementById("upldFile").click()
        },
        fileValid(){
            let fileInput = document.getElementById('upldFile').value
            let allowedExtens = /(\.shp|\.gdb)$/i;
            if(!allowedExtens.exec(fileInput)){
                alert("Incorrect File Type!")
                fileInput = '';
                return false
            }
        }
        
    },
    
    watch:{
       previousTotal() {
            addRoadbed().then(result=>
            this.previousTotal += parseFloat(result.toFixed(3)))
            document.getElementById("step").style.width='450px'
            
        },
       // converts refLayer to graphicsLayer
       
        modifyLine:{
             handler: async function(){
                let modify = await modifyRoadbed("double-click")
                this.editTest = true;
                this.modifyLine += parseFloat(geometryEngine.geodesicLength(modify.features[0].geometry, "miles").toFixed(3))
                console.log(modify.features[0].geometry)
                
            },
            immediate:true,
        },
       modifyLength:{
            handler: async function(){
                let crow = await updateLength()
                console.log(crow)
                this.modifyLength += crow
               
            },
            immediate: true, 
        }
    },

    computed:{
        countyTots: function(){
            return Number(this.countyTotal) + Number(this.previousTotal) + Number(this.modifyLength)
        },

        currentMiles: function(){
            return Number(this.previousTotal) + Number(this.modifyLength)
        },
        getCount:{//testing function; not working
            get(){
                return roadInfo.getCount
            },   
            set(x){
                this.$set(roadInfo,'getCount',x)
            }
        },
        


    }

};
</script>

<style scoped>

#viewDiv {
    position: absolute;
    top: 0px;
    right: 0;
    height: 100%;
    width: 100%;
    }

.main{
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
}
.mileInfo{
    background: gray;
    position: absolute;
    width: 100%;
    height: 10px;
    right: 0%;
    top: 95%;
}

#step{
    position: fixed;
    width: 0;
    left: 0;
    top: 10%;
    transition: 0.5s;
    z-index: 1
}

#delBtn{
    position: absolute;
    width: auto;
    height: auto;
    top: 30px;
    right: 45%; 
}
#Recertify{
    position: absolute;
    width: auto;
    height: auto;
    top: 30px;
    right: 5%; 
}
.banner{
    position: absolute;
    width: 100%;
    height: 0;
    top: 0;
    left: 0;
}
/* .footer{
    position: absolute;
    width: 100%;
    height: 100%;
    top: 0;
    right: 600px;
} */
</style>