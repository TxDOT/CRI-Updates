<!-- Legend component -->
<template >
    
        <v-card tile class="legend-box">
            <v-card-title class="editRdTitle"><p id="legendTitleTxt">Edit Types</p></v-card-title>
            <canvas id="legend-edit-type" width="190" height="150"></canvas>
            <div id="add">
                <v-card-text class="editType">Add Road</v-card-text>
            </div>
            <div id="edit">
                <v-card-text class="editType">Edit Road</v-card-text>
            </div>
            <div id="delete">
                <v-card-text class="editType">Delete Road</v-card-text>
            </div>
        </v-card>

</template>

<script>



export default {
    name: "Legend",
    data() {
        return{
            canvas: null,
            display: false
        }
    },
    mounted(){
            let canvasT = document.getElementById('legend-edit-type')
            this.canvas = canvasT.getContext('2d')

            this.canvas.strokeStyle = '#27D83E'
            this.canvas.setLineDash([8, 6]);
            this.canvas.lineWidth = 3.5
            this.canvas.lineCap = 'round'

            this.canvas.lineDashOffset = 4
            this.canvas.beginPath()
            this.canvas.moveTo(1,30)
            this.canvas.lineTo(60, 30);
            this.canvas.stroke()

            this.canvas.strokeStyle = '#F8A307'
            this.canvas.beginPath()
            this.canvas.moveTo(1,75)
            this.canvas.lineTo(60, 75);
            this.canvas.stroke()
            
            this.canvas.strokeStyle = '#E32636'
            this.canvas.beginPath()
            this.canvas.moveTo(1,120)
            this.canvas.lineTo(60,120);
            this.canvas.stroke()

       
    },
    methods:{

    },
    watch:{

    },
    computed:{
        lastYearEdit:{
            get(){
                return this.$store.state.isLastYearEdits
            },
            set(bool){
                this.$store.commit('setIsLastYearEdits', bool)
            }
      },
      isLegend:{
            get(){
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
        bottom: .5rem;
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
</style>