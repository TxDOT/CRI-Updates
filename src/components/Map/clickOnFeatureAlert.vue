<template>
    <div>
        <v-card id="deny">
            <v-card-title class="surfaceTitle" >
                <v-card-text style="bottom:30px; position:relative; font-size: 15px; text-align: left; right: 17px">
                    <v-icon color="red">mdi-alert-circle</v-icon>
                    Cannot Select Road
                </v-card-text>
            </v-card-title>
            <v-card-text style="text-align:left; padding-top: 10px;">
                Please save your work in the stepper, to edit the selected road.
            </v-card-text>
            <v-btn tile @click="setDenyFalse()" style="poistion:relative;" plain outlined color="#204E70"><u>close</u></v-btn>
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
    methods:{
        setDenyFalse(){
            this.denyFeature = false
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
#deny{
    position: relative;
    top: 200px;
    width: 300px;
    left: 800px;
    height: 150px;
    border-radius: 0px;
}
.surfaceTitle{
  background-color: #204E70;
  color: #E64545;
  height:30px;
  width: 100%;
  font-size: 25px; 
}

</style>