//geometry checks to display road length and overlaps
<template >
    <v-card style="position: relative; top: 2rem; left: 54rem; width: 20rem; height: 10rem;" tile v-if="display">
        <v-card-title class="editRdTitle"><p style="position:absolute; top: 2.5%; left: 4%">Edit Error</p></v-card-title>
        <v-card-text style="position: relative; color:black; text-align: left; padding-left: 4.5%; top:15%;">{{geomChecks}}</v-card-text>
        <!-- <v-btn outlined tile color="#14375A" id="loginButton" @click="closeCheck()"><u>Close</u></v-btn> -->
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
        background: #14375A;
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
</style>