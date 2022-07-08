<template>
    <div>
        <v-alert type="success" v-if="isAssetCoverage" height="44" dense outlined>
            This asset covers the full length of the road
        </v-alert>
        <v-alert type="error" color="#E64545" v-if="!isAssetCoverage" height="50" dense outlined>
        
          <!-- <v-tooltip top>
            <template v-slot: activator="{on, attr}">
              <v-icon v-bind="attrs" v-on="on">mdi-help-circle</v-icon>
            </template>
            <span>This is a test</span>
          </v-tooltip> -->
            <p style="text-align: left;" v-if="shortLong === 'short' || shortLong==='long'">The provided assets is {{shortLong}}, Asset ends at {{dfoValue}}, but ending mile for road is {{lineEndValue}}.</p>
            <p style="text-align: left;" v-if="shortLong === 'gap' || shortLong === 'overlap'"> An {{shortLong}} has been detected. Refer to asset with ending value of <u>{{dfoValue}}</u></p>
            <v-tooltip bottom color="error" left nudge-right="120" nudge-top="50" max-width="130">
              <template v-slot:activator="{ on, attrs }">
                <v-icon v-bind="attrs" v-on="on" right style="poistion: absolute; left:158px; bottom: 65px;">mdi-help-circle</v-icon>
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
        isAssetCoverage: null,
        shortLong: '',
        gapOverlap: '',
        dfoValue: 0,
        lineEndValue: 0
      }
    },
    methods:{
      reset(){
        this.isAssetCoverage = false,
        this.shortLong = '',
        this.gapOverlap = '',
        this.dfoValue = 0,
        this.lineEndValue = 0
      },
    },
    watch:{
      sendAssetCoverage:{
        handler: function(){
          if(this.sendAssetCoverage){
          this.reset();
          this.isAssetCoverage = this.sendAssetCoverage[0]
          this.shortLong = this.sendAssetCoverage[1]
          this.dfoValue = this.sendAssetCoverage[2]
          this.lineEndValue = this.sendAssetCoverage[3]  
          }
        },
        immediate: true,
      },
    },
    computed:{
        sendAssetCoverage:{
          get(){
            let a;
            if(this.$store.state.assetCoverage){
              a = this.$store.state.assetCoverage
            }
            return a;
           
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
