<template>
    <v-card height="230" elevation="0">
        <!-- <v-row no gutters dense>
            <v-col> -->
                <v-text-field autofocus id="input1" v-model="streetNames" solo flat disabled></v-text-field>
            <!-- </v-col> -->
    
            <span>
                <v-text-field persistent-placeholder dense outlined id="input1" :rules="emptyValues" label="Road Name" v-model="streetName" style="font-size: 15px; left: 87px; bottom: 16px; width: 100px; position: relative;"></v-text-field>
            </span>
                
            <v-card-text>
                <v-autocomplete persistent-placeholder dense outlined v-model="roadNameType" :items="roadType" label="Type" style="font-size: 15px; left: 175px; bottom: 98px; width:113px; position: relative;"></v-autocomplete>
            </v-card-text>
                
            <v-select persistent-placeholder dense id="prefix" outlined label="Prefix" v-model="prefixStreet" :items="prefixSuffixList" style="width: 83px; left: 0%; bottom:180px; position: relative"></v-select>
            <!-- <v-autocomplete persistent-placeholder dense id="prefix" outlined label="Prefix" v-model="prefixStreet" :items="prefixSuffixList" style="width:3-1%; left:0px; top:66px; position: absolute"></v-autocomplete> -->


            <v-select persistent-placeholder :value="suffixStreet" dense id="prefix" outlined label="Suffix" v-model="suffixStreet" :items="prefixSuffixList" style="width:83px; left: 307px; bottom: 246px; position: relative;"></v-select>   
        <!-- </v-row> -->

        <v-btn outlined style="bottom:210px; left:103px;" tile @click="nextStep(3); initLoadAsset('surface'); updateGraphic(); error = null" color="#15648C" :disabled="streetName.length < 1"> 
          <u>Continue</u>
        </v-btn>
    </v-card>
</template>

<script>
import {initLoadAssetGraphic, sketchCompete} from '../editFunc'
import {criConstants} from '../../../common/cri_constants'
import { gLayer } from '../map'

export default {
    components: {},
    name: 'roadName',
    data(){
      return{
        error: false,
        roadType: ['ALLEY','ANEX','ARCADE','AVENUE','BAYOU','BEACH','BEND','BLUFF','BLUFFS','BOTTOM','BOULEVARD','BRANCH','BRIDGE',
                   'BROOK','BROOKS','BURG','BURGS','BYPAS','CAMP','CANYON','CAPE','CAUSEWAY','CENTER','CENTERS','CIRCLE','CIRCLES',
                   'CLIFF','CLIFFS','CLUB','COMMON','COMMONS','CORNER','CORNERS','COURSE','COURT','COURTS','COVE','COVES','CREEK',
                   'CRESCENT','CREST','CROSSING','CROSSROAD','CROSSROADS','CURVE','DALE','DAM','DIVIDE','DRIVE','DRIVES','ESTATE',
                   'ESTATES','EXPRESSWAY','EXTENSION','EXTENSIONS','FALL','FALLS','FERRY','FIELD','FIELDS','FLAT','FLATS','FORD',
                   'FORDS','FOREST','FORGE','FORGES','FORK','FORKS','FORT','FREEWAY','GARDEN','GARDENS','GATEWAY','GLEN','GLENS',
                   'GREEN','GREENS','GROVE','GROVES','HARBOR','HARBORS','HAVEN','HEIGHTS','HIGHWAY','HILL','HILLS','HOLLOW','INLET',
                   'ISLAND','ISLANDS','ISLE','JUNCTION','JUNCTIONS','KEY','KEYS','KNOLL','KNOLLS','LAKE','LAKES','LAND','LANDING',
                   'LANE','LIGHT','LIGHTS','LOAF','LOCK','LOCKS','LODGE','LOOP','MALL','MANOR','MANORS','MEADOW','MEADOWS','MEWS',
                   'MILL','MILLS','MISSION','MOTORWAY','MOUNT','MOUNTAIN','MOUNTAINS','NECK','ORCHARD','OTHER','OVAL',
                   'OVERPASS','PARKS','PARKWAYS','PASS','PASSAGE','PATH','PIKE','PINE','PINES','PLACE','PLAIN','PLAINS','PLAZA','POINT',
                   'POINTS','PORT','PORTS','PRAIRIE','RADIAL','RAMP','RANCH','RAPID','RAPIDS','REST','RIDGE','RIDGES','RIVER',"ROAD",'ROADS',
                   'ROUTE','ROW','RUE','RUN','SHOAL','SHOALS','SHORE','SHORES','SKYWAY','SPRING','SPRINGS','SPURS','SQUARE','SQUARES',
                   'STATION','STRAVENUE','STREAM','STREET','STREETS','SUMMIT','TERRACE','THROUGHWAY','TRACE','TRACK','TRAFFICWAY','TRAIL',
                   'TRAILER','TUNNEL','TURNPIKE','UNDERPASS','UNION','UNIONS','VALLEY','VALLEYS','VIADUCT','VIEW','VIEWS','VILLAGE','VILLAGES',
                   'VILLE','VISTA','WALKS','WALL','WAY','WAYS','WELL','WELLS'],
        streetName: ' ',
        roadNameType: ' ',
        prefixSuffixList: ['', 'E','N','NE','NW','S','SE','SW','W'],
        prefix: false,
        suffix: false,
        prefixStreet: ' ',
        suffixStreet: ' ',
        emptyValues:[v => !!v || '',
                     v => !!v || this.updateError()]
      }
    },
    methods:{
        updateError(){
            this.error = true
        },
        updateGraphic(){
            let updateG = [{
                    streetName:this.streetName, 
                    prefix: this.prefixStreet, 
                    suffix: this.suffixStreet,
                    streetType: this.roadNameType
            }]

            for(let z=0; z < gLayer.graphics.items.length; z++){
                if(gLayer.graphics.items[z].attributes.objectid === this.objid){
                    gLayer.graphics.items[z].attributes.roadbedName = JSON.stringify(updateG)
                }
            }
        },
        initLoadAsset(asset){
            sketchCompete()
            initLoadAssetGraphic(asset)
        },  
        nextStep(x){
            this.returnStep = x
        },
        resetItems(){
            this.suffixStreet = ''
            this.prefixStreet = ''
            this.roadNameType = ''
            this.prefix = false
            this.suffix = false
            this.streetName = ''
        },
    },
    watch:{
        streetName:{
            handler: function(){
            this.streetName.length > 1
            this.error = false   
          }, 
          immediate: true,
        },
        objid:{
          handler: function(){
            //this.streetName = this.roadName
            this.resetItems();    
          }, 
          immediate: true,
        },
        roadName:{
            handler: function(){
                if(this.roadName){
                    for(let i=0; i < this.roadName.length; i++){
                        console.log(this.roadName)
                        this.streetName = this.roadName[i].streetName
                        this.roadNameType = this.roadName[i].streetType !== 'NOT APPLICABLE' ? this.roadName[i].streetType : ''
                        this.prefixStreet = this.roadName[i].prefix !== 'NOT APPLICABLE' ? criConstants.suffixPrefix[`${this.roadName[i].prefix}`] : ''
                        this.suffixStreet = this.roadName[i].suffix !== 'NOT APPLICABLE' ? criConstants.suffixPrefix[`${this.roadName[i].suffix}`] : ''
                        this.prefixStreet ? this.prefix = true : this.prefix = false
                        this.suffixStreet ? this.suffix = true : this.suffix = false
                    }
                }

            }, 
          immediate: true,
        },
    },
    computed:{
        streetNames:{
            get: function(){
                return (this.prefixStreet ? this.prefixStreet : '') + ' ' + (this.streetName ? this.streetName : '') + ' ' + (this.roadNameType ? this.roadNameType : '') + ' ' +  (this.suffixStreet ? this.suffixStreet : '')
            },
            set:function(x){
                console.log(x)
                document.getElementById('input1').style.width = ((x+1)*8) + 'px'
                // let splitName = x.split(' ')
                // console.log(splitName)
                // this.streetName = splitName[0]
                // this.roadNameType = splitName[1]

            }
        },
        returnStep:{
            get(){
                return this.$store.state.stepNumber
            },
            set(x){
                this.$store.commit('setStepNumber', Number(x))
            }
        },
        roadName:{
            get(){
                if(typeof(this.$store.state.roadbedName) === 'string'){
                  return JSON.parse(this.$store.state.roadbedName) 
                }
                else{
                  return this.$store.state.roadbedName
                }
            },
            set(name){
                this.$store.commit('setRoadbedName', JSON.stringify(name))
            }
        },
        objid:{
          get(){
            return this.$store.state.objectid
          }
        },
    }
}
</script>
<style>
.v-input input{
    text-transform: uppercase;
}

.v-text-field--outlined fieldset{
    border-radius: 0px 0px 0px 0px;
    border: black solid .5px;
}
.v-text-field--outlined.v-input--dense .v-label{
    font-size: 18px;
}
</style>

