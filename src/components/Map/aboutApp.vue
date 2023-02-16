<!-- "About" content -->
<template>
    <v-dialog v-model="aboutClick" max-width="600" persistent>
        <v-card id="finalCheck" v-model="aboutClick">
            <v-card-title class="surfaceTitle"><span id="titleText">About the County Road Inventory Map</span></v-card-title>
        <v-card-text class="textSymb" id="buildNm"><u>Build Version: 1.5.7</u></v-card-text>
        <div>
            <v-card-text class="textSymb" id="cardText">The County Road Inventory Map is a tool for county officials to verify and make updates to TxDOT’s 
                                                                                                        roadway inventory. <a id="hoverLink" href='https://capitol.texas.gov/tlodocs/74R/billtext/html/SB00971F.htm' target="_blank">
                                                                                                        The Texas Legislature requires TxDOT to administer this program</a> to ensure accuracy
                                                                                                        of the mileage reported to the Department of Motor Vehicles and Comptroller of Public Accounts for the
                                                                                                        purpose of allocation of highway funds.</v-card-text>
        </div>
        <v-divider class="textSymb" id="divider"></v-divider>
        <div>
            <v-card-text class="textSymb" id="updateTextRow" v-for="(i, index) in updateList" :key=index><ul id="updateText"><li>{{updateList[index]}}</li></ul></v-card-text>
        </div>

        <div id="btnPosition"><v-btn underline tile color="#14375A" outlined @click="close(); clearEditBtn=false"><u>close</u></v-btn></div>
        
      </v-card>
    </v-dialog>
</template>

<script>
export default {
    name: 'about',
    data (){
      return {
        updateList:['Added Geometry Checks (Self-Intersection, Minimum geometry length)', 'Updated sign-up URL','Added link to training videos','Adjusted Action item Body text font', 'Disabled mile info after ending asset mileage is completed', 
                    'Adjusted Missing Attributes/Discard Edit Popup', 'Judge Workflow Updated']
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
    position: relative;
    top:50%;
    width: 500px;
    left: 4rem;
    min-height: 0vh;
    max-height: 100rem;
    border-radius: 0px;
    display: flex;
    flex-direction: column;
    overflow-x: hidden;
    overflow-y: auto;
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
    top: 28.5rem; 
    left: 0%; 
    font-size: 10px; 
}
#cardText{
    position: relative; 
    bottom:2.5rem; 
    left: 0%; 
}
#divider{
    position: relative;
    bottom: 1.5rem;
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
    left: 12rem;
    top: 4rem;
}
#btnClose{
    border:1px solid black;
}
</style>