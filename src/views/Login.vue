<template>
    <v-dialog
      v-model="disagree"
      persistent
      max-width="500"
      id="cardDisplay"
      >
      <v-card v-model="disagree" height="250" style="border-radius:0px">
        <v-card-actions>
          <div style="position:absolute; top:0%; left: 0%; width:100%;" v-if="certify===false">
            <v-alert color="#14375A" border="top" dark v-html="statusMessageFalse" style="border-radius: 0px; text-align: left;"></v-alert>
          </div>
          <div style="position:absolute; top:10%; left: 0%" v-if="certify===true">
          <v-alert color="green" border="top" dark v-html="statusMessageTrue" class="black--text mb-3" >
          </v-alert>
          </div>
          <div style="position:absolute; top:15%; left: 5%; text-align: left;" class="black--text mb-3">
            <v-card-text style="color:black;" v-html="disagreeTxt">
            </v-card-text>
          </div>
            <div style="position:absolute ; right:4%; bottom:10%">
              <v-btn id="loginButton" outlined tile @click="disagree = false; logMeIn();" color="#14375A"> <!-- goToMap() -->
                Login
              </v-btn>
            </div>
              <v-btn style="position:absolute; left:4%; bottom:13%" depressed text tile color="black" x-small onclick="window.open('https://www.dot.state.tx.us/apps-cg/contact_us/form/dusa-form.htm','_blank')" >
                Sign-Up
              </v-btn>
         
        </v-card-actions>
      </v-card>
    </v-dialog>

</template>

<script>
//import {autoDrawAsset} from '../components/Map/editFunc'
import {viewPoint,countyOfficialInfo, search} from '../components/Map/map'
import {goToMap} from '../components/Map/editFunc'
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
      console.log(to)
      if(this.loginToMap){
        next()
        return;
      }
      console.log(to, from)
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
      // this.loginStatus()
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
          .then(()=>{
            console.log('1')
          })
        console.log('logging in')
        
      },

      async loadMap(name, nbr){
        await goToMap(name, nbr)
        console.log(viewPoint)
        this.$router.push('/map')
        this.loginToMap = false
        //view.goTo(viewPoint);
        //autoDrawAsset(queryFeat)
      },
      handleSignedIn() {
        const portal = new Portal();
        this.loginToMap = true
        portal.load()
          .then( async () => {
            const results = { name: portal.user.fullName, username: portal.user.username };
            console.log(results)
            //this.$router.push('/load')
            let countyInfo = localStorage.getItem('county') ? JSON.parse(localStorage.getItem('county')) : await this.getCountyInfo(portal.user.username)
            this.userName = portal.user.username 
            let cntyNumber = countyInfo[1]
            let cntyName = countyInfo[0]
            search.sources._items[0].layer.definitionExpression = `CNTY_TYPE_NBR = ${cntyNumber}`
            console.log(search.sources)
            this.countyName = cntyName
            this.countyNumber = cntyNumber
            this.countyMiles = countyInfo[2]
            this.loadMap(cntyName,cntyNumber)
          });
      },
      async getCountyInfo(username){
        let county;
        //let getCounty = username.split('_')[1]
        let getCountyNbr = Object.keys(cntyNbrNm[0]).find((x) => {
          if(username.toLowerCase().includes(cntyNbrNm[0][x].replace(/\s/,'').toLowerCase())){
            console.log(cntyNbrNm[0][x])
            county = cntyNbrNm[0][x]
            return cntyNbrNm[0]
          }
        })
        console.log(getCountyNbr)
        if(getCountyNbr){
          let whereStatement = `County_NBR = '${getCountyNbr}'`
          const query = new Query();
          query.where = whereStatement
          query.outFields = [ "*" ]
          let queryResult = await countyOfficialInfo.queryFeatures(query)
          this.countyNumber = getCountyNbr
          console.log(queryResult, queryResult.features[0].attributes['Total_Mileage'], getCountyNbr)
          localStorage.setItem('county',JSON.stringify([county,getCountyNbr,queryResult.features[0].attributes['Total_Mileage']]))
          return [county, Number(getCountyNbr), queryResult.features[0].attributes['Total_Mileage']]
        }
        else{
          console.log('leggo')
          this.$router.push({ name: 'PickCounty'})
        }
      }
    },
    computed:{
      setLogOut:{
        get(){
          console.log(this.$store.state.isLoggedOut)
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
          console.log(countyNumber)
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
      }
    }
    
}
</script>
<style>
.v-dialog {
  border-radius: 0px;
}
</style>