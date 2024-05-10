<template>
    <v-card id="showVideo" tile v-if="showVideo">
        <v-card-text>
            <span style="color: white;">
                Watch a short video about how to edit a road.
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
                youtubeUrl: "",
                edit: false,
            }
        },
        mounted(){
            setTimeout(()=>{
                this.showVideo = false
            }, 3000)
            this.addVideos()
            
        },
        methods:{
            watchVideo(){
                window.open(this.youtubeUrl, "_blank")
            },
            addVideos(){
                document.getElementById("addVideo").addEventListener("mouseenter", ()=>{
                    this.showVideo = true
                })
            }
        },
        
        watch:{
            editStatus:{
                handler: function(){
                    if(this.editStatus){
                        this.youtubeUrl = "https://www.google.com"
                        return
                    }
                },
                immediate: true
            },
            deleteRoad:{
                handler: function(){
                    console.log(this.deleteRoad)
                    if(this.deleteRoad){

                        this.youtubeUrl = "https://www.txdot.gov/"
                        return
                    }
                },
                immediate: true
            },
            addRdBoolean:{
                handler: function(){
                    if(this.addRdBoolean){
                        this.youtubeUrl = "https://www.youtube.com/watch?v=GZe9xHXk5RQ&list=PLyLWQADRroOUeiQ8sXX3JMVQeu87sgig2&index=3&t=9s"
                        return
                    }
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
        }
    }
</script>

<style scoped>
    #showVideo{
        position: relative;
        background-color: #204E70;
        width: 20rem;
        top: 43px;
        left: 40rem;
        color: white;
    }
    #watchBtn{
        color: white;
        border: 1px solid white;
    }
</style>