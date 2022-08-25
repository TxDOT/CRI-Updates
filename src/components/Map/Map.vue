<template>
    <div id="viewDiv" class="main">
        <!-- <div id="step"><stepper/></div> -->
    </div>
</template>

<script>
//import {zoomExtents, } from '../Map/editFunc'
//import stepper from '../../components/stepperQuestion.vue'

//import mapFooter from '../Map/mapFooter.vue'
//import {roadInfo} from '../../store'
//import { hightlightFeat } from '../Map/map';
//import Graphic from "@arcgis/core/Graphic";
// import * as geometryEngine from "@arcgis/core/geometry/geometryEngine";

export default {
    name: 'Map',
    //components: {stepper},
    data(){
        return{
            // submitCertify:false,
            //snackbar: false,
            stepper: false,
            addButton: "add Road",
            previousTotal: 0,
            //county:  roadInfo.getcntyName,
            // username: 'DPROSACK', //TODO Dynamic
            //countyTotal: roadInfo.getcntyMiles,
            lineLength: {},
            newMiles: '',
            modifyLine: 0,
            alert:''
            //modifyLength: 0,
        }
    },
    async mounted() { //async waits for map to load
        const app = await import('../Map/map');
        app.initialize(this.$el); //assigns esri map to the container
    },
    methods: {
        // addRoad() {
        //     addRoadbed().then(result=>{
        //     this.previousTotal += parseFloat(result.toFixed(3))         
        //     })            
        // },
        // cancelEditing(){
        //     stopEditing()
        // },
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
        },
    },
    
    watch:{
      
    },

    computed:{
        // countyTots: function(){
        //     return Number(this.countyTotal) + Number(this.previousTotal) + Number(this.modifyLength)
        // },

        // currentMiles: function(){
        //     return Number(this.previousTotal) + Number(this.modifyLength)
        // },
        // cntyName:{
        //     get(){
        //         return this.$store.state.cntyName
        //     },
        //     // set(cntyName){
        //     //     this.$store.commit('setCntyName',cntyName)
        //     // }
        // },



    }

};
</script>

<style scoped>

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
    left: 0%;
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
<style>
    .esri-basemap-toggle__container, .esri-basemap-toggle__image {
        width: 32px;
        height: 32px;
        position: absolute;
        top: 0;
        left: 0;
        overflow: hidden;
    }
    .esri-basemap-toggle__image--secondary {
        margin-top: 0px;
        margin-left: 0px;
    }
    .esri-basemap-toggle {
        cursor: pointer;
        position: relative;
        overflow: visible;
        width: 33px;
        height: 30px;
        background-color: transparent;
        box-shadow: none;
        display: flex;
        flex-flow: row nowrap;
        justify-content: center;
        align-items: center;
    }
    .esri-scale-bar.esri-widget{
        position: relative;
        top:93.5%;
        left: 89%;
    }
</style>