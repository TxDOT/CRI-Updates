<!-- displays when a road has been deleted -->
<template>
    <div>
        <v-alert type="warning" prominent border="left" dense style="top: 24px; width:550px; left: 40%; text-align: left; border-radius: 0px;">
            {{roadName[0].streetName}} {{roadName[0].streetType !== 'NOT APPLICABLE' ? roadName[0].streetType : null}} has been marked as deleted
        </v-alert>
    </div>
</template>

<script>

export default {
    components: {},
    name: 'confirmationAlert',
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