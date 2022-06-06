<template>
    <div>
        <v-alert type="success" dismissible v-if="sendAssetCoverage" height="44" dense outlined>
            This asset covers the full length of the road
        </v-alert>
        <v-alert type="error" dismissible v-if="!sendAssetCoverage" height="50" dense outlined>
            The provided assets are either too short or too long for the road.
        </v-alert>
    </div>
   
</template>
<script>

export default {
    components: {},
    name: 'assetAlert',
    data(){
      return{

      }
    },
    watch:{
      sendAssetCoverage:{
        handler: function(){
            console.log(this.sendAssetCoverage)
        },
        immediate: true,
      },
    },
    computed:{
        sendAssetCoverage:{
          get(){
            return this.$store.state.assetCoverage
          },
          set(assetDfos){
            this.$store.commit('setAssetCoverage',assetDfos)
          }
        }
    }
}
</script>

<style lang="scss" scoped>

@import '~vuetify/src/components/VAlert/_variables.scss';
$alert-font-size: 13px;
@import "~vuetify/src/components/VAlert/VAlert.sass";

</style>
