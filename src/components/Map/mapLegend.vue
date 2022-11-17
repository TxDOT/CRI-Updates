<!-- Legend component -->
<template >
    <v-card style="position: absolute; bottom: 8%; right: 2%; width: 10.5rem; height: 8rem;" tile>
        <v-card-title class="editRdTitle"><p style="position:absolute; top: 0.5%; left: 5%">Edit Types</p></v-card-title>
        <canvas id="legend" width="190" height="150" style="position: absolute; left: 5%;"></canvas>
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
        let canvas = document.getElementById('legend')
        this.canvas = canvas.getContext('2d')

        this.canvas.strokeStyle = '#27D83E'
        this.canvas.setLineDash([8, 6]);
        this.canvas.lineWidth = 3.5
        this.canvas.lineCap = 'round'

        this.canvas.lineDashOffset = 4
        this.canvas.beginPath()
        this.canvas.moveTo(1,20)
        this.canvas.lineTo(60, 20);
        this.canvas.stroke()

        this.canvas.strokeStyle = '#F8A307'
        this.canvas.beginPath()
        this.canvas.moveTo(1,50)
        this.canvas.lineTo(60, 50);
        this.canvas.stroke()
        
        this.canvas.strokeStyle = '#E32636'
        this.canvas.beginPath()
        this.canvas.moveTo(1,80)
        this.canvas.lineTo(60,80);
        this.canvas.stroke()
    }
}
</script>

<style scoped>
    #legend{
        position: relative;
        right: .5rem;
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
    }
</style>