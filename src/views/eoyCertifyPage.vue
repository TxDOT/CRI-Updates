<template>
        <v-card height="700">
            <div><img src="../assets/darrelBarrel.gif">
            <p><br>Whoa, hold on...
            <br><br>The County Road Inventory Map is closed following the August 31st deadline
                    while we transition to the next data year.<br><br>
                    The map will reopen on September 15th.
                    <br><br>
                Thank You!
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
p{
    position: relative;
    bottom: 1.5rem;
    font-size: 20px;
    text-align: left;
    padding-left: 30%;
    padding-right: 30%;
}

div{
    align-items: center;
}

</style>