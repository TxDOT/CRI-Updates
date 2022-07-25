<template>
    <div id="dfoBox">
        <v-card outlined height="55" tile style="border-color: #15648C;">
            <v-card-text>Miles: {{dfo.toFixed(3)}}</v-card-text>
        </v-card>
    </div>
</template>
<script>
//import { mouseHoverDfoDisplay, returnDFO } from '../editFunc'
export default{
    name: 'dfoBox',
    data(){
        return{
            dfo: 0
        }
    },
    watch:{
        returnDFOValue:{
            handler: function(){
                if(this.returnDFOValue){
                    this.dfo = Number(this.returnDFOValue)
                }
            },
            immediate: true
        }
    },
    computed:{
        returnDFOValue:{
            get(){
                return this.$store.state.dfoReturn
            },
            set(x){
                this.$store.commit('setDfoReturn', x)
            }
        },
    }

}
</script>
