<template>
    <v-container>
        <v-card  id="edit">
        <v-card-title class="editRdTitle" v-if="edit===true">
            Edit an Existing Road
        </v-card-title>
        <v-card-title class="editRdTitle" v-if="edit===false">
            Add a new Road
        </v-card-title>
            <v-icon color="blue" v-if="edit===true">
                mdi-cursor-default
            </v-icon>
            <v-icon color="blue" v-if="edit===false">
                mdi-plus
            </v-icon>
            <v-card-text v-if="edit===true">
                Select a road from the map to begin editing
            </v-card-text>
            <v-card-text v-if="edit ===false">
                Click on the Map to add a new Road
            </v-card-text>
            
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
        editStatus:{
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
                return this.$store.state.editExisting
            },
            set(edit){
                this.$store.commit('setEditExisting',edit)
            }
        },

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
        top:121px;
        left:15%;
        width: 15%;
        color: #15648C;
    }
</style>
