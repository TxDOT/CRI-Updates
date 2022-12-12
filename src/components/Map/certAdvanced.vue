<template><!-- update -->
    <v-card id="tutorialTitle" width="560" height="flex" tile>
        <v-card-title class="cardTitle"><p id="titleText">You Are Not Worthy</p></v-card-title>

        <v-card-text id="cardTxt" class="textSymb" v-for="i in requiredFields" :key="i">{{i}}
        </v-card-text>
        <div id="idSelect">
            <v-select  class="textSymb" v-for="i in userCertDisplay" :key="i" :items="userCertDisplay">{{i}}
            </v-select>
        </div>

        <!-- <v-btn id="trainingBtn" :href="emailTag" tile outlined color="#14375A" @click="close()">Request Training</v-btn> -->
    </v-card> 
</template>

<script>

export default {
    name: 'isCertAdvanced',
    data(){
        return{
            display: false,
            requiredFields: ['EDIT_TYPE', 'GID', 'Id', 'ST_DEFN'],
            userCertDisplay: ["FID", "EDIT_ID", "TASK_ID", "EDIT_TYPE_"],
        }
    },
    methods:{
        close(){
            this.isMapAttr = false
        }
    },
    watch:{
        isMapAttr:{
            handler: function(){
                this.display = this.isMapAttr
            },
            immediate: true
        }
    },
    computed:{
        isMapAttr:{
            get(){
                return this.$store.state.isMapAttr
            },
            set(bool){
                this.$store.commit('setIsMapAttr',bool)
            }
        },
    }

}
</script>

<style scoped>
    #trainingBtn{
        bottom: .5rem;
        left: 4rem;
        text-decoration: underline;
    }
    #tutorialTitle{
        position:absolute;
        left:50%;
        top: 40%;
    }
    #titleText{
        position: relative;
        bottom: .7rem;
    }
    #cardTxt{
        position: relative;
        top: 1rem;
    }
    #idSelect{
        position:absolute;
        top: 1rem;
        left: 19rem;
    }
</style>