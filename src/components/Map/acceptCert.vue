<template>
    <v-container>
    <v-card tile id="acceptCard" v-if="test1">
        <v-card-title class="cardTitle"><v-icon color="white" id="certIcon">mdi-certificate</v-icon><p id="certTitle">Mileage Certification</p></v-card-title>
        <v-card-text class="textSymb" id="countyMileTxt">Sign below to certify your county's mileage.</v-card-text>
        <v-card-text class="textSymb" v-html="countyMileageTxt()"></v-card-text>

        <v-row>
            <v-col cols="12" md="5" id="judgeName">
                <v-text-field disabled dense label="County Judge Name" outlined v-model="this.judgeNameSend"></v-text-field>
            </v-col>
            <v-col cols="12" md="6" id="judgeEmail">
                <v-text-field disabled dense label="County Judge E-mail" outlined v-model="this.judgeEmailSend"></v-text-field>
            </v-col>
        </v-row>
       <v-row v-for="(i, index) in ccEmail" :key="index">
            <v-col cols="12" md="5" id="emailCC">
                <v-text-field dense :rules="ccEmailRules" outlined label="CC Email" v-model="i.EmailAdd"></v-text-field>
            </v-col>
            <v-col><v-icon @click="deleteEmail(index)" id="trashIcon">mdi-delete</v-icon></v-col>
        </v-row>

        <a x-small @click="addEmail" id="addCCEmail">Add CC Email</a>

        <p id="signature">Signature: {{signature}}</p>

        <v-text-field class="signatureBox" :rules="sigRules" v-model="signature" outlined placeholder="Gimme your John Hancock" :v-if="toggleSubTxt()"></v-text-field>
    
        
        <div v-if="hideSubText">
            <p id="signNote" v-html="signatureNote"></p>
            <v-checkbox v-model="isCountyJudge" label="I am the county judge listed above." class="acceptCheckbox"></v-checkbox>
        </div>

        <v-btn text color="#204E70" id="cancelBtn" @click="returnToLetter()">Cancel</v-btn>
        <v-btn tile outlined color="#204E70" id="acceptBtn" :disabled="hideSubText === false || isCountyJudge === false" @click="submit('certify'); test1=false; test2=true;">Accept</v-btn>
    </v-card>
    <v-dialog v-model="test2" max-width="600px" persistent>
        <v-card>
      <v-icon style="left: 0%" color="green">
        mdi-check
      </v-icon>
    Thank you for certifing your mileage! Be on the lookout for an email confirming your certification.
    </v-card>
    </v-dialog>
</v-container>

</template>

<script>

import {sendJudgeEmail} from '../Map/helper'

export default {
    name: 'acceptCertify',
    acceptCertify: true,
    data(){
        return{
            date: '',
            test1: true,
            test2: false,
            ccEmailAdd: '',
            disableAddCCBtn: false,
            ccEmail: [],
            ccEmailRules : [y => !!y || 'CC Email is required'],
            sigRules: [x => !!x || 'Signature is required',
            x => (x && x.length >= 5) || 'Name must be greater than 5 characters'],
            signature: '',
            signatureNote: `By clicking submit, you are certifying the mileage for your county and completing the process for ${new Date().getFullYear()}.
                            <br><br> <b>Note</b>: any subsequent edits made in the CRI Map up until August 31 will need to be recertified.`,
            hideSubText: false,
            isCountyJudge: false,
        }
    },
    methods:{
        addEmail(){
            this.ccEmail.push({'EmailAdd':''})
        },
        deleteEmail(index){
            this.ccEmail.splice(index, 1)
        },
        toggleSubTxt(){
            this.signature.length >= 5 ? this.hideSubText = true : this.hideSubText = false
        },
        countyMileageTxt(){
            return `The current mileage for ${this.countyName} is ${this.countyMileage}`
        },
        returnToLetter(){
            this.isJudgeLetter = !this.isJudgeLetter
        },
        submit(step){
            let ccEmailList = []
            this.ccEmail.forEach((x) => {
                ccEmailList.push(x.EmailAdd)
            })
            sendJudgeEmail(step, [], ccEmailList, this.signature, null, null)
        }
    },

    computed:{
        judgeNameSend:{
            get(){
               return this.$store.state.judgeName
            }
        },
        judgeEmailSend:{
            get(){
                return this.$store.state.judgeEmail
            }
        },
        countyName:{
            get(){
                return this.$store.state.cntyName
            }
        },
        countyMileage:{
            get(){
                return this.$store.state.cntyMiles
            }
        },
        isJudgeLetter:{
            get(){
                return this.$store.state.isJudgeLtter
            },
            set(bool){
                this.$store.commit('setIsJudgeLetter', bool)
            }
        }
    }
}
</script>

<style scoped>
    #certIcon{
        position: relative;
        bottom: 1rem;
        padding-right: 1rem;
    }
    #certTitle{
        position: relative;
        bottom: .5rem;
    }
    #judgeName{
        position: absolute;
        left: .8rem;
    }
    #judgeEmail{
        position: relative;
        left: 14rem;
    }
    #addCCEmail{
        position: relative;
        bottom: 1rem;
        left: 10.2rem;
    }
    #emailCC{
        position: relative;
        width: 30rem;
        bottom: 1rem;
        left: 14.4rem;
        padding-bottom: 0rem;
        padding-top: 0rem;
    }
    #trashIcon{
        position: relative;
        color: red;
        bottom: 1.4rem;
        left: 6rem;
    }
    #signature{
        position: relative;
        font-family: Brush Script MT;
        font-size:1.8rem;
        left: 1.4rem;
        align-content: left;
        bottom: 1rem;
        display: flex;
        height: 2rem;
        flex-direction: row;
    }    

    .signatureBox{
        position: relative;
        left: 1.5rem;
        bottom: 1rem;
        width: 27rem;
    }
    #signNote{
        position: relative;
        text-align: left;
        left: 1.5rem;
        bottom: 2rem;
        font-size: .7rem;
        padding-right: 2.5rem;
        color:#CC5500;
    }
    #cancelBtn{
        position: relative;
        width: 2rem;
        left: 18.5rem;
        padding: none;
        top: 1.2rem;
    }
    #acceptBtn{
        position: relative;
        width: 5rem;
        left: 23.5rem;
        bottom: 1.2rem;
        padding-left: 1.5rem !important;
        padding-right: 1.5rem !important;
        text-decoration: underline;
    }
    #acceptCard{
        position: relative;
        display: flex;
        flex-direction: column;
        min-height: 0rem;
        max-height: 90vh;
        overflow-x: hidden;
        overflow-y: auto;
        border-radius: 0%;
    }
    .container{
        padding: 0% !important;
    }
    .acceptCheckbox{
        position: relative;
        bottom: 1rem;
        left: 1.3rem;
        color: black;
    }
    #countyMileTxt{
        padding-top: 1rem;
    }
    #test2{
        position: relative;
        bottom: 3rem;
        width: 20rem;
    }
</style>