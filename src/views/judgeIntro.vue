<template>
    <v-main>
        <v-dialog persistent max-width="1000" v-model="judgeLetter" id="judgeDialog">
            <v-card id="judgeLetter">
                <v-card-title><v-img :src="require('@/assets/txdotLogo.jpeg')" id="judgeLetterLogo"></v-img></v-card-title>
                <v-card-text justify="left" v-html="mainTxt" class="letterTxt" id="mainTxt"></v-card-text>
                
                <v-btn small tile color="green" class="buttonColor" id="acceptCert" @click="judgeLetter=false; assignDel=false; accptCertify=true"><v-icon left color="white" >mdi-certificate</v-icon>Agree & Certify</v-btn>
                <v-btn small tile color="blue" class="buttonColor" @click="logMeIn()"><v-icon left color="white">mdi-vector-polyline-edit</v-icon>Review & Edit</v-btn>
                <v-btn small tile color="black" class="buttonColor" id="assignDelegate" @click="judgeLetter=false; accptCertify=false; assignDel=true;"><v-icon left color="white">mdi-account-multiple-plus</v-icon>Assign Delegate</v-btn>

                <v-card-text v-html="subTxt" class="letterTxt" id="subTxt"></v-card-text>
            </v-card>
        </v-dialog >
        <v-dialog width="700" v-model="assignDel" persistent>
            <AssignDelegate />
        </v-dialog>
        <v-dialog width="490" v-model="accptCertify" persistent>
            <acceptCertify/>
        </v-dialog>
        
    </v-main>
</template>

<script>
import {countyInfo} from '../components/Map/login'
import AssignDelegate from '../components/Map/assignDelegate.vue'
import acceptCertify from '../components/Map/acceptCert.vue'

export default{
    name:'JudgeIntro',
    components: {AssignDelegate, acceptCertify},
    props: ["id"],
    data(){
        return{
            judgeLetter: true,
            mainTxt: '',
            subTxt: '',
            judgeName: '',
            judgeEmail: '',
            countyNbr: '',
            sendData: '',
            assignDel: false,
            accptCertify: false,
            mileageTxt: ''
        }
    },
    async mounted(){
        let readCntyInfo = await countyInfo()
        let getCntyInfoQuery = await readCntyInfo['query']
        this.judgeName = getCntyInfoQuery.features[0].attributes['JUDGE_NM']
        this.judgeNameSend = getCntyInfoQuery.features[0].attributes['JUDGE_NM']
        this.judgeEmail = getCntyInfoQuery.features[0].attributes['JUDGE_EML']
        this.judgeEmailSend = getCntyInfoQuery.features[0].attributes['JUDGE_EML']
        this.countyNbr = getCntyInfoQuery.features[0].attributes['CNTY_NBR']
        this.currentMiles = getCntyInfoQuery.features[0].attributes['UPDATED_MLGE'] ? getCntyInfoQuery.features[0].attributes['UPDATED_MLGE'] : getCntyInfoQuery.features[0].attributes['TOT_MLGE']
        let updatedMileage = getCntyInfoQuery.features[0].attributes['UPDATED_MLGE']
        this.county = getCntyInfoQuery.features[0].attributes['CNTY_NM']
        this.sendData = parseInt(this.currentMiles)
        this.updateMileage(getCntyInfoQuery.features[0].attributes['TOT_MLGE'], updatedMileage)
        localStorage.setItem('county',JSON.stringify([this.county,this.countyNbr,this.currentMiles]))
        //this.sendCountyName();
          //this.sendCountyName(Number(getCntyInfoQuery.features[0].attributes['Total_Mileage']))
        this.$store.commit('setCntyMiles',this.currentMiles)
        this.mainTxt = `
          <p align="justify">Dear ${this.judgeName},</p>
          <p align="justify">The Texas Department of Transportation (TxDOT) is soliciting updates to the County Road Inventory (CRI) from your county.  The deadline for the ${new Date().getFullYear()} submission is <u>August 31</u>.<br><br>
            
          Your ${new Date().getFullYear()} certified mileage is: <b><u>${this.currentMiles}.</b></u> ${this.mileageTxt}<br><br>
          
          If you agree with this mileage, please click the AGREE & CERTIFY button below.  To review your CRI and make edits, please click the REVIEW & EDIT button below.  To delegate the responsibility of making updates to a trusted partner, please click the ASSIGN DELEGATE button below.<br><br>
          Thank you for your assistance in keeping the county road inventory up to date. If you have any questions or need clarification, please contact us by email or phone. <br><br>
          Sincerely,<br><br> 
          Michael Chamberlain<br>  
          Transportation Planning and Programming Division<br>  
          Director of Data Management<br>  
          TPP-GIS@txdot.gov<br>  
          (512) 851-9039<br><br></p>`
          this.subTxt = `<br><p align="justify">If you would like to review your inventory using the Review & Edit button above, but have not yet created an account for yourself, you can <a href='https://www.txdot.gov/data-maps/roadway-inventory/cri-form.html' target='_blank'><u>register here</u></a>.</p>
                         <p align="justify">TxDOT reports county road mileage to the Texas State Comptroller and Department of Motor Vehicles. That data is used to calculate funds to be distributed to each county. 
                         Your participation in the County Road Inventory program is essential for ensuring an accurate and complete inventory.</p>`
    },
    methods:{
        logMeIn(){
             this.$router.push('/login')
           },
        updateMileage(curr, upd){
            if(upd){
                let delta = curr - upd
                this.mileageTxt = upd > curr ? `Edits were made in the CRI Map for a net change in total mileage of +${Math.abs(delta).toFixed(2)} miles.` : `Edits were made in the CRI Map for a net change in total mileage of -${Math.abs(delta).toFixed(2)} miles.`
                return
            }
            
            this.mileageTxt = 'No edits have been made.'

        }
    },
    watch:{
        isJdgeLetter:{
            handler:function(){
                this.assignDel = false
                this.judgeLetter = true
                this.accptCertify = false
                console.log(this.judgeLetter)
            },
            immediate: true,
        }
    },
    computed:{
        isJdgeLetter:{
            get(){
                return this.$store.state.isJudgeLtter
            },
            set(bool){
                this.$store.commit('setIsJudgeLetter', bool)
            }
        },
        judgeNameSend:{
            get(){
                return this.$store.state.judgeName
            },
            set(name){
                this.$store.commit('setJudgeName', name)
            }
        },
        judgeEmailSend:{
            get(){
                return this.$store.state.judgeEmail
            },
            set(email){
                this.$store.commit('setJudgeEmail', email)
            }
        },
        county:{
            get(){
                return this.$store.state.cntyName
            },
            set(name){
                this.$store.commit('setCntyName', name)
            }
        },
        currentMiles:{
            get(){
                return this.$store.state.cntyMiles
            },
            set(mile){
                this.$store.commit('setCntyMiles', mile)
            }
        }
    }

}
</script>

<style scoped>
#judgeLetterLogo{
    position: relative;
    height: 10rem;
    bottom: .2rem;
    bottom: 2rem;
    width: 4rem;
}
#judgeLetter{
    position: relative;
    flex-direction: column;
    width: 70rem;
    overflow-y: auto !important;
    min-height: 0vh;
    max-height: 100vh;
}
.buttonColor{
    color: white;
    bottom: 70px;
}

.letterTxt{
    font-size: 13px;
}
#mainTxt{
    position:relative;
    bottom: 2rem;
    color:black;
}
#subTxt{
    position:relative;
    bottom: 3rem;
    color:black;
}
#judgeDialog{
    position: relative;
    border-radius: 0px;
    overflow: auto !important;
}
#acceptCert{
    position: relative;
    right: 1rem;
}
#assignDelegate{
    position: relative;
    left: 1rem;
}

</style>