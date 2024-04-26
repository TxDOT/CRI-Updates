<!-- "About" content -->
<template>
    <v-dialog v-model="aboutClick" max-width="600" persistent id="aboutApp">
        <v-card id="finalCheck" v-model="aboutClick">
            <v-card-title class="surfaceTitle"><span id="titleText">About the County Road Inventory Map</span></v-card-title>
        <div>
            <v-card-text class="textSymb" id="cardText">The County Road Inventory Map is a tool for county officials to verify and make updates to TxDOT’s 
                                                                                                        roadway inventory. <a id="hoverLink" href='https://capitol.texas.gov/tlodocs/74R/billtext/html/SB00971F.htm' target="_blank">
                                                                                                        The Texas Legislature requires TxDOT to administer this program</a> to ensure accuracy
                                                                                                        of the mileage reported to the Department of Motor Vehicles and Comptroller of Public Accounts for the
                                                                                                        purpose of allocation of highway funds.</v-card-text>
        </div>
        <v-divider class="textSymb" id="divider"></v-divider>
        <v-card-text id="releaseNotes">Release Notes:</v-card-text>
        <div id="moveItem">
            <v-card-text class="textSymb" id="updateTextRow" v-for="(i, index) in updateList" :key=index><ul id="updateText"><li>{{updateList[index]}}</li></ul></v-card-text>
        </div>

        <div id="btnPosition"><v-btn underline tile color="#14375A" outlined @click="close(); clearEditBtn=false"><u>close</u></v-btn></div>

        <v-card-text class="textSymb" id="buildNm"><u>Build Version: 1.6.5</u></v-card-text>

            
      </v-card>
    </v-dialog>
</template>

<script>
export default {
    name: 'about',
    data (){
      return {
        updateList:['Added Geometry Checks (Self-Intersection, Minimum geometry length)', 'Updated sign-up URL','Added link to training videos','Adjusted Action item Body text font', 'Disabled mile info after ending asset mileage is completed', 
                    'Adjusted Missing Attributes/Discard Edit Popup', 'Judge Workflow Updated', 'Updated delete workflow', 'Updated to automatic asset length changes', 'Added EOY edits alert', 'Last Years edits layer and legend added', 'Removed Design/Surface/Lane attributes']
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
#releaseNotes{
    text-align: left;
    padding-bottom: 1rem;
    color: black;
    text-decoration: underline;
}
#aboutApp{
    position: relative;
    min-height: 0px;
    display: flex;
    flex-direction: column;
}
#moveItem{
    position: relative;
    bottom: 0rem;
}
.surfaceTitle{
  position: inherit;
  background-color: #14375A;
  text-align: left;
  color: white;
  top: 0%;
  bottom:10px;
  height:40px;
  padding: 0%;
  width: 100%;
  font-size: 16px;
}

#finalCheck{
    position: inherit;
    top:50%;
    width: 500px;
    left: 4rem;
    min-height: 0vh;
    max-height: 50rem;
    border-radius: 0px;
    display: flex;
    flex-direction: column;
    overflow-x: hidden;
    overflow-y: hidden;
}

#hoverLink{
    color: blue;
    text-decoration: none;
}
#hoverLink:hover{
    text-decoration: underline;
}
#titleText{
    position: relative; 
    bottom: 10px; 
    right: 7px;
}
#buildNm{
    position: relative; 
    bottom: 0rem; 
    left: 0%; 
    font-size: 10px; 
    width: 10rem;
}
#cardText{
    position: relative; 
    bottom:.5rem; 
    left: 0%; 
}
#divider{
    position: relative;
    bottom: .5rem;
}
#updateTextRow{
   margin-left: 1rem;
}
#updateText{
    position:relative;
    line-height: 1px;
    white-space: nowrap;
    padding: 0rem;
}
#btnPosition{
    position: relative;
    left: 11.5rem;
    top: 2rem;
    
}
#btnClose{
    border:1px solid black;
}
</style>