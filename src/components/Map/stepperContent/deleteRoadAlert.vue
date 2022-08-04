<template>
    <v-card id="discardSketch" v-if="deleteAlert">
        <v-card-title class="confirmationTitle">Are you sure you want to discard this item?</v-card-title>
        
        <v-btn tile outlined color="#14375A" @click="deleteRoad()"><u>YES</u></v-btn>
        <v-btn tile outlined color="#14375A" @click="setDeleteFalse()"><u>NO</u></v-btn>
    </v-card>
    <!-- <v-card style="top: 330px; left: 730px; width: 330px;border: black solid 2px;">
        <v-card-title class="confirmationTitle">Road Deleted</v-card-title>
        <v-card-text><b>{{roadName[0].streetName}} {{roadName[0].streetType}} has been marked as deleted</b></v-card-text>
    </v-card> -->
</template>

<script>
import {removeGraphic} from '../editFunc'
export default {
    components: {},
    name: 'deleteRoadAlert',
    // data(){
    //   return{
    //     deleteAlert: false
    //   }
    // },
    methods:{
        setDeleteFalse(){
            this.deleteClick = false
        },
        deleteRoad(){
            removeGraphic()
            this.deleteClick = false
        }
    },
    watch:{
       
    },
    computed:{
        deleteClick:{
            get(){
                return this.$store.state.deleteGraphClick
            },
            set(x){
                this.$store.commit('setdeleteGraphClick', x)
            }
        }
    }
}
</script>
<style scoped>
.confirmationTitle{
    background: #14375A;
    color:white;
    font-size: 16px;
    height: 40px;
    padding-left: 25px;
    padding-top: 1%;
    text-align: justify;
    top: 10%;
    width: 100%;
    left: 100%;
    border-radius: 0px;
}
#discardSketch{
    width: 430px;
    left: 725px;
    top: 380px;
    border-radius: 0px;
}
</style>