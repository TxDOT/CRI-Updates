<template>
    <div :style="currentPos" v-if="hideCycle">
        <div class="arrow-right" :style="arrowChange[currIndex - 1] ? arrowChange[currIndex - 1] : arrowChange[currIndex]" v-if="currIndex > 0"></div>
        <v-card style="position: relative; width: 13rem; right: 0px;" color="#14375a" tile>
            <v-card-text v-html="posText[currIndex].txt" style="text-align: left; color: white; width: 100%; padding: 15px;"></v-card-text>
            <div style="display: flex; flex-direction: row;">
                <v-btn @click="closeProcess()" color="white" class="btn" text tile>Exit</v-btn>
                <v-btn @click="returnPos(currIndex += 1)" color="white" class="btn" text tile style="border: 1px white solid;">{{ this.currIndex !== 5 ? nextValue : otherValue }}</v-btn>
            </div>
            
        </v-card>
    </div>
</template>

<script>
export default{
    name: "cycleIntro",
    data(){
        return{
            pos: [{'position' :'absolute','bottom': '38vh', 'left': '0px', 'width': 'fit-content', 'float': 'right'}, {'position' :'absolute','left': '231px', 'width': 'fit-content', 'float': 'none', 'top': '98px'}, {'position':'absolute', 'bottom': '62.5px', 'left': '62rem', 'width': 'fit-content'}, {'position' :'absolute','top': '58px', 'right': '124px', 'width': 'fit-content'}, {'position' :'absolute','top': '59px', 'right': '13px', 'width': 'fit-content'}, {'position' :'absolute','bottom': '81px', 'left': '231px', 'width': 'fit-content'}, {'position' :'absolute','bottom': '7rem', 'left': '14rem', 'width': 'fit-content'}],
            currentPos: {'position' :'absolute','bottom': '38vh', 'right': '59px', 'width': 'fit-content', 'float': 'right'},
            currIndex: 0,
            posText: [{txt: "<p>The map opens to your county with your roads highlighted in blue. Only your county roads are editable.</p>"}, {txt: "<p>Select one of these options to begin editing. Or select a road from the map.</p>"},
                      {txt: "<p>Keep track of changes in mileage here.</p>"}, {txt: "<p>To save your changes and return later to resume editing. Click here.</p>"}, {txt: "<p>Once you're finished editing, be sure to click 'Submit & Certify'. This generates an email to the county judge for their certification.</p> <p>Note: edits that are not certified by the county judge will not be accepted by TxDOT.</p>"},
                      {txt: "<p>For additional help and training, including training videos and scheduled training sessions, click here.</p>"}
            ],
            arrowChange: [{'top': '40px', 'right': '22px', 'transform': 'rotate(270deg)'}, {'top': '153px', 'left': '32px', 'transform': 'rotate(180deg)'}, {'top': '0px', 'left': '79px', 'transform': 'rotate(0deg)'}, {'top': '0px', 'left': '79px', 'transform': 'rotate(0deg)'}, {'top': '40px', 'right': '22px', 'transform': 'rotate(270deg)'}],
            hideCycle: true,
            nextValue: "GOT IT",
            otherValue: "FINISH"
        }
    },
    mounted(){
        this.currIndex = 0
    },
    methods:{
        returnPos(index){
            this.currentPos = this.pos[index]
            if(this.currIndex > 5){
                this.isTours = false
            }
            return
        },
        closeProcess(){
            
            this.isTours = false
        }
    },
    watch:{
        isTours:{
            handler: function(){
                console.log(this.isTours)
                this.hideCycle = this.isTours
            }
        }
    },
    computed:{
        isTours:{
            get(){
                console.log(this.$store.state.isTour)
                return this.$store.state.isTour
            },
            set(bool){
                this.$store.commit("setShowTour", bool)
            }
        },
    }
}
</script>

<style scoped>
    .arrow-right{
        position: relative;
        height: 0;
        width: 0;
        border-style: solid;
        border-width: 0 10px 25px 10px;
        border-color: transparent transparent #14375a transparent;
        z-index: 9999;
    }
    .btn{
        margin-right: 40px;
        bottom: 10px;
    }
</style>