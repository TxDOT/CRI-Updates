//map component
<template>
    <div id="viewDiv" class="main"></div>
</template>

<script>

export default {
    name: 'Map',
    data(){
        return{
            stepper: false,
            addButton: "add Road",
            previousTotal: 0,
            lineLength: {},
            newMiles: '',
            modifyLine: 0,
            alert:''
        }
    },
    async mounted() {
        const app = await import('../Map/map');
        app.initialize(this.$el);
    },

};
</script>

<style scoped>

.main{
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
}
.mileInfo{
    background: gray;
    position: absolute;
    width: 100%;
    height: 10px;
    right: 0%;
    top: 95%;
}

#step{
    position: fixed;
    width: 0;
    left: 0%;
    top: 10%;
    transition: 0.5s;
    z-index: 1
}

#delBtn{
    position: absolute;
    width: auto;
    height: auto;
    top: 30px;
    right: 45%; 
}
#Recertify{
    position: absolute;
    width: auto;
    height: auto;
    top: 30px;
    right: 5%; 
}
.banner{
    position: absolute;
    width: 100%;
    height: 0;
    top: 0;
    left: 0;
}

/* .footer{
    position: absolute;
    width: 100%;
    height: 100%;
    top: 0;
    right: 600px;
} */
</style>
//I think these can be applied in the app.vue
<style>
    .esri-basemap-toggle__container, .esri-basemap-toggle__image {
        width: 32px;
        height: 32px;
        position: absolute;
        top: 0;
        left: 0;
        overflow: hidden;
    }
    .esri-basemap-toggle__image--secondary {
        margin-top: 0px;
        margin-left: 0px;
    }
    .esri-basemap-toggle {
        cursor: pointer;
        position: relative;
        overflow: visible;
        width: 33px;
        height: 30px;
        background-color: transparent;
        box-shadow: none;
        display: flex;
        flex-flow: row nowrap;
        justify-content: center;
        align-items: center;
    }
    .esri-scale-bar.esri-widget{
        position: relative;
        top:93.5%;
        left: 89%;
    }
</style>