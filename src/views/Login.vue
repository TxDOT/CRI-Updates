<template>
    <v-dialog
      v-model="disagree"
      persistent
      max-width="500">
      <v-card v-model="disagree" height="300">
         <v-img><img style="position:relative; top:0%;" src="@/assets/favicon-32x32.png"></v-img>
        <v-card-actions>
          <div style="position:absolute; top:10%; left: 0%" v-if="certify===false">
          <v-alert color="red lighten-2" border="top" dark v-html="statusMessageFalse" class="black--text mb-3" >
          </v-alert>
          </div>
          <div style="position:absolute; top:10%; left: 0%" v-if="certify===true">
          <v-alert color="green" border="top" dark v-html="statusMessageTrue" class="black--text mb-3" >
          </v-alert>
          </div>
          <div style="position:absolute; top:20%; left: 5%" class="black--text mb-3">
            <v-card-text v-html="disagreeTxt">
            </v-card-text>
          </div>
          <div style="position:absolute; left: 10%; bottom: 5%; width=100%">
            <div style="position:relative; left:200%; top:0%">
              <v-btn id="loginButton" elevation="2" @click="disagree = false;logMeIn()" color="primary"> <!-- goToMap() -->
                Login
              </v-btn>
            </div>
            <div style="position:relative; right:50%; bottom:10%">
              <v-btn x-small elevation="0" outlined color="primary" onclick="window.location.href='https://www.dot.state.tx.us/apps-cg/contact_us/form/dusa-form.htm'" >
                Sign-Up
              </v-btn>
            </div>
          </div>
        </v-card-actions>
      </v-card>
    </v-dialog>
</template>

<script>
//import {autoDrawAsset} from '../components/Map/editFunc'
import {txCounties,view, featLayer, viewPoint} from '../components/Map/map'
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
        disagreeTxt:'<br><br>Click on the Login button to use your CRI credentials to access DUSA. If you do not have a DUSA account, click on the sign up button to register.',
        judgeName:'',
        county:'',
        auth: {},
        cntyNme:''
        }
    },
    mounted(){

      this.auth = new OAuthInfo({
        appId:"Chsd9GwkzlckpRBr",
        expiration: 10080,
        flowType: 'auto',
        popup: false,
        portalUrl: "https://txdot.maps.arcgis.com",
        preserveUrlHash: true
      });
      esriId.registerOAuthInfos([this.auth]);
      
      this.loginStatus();
      document.getElementById('loginButton').addEventListener('click',()=>{
        this.loginStatus();
        this.logMeIn();
      })
      this.certify = false;

      const todayDate = new Date();
      this.certiAlert = `<p>By clicking submit, you are certifying the mileage for your county and completing the process for ${todayDate.getFullYear()-1}.<br> Edits made in ${todayDate.getFullYear()} after certifying are allowed, but will need to be recertified by the county judge prior to <DATE> in order to be accepted.`
      todayDate.toDateString()
      this.statusMessageFalse =`As of today, ${todayDate.toDateString().substring(4,15)}, ${this.countyName} County mileage has not been certified`
      this.statusMessageTrue =`As of today, ${todayDate.toDateString().substring(4,15)}, ${this.countyName} County mileage has been certified`
    },
    methods:{
      logMeIn(){
        esriId.getCredential(this.auth.portalUrl + "/sharing")
          .then(()=>{
            this.goToMap(this.countyName,this.countyNumber)
            esriId.setOAuthRedirectionHandler(function(info){
              console.log(info)
            })
          })
          .catch(error =>{
            console.log('error', error)
          })
        console.log('logging in')
      },
      loginStatus(){
        esriId.checkSignInStatus(this.auth.portalUrl + "/sharing")
          .then((value) => {
            this.userName = value.userId
            let county = JSON.parse(localStorage.getItem('county'))
            let cntyNumber = county[1]
            let cntyName = county[0]
            this.countyName = cntyName
            this.countyNumber = cntyNumber
            this.countyMiles = county[2]
            this.goToMap(cntyName,cntyNumber)
          })
      },
      async goToMap(name, nbr){
        this.$router.push('/map')
        console.log(nbr)
        featLayer.definitionExpression =`CNTY_TYPE_NM = '${name}'`
        txCounties.definitionExpression=`CNTY_NM='${name}'`
        //rdbdSrfcGeom.definitionExpression=`CNTY_NM='${name}'`
        const query = new Query();
        query.where = `CNTY_NM = '${name}'`
        query.outFields = [ "*" ]
        query.returnGeometry = true
        let countyQuery = txCounties.queryFeatures(query)
        let returnCountyObj = await countyQuery
        view.goTo({
          target: returnCountyObj.features[0].geometry
        })
        console.log(viewPoint)
        //view.goTo(viewPoint);
        //autoDrawAsset(queryFeat)
      },
      handleSignedIn() {
        const portal = new Portal();
        portal.load().then(() => {
          const results = { name: portal.user.fullName, username: portal.user.username };
          console.log(results)
        });
      }
    },
    computed:{
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
      }
    }
    
}
</script>