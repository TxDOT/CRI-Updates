<template>
    <v-card style="padding-bottom:10%;">
        <v-row no gutters>
            <v-col>
                <v-text-field v-model="roadName" label="Roadbed Name" :rules="emptyValues" outlined>
                </v-text-field>
            </v-col>
            <v-col>
                <v-card-text class="roadName" outlined>
                    <v-autocomplete v-model="roadNameType" :items="roadType" label="Roadbed Type" dense @formchange="roadNameType=''"></v-autocomplete>
                </v-card-text>
            </v-col>
        </v-row>
        <v-row no gutters dense>
            <v-col cols="auto">
                <v-tooltip right max-width="200">
                    <template v-slot:activator="{ on, attrs }">
                        <v-btn small text color="primary" v-bind="attrs" v-on="on" style="position: absolute; right: 230px; top: 80px;" @click="prefix = true">
                            <u>Add a Prefix</u><v-icon small>mdi-help-circle</v-icon>
                        </v-btn>
                    </template>
                    <span>Add a prefix, such as "North" Example: North Charles Street</span>
                </v-tooltip>
            </v-col>
            <v-col>
                <v-card-text v-if="prefix === true" style="padding:0px;" v-model="prefixStreet">
                    <v-autocomplete :items="prefixSuffixList" style="width:38%; right:15px; top: 50px; position: absolute;"></v-autocomplete>
                </v-card-text>
            </v-col>
        </v-row>
        <v-row>
            <v-col cols="auto">
                <v-tooltip right max-width="200">
                    <template v-slot:activator="{ on, attrs }">
                        <v-btn small text color="primary" v-bind="attrs" v-on="on" style="top: 110px; right: 230px; position: absolute;" @click="suffix = true">
                            <u>Add a Suffix</u><v-icon small>mdi-help-circle</v-icon>
                        </v-btn>
                    </template>
                    <span>Add a Suffix, such as "North" Example: Charles Street North</span>
                </v-tooltip>
            </v-col>
            <v-col>
                <v-card-text v-if="suffix === true" style="padding:0px;" v-model="suffixStreet">
                    <v-autocomplete :items="prefixSuffixList" style="width:38%; right:15px; top: 80px; position: absolute;"></v-autocomplete>
                </v-card-text>
            </v-col>
        </v-row>
        <v-btn depressed plain style="left:69px; top:30px"> 
          Cancel
        </v-btn>
        <v-btn outlined style="top:30px; left:73px;" tile @click="nextStep(2); initLoadAsset('design'); updateGraphic();" color="#15648C"> 
          <u>Continue</u>
        </v-btn>
    </v-card>
</template>

<script>
import {initLoadAssetGraphic, sketchCompete} from '../editFunc'
import { gLayer } from '../map'

export default {
    components: {},
    name: 'roadName',
    data(){
      return{
        roadType: ['ALLEY','ANEX','ARCADE','AVENUE','BAYOU','BEACH','BEND','BLUFF','BLUFFS','BOTTOM','BOULEVARD','BRANCH','BRIDGE',
                   'BROOK','BROOKS','BURG','BURGS','BYPAS','CAMP','CANYON','CAPE','CAUSEWAY','CENTER','CENTERS','CIRCLE','CIRCLES',
                   'CLIFF','CLIFFS','CLUB','COMMON','COMMONS','CORNER','CORNERS','COURSE','COURT','COURTS','COVE','COVES','CREEK',
                   'CRESCENT','CREST','CROSSING','CROSSROAD','CROSSROADS','CURVE','DALE','DAM','DIVIDE','DRIVE','DRIVES','ESTATE',
                   'ESTATES','EXPRESSWAY','EXTENSION','EXTENSIONS','FALL','FALLS','FERRY','FIELD','FIELDS','FLAT','FLATS','FORD',
                   'FORDS','FOREST','FORGE','FORGES','FORK','FORKS','FORT','FREEWAY','GARDEN','GARDENS','GATEWAY','GLEN','GLENS',
                   'GREEN','GREENS','GROVE','GROVES','HARBOR','HARBORS','HAVEN','HEIGHTS','HIGHWAY','HILL','HILLS','HOLLOW','INLET',
                   'ISLAND','ISLANDS','ISLE','JUNCTION','JUNCTIONS','KEY','KEYS','KNOLL','KNOLLS','LAKE','LAKES','LAND','LANDING',
                   'LANE','LIGHT','LIGHTS','LOAF','LOCK','LOCKS','LODGE','LOOP','MALL','MANOR','MANORS','MEADOW','MEADOWS','MEWS',
                   'MILL','MILLS','MISSION','MOTORWAY','MOUNT','MOUNTAIN','MOUNTAINS','NECK','NOT APPLICABLE','ORCHARD','OTHER','OVAL',
                   'OVERPASS','PARKS','PARKWAYS','PASS','PASSAGE','PATH','PIKE','PINE','PINES','PLACE','PLAIN','PLAINS','PLAZA','POINT',
                   'POINTS','PORT','PORTS','PRAIRIE','RADIAL','RAMP','RANCH','RAPID','RAPIDS','REST','RIDGE','RIDGES','RIVER','ROAD','ROADS',
                   'ROUTE','ROW','RUE','RUN','SHOAL','SHOALS','SHORE','SHORES','SKYWAY','SPRING','SPRINGS','SPURS','SQUARE','SQUARES',
                   'STATION','STRAVENUE','STREAM','STREET','STREETS','SUMMIT','TERRACE','THROUGHWAY','TRACE','TRACK','TRAFFICWAY','TRAIL',
                   'TRAILER','TUNNEL','TURNPIKE','UNDERPASS','UNION','UNIONS','VALLEY','VALLEYS','VIADUCT','VIEW','VIEWS','VILLAGE','VILLAGES',
                   'VILLE','VISTA','WALKS','WALL','WAY','WAYS','WELL','WELLS'],
        streetName: null,
        roadNameType: null,
        prefixSuffixList: ['East','North','Northeast','Northwest','Not Applicable','South','Southeast','Southwest','West'],
        prefix: false,
        suffix: false,
        prefixStreet: null,
        suffixStreet: null,
        emptyValues:[v => !!v || 'Road Name is required']
      }
    },
    methods:{
        updateGraphic(){
            for(let z=0; z < gLayer.graphics.items.length; z++){
                if(gLayer.graphics.items[z].attributes.objectid === this.objid){
                    gLayer.graphics.items[z].attributes.roadbedName = this.roadName
                }
            }
        },
        initLoadAsset(asset){
            initLoadAssetGraphic(asset)
            sketchCompete()
        },  
        nextStep(x){
            this.returnStep = x
        },
        resetItems(){
            this.suffixStreet = null
            this.roadNameType = null
            this.prefix = false
            this.suffix = false
        }
    },
    watch:{
        objid:{
          handler: function(){
            this.streetName = this.roadName
            this.resetItems();    
          }, 
          immediate: true,
        },
    },
    computed:{
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
                return this.$store.state.roadbedName
            },
            set(name){
                this.$store.commit('setRoadbedName', name)
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
