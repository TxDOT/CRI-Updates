<template>
    <v-dialog
      v-model="disagree"
      persistent
      max-width="500"
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
            <v-card-text style="color:#15648C;" v-html="disagreeTxt">
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
import {txCounties,view, featLayer, viewPoint,countyOfficialInfo} from '../components/Map/map'
import {reloadEdits} from '../components/Map/editFunc'
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
        disagreeTxt:'<br><br>Click on the Login button to use your CRI credentials to access DUSA. If you do not have a DUSA account, click on the sign up button to register.',
        judgeName:'',
        county:'',
        auth: {},
        cntyNme:'',
        loginToMap: false
        }
    },
    beforeRouteLeave(to, from, next){
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
        appId:"Chsd9GwkzlckpRBr",
        expiration: 10080,
        flowType: 'auto',
        popup: false,
        portalUrl: "https://txdot.maps.arcgis.com",
        preserveUrlHash: true
      });
      console.log(this.auth)
      esriId.registerOAuthInfos([this.auth]);
      this.loginStatus()
      console.log(document.getElementById('loginButton').baseURI)
      
      //this.loginStatus();
      // await this.logMeIn();
      // console.log('whatup before')
      // document.getElementById('loginButton').addEventListener('click',()=>{
      //   console.log('step 1')
      //   this.loginStatus();
      //   this.logMeIn();
      // })
      // this.logMeIn();
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
          .then((x)=>{
            console.log('hey',x)
            esriId.checkSignInStatus(this.auth.portalUrl + "/sharing")
              .then(async (value) => {
                console.log(value)
                this.loginToMap = true
                this.userName = value.userId
                let county = localStorage.getItem('county') ? JSON.parse(localStorage.getItem('county')) : await this.getUserName(value.userId)
                let cntyNumber = county[1]
                let cntyName = county[0]
                this.countyName = cntyName
                this.countyNumber = cntyNumber
                this.countyMiles = county[2]
                this.goToMap(cntyName,cntyNumber)
          })
          .catch((error) => {
            console.log('new Error', error)
            return;})
          })
          .catch((error) =>{
            console.log('error', error)
            return;
          })
        console.log('logging in')
        
      },

      async loginButton(){
        let buttonPromise = new Promise(function(res){
          let regExUrl = /\/(?:.(?!\/))+$/
          if(document.getElementById('loginButton').baseURI === `${regExUrl}/login`){
            document.getElementById('loginButton').addEventListener('click',()=>{
              this.logMeIn();
              res(true)
            })
          }
          else{
            res(false)
          }
        })

        let returnButtonPromise = await buttonPromise
        return returnButtonPromise
      },

      async loginStatus(){
        console.log(await this.loginButton())
        esriId.checkSignInStatus(this.auth.portalUrl + "/sharing")
          .then(async (value) => {
            this.loginToMap = true
            console.log(value)
            this.login
            this.userName = value.userId
            let county = localStorage.getItem('county') ? JSON.parse(localStorage.getItem('county')) : await this.getUserName(value.userId)//value.userId
            let cntyNumber = county[1]
            let cntyName = county[0]
            this.countyName = cntyName
            this.countyNumber = cntyNumber
            this.countyMiles = county[2]
            this.goToMap(cntyName,cntyNumber)
          })
          .catch(() => {return;})
        console.log('done')
      },
      async goToMap(name, nbr){
        let road = await reloadEdits()
        let objectidList = [];
          for(let id in road.features){
            if(road.features[id].attributes !== null){
              let objectid = road.features[id].attributes.objectid || road.features[id].attributes.OBJECTID
              objectidList.push(objectid)
            }
          }
          console.log(objectidList)

          featLayer.definitionExpression = objectidList.length ? `OBJECTID not in (${objectidList}) and CNTY_TYPE_NM = '${name}'`: `CNTY_TYPE_NM = '${name}'`
        // reloadEdits().then((road)=>{
        //   let objectidList = [];
        //   for(let id in road.features){
        //     if(road.features[id].attributes !== null){
        //       let objectid = road.features[id].attributes.objectid || road.features[id].attributes.OBJECTID
        //       objectidList.push(objectid)
        //     }
        //   }
        //   console.log(objectidList)

        //   featLayer.definitionExpression = objectidList.length ? `OBJECTID not in (${objectidList}) and CNTY_TYPE_NM = '${name}'`: `CNTY_TYPE_NM = '${name}'`
        // });
        console.log(nbr)
        //featLayer.definitionExpression =`CNTY_TYPE_NM = '${name}'`
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
        this.$router.push('/map')
        this.loginToMap = false
        //view.goTo(viewPoint);
        //autoDrawAsset(queryFeat)
      },
      handleSignedIn() {
        const portal = new Portal();
        portal.load().then(() => {
          const results = { name: portal.user.fullName, username: portal.user.username };
          console.log(results)
        });
      },
      async getUserName(username){
        let county;
        //let getCounty = username.split('_')[1]
        let getCountyNbr = Object.keys(cntyNbrNm[0]).find((x) => {
          if(username.toLowerCase().includes(cntyNbrNm[0][x].replace(/\s/,'').toLowerCase())){
            console.log(cntyNbrNm[0][x])
            county = cntyNbrNm[0][x]
            return cntyNbrNm[0]
          }
        })

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
          this.$router.push('/pickCounty')
        }
        
       
        //let getCountyNbr = 
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
    }
    
}
</script>
<style>
.v-dialog {
  border-radius: 0px;
}
</style>