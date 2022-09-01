<template>
    <v-card>
        <v-card-text style="color:black; text-align: left; position: relative; right:1rem;" v-if="!info">Click and drag vertices to edit the shape of the road.</v-card-text>
        <v-card-text style="color:black; text-align: left; position: relative; right:1rem;" v-else>Click Edit Road to make changes.</v-card-text>
        <v-btn style="top:0px; left:3rem;" depressed @click="deleteRoad()" text color="#204E70" v-if="!info && modifyRoad"> 
          <v-icon color="black" medium style="right:5px">mdi-trash-can</v-icon><u>Delete Road</u>
        </v-btn>
        <v-btn outlined tile color="#204E70" v-on="!info ? {'click' : () =>{nextStep(2)}} : {'click' : () =>{beginEdit()}}" :style="!info && modifyRoad ? [isPopupF] : [isPopupT]"> 
          <u v-if="info">{{editStep}}</u>
          <u v-if="!info">{{advanceStep}}</u>
        </v-btn>
    </v-card>
</template>

<script>

import {stopEditing, delRoad, defineGraphic} from './../editFunc'
export default {
    name: 'editVerts',
    data(){
      return{
        advanceStep: 'Next Step',
        editStep: 'Edit Road',
        info: false,
        isPopupT: {'top':'0rem', 'left':'8.8rem', 'border':'black 1px solid', 'position': 'relative'},
        isPopupF: {'top':'0rem', 'left':'3.8rem', 'border':'black 1px solid', 'position': 'relative'}

      }
    },
    methods:{
        nextStep(x){
            this.returnStep = x
            stopEditing();
            this.getDfoBool = false
        },
        deleteRoad(){
            delRoad();
            stopEditing();
            document.getElementById("stepper").style.width = '0px'
            this.steppClose = false 
            this.nextDeleteRoadForm = true
        },
        beginEdit(){
            this.nextDeleteRoadForm = false
            this.infoRoad = false
            this.firstAddToMap = true
            defineGraphic(this.featureGeometry, 'click', 'edit') 
        },
    },
    watch:{
        infoRoad:{
            handler: function(){
                this.info = this.infoRoad
            },
            immediate: true
        }
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
        nextDeleteRoadForm:{
            get(){
                return this.$store.state.deleteRdSecond
            },
            set(secondStep){
                this.$store.commit('setDeleteRdSecond', secondStep)
            }
        },
        steppClose:{
            get(){
                return this.$store.state.stepperClose
            },
            set(stepClose){
                this.$store.commit('setStepperClose', stepClose)
            }
        },
        modifyRoad:{
            get(){
                return this.$store.state.modifyRd
            },
            set(mod){
                this.$store.commit('setModifyRd', mod)
            }
        },
        infoRoad:{
            get(){
                return this.$store.state.infoRd
            },
            set(info){
                this.$store.commit('setInfoRd', info)
            }
        },
        getDfoBool:{
            get(){
                return this.$store.state.isDfoReturn
            },
            set(bool){
                this.$store.commit('setIsDfoReturn', bool)
            }
        },
        featureGeometry:{
            get(){
                return this.$store.state.featureGeometry
            }
        },
        firstAddToMap:{
            get(){
                return this.$store.state.isInitAdd
            },
            set(boolAdd){
                this.$store.commit('setIsInitAdd', boolAdd)
            }
        },
    }
}
</script>
<style scoped>

</style>