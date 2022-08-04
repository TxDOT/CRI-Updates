<template>
    <v-card>
        <v-card-text>Click and drag vertices to edit the shape of the road.</v-card-text>
        <v-btn outlined small style="top:0px; left:70px; border:black 1px solid" tile @click="deleteRoad()" color="#15648C" v-if="!info"> 
          <u><v-icon color="black" medium style="right:5px">mdi-trash-can</v-icon>Delete Road</u>
        </v-btn>
        <v-btn outlined small style="top:0px; left:73px; border:black 1px solid" tile @click="nextStep(2);" color="#15648C" v-on="!info ? {'click' : () =>{nextStep(2)}} : {'click' : () =>{beginEdit()}}"> 
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
        advanceStep: 'Continue',
        editStep: 'Edit Road',
        info: false
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
            this.infoRoad = false
            defineGraphic(this.featureGeometry, 'click', 'edit') 
         }
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
                console.log(this.$store.state.modifyRd)
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
        }    
    }
}
</script>
<style scoped>

</style>