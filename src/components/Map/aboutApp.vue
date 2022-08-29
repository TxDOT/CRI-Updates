<template>
    <!-- <v-dialog style="position:absolute; left: 50%; top: 50%;"> -->
      <v-card id="finalCheck">
        <v-card-title class="surfaceTitle">About the County Road Inventory Map</v-card-title>
        <v-card-text style="position: absolute; color: black; top: 1rem; left: 0%; font-size: 10px; text-align: left;"><u>Build Version: 1.4.9</u></v-card-text>
        <!-- <v-card-text style="poistion: absolute; text-align: left; color: black;">Overview: this is a new version of the DUSA application. Refer to this section to review updates to the map.</v-card-text> -->
        <v-card-text style="poistion: relative; text-align: left; color: black; margin-left: 1rem;" v-for="(i, index) in updateList" :key=index><ul style="position:relative; line-height: 1rem; padding: 0rem;"><li>{{updateList[index]}}</li></ul></v-card-text>
        
        <div style="position: relative; left: 35%; bottom: .5rem;"><v-btn style="border:1px solid black;" underline tile color="#14375A" outlined @click="close(); clearEditBtn=false"><u>close</u></v-btn></div>
        
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
  background-color: #14375A;
  text-align: left;
  top:10%;
  color: white;
  bottom:30px;
  height:40px;
  padding-top: 1%;
  width: 100%;
  font-size: 16px;
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

</style>