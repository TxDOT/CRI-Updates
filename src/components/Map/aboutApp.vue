<template>
    <!-- <v-dialog style="position:absolute; left: 50%; top: 50%;"> -->
      <v-card id="finalCheck">
        <v-card-title class="surfaceTitle"><v-card-text style="position:relative; bottom:25px; text-align: left; padding-left: 0px;">About the County Road Inventory Map</v-card-text></v-card-title>
        <v-card-text style="position: absolute; color: black; top: 0rem; left: 0%; font-size: 10px;"><u>Build Version: 1.4.5</u></v-card-text>
        <!-- <v-card-text style="poistion: absolute; text-align: left; color: black;">Overview: this is a new version of the DUSA application. Refer to this section to review updates to the map.</v-card-text> -->
        <v-card-text style="poistion: absolute; text-align: left; color: black;" v-for="(i, index) in updateList" :key=index><ul style="position:relative; line-height: 1rem; padding: 0rem;"><li>{{updateList[index]}}</li></ul></v-card-text>
        
        <div style="position: relative; left: 35%; bottom: .5rem;"><v-btn tile color="#204E70" outlined @click="close(); clearEditBtn=false">Close</v-btn></div>
        
      </v-card>
    <!-- </v-dialog> -->
</template>

<script>
export default {
    name: 'about',
    data (){
      return {
        updateList:['Adjusted Action item Body text font', 'Disabled mile info after ending asset mileage is completed', 
                    'Adjusted Missing Attributes/Discard Edit Popup']
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
    position: relative;
    top: 10vh;
    width: 350px;
    left: 45vw;
    border-radius: 0px;
    display: flex;
    flex-direction: column;
}

ul { list-style-position: inside; }
</style>