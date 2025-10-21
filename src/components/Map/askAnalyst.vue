<template>
    <div>
        <div class="askAnalystDiv">
            <v-progress-circular
         :size="50"
         color="primary"
         indeterminate
         class="spinner"
         v-if="isSpinner"
         ></v-progress-circular>
            <v-overlay z-index="7" v-if="askAnalystFormMask" ></v-overlay>
            
            <v-card id="askAnalystForm" v-if="askAnalystForm">
                <v-alert color="#0056a9" border="top" dark  v-html="statusMessageAskAnalyst" id="askAnalystBanner"></v-alert>
                <v-card-text class="askAnalystText">What's your question?</v-card-text>
                <v-textarea v-model="questionValue" :rules="questionRequired" no-resize outlined class="questionTextArea"  ></v-textarea>
                <v-card-text class="askAnalystText" >What's your full name?</v-card-text>
                <v-text-field v-model="nameValue" :rules="nameRequired" single-line outlined dense class="smallTextField" maxlength="40"></v-text-field>
                <v-card-text class="askAnalystText">How would you prefer to be contacted?</v-card-text>
                    <v-radio-group class="contactDiv" v-model="contactSelected" row >
                        <v-radio class="contactCheckbox"  color="#0056a9" label="Email"  value="email"  style="padding-right: 0; margin-right: 0;"  ></v-radio>
                        <v-radio class="contactCheckbox"   color="#0056a9" label="Phone"   value="phone" style="width: 50%;"  ></v-radio>
                    </v-radio-group>
                <v-text-field v-model="contactValue" :rules="contactRequired.concat(emailRequired).concat(phoneRequired)" @input="formatPhone()" :disabled="contactSelected == ''" outlined dense autocapitalize="off"  class="smallTextField" id="emailinput" ></v-text-field>
                <div class="formButtonsDiv">
                    <v-btn text underlined small color="#0056a9" class="buttonComponent" @click="cancelForm()" >Cancel</v-btn>
                    <v-btn text outlined small color="#0056a9" class="buttonComponent" style="border-radius: 0; border-color: #0056a9; " @click=" submitForm()" :disabled="questionValue === null || nameValue === null || contactValue === null ||contactSelected == '' || ruleDisable" >Submit</v-btn>

                </div>
            
            </v-card>
            <v-card style="height: 150px; width: 380px; z-index: 9;" v-if="thankyouPopup" >
                <v-alert color="#0056a9" border="top" dark  v-html="statusMessageThankYou" id="askAnalystBanner"></v-alert>
                <v-card-text style="text-align: left; color: black;">A member of our team will be in contact within 1 to 2 business days.</v-card-text>
                <v-btn text underlined outlined small color="#0056a9" class="buttonComponent" style="position: absolute; right: 10px; border-radius: 0; border-color: #0056a9; text-transform: none;" @click="thankyouPopup = false; askAnalystForm = false ; askAnalystFormMask = false">Close</v-btn>
            </v-card>

        </div>
        <div>
            <v-btn class="askQuestionButton" color="#0056a9" dark @click="askAnalystForm = true; askAnalystFormMask= true" style="text-transform: none;">Ask a Question</v-btn>

        </div>
    </div>
    
    
    
</template>
<script>

export default {
    name: "askAnalyst",
    data(){
        return{
            askAnalystForm: false,
            ruleDisable: true,
            askAnalystFormMask: false,
            preferredContact: null,
            contactValue: null,
            thankyouPopup: false,
            nameValue: null,
            questionValue: null,
            isSpinner: false,
            contactSelected: '',
           questionRequired: [
            value => {
                if(value && value.length){
                    return true
                }
                else{
                    this.questionValue = null
                    return "Question is required"
                }
            }
           ],
           nameRequired:[
           value => {
                if(value && value.length && value.length < 40){
                    return true
                }
                else if(value && value.length && value.length >= 40){
                    return "Name field must be under 40 characters"
                }
                else{
                    this.nameValue = null
                        return "Name is required"
                    }
            }
           ],
           contactRequired: [
            value => {
                if (value && value.length){
                    return true
                }
                else{
                    this.contactValue = null
                    return "Contact method is required"
                }
            }
           ],
           emailRequired:[
                 value => {
                    if(this.contactSelected == 'phone'){
                        return true
                    }
                     if(/.+@.+\..+/.test(value)){
                        this.ruleDisable = false
                     return true
                     } 
                     else{
                        this.ruleDisable = true
                     return "E-mail must be valid"
 
                     }
                 }
                 ],
            phoneRequired:[
                value => {
                    if(this.contactSelected == 'email'){
                        return true
                    }
                    if (value && value.length == 14)
                    {
                        this.ruleDisable = false

                    return true
                    } 
                    else{
                        this.ruleDisable = true
                    return "Phone number must be valid"

                    }
                }
            ],
        }
    },
    computed:{
        countyValue:{
            get(){
                return this.$store.state.cntyName
            }    
        },
        districtValue: {
            get(){
                return this.$store.state.district
            }
        },
        userNameValue:{
            get(){
                return this.$store.state.username
            }
            },
    },
    mounted(){
        this.statusMessageAskAnalyst = "Ask a Question"
        this.statusMessageThankYou = "Thank you"
    },
    watch: {
        contactSelected:{
            handler: function(){
                this.contactValue = null
            },
            immediate: true,
        },
    },
    methods:{
        formatPhone(){
            if (this.contactSelected != "phone"){
                return
            }

            // Remove non-numeric characters from the input value
            let formattedNumber = this.contactValue.replace(/\D/g, '');

            // Check if the input is not empty and format it as a phone number
            if (formattedNumber.length > 0) {
                formattedNumber = formattedNumber.replace(/(\d{3})(\d{3})(\d{4})/, '($1) $2-$3');
            }

            // Update the model with the formatted phone number
            this.contactValue = formattedNumber;
        },
    submitForm(){

        this.askAnalystForm = false
        this.isSpinner = true
            
        let url = `https://testportal.txdot.gov/fmejobsubmitter/TPP/TPP_DEV_CRI_AskAnalystEmailer.fmw?QUESTION=${this.questionValue}&DISTRICT=${this.districtValue}&COUNTY=${this.countyValue}&CONTACT=${this.contactValue}&NAME=${this.nameValue}&USERNAME=${this.userNameValue}&opt_showresult=false&opt_servicemode=sync&token=3357562003979484014b5691782f73b9af2f8317`

        this.sendRequest(url)
    },
    cancelForm(){
        this.askAnalystForm = false; 
        this.askAnalystFormMask = false

        this.questionValue = null
        this.nameValue = null
        this.contactValue = null
        this.contactSelected = null
    },
    sendRequest(url){
        fetch(url)
            .then(()=>{
                this.thankyouPopup = true
                this.isSpinner = false
                this.questionValue = null
                this.nameValue = null
                this.contactValue = null
                this.contactSelected = null
                console.log('success')
                })
            .catch((err) => {
                console.error('Error:', err);
                return;
            })
        }
    }
}

</script>


<style>
.askQuestionButton{
    position: absolute;
    right: 15px;
    /* bottom: 200px; */
    bottom: 50px;
    z-index: 3;
}
.askAnalystDiv{
    display: flex;
    justify-content: center;
    align-items: center;
    /* min-height: 100vh; */
    min-height: calc(80vh - 90px);
    width: 100%;
    flex-direction: column;



    
}
.askAnalystText{
   text-align: left;
   padding-left: 12px;
   padding-right:2rem;
   padding-bottom: 6px;
   padding-top: 5px;
   color: black !important;
   font-size: 14px;
}


.questionTextArea{
    width: 95%; margin: auto !important; left: 0 !important; right: 0 !important;
}

.questionTextArea.v-text-field--outlined fieldset{
    border: .5px solid #808080;
}

.smallTextField.v-text-field--outlined fieldset{
    border: .5px solid #808080;
}

.smallTextField{
    width: 95%;
    margin: auto !important; 
    left: 0 !important; 
    right: 0 !important;


}
.contactDiv{
    display: flex;
    width: 95%;
    margin: auto !important; left: 0 !important; right: 0 !important;
}
.contactCheckbox{
    flex: 1;
    padding-right: 150px;
    /* margin: 20px; */
}
.formButtonsDiv{
    width: 95%;
    margin: auto !important; left: 0 !important; right: 0 !important;
    display: flex;
    justify-content: flex-end;
}
#askAnalystForm{
    top: 50px !important;
    height: 500px;
    width: 380px;
    border-radius: 0;
    z-index: 7;
    
}
#askAnalystBanner{
   text-align: left;
   font-size:18px;
   font-weight: 400;
   margin: 0;
   height: 30px;
   min-height: 40px;
   border-radius: 0;
   padding-left: 10px;
   padding-top: 8px !important;
   
 
 }

 #thankYouPopup{
    height: 150px;
    width: 380px;
    top: -270px;
    z-index: 9;
 }
 #emailinput{
    text-transform: lowercase !important;

 }
 .questionTextArea .v-input__slot{
    margin-bottom: 0px;
 }
 .questionTextArea.v-text-field.v-text-field--enclosed .v-text-field__details{
    margin-bottom: 0px !important ;

 }
 .nameTextField.v-text-field.v-text-field--enclosed .v-text-field__details{
    margin-bottom: 0px !important ;

 }

 .smallTextField .v-input__slot{
    height: 30px !important;
    min-height: 0px !important;
 }

 .contactCheckbox .v-label{
    color: black ;
    font-size: 10.5pt;
}

.contactCheckbox .v-icon{
    color: #0056a9;
    font-size:large;
}

.buttonComponent .v-btn__content{
    text-decoration: underline;

}






</style>