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
          toggleCard: false
      }
    },
    watch:{
        returnStep:{
        handler: function(){
            console.log(this.returnStep)
         if(this.returnStep > 1 && this.steppClose === true){
             this.toggleCard = true
         }
        },
        immediate: true,
      },
    },
    computed:{
        returnStep:{
          get(){
            return this.$store.state.stepNumber
          },
          set(x){
            this.$store.commit('setStepNumber',x)
          }
        },
        steppClose:{
            get(){
                return this.$store.state.stepperClose
            },
            set(open){
                this.$store.commit('setStepperClose', open)
            }
        },
    }
}
</script>

<style scoped>


</style>