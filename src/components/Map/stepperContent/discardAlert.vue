<!-- displays when a user removes an already saved edit -->
<template>
    <div>
        <v-alert type="warning" prominent border="left" dense style="position:fixed; top: 3.5rem; width:17rem; left: 50%; text-align: left; border-radius: 0px;">
            Edit has been removed.
        </v-alert>
    </div>

</template>

<script>

export default {
    components: {},
    name: 'sketchAlert',
    methods:{
        
    },
    watch:{
       
    },
    computed:{
    }
}
</script>
<style scoped>
</style>