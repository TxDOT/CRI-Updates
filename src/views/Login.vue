<!-- Login component -->
<template>
    <v-dialog
      v-model="disagree"
      persistent
      max-width="500"
      id="cardDisplay"
      
      >
      <!-- <v-alert type="success">ok</v-alert> -->
      <v-alert
        type="success"
        class="valert"
        max-width="500"
        v-if="alert"
        >
        Form has been submitted successfully!
        </v-alert>
      <v-card height="250" class="login-card">
        
        <v-card-actions>
          <div id="loginBannerPos" v-if="certify===false">
            <v-alert color="#14375A" border="top" dark v-html="statusMessageFalse" id="loginBannerTxt"></v-alert>
          </div>
          <div id="loginTxt" class="black--text mb-3">
            <v-card-text style="color:black;" v-html="disagreeTxt">
            </v-card-text>
          </div>
            <div id="loginBtnPos">
              <v-btn id="loginButton" outlined tile @click="disagree = false ; logMeIn();" color="#14375A">
                <u>Login</u>
              </v-btn>
            </div>
              <v-btn id="SignupBtnPos" depressed text tile color="black" x-small @click="registerPopup = true; login=false;" >
                <!-- onclick="window.open('https://www.txdot.gov/data-maps/roadway-inventory/cri-form.html','_blank')" -->
                Sign-Up
              </v-btn>         
        </v-card-actions>
      </v-card>
      <Signupform v-if="registerPopup"/>
    </v-dialog>
</template>

<script>
import {countyOfficialInfo} from '../components/Map/map'
import {getTodaysDate} from '../components/Map/helper'
import {goToMap, isTrainingAccess} from '../components/Map/login'
import {cntyNbrNm} from '../common/txCnt'
import OAuthInfo from "@arcgis/core/identity/OAuthInfo";
import esriId from "@arcgis/core/identity/IdentityManager";
import Portal from "@arcgis/core/portal/Portal";
import Query from "@arcgis/core/rest/support/Query"
import Signupform from '../components/signupform.vue';
//import { C } from 'caniuse-lite/data/agents';

export default {
    name: 'Login',
    components:{Signupform},
    props:['id'],
    data(){
        return{
        isAlert: false,
        countyvalid: false,
        emailvalid: false,
        firstnvalid: false,
        lastnvalid: false,
        phonevalid: false,
        isDisabled : false,
        cntyNbrNm,
        registerpopup: false,
        statusMessageTrue:'',
        statusMessageFalse:'',
        statusMessageFalseRegister: '',
        certify: false,
        disagree: true,
        countyPopup: false,
        disagreeTxt:'<br><br>Click the Login button and use your TxDOT-provided credentials to access the County Road Inventory Map. If you do not have an account, click the Sign-Up button to register.',
        judgeName:'',
        auth: {},
        cntyNme:'',
        login: true,
        loginToMap: false,
        isCertify: false,
        signup: false,

        }
    },
    beforeRouteLeave(to, from, next){
      to;
      from;
      if(this.loginToMap){
        next()
        return;
      }
      next(false)
    },
    mounted(){
      // setup OAuth Constructor; gets loaded on mount of login.vue and check login Status
      this.auth = new OAuthInfo({
        appId:"9XWrQUJ2eX0jXEAW",
        expiration: 10080,
        popup: false,
      });

      esriId.registerOAuthInfos([this.auth]);
      esriId.checkSignInStatus("https://txdot.maps.arcgis.com/sharing")
        .then(()=>{
          this.handleSignedIn()
        })
        .catch((err) => {
          console.warn("logged out", err)
          return;
        })

      this.certify = false;
      // this.logMeIn()
      const todayDate = new Date();
      this.certiAlert = `<p>By clicking submit, you are certifying the mileage for your county and completing the process for ${todayDate.getFullYear()-1}.<br> Edits made in ${todayDate.getFullYear()} after certifying are allowed, but will need to be recertified by the county judge prior to <DATE> in order to be accepted.`
      todayDate.toDateString()
      this.statusMessageFalse =`The TxDOT County Road Inventory Map`
      this.statusMessageFalseRegister = 'County Road Inventory Registration'
      // this.statusMessageTrue =`As of today, ${todayDate.toDateString().substring(4,15)}, ${this.countyName} County mileage has been certified`

    },
    methods:{
      async getCountyJudge(cntyNum){
        let whereStatement = `CNTY_NBR = '${cntyNum}'`
        const query = new Query();
        query.where = whereStatement
        query.outFields = [ "*" ]
        
        let queryResult = await countyOfficialInfo.queryFeatures(query)
        this.countyNumber = cntyNum
        this.judgeCntyOid = queryResult.features[0].attributes['OBJECTID']
        this.judgeNameSend = queryResult.features[0].attributes['JUDGE_NM']
        this.judgeEmailSend = queryResult.features[0].attributes['JUDGE_EML']
        this.isCertify = queryResult.features[0].attributes['CERTFD'] === "Y" ? true : false
        
        return queryResult.features[0].attributes['TOT_MLGE']
      },      

      checkLocalStorage(){
        let cntyNum = JSON.parse(localStorage.getItem('county'))
        this.getCountyJudge(cntyNum[1])
        return cntyNum
      },
      logMeIn(){
        esriId.getCredential(this.auth.portalUrl + "/sharing")
      },
      async loadMap(name, nbr){
        const map = await goToMap(name, nbr)
        const [month, date] = getTodaysDate()
        if(map === 0 && (month === 8 && (date >= 1 || date < 15))){
          this.$router.push('/EOY')
          return;
        }
        this.$router.push('/map')
        this.loginToMap = false
        //view.goTo(viewPoint);
        //autoDrawAsset(queryFeat)
      },
      handleSignedIn() {
        //TODO -- Remove LocalStorage and replace with ESRI OAUTH userId
        const portal = new Portal();
        this.loginToMap = true
        portal.load()
          .then( async () => {
            if(this.isCertify){
              this.$router.push('/EOY')
              return
            }
            this.usrEmail = portal.user.email
            this.$router.push('/load')
            isTrainingAccess(portal.user.fetchGroups())
            this.userName = portal.user.username 
            let countyInfo = localStorage.getItem('county') ? this.checkLocalStorage() : await this.getCountyInfo(portal.user.username) //delete local storage. no longer needed. 
            if(!countyInfo){return;}
            let cntyNumber = countyInfo[1]
            let cntyName = countyInfo[0]
            //search.sources._items[0].layer.definitionExpression = `CNTY_TYPE_NBR = ${cntyNumber}`
            this.countyName = cntyName
            this.countyNumber = cntyNumber
            this.countyMiles = countyInfo[2]
            this.loadMap(cntyName,cntyNumber)
          })
      },  
      async getCountyInfo(username){
        let county;
        let getCountyNbr = Object.keys(cntyNbrNm[0]).find((x) => {
          let userNameSplit = username.split('_')
          if(userNameSplit[1].toLowerCase() === cntyNbrNm[0][x].replace(/\s/,'').toLowerCase()){
            county = cntyNbrNm[0][x]
            return cntyNbrNm[0]
          }
        })
        if(getCountyNbr){
          let totalMileage = await this.getCountyJudge(getCountyNbr)
          localStorage.setItem('county',JSON.stringify([county,getCountyNbr, totalMileage]))
          return [county, Number(getCountyNbr), totalMileage]
        }
        else{
          this.$router.push({ name: 'PickCounty'})
          return;
        }
      },
      handlecaps: (str) => {
          return str ? str.toLowerCase() : "";
        },
     
    },
    watch:{
      registerPopup: {
        handler: function(){
          this.registerpopup = this.registerPopup

        },
        immediate: true
      }

    },
    computed:{

      setLogOut:{
        get(){
          return this.$store.state.isLoggedOut
        },
        set(bool){
          this.$store.commit('setIsLoggedOut', bool)
        }
      },
      countyName:{
        get(){
          return this.$store.state.cntyName
        },
        set(countyName){
          this.$store.commit('setCntyName',countyName)
        }
      },
      countyNumber:{
        get(){
          return this.$store.state.cntyNmbr
        },
        set(countyNumber){
          this.$store.commit('setCntyNmbr', countyNumber)
        }
      },
      countyMiles:{
        get(){
          return this.$store.state.cntyMiles
        },
        set(countyMiles){
          this.$store.commit('setCntyMiles',countyMiles)
        }
      },
      userName:{
        get(){
          return this.$store.state.username
        },
        set(userName){
          this.$store.commit('setUserName', userName)
        }
      },
      usrEmail:{
        get(){
          return this.$store.state.userEmail
        },
        set(email){
          this.$store.commit('setUserEmail', email)
        }
      },
      logIn:{
        get(){
          return this.$store.state.isLoggedIn
        },
        set(bool){
          this.$store.commit('setIsLoggedIn', bool)
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
      judgeCntyOid:{
        get(){
          return this.$store.state.judgeObjectId
        },
        set(oid){
          this.$store.commit('setJudgeObjectId', oid)
        }
      },
      registerPopup:{
        get(){
          return this.$store.state.registerpopup
        },
        set(bool){
          this.$store.commit('setIsRegisterPopup', bool)
        }
      },  
      alert:{
          get(){
              return this.$store.state.alerstatus
          },
          set(bool){
              this.$store.commit('setIsAlert', bool)
          }
        },
    }
    
}
</script>
<style>
.valert{
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  margin: auto;
}
.spinner{
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  margin: auto;}
.custom-checkbox .v-label {
  color: black; /* Set the desired label font color here */
  font-size: 14px;
}
.custom-border-radius .v-input__control {
  border-radius: 0px; /* Adjust the border radius as needed */
}
.v-input #form-input {
    font-size: 14px !important;

}
.v-input #form-select {
    font-size: 14px !important;

}
.v-input #form-input-email {
    text-transform: lowercase !important;
    font-size: 14px !important;

}

.custom-border-radius .v-select__selection{
  font-size: 14px !important;
}
.custom-border-radius .v-input__slot{
  min-width:400px ;
  max-width: 400px;
}
.custom-border-radius .v-text-field__details{
  
    left: 400px;
    top: -30px;
    position: relative;

}

.custom-border-radius .v-menu__content{
  position:relative;
  top: 40px !important;
  left:-400px !important;
}
.v-dialog {
  border-radius: 0px;
}

#loginBannerPos{
  position:absolute; 
  top:0%; 
  left: 0%; 
  width:100%;
}
#registerBannerPos{
  position:absolute; 
  top:0%; 
  left: 0%; 
  width:100%;
}
#loginBannerTxt{
  border-radius: 0px; 
  text-align: left;
  font-size:20px;
  font-weight: 400;

}
#loginTxt{
  position:absolute; 
  top:15%; 
  left: 5%; 
  text-align: left;
}
#loginBtnPos{
  position:absolute; 
  right:4%; 
  bottom:10%
}
#SignupBtnPos{
  position:absolute; 
  left:4%; 
  bottom:13%
}
.login-card{
  border-radius: 0px !important;
  
}
.signup-card{
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  margin: auto;
  width: 900px;
  overflow: hidden;;
}
.signup-form{
  padding-left: 3rem !important;
  padding-right: 2rem !important;
  margin-bottom: -30px;
  height: 65px;
  

}
#formtext{
  position: absolute;
  top:60px;
  text-align: left;
  padding-left: 1px;
  padding-right:2rem;
  font-size: 14px;
  }

#termstext{
  position: absolute;
  text-align: left;
  top: 365px;
  padding-left: 1px;
  padding-right:2rem;
  font-size: 14px;

}
.formPos{
  position: absolute;
  top: 140px;
}
 .cancelButton{
  right: 10px;
  bottom: 8px;
} 
.continueButton{
  right: 12px;
} 
.buttonPos{
  position: absolute;
  bottom: 0px;
  right: 0;
  
  }
  .btnblocker{
    position: absolute;
    bottom: 10px;
    right: 5px;
    height: 40px;
    width: 188px;
    background-color: transparent ;
    /* pointer-events: none  ; */
    
  }

</style>