<template>
    <div>
        <v-card type="error" dismissible v-model="toggleCard" height="50" outlined>
            To Edit the select road, please save work in the stepper.
            <v-btn @click="toggleCard = false">close</v-btn>
        </v-card>
    </div>
   
</template>
<script>

export default {
    components: {},
    name: 'denyClickFeat',
    data(){
      return{
      }
    },
    computed:{
        denyFeature:{
            get(){
                return this.$store.state.denyFeatClick
            },
            set(deny){
                this.$store.commit('setdenyFeatClick', deny)
            }
        }
    }

}
</script>


<style scoped>


</style>