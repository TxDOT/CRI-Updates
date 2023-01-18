<!-- Login component -->
<template>
    <v-dialog
      v-model="disagree"
      persistent
      max-width="500"
      id="cardDisplay"
      >
      <v-card v-model="disagree" height="250" style="border-radius:0px">
        <v-card-actions>
          <div id="loginBannerPos" v-if="certify===false">
            <v-alert color="#14375A" border="top" dark v-html="statusMessageFalse" id="loginBannerTxt"></v-alert>
          </div>
          <!-- <div style="position:absolute; top:10%; left: 0%" v-if="certify===true">
          <v-alert color="green" border="top" dark v-html="statusMessageTrue" class="black--text mb-3" >
          </v-alert>
          </div> -->
          <div id="loginTxt" class="black--text mb-3">
            <v-card-text style="color:black;" v-html="disagreeTxt">
            </v-card-text>
          </div>
            <div id="loginBtnPos">
              <v-btn id="loginButton" outlined tile @click="disagree = false; logMeIn();" color="#14375A">
                <u>Login</u>
              </v-btn>
            </div>
              <v-btn id="SignupBtnPos" depressed text tile color="black" x-small onclick="window.open('https://www.txdot.gov/data-maps/roadway-inventory/cri-form.html','_blank')" >
                Sign-Up
              </v-btn>
         
        </v-card-actions>
      </v-card>
    </v-dialog>

</template>

<script>
import {countyOfficialInfo} from '../components/Map/map'
import {goToMap, isTrainingAccess} from '../components/Map/login'
import {cntyNbrNm} from '../common/txCnt'
import OAuthInfo from "@arcgis/core/identity/OAuthInfo";
import esriId from "@arcgis/core/identity/IdentityManager";
import Portal from "@arcgis/core/portal/Portal";
import Query from "@arcgis/core/rest/support/Query"

export default {
    name: 'Login',
    props:['id'],
    data(){
        return{
        statusMessageTrue:'',
        statusMessageFalse:'',
        certify: false,
        disagree: true,
        countyPopup: false,
        disagreeTxt:'<br><br>Click the Login button and use your TxDOT-provided credentials to access the County Road Inventory Map. If you do not have an account, click the Sign-Up button to register.',
        judgeName:'',
        county:'',
        auth: {},
        cntyNme:'',
        loginToMap: false
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
          console.log(err)
          return;
        })

      this.certify = false;
      // this.logMeIn()
      const todayDate = new Date();
      this.certiAlert = `<p>By clicking submit, you are certifying the mileage for your county and completing the process for ${todayDate.getFullYear()-1}.<br> Edits made in ${todayDate.getFullYear()} after certifying are allowed, but will need to be recertified by the county judge prior to <DATE> in order to be accepted.`
      todayDate.toDateString()
      this.statusMessageFalse =`The TxDOT County Road Inventory Map`
      // this.statusMessageTrue =`As of today, ${todayDate.toDateString().substring(4,15)}, ${this.countyName} County mileage has been certified`
    },
    methods:{
      logMeIn(){
        esriId.getCredential(this.auth.portalUrl + "/sharing")
        console.log('logging in')
        
      },

      async loadMap(name, nbr){
        await goToMap(name, nbr)
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
            this.$router.push('/load')
            isTrainingAccess(portal.user.fetchGroups())
            this.userName = portal.user.username 
            let countyInfo = localStorage.getItem('county') ? JSON.parse(localStorage.getItem('county')) : await this.getCountyInfo(portal.user.username) //delete local storage. no longer needed.
            if(!countyInfo){return;}
            let cntyNumber = countyInfo[1]
            let cntyName = countyInfo[0]
            //search.sources._items[0].layer.definitionExpression = `CNTY_TYPE_NBR = ${cntyNumber}`
            this.countyName = cntyName
            this.countyNumber = cntyNumber
            this.countyMiles = countyInfo[2]
            this.loadMap(cntyName,cntyNumber)
          });
      },
      async getCountyInfo(username){
        let county;
        let getCountyNbr = Object.keys(cntyNbrNm[0]).find((x) => {
          let userNameSplit = username.split('_')
          if(userNameSplit[1].toLowerCase().includes(cntyNbrNm[0][x].replace(/\s/,'').toLowerCase())){
            county = cntyNbrNm[0][x]
            return cntyNbrNm[0]
          }
        })
        if(getCountyNbr){
          let whereStatement = `CNTY_NBR = '${getCountyNbr}'`
          const query = new Query();
          query.where = whereStatement
          query.outFields = [ "*" ]
          let queryResult = await countyOfficialInfo.queryFeatures(query)
          this.countyNumber = getCountyNbr
          this.judgeNameSend = queryResult.features[0].attributes['JUDGE_NM']
          this.judgeEmailSend = queryResult.features[0].attributes['JUDGE_EML']
          localStorage.setItem('county',JSON.stringify([county,getCountyNbr,queryResult.features[0].attributes['TOT_MLGE']]))
          return [county, Number(getCountyNbr), queryResult.features[0].attributes['TOT_MLGE']]
        }
        else{
          this.$router.push({ name: 'PickCounty'})
          return;
        }
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
    }
    
}
</script>
<style>
.v-dialog {
  border-radius: 0px;
}

#loginBannerPos{
  position:absolute; 
  top:0%; 
  left: 0%; 
  width:100%;
}
#loginBannerTxt{
  border-radius: 0px; 
  text-align: left;
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
</style>