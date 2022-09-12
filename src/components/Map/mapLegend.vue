<template >
    <v-card style="position: absolute; bottom: 8%; right: 2%; width: 15rem; height: 10rem;" tile>
        <v-card-title class="editRdTitle"><p style="position:absolute; top: 2.5%; left: 5%">Legend</p></v-card-title>
        <canvas id="legend" width="190" height="150" style="position: absolute; right: 16%;"></canvas>
        <div id="add">
            <v-card-text>Add Road</v-card-text>
        </div>
        <div id="edit">
            <v-card-text>Edit Road</v-card-text>
        </div>
        <div id="delete">
            <v-card-text>Delete Road</v-card-text>
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
        this.canvas.lineTo(80, 20);
        this.canvas.stroke()

        this.canvas.strokeStyle = '#F8A307'
        this.canvas.beginPath()
        this.canvas.moveTo(1,60)
        this.canvas.lineTo(80, 60);
        this.canvas.stroke()
        
        this.canvas.strokeStyle = '#E32636'
        this.canvas.beginPath()
        this.canvas.moveTo(1,100)
        this.canvas.lineTo(80,100);
        this.canvas.stroke()
    }
}
</script>

<style scoped>
    #legend{
        position: relative;
        /* border: 1px solid grey; */
        right: .5rem;
    }
    .editRdTitle{
        background: #14375A;
        color:white;
        height: 40px;
        text-align: left;
        top: 10%;
        width: 100%;
        left: 100%;
    }
    #add{
        position: absolute;
        top: 22%;
        left: 50%;
    }
    #edit{
        position: absolute;
        top: 47%;
        left: 50%;
    }
    #delete{
        position: absolute;
        top: 72%;
        left: 50%;
    }
</style>