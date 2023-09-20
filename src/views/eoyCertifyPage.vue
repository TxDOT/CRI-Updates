<template>
        <v-card height="700">
            <div><img src="../assets/darrelBarrel.gif">
            <p><br><br>Howdy!
            <br><br>Are you trying to make edits? Well unfortunently, you cannot make edits as the Judge has certified the edits and it is passed August 31st.
            Better luck next time!<br><br>
                - Darrel aka Darrel the Barrel
            </p>

            </div>
        </v-card>
        
        
</template>

<script>

export default {
    name: "EoyDataProcessing",
    data(){
        return{

        }
    },
    beforeRouteLeave(to, from, next){
        to, from
        next(false)
    },
    mounted(){

    },

    watch:{

    }
}
</script>
<style scoped>
</style>