<template>
    <v-card tile id="assignDelCard">
        <v-card-title class="cardTitle"><v-icon id="assignDelIcon">mdi-account-multiple-plus</v-icon><p id="titleTxt">Assign Delegate</p></v-card-title>
        <v-card-text v-html="delTxt" id="addDelgTxt"></v-card-text>
        
        <v-row v-for="(i,item) in emailCounter" :key="item">
            <v-col cols="12" md="4" id="txtFieldName"><v-text-field dense required outlined label="Delegate Name" v-model="i.delUserName"></v-text-field></v-col>
            <v-col cols="12" md="8" id="txtFieldEmail"><v-text-field dense :rules="emailRules" label="Delegate email address" v-model="i.delEmail" required outlined style="width:60%; left:20%"></v-text-field></v-col>
            <v-col id="trashIcon"><v-icon color="red" @click="deleteEmail(item)" :disabled="emailCounter.length === 1">mdi-delete</v-icon></v-col>
        </v-row>
        
        <a x-small @click="addEmail" id="addDelegate">Add additional delegate</a>
        <v-btn text color="#204E70" id="cancelBtn" @click="returnToLetter()">Cancel</v-btn>
        <v-btn tile outlined color="#204E70" id="acceptBtn" @click="submit('delegate')"><u>Accept</u></v-btn>

    </v-card>

</template>

<script>
import {sendJudgeEmail} from '../../components/Map/helper'

export default {
    name: 'AssignDelegate',
    data(){
        return{
            delTxt: '',
            del: true,
            counter:0,
            emailCounter: [{"counter": 0, "delEmail": "", "delUserName":""}],
            emailRules: [
              v => !!v || 'E-mail is required',
              v => /.+@.+\..+/.test(v) || 'E-mail must be valid',
            ],
        }
    },
    mounted(){
        this.delTxt = `<p align="justify">Use this form to assign delegates to make edits to the ${this.countyNm} County Road Inventory.</p>
                       <p align="justify">Delegates will receive an email stating that you, ${this.countyJudgeNm}, have granted them authority
                        to make edits to the County Road Inventory on your behalf. Delegating others to assist with review and edits
                        does not preclude you from making edits yourself. Furthermore, as county judge, you will have to certify changes
                        made by your delegate(s) upon their completion and submittal of edits.`
    },
    methods:{
        addEmail(){
            let count= this.counter++
            this.emailCounter.push({
               "counter":count,
               "delEmail": "",
               "delUserName":""
              });
            //this.emailList.push({"count": count, "email":''})
        },
        deleteEmail(index){
            console.log(index)
            console.log(this.emailCounter)
            this.emailCounter.splice(index, 1)
        },
        // accept(){
        //     console.log(this.emailCounter)
        // },
        returnToLetter(){
            this.isJudgeLetter = !this.isJudgeLetter
        },
        submit(step){
            let ccEmailList = []
            let ccDelName = []
            this.emailCounter.forEach((x) => {
                ccEmailList.push(x.delEmail)
                ccDelName.push(x.delUserName)
            })

            sendJudgeEmail(step, ccDelName, ccEmailList, null, null, null)
        }
    },
    computed:{
        isJudgeLetter:{
            get(){
                return this.$store.state.isJudgeLtter
            },
            set(bool){
                this.$store.commit('setIsJudgeLetter', bool)
            }
        },
    }
}
</script>

<style scoped>
#addDelgTxt{
    position: relative;
    top: 1rem;
    color: black;
}
#assignDelIcon{
    position: relative;
    bottom: 1.2rem;
    right: .1rem; 
    color: white;
    padding-right: 1rem;
    font-size: 2rem;
}
#titleTxt{
    position: relative;
    bottom: .6rem;
}
#txtFieldName{
    position: absolute;
    left: 1rem;
}
#txtFieldEmail{
    position: relative;
    /* width: 3rem; */
    left: 15rem;
}
#addDelegate{
    position: relative;
    right: 14.6rem;
}
#trashIcon{
    position: relative;
    top: .4rem;
    left: 4rem;
}
#assignDelCard{
    position: relative;
    min-height: 0vh;
    max-height: 40rem;
    flex-direction: column;
    display: flex;
    overflow-x: hidden;
    overflow-y: auto;

}
#cancelBtn{
    position: relative;
    width: 2rem;
    left: 33rem;
    top: 1.3rem;
}
#acceptBtn{
    position: relative;
    width: 2rem;
    left: 38rem;
    bottom: 1rem;
}
</style>