<template>
    <v-card id="showVideo" tile v-if="showVideo">
        <v-card-text>
            <span style="color: white;">
                Watch a short video about how to {{ editType }} a road.
            </span>
            <v-btn block tile id="watchBtn" depressed text @click="watchVideo()">watch now</v-btn>
        </v-card-text>
    </v-card>
</template>

<script>

    export default{
        name: "editingVideo",
        data(){
            return{
                youtubeUrl: "https://www.youtube.com/watch?v=3xTr7q4Cno4&list=PLyLWQADRroOUeiQ8sXX3JMVQeu87sgig2&index=6",
                edit: false,
                videoEvtLis: false,
                editType: "delete"
            }
        },
        mounted(){
            // setTimeout(()=>{
            //     this.showVideo = false
            // }, 2000)
        },
        methods:{
            watchVideo(){
                window.open(this.youtubeUrl, "_blank")
                return
            },
        },
        
        watch:{
            editStatus:{
                handler: function(){
                    if(this.editStatus){
                        this.editType = "edit"
                        this.youtubeUrl = "https://www.youtube.com/watch?v=qy5At3NOTpg&list=PLyLWQADRroOUeiQ8sXX3JMVQeu87sgig2&index=5"
                        return
                    }
                },
                immediate: true
            },
            deleteRoad:{
                handler: function(){
                    if(this.deleteRoad){
                        this.editType = "delete"
                        this.youtubeUrl = "https://www.youtube.com/watch?v=3xTr7q4Cno4&list=PLyLWQADRroOUeiQ8sXX3JMVQeu87sgig2&index=6"
                        return
                    }
                },
                immediate: true
            },
            addRdBoolean:{
                handler: function(){
                    if(this.addRdBoolean){
                        this.editType = "add"
                        this.youtubeUrl = "https://www.youtube.com/watch?v=5W8jGqaOyXc&list=PLyLWQADRroOUeiQ8sXX3JMVQeu87sgig2&index=7"
                        return
                    }
                },
                immediate: true
            },
            typeEdit:{
                handler: function(){
                        this.editType = this.typeEdit[0]
                        this.youtubeUrl = this.typeEdit[1]
                        return
                },
                immediate: true
            },

        },
        computed:{

            deleteRoad:{
                get(){
                    return this.$store.state.deleteRd
                }
            },
            addRdBoolean:{
                get(){
                    return this.$store.state.addRd
                }
            },
            showVideo:{
                get(){
                    return this.$store.state.showVideo
                },
                set(bool){
                    this.$store.commit('setIsShowVideo', bool)
                }
            },
            editStatus:{
                get(){
                    return this.$store.state.editExisting
                },
            },
            typeEdit:{
                get(){
                    return this.$store.state.editType
                },
            },
        }
    }
</script>

<style scoped>
    #showVideo{
        position: absolute;
        background-color: #204E70;
        width: 20rem;
        top: 5rem;
        left: calc(500px + 13rem);
        color: white;
        z-index: 9999;
    }
    #watchBtn{
        color: white;
        border: 1px solid white;
    }
</style>