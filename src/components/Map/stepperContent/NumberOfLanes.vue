<template>
    <v-card :disabled="graphic ? disabled : ''"><v-select v-model="numberLane" :items="lanes" label="Number of Lanes" outlined filled></v-select>
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
      numberLane:{
        get(){
          return this.$store.state.numberLane
        }
      },
    }
}
</script>