<template>
    <!-- <v-dialog style="position:absolute; left: 50%; top: 50%;"> -->
      <v-card id="finalCheck">
        <v-card-title class="surfaceTitle"><v-card-text style="position:relative; bottom:25px; text-align: left; padding-left: 0px;">About the County Road Inventory Map</v-card-text></v-card-title>
        
        <v-card-text style="poistion: absolute; text-align: left; color: black;">Overview: this is a new version of the DUSA application. Refer to this section to review updates to the map.</v-card-text>
        <v-card-text style="poistion: absolute; text-align: left; color: black;">Release Notes: A lot of stuff</v-card-text>
        
        <v-card-text style="position: absolute; color: black; bottom: 6.5rem; left: 40%"><u>Build Version: 1.4.3</u></v-card-text>
        <v-btn style="position: absolute; right: 1%; bottom: 9%;" tile color="#204E70" outlined @click="close(); clearEditBtn=false">Close</v-btn>
      </v-card>
    <!-- </v-dialog> -->
</template>

<script>
export default {
    name: 'about',
    data (){
      return {

      }
    },
    methods:{
        close(){
            this.aboutClick = false
        }
    },
    computed:{
        aboutClick:{
            get(){
                return this.$store.state.isAbout
            },
            set(bool){
                this.$store.commit('setIsAbout', bool)
            }
        },
        clearEditBtn:{
            get(){
                return this.$store.state.isClearAboutHelpTools
            },
            set(isBool){
                this.$store.commit('setIsAboutHelpTools', isBool)
            }
      },
    }
}
</script>
<style scoped>
.surfaceTitle{
  position: relative;
  background-color: #204E70;
  color: white;
  bottom:30px;
  height:30px;
  width: 100%;
  font-size: 10px;
}

#finalCheck{
    position: absolute;
    top: 40%;
    width: 50vw;
    left: 30%;
    height: 150px;
    border-radius: 0px;
}
</style>