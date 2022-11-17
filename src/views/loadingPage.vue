<!-- loader component -->
<template>
    <loader/>
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