<template>
    <v-card :disabled="graphic ? disabled : ''"><v-select v-model="numLane" :items="lanes" label="Number of Lanes" outlined filled></v-select>
    </v-card>
</template>

<script>

export default {
    components: {},
    name: 'numOfLane',
    data(){
      return{
        lanes:[1,2,3,4,5,6],
        graphic: false
      }
    },
    computed:{
      numLane:{
        get(){
          return this.$store.state.numLane
        }
      },
    }
}
</script>