<template>
    <v-card style="padding-bottom:10%;">
        <v-row no gutters>
            <v-col>
                <v-text-field v-model="roadbedName" label="Roadbed Name" :rules="emptyValues">
                </v-text-field>
            </v-col>
            <v-col>
                <v-card-text class="roadName" outlined>
                    <v-autocomplete :items="roadType" label="Roadbed Type" dense>
                    </v-autocomplete>
                </v-card-text>
            </v-col>
        </v-row>
        <v-row no gutters dense>
            <v-col cols="auto">
                <v-tooltip right max-width="200">
                    <template v-slot:activator="{ on, attrs }">
                        <v-btn small text color="primary" v-bind="attrs" v-on="on" style="position: absolute; right:61%; top: 60%;" @click="prefix = true">
                            <u>Add a Prefix</u><v-icon small>mdi-help-circle</v-icon>
                        </v-btn>
                    </template>
                    <span>Add a prefix, such as "North" Example: North Charles Street</span>
                </v-tooltip>
            </v-col>
            <v-col>
                <v-card-text v-if="prefix === true" style="padding:0px;">
                    <v-autocomplete :items="prefixSuffixList" style="width:50%; left:50%; bottom:15%; position: absolute;"></v-autocomplete>
                </v-card-text>
            </v-col>
        </v-row>
        <v-row>
            <v-col cols="auto">
                <v-tooltip right max-width="200">
                    <template v-slot:activator="{ on, attrs }">
                        <v-btn small text color="primary" v-bind="attrs" v-on="on" style="top:77%; right: 61%; position: absolute;" @click="suffix = true">
                            <u>Add a Suffix</u><v-icon small>mdi-help-circle</v-icon>
                        </v-btn>
                    </template>
                    <span>Add a Suffix, such as "North" Example: Charles Street North</span>
                </v-tooltip>
            </v-col>
            <v-col>
                <v-card-text v-if="suffix === true" style="padding:0px;">
                    <v-autocomplete :items="prefixSuffixList" style="width:50%; left:50%; top:58%; position: absolute;"></v-autocomplete>
                </v-card-text>
            </v-col>
        </v-row>
    </v-card>
</template>

<script>

export default {
    components: {},
    name: 'roadName',
    data(){
      return{
        roadType: ['ALLEY','ANEX','ARCADE','AVENUE','BAYOU','BEACH','BEND','BLUFF','BLUFFS','BOTTOM','BOULEVARD','BRANCH','BRIDGE','BROOK','BROOKS','BURG','BURGS','BYPAS','CAMP','CANYON','CAPE','CAUSEWAY','CENTER','CENTERS','CIRCLE','CIRCLES','CLIFF','CLIFFS','CLUB','COMMON','COMMONS','CORNER','CORNERS','COURSE','COURT','COURTS','COVE','COVES','CREEK','CRESCENT','CREST','CROSSING','CROSSROAD','CROSSROADS','CURVE','DALE','DAM','DIVIDE','DRIVE','DRIVES','ESTATE','ESTATES','EXPRESSWAY','EXTENSION','EXTENSIONS','FALL','FALLS','FERRY','FIELD','FIELDS','FLAT','FLATS','FORD','FORDS','FOREST','FORGE','FORGES','FORK','FORKS','FORT','FREEWAY','GARDEN','GARDENS','GATEWAY','GLEN','GLENS','GREEN','GREENS','GROVE','GROVES','HARBOR','HARBORS','HAVEN','HEIGHTS','HIGHWAY','HILL','HILLS','HOLLOW','INLET','ISLAND','ISLANDS','ISLE','JUNCTION','JUNCTIONS','KEY','KEYS','KNOLL','KNOLLS','LAKE','LAKES','LAND','LANDING','LANE','LIGHT','LIGHTS','LOAF','LOCK','LOCKS','LODGE','LOOP','MALL','MANOR','MANORS','MEADOW','MEADOWS','MEWS','MILL','MILLS','MISSION','MOTORWAY','MOUNT','MOUNTAIN','MOUNTAINS','NECK','NOT APPLICABLE','ORCHARD','OTHER','OVAL','OVERPASS','PARKS','PARKWAYS','PASS','PASSAGE','PATH','PIKE','PINE','PINES','PLACE','PLAIN','PLAINS','PLAZA','POINT','POINTS','PORT','PORTS','PRAIRIE','RADIAL','RAMP','RANCH','RAPID','RAPIDS','REST','RIDGE','RIDGES','RIVER','ROAD','ROADS','ROUTE','ROW','RUE','RUN','SHOAL','SHOALS','SHORE','SHORES','SKYWAY','SPRING','SPRINGS','SPURS','SQUARE','SQUARES','STATION','STRAVENUE','STREAM','STREET','STREETS','SUMMIT','TERRACE','THROUGHWAY','TRACE','TRACK','TRAFFICWAY','TRAIL','TRAILER','TUNNEL','TURNPIKE','UNDERPASS','UNION','UNIONS','VALLEY','VALLEYS','VIADUCT','VIEW','VIEWS','VILLAGE','VILLAGES','VILLE','VISTA','WALKS','WALL','WAY','WAYS','WELL','WELLS'],
        prefixSuffixList: ['East','North','Northeast','Northwest','Not Applicable','South','Southeast','Southwest','West'],
        prefix: false,
        suffix: false,
        emptyValues:[v => !!v || 'Road Name is required']
      }
    },
    computed:{
        roadbedName:{
            get(){
                return this.$store.state.roadbedName
            },
            set(name){
                console.log(name)
                this.$store.commit('setRoadbedName', name)
            }
        },
    }
}
</script>
