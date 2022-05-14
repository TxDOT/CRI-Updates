<!-- <template>
    <v-alert v-model="display" type="success" dismissible @click="display = false">
        Click on the Map to start Drawing!
    </v-alert>
</template>

<script>
    export default {
    name: 'alert',
    data (){
      return {
        display: this.display()
      }
    },
    watch:{
        display(){
            console.log(this.display)
            this.display = this.alertStatus
        }
    },
    computed:{
        alertStatus:{
            get(){
                console.log(this.$store.state.alertDisplay)
                return this.$store.state.alertDisplay
            },
            set(status){
                console.log(status)
                this.$store.commit('setAlertDisplay',status)
            }
        }
    }
  }
</script> -->