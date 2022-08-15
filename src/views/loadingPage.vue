<template>
    <loader/>
    <!-- <v-skeleton-loader type="list-item, card" :loading="loading">

    </v-skeleton-loader> -->
</template>
<script>

import loader from '../components/Map/loader.vue'
export default {
    components:{loader},
    name: 'Loading',
    data(){
        return{
            loading: true
        }
    }
}
</script>