<template>
    <v-skeleton-loader type="list-item" :loading="loading">

    </v-skeleton-loader>
</template>
<script>
export default {
    name: 'Loading',
    data(){
        return{
            loading: true
        }
    }
}
</script>