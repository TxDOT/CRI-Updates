<template>
    <div>
        <v-alert type="success" v-if="sendAssetCoverage" height="44" dense outlined>
            This asset covers the full length of the road
        </v-alert>
        <v-alert type="error" color="#E64545" v-if="!sendAssetCoverage" height="50" dense outlined>
        
          <!-- <v-tooltip top>
            <template v-slot: activator="{on, attr}">
              <v-icon v-bind="attrs" v-on="on">mdi-help-circle</v-icon>
            </template>
            <span>This is a test</span>
          </v-tooltip> -->
            The provided assets are either too short or too long for the road.
            <v-tooltip bottom color="error" left nudge-right="120" nudge-top="50" max-width="130">
              <template v-slot:activator="{ on, attrs }">
                <v-icon v-bind="attrs" v-on="on" right style="poistion: absolute; left:132px; bottom: 31px;">mdi-help-circle</v-icon>
              </template>
              <span>Check Assest are full length. If you modified the geometry of the road, please review the assets.</span>
            </v-tooltip>
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
