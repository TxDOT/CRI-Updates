<template>
        <v-card id="finalCheck">
            <v-card-title class="surfaceTitle" >
                <v-card-text style="bottom:26px; position:relative; font-size: 15px; text-align: left; right: 17px">
                    <v-icon color="white" style="position:relative; bottom: 2px; right: 5px;">mdi-alert-circle</v-icon>
                    Missing Attributes
                </v-card-text>
            </v-card-title>
            <v-card-text style="position:relative; text-align:left; padding: 0px; color: black; top:20px; left: .9rem;">
                Road Name is Required.
            </v-card-text>
            <v-btn tile @click="setFinalCheck()" style="poistion:relative; right: 4.1rem; top:2.0rem" outlined color="#14375A"><u>close</u></v-btn>
        </v-card>
</template>

<script>
export default {
    name:'finalCheck',
    methods:{
        setFinalCheck(){
            this.finalCheck = false
        }
    },
    computed:{
        finalCheck:{
            get(){
                return this.$store.state.isFinalCheck
            },
            set(bool){
                this.$store.commit('setIsFinalCheck', bool)
            }
        }
    }

}
</script>
<style scoped>
.surfaceTitle{
  background-color: #204E70;
  color: white;
  bottom:16px;
  height:30px;
  width: 100%;
  font-size: 10px;
}
#finalCheck{
    position: absolute;
    top: 25rem;
    width: 15rem;
    left: 57rem;
    height: 8rem;
    border-radius: 0px;
}
</style>