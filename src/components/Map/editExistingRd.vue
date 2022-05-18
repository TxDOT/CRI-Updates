<template>
    <v-container>
        <v-card  id="edit">
        <v-card-title class="editRdTitle">
            Edit an Existing Road
        </v-card-title>
            <v-icon color="blue">
                mdi-cursor-default
            </v-icon>
            Select a road from the map to begin editing
        </v-card>
    </v-container>
</template>

<script>
export default {
    name: 'editExistingRd',
    data (){
      return {
        edit:false
      }
    },
    watch:{
        edit:{
            handler: function(){
                this.edit =  this.editStatus
                console.log(this.edit)
            },
        immediate:true,
        },
    },
    computed:{
        editStatus:{
            get(){
                return this.$store.state.editStatus
            },
            set(edit){
                this.$store.commit('setEditStatus',edit)
            }
        }
    }
}
</script>

<style scoped>
    .editRdTitle{
        background: #15648C;
        color:white;
        font-size: 16px;
        height: 40px;
        padding-left: 50px;
        padding-top: 1%;
        text-align: justify;
        top: 10%;
        width: 100%;
        left: 100%;
    }
    #edit{
        position: absolute;
        top:10%;
        left:102%;
        width: 100%;
        color: #15648C;
    }
</style>
