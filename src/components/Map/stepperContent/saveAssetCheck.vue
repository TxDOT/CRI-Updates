<template>
        <v-card id="finalCheck">
            <v-card-title class="surfaceTitle" >
                <v-card-text style="bottom:30px; position:relative; font-size: 15px; text-align: left; right: 17px">
                    <v-icon color="red">mdi-alert-circle</v-icon>
                    Missing Attributes
                </v-card-text>
            </v-card-title>
            <v-card-text style="text-align:left; padding-top: 10px;">
                Whoa, champ! Slow Down! This road is going to feel bad without a name.
            </v-card-text>
            <v-btn @click="setFinalCheck()" style="poistion:relative;" plain outlined color="#204E70"><u>close</u></v-btn>
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
  bottom:20px;
  height:30px;
  width: 100%;
  font-size: 10px;
}
#finalCheck{
    position: absolute;
    top: 40%;
    width: 300px;
    left: 50%;
    height: 150px;
}
</style>