<template>
    <v-card><v-select v-model="roadDesign" :items="design" label="Design" outlined filled :disabled="graphic ? disabled : ''"></v-select>
    </v-card>
</template>

<script>

export default {
    components: {},
    name: 'roadDesign',
    data(){
      return{
        design: ['One Way', 'Two-way', 'Boulevard'],
        emptyValues:[v => !!v || 'Road Name is required'],
        graphic: true
      }
    },
  
    computed:{
      roadDesign:{
        get(){
          return this.$store.state.roadbedDesign
        }
      },
    }
}
</script>