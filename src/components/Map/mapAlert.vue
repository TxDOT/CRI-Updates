<template>
    <v-alert type="success" dismissible>
        Click on the Map to start Drawing!
    </v-alert>
</template>

<script>
    export default {
    name: 'alert',
    data (){
      return {
        display: this.alertStatus
      }
    },
    watch:{
        display(){
          this.display = this.alertStatus
        }
    }
  }
</script>