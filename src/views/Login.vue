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
import {viewPoint,countyOfficialInfo} from '../components/Map/map'
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
        appId:"9XWrQUJ2eX0jXEAW",
        expiration: 10080,
        flowType: 'auto',
        popup: false,
        portalUrl: "https://txdot.maps.arcgis.com",
        preserveUrlHash: false
      });
      document.getElementById('cardDisplay').addEventListener('load', (event)=>{
        console.log(event,'load')
      })
      // esriId.checkSignInStatus(this.auth.portalUrl + "/sharing")
      //   .then((a)=>{
      //     console.log(a)
      //     this.$router.push('/load')
      //     this.logMeIn()
      //     return;
      //   })
      //   .catch((err) => {
      //     console.log(err)
      //     return;
      //   })
      //console.log(this.auth)
      esriId.registerOAuthInfos([this.auth]);
      // this.loginStatus()
      esriId.checkSignInStatus("https://txdot.maps.arcgis.com/sharing")
        .then(()=>{
          this.handleSignedIn()
          // esriId.setOAuthRedirectionHandler(function(info){
          //     console.log(info)
          //     this.$router.push('/load')
          // })
          // console.log(a)
          // this.loginToMap = true
          // this.logMeIn(a)
          // this.$router.push('/load')
          // return;
        })
        .catch((err) => {
          console.log(err)
          return;
        })
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
          .then(()=>{
            console.log('1')
          })
              // .then(async(x)=>{
              //   console.log('hey1')
              //   console.log('hey',x)
              //   this.logIn = true
              //   this.loginToMap = true
              //   this.userName = x.userId
              //   let county = localStorage.getItem('county') ? JSON.parse(localStorage.getItem('county')) : await this.getUserName(x.userId)
              //   let cntyNumber = county[1]
              //   let cntyName = county[0]
              //   this.countyName = cntyName
              //   this.countyNumber = cntyNumber
              //   this.countyMiles = county[2]
              //   this.loadMap(cntyName,cntyNumber)
              // })
              // .catch((err)=>{
              //   console.log('error', err)
              // })
         
        

        console.log('logging in')
        
      },

      // async loginButton(){
      //   let buttonPromise = new Promise(function(res){
      //     let regExUrl = /\/(?:.(?!\/))+$/
      //     if(document.getElementById('loginButton').baseURI === `${regExUrl}/login`){
      //       document.getElementById('loginButton').addEventListener('click',()=>{
      //         this.logMeIn();
      //         res(true)
      //       })
      //     }
      //     else{
      //       res(false)
      //     }
      //   })

      //   let returnButtonPromise = await buttonPromise
      //   return returnButtonPromise
      // },

      // loginStatus(){
      //   esriId.setOAuthRedirectionHandler(function(info){
      //     console.log(info)
      //     window.location = 'http://localhost:8080/load'
      //     esriId.checkSignInStatus(this.auth.portalUrl + "/sharing")
      //       .then(async (value) => {
            
      //       this.loginToMap = true
      //       console.log(value)
      //       this.login
      //       this.userName = value.userId
      //       let county = localStorage.getItem('county') ? JSON.parse(localStorage.getItem('county')) : await this.getUserName(value.userId)//value.userId
      //       let cntyNumber = county[1]
      //       let cntyName = county[0]
      //       this.countyName = cntyName
      //       this.countyNumber = cntyNumber
      //       this.countyMiles = county[2]
      //       this.goToMap(cntyName,cntyNumber)
      //     })
      //     .catch(() => {return;})
      //     console.log('done')
      //     //this.$router.push('/load')
      //   })
      //   //console.log(await this.loginButton())
       
      // },
      async loadMap(name, nbr){
        await goToMap(name, nbr)
        // let road = await reloadEdits()
        // let objectidList = [];
        //   for(let id in road.features){
        //     if(road.features[id].attributes !== null){
        //       let objectid = road.features[id].attributes.objectid || road.features[id].attributes.OBJECTID
        //       objectidList.push(objectid)
        //     }
        //   }
        // console.log(objectidList)

        // featLayer.definitionExpression = objectidList.length ? `OBJECTID not in (${objectidList}) and CNTY_TYPE_NM = '${name}'`: `CNTY_TYPE_NM = '${name}'`
        // console.log(nbr, name)
        // txCounties.definitionExpression=`CNTY_NM='${name}'`
        
        // const query = new Query();
        // query.where = `CNTY_NM = '${name}'`
        // query.outFields = [ "*" ]
        // query.returnGeometry = true
        // let countyQuery = txCounties.queryFeatures(query)
        // let returnCountyObj = await countyQuery
        // view.goTo({
        //   target: returnCountyObj.features[0].geometry
        // })
        console.log(viewPoint)
        this.$router.push('/map')
        this.loginToMap = false
        //view.goTo(viewPoint);
        //autoDrawAsset(queryFeat)
      },
      handleSignedIn() {
        const portal = new Portal();
        portal.load()
          .then( async () => {
            this.loginToMap = true
            this.$router.push('/load')
            const results = { name: portal.user.fullName, username: portal.user.username };
            console.log(results)
            
            let county = localStorage.getItem('county') ? JSON.parse(localStorage.getItem('county')) : await this.getUserName(portal.user.username)
            this.userName = portal.user.username 
            let cntyNumber = county[1]
            let cntyName = county[0]
            this.countyName = cntyName
            this.countyNumber = cntyNumber
            this.countyMiles = county[2]
            this.loadMap(cntyName,cntyNumber)
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