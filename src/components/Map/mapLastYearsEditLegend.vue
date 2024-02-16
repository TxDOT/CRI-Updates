<!-- Last year edits Legend component -->
<template >
        <v-card tile class="legend-box">
            <v-card-title class="editRdTitle"><p id="legendTitleTxt">Last Year's Edits</p></v-card-title>
            <canvas id="legend-last-year-edits" width="190" height="150"></canvas>
            <div id="add">
                <v-card-text class="editType">Pending update</v-card-text>
            </div>
            <div id="edit">
                <v-card-text class="editType">Update Complete</v-card-text>
            </div>
            <div id="delete">
                <v-card-text class="editType">Does Not Meet Criteria
                </v-card-text>
                
                
                    <v-tooltip top color="black" nudge-left=2>
                        <template v-slot:activator="{on, attr}" >
                            <v-icon v-bind="attr" v-on="on" class="legend-tooltips" color="black">mdi-help-circle</v-icon>
                        </template>

                            <span><p style="text-align: left;">Edits do not meet criteria for the following reasons:</p>
                                <div style="text-align: left; padding-left: 2rem;">
                                    City Limit Interaction<br>
                                    Gated<br>
                                    Signed as private<br>
                                    Already exists / duplicate<br>
                                    Edit unclear<br>
                                </div>

                            </span>
                    </v-tooltip>
                
                
            </div>
        </v-card>
</template>

<script>

//import { expandLegend } from './map'



export default {
    name: "LastYearsEditLegend",
    data() {
        return{
            canvasLastYearEdits: null,
            display: false
        }
    },
    mounted(){
        try{
            this.displayLegendLastYearEdits()
        }
        catch{
            //
        } 
       
    },
    methods:{
        displayLegendLastYearEdits(){
            let canvasLastYearEdit = document.getElementById('legend-last-year-edits')
            this.canvasLastYearEdits = canvasLastYearEdit.getContext('2d')

            this.canvasLastYearEdits.strokeStyle = '#F0E130'
            //this.canvasLastYearEdits.setLineDash([8, 6]);
            this.canvasLastYearEdits.lineWidth = 3.5
            this.canvasLastYearEdits.lineCap = 'round'

            this.canvasLastYearEdits.lineDashOffset = 4
            this.canvasLastYearEdits.beginPath()
            this.canvasLastYearEdits.moveTo(3,25)
            this.canvasLastYearEdits.lineTo(60, 25);
            this.canvasLastYearEdits.stroke()

            this.canvasLastYearEdits.strokeStyle = '#89CFF0'
            this.canvasLastYearEdits.beginPath()
            this.canvasLastYearEdits.moveTo(4,70)
            this.canvasLastYearEdits.lineTo(60, 70);
            this.canvasLastYearEdits.stroke()
            
            this.canvasLastYearEdits.strokeStyle = '#8B008B'
            this.canvasLastYearEdits.beginPath()
            this.canvasLastYearEdits.moveTo(5,120)
            this.canvasLastYearEdits.lineTo(60,120);
            this.canvasLastYearEdits.stroke()
        }
    },
    watch:{
        lastYearEdit:{
            handler: function(){
                if(this.lastYearEdit){
                    console.log("hell")
                    this.displayLegendLastYearEdits()
                }
            },
            immediate: true
        },
    },
    computed:{
        lastYearEdit:{
            get(){
                console.log(this.$store.state.isLastYearEdits)
                return this.$store.state.isLastYearEdits
            },
            set(bool){
                this.$store.commit('setIsLastYearEdits', bool)
            }
      },
      isLegend:{
            get(){
                console.log(this.$store.state.isLegend)
                return this.$store.state.isLegend
            },
            set(bool){
                this.$store.commit('setIsLegend', bool)
            }
      },
    }
}
</script>

<style scoped>
    #legend{
        position: relative;
        left: .7rem;
    }
    .editRdTitle{
        background: #14375A;
        color:white;
        height: 30px;
        text-align: left;
        top: 10%;
        width: 100%;
        left: 100%;
        font-size: 16px;
    }
    #add{
        position: absolute;
        top: 32%;
        left: 55%;
    }
    #edit{
        position: absolute;
        top: 55%;
        left: 55%;
    }
    #delete{
        position: absolute;
        top: 79%;
        left: 55%;
    }
    .editType{
        font-size: .8rem;
        padding: 0%;
        bottom: 1rem;
        position: relative;
        text-align: left;
    }
    #legendPos{
        position: absolute; 
        bottom: 8%; 
        right: 2%; 
        width: 10.5rem; 
        height: 8rem;
    }
    /* #legendPos1{
        position: absolute; 
        bottom: 25%; 
        right: 2%; 
        width: 10.5rem; 
        height: 8rem;
    } */
    #legendTitleTxt{
        position:absolute; 
        top: 0.5%; 
        left: 5%
    }
    .legend-tooltips{
        position: relative;
        background-color: black;
        bottom: 2.5rem;
        width: 0rem;
        font-size: 1.2rem;
    }
    .v-tooltip__content{
        border-radius: 0px !important;
        width: 15rem;
    }   
</style>