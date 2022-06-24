<template>
    <v-alert type="success" prominent border="left" style="height: 80px; top: 40px; width:350px; left: 40%; text-indent: 3px;">SUCCESS!</v-alert>
    <!-- <v-card style="top: 330px; left: 730px; width: 330px;border: black solid 2px;">
        <v-card-title class="confirmationTitle">Road Deleted</v-card-title>
        <v-card-text><b>{{roadName[0].streetName}} {{roadName[0].streetType}} has been marked as deleted</b></v-card-text>
    </v-card> -->
</template>

<script>

export default {
    components: {},
    name: 'confirmAlertSuccess',
    // data(){
    //   return{
        
    //   }
    // },
    methods:{
        
    },
    watch:{
       
    },
    computed:{
    }
}
</script>
<style scoped>
.confirmationTitle{
    background: #15648C;
    color:white;
    font-size: 16px;
    height: 40px;
    padding-left: 25px;
    padding-top: 1%;
    text-align: justify;
    top: 10%;
    width: 100%;
    left: 100%;
} 
</style>