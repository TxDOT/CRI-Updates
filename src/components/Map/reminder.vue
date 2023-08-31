<template>
    <v-alert :type="getColor === '#c55a11' ? 'warning' : ''" border="left" :color="getColor" id="eoeWarning" tile dense dismissible>
        <p v-if="getColor === '#c55a11'"><b>IMPORTANT:</b> <u>Submit and Certify</u> edits by the August 31 deadline.</p>
        <p v-else><b>Notice:</b> Submissions for 2023 closed on August 31st.  We're processing your updates now.  You may continue to make updates up to August 31, 2024 for next year's submission.</p>
    </v-alert>
</template>
<script>
export default {
    name: "eoeWarning",
    data() {
        return{
            getColor: null,
            getText: "",
            
        }
    },

    mounted(){
        const date = new Date();
        const month = date.getMonth() + 1;
        const day = date.getDate();

        if(month === 8 && day >= 21){
            this.getColor = "#c55a11"
        }

        else if(month < 8 || month >= 9 ){
            this.getColor = "#207f74"
        }
    }

}
</script>
<style scoped>
    #eoeWarning{
        position: relative;
        width: 36rem;
        left: 36vw;
        bottom:.8rem;
        text-align: left;
        color: white;
    }
</style>