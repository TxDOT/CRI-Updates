<template>
    <!-- <v-dialog style="position:absolute; left: 50%; top: 50%;"> -->
      <v-card id="finalCheck">
        <v-card-title class="surfaceTitle"><v-card-text style="position:relative; bottom:25px; text-align: left; padding-left: 0px;">About the County Road Inventory Map</v-card-text></v-card-title>
        <v-card-text style="position: absolute; color: black; top: 0rem; left: 0%; font-size: 10px;"><u>Build Version: 1.4.4</u></v-card-text>
        <div style="width:100%;height:0;padding-bottom:100%;position:relative; right: 35%;"><iframe src="https://giphy.com/embed/fveEm9uqUas7igLGTU" width="70%" height="70%" style="position:absolute" frameBorder="0" class="giphy-embed" allowFullScreen></iframe></div>
        <!-- <v-card-text style="poistion: absolute; text-align: left; color: black;">Overview: this is a new version of the DUSA application. Refer to this section to review updates to the map.</v-card-text> -->
        <v-card-text style="poistion: absolute; text-align: left; color: black;" v-for="(i, index) in updateList" :key=index><ul style="line-height: .5rem"><li>{{updateList[index]}}</li></ul></v-card-text>
        
        <div style="position: relative; left: 35%; bottom: .5rem;"><v-btn tile color="#204E70" outlined @click="close(); clearEditBtn=false">Close</v-btn></div>
        
      </v-card>
    <!-- </v-dialog> -->
</template>

<script>
export default {
    name: 'about',
    data (){
      return {
        updateList:['Add Road Update', 'Edit Road Update', 'Delete Road Update']
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
</style>