<template>
    <div>
        <v-alert type="success" v-if="isAssetCoverage" height="44" dense outlined style="text-align: left; border-radius: 0px;">
            This asset covers the full length of the road
        </v-alert>
        <v-alert type="error" color="#E64545" v-if="!isAssetCoverage" height="60" dense outlined style="border-radius: 0px;">
        
          <!-- <v-tooltip top>
            <template v-slot: activator="{on, attr}">
              <v-icon v-bind="attrs" v-on="on">mdi-help-circle</v-icon>
            </template>
            <span>This is a test</span>
          </v-tooltip> -->
            <p class="assetAlert" v-if="shortLong === 'short'">The provided assets is {{shortLong.toUpperCase()}} - asset ends at <u>{{dfoValue}}</u> but ending mile for road is <u>{{lineEndValue}}</u></p>
            <p class="assetAlert" v-if="shortLong==='long'">An asset is covering a portion of this road to the end <u>{{dfoValue}}</u> but additional assets are missing</p>
            <p class="assetAlert" v-if="shortLong === 'gap' || shortLong === 'overlap'"> An {{shortLong.toUpperCase()}} detected - refer to asset with ending value of <u>{{dfoValue}}</u></p>
            <v-tooltip bottom color="error" left nudge-right="120" nudge-top="50" max-width="130">
              <template v-slot:activator="{ on, attrs }">
                <v-icon v-bind="attrs" v-on="on" right style="position: absolute; left:91%; bottom: 50%;">mdi-help-circle</v-icon>
              </template>
              <span>Assets must cover the full length of the route and must not have gaps or overlaps</span>
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

.assetAlert{
  border-radius: 0px;
  text-align: left;
  margin-right: 15px;
}

</style>
