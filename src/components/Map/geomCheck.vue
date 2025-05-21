<!-- geometry checks to display road length and overlaps -->
<template>
    <v-card id="cardPlacement" tile v-if="display">
        <v-card-title class="editRdTitle"><p id="cardTitle">Edit Error</p></v-card-title>
        <v-card-text id="cardTxt">{{geomChecks}}</v-card-text>
    </v-card>
</template>

<script>


export default {
    name: "geomCheck",
    data() {
        return{
            display: false,
            geomChecks: ''
        }
    },
    methods:{
        closeCheck(){
            this.display = false
        }
    },
    watch:{
        isGeomCheck:{
            handler: function(){
                if(this.isGeomCheck > 0){
                    this.isGeomCheck === 1 ? this.geomChecks = 'Roads must be a minimum of .007 miles long. Please edit the road to be longer than .007 miles, or discard the edit.': this.geomChecks = 'Roads must not intersect themselves. Please edit the road so that it does not intersect itself.'
                    this.display = true
                    return;
                }
                this.display = false                
            },
            immediate: true
        }
    },
    computed:{
        isGeomCheck:{
            get(){
                return this.$store.state.geomCheck
            },
            set(check){
                this.$store.commit('setGeomCheck', check)
            }
        }
    }
}
</script>

<style scoped>
    .editRdTitle{
        background: #0056a9;
        color:white;
        height: 40px;
        text-align: left;
        top: 10%;
        width: 100%;
        left: 100%;
    }
    #loginButton{
        position: absolute;
        top: 7.2rem;
        left: 14rem;
    }
    #cardPlacement{
        width: 20rem;
        height: 10rem;
        z-index: 1;
        position: absolute; 
        left: 40vw; 
        top: 200px;
        z-index: 2;
    }
    #cardTitle{
        position:absolute;
        top: 2.5%;
        left: 4%
    }
    #cardTxt{
        position: relative;
        color:black;
        text-align: left;
        padding-left: 4.5%;
        top:15%;
    }
</style>