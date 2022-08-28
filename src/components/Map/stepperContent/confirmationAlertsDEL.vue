<template>
    <div>
        <v-alert type="warning" prominent border="left" dense style="top: 24px; width:550px; left: 40%; text-align: left; border-radius: 0px;">
            {{roadName[0].streetName}} {{roadName[0].streetType !== 'NOT APPLICABLE' ? roadName[0].streetType : null}} has been marked as deleted
        </v-alert>
    </div>
    

    <!-- <v-card style="top: 330px; left: 730px; width: 330px;border: black solid 2px;">
        <v-card-title class="confirmationTitle">Road Deleted</v-card-title>
        <v-card-text><b>{{roadName[0].streetName}} {{roadName[0].streetType}} has been marked as deleted</b></v-card-text>
    </v-card> -->
</template>

<script>

export default {
    components: {},
    name: 'confirmationAlert',
    // data(){
    //   return{
        
    //   }
    // },
    methods:{
        
    },
    watch:{
       
    },
    computed:{
        roadName:{
            get(){
                return JSON.parse(this.$store.state.roadbedName)
            }
        },
    }
}
</script>
<style scoped>
</style>