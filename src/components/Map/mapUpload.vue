//not needed at the moment
<!-- <template>
    <v-card id="mapValue">
        <v-card-title>Map Values</v-card-title>
        <v-card-text  style="width: 100%;" v-for="i in txdotMapK" :key="i" id="txdotKey">
            <v-row>{{i}}<div id="dropdwn"><v-autocomplete outlined dense :items="txdotMapV" @change="changeValue($event,i)"></v-autocomplete></div></v-row>
        </v-card-text>
    </v-card>
</template>
<script>
export default {
    name: 'mapValues',
    data() {
        return{
            txdotMapK: ['editType', 'gid', 'objectid', 'roadbedName', 'roadbedDesign','roadbedSurface', 'numLane'],
            txdotMapV: '',
            mapValue: ''
        }
    },
    methods:{
        processData(event){
            this.mapValue = event
        },
        changeValue(e,x){
            console.log(x,e)
        }
    },
    watch:{
        returnFieldNames:{
            handler: function(){
                this.txdotMapV = this.returnFieldNames
                this.dragDropClick = false
            },
            immediate: true
        }

    },
    computed:{
        returnFieldNames:{
            get(){
                console.log
                return this.$store.state.uploadFields
            }
        },
        dragDropClick:{
            get(){
                return this.$store.state.isDragDrop
            },
            set(isBool){
                this.$store.commit('setIsDragDrop', isBool)
            }
      },

    }

}
</script>

<style scoped>
#mapValue{
    width: 35rem;
    position: absolute;
    top: 15%;
    left: 35%;
    padding: none;
}
#txdotKey{
    position: relative;
    text-align: left;
    line-height: 2rem;
    padding: 2rem;
}
#dropdwn{
    position: absolute;
    width: 30%;
    left: 22rem;
    top: 0rem;
    padding: 1rem;
}
</style> -->
