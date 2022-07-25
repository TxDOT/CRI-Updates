<template>
    <v-dialog
      v-model="disagree"
      persistent
      max-width="500">
      <v-card v-model="disagree" height="300">
         <v-img><img style="position:relative; top:0%;" src="@/assets/favicon-32x32.png"></v-img>
        <v-card-actions>
          <div style="position:absolute; top:10%; left: 0%; width:100%" v-if="certify===false">
            <v-alert color="#14375A" border="top" dark v-html="statusMessageFalse"></v-alert>
          </div>
          <div style="position:absolute; top:10%; left: 0%" v-if="certify===true">
          <v-alert color="green" border="top" dark v-html="statusMessageTrue" class="black--text mb-3" >
          </v-alert>
          </div>
          <div style="position:absolute; top:20%; left: 5%" class="black--text mb-3">
            <v-card-text style="color:#15648C" v-html="disagreeTxt">
            </v-card-text>
          </div>
          <div style="position:absolute; left: 10%; bottom: 5%; width=100%">
            <div style="position:relative; left:200%; top:0%">
              <v-btn id="loginButton" elevation="2" @click="disagree = false; logMeIn();" color="primary"> <!-- goToMap() -->
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
        cntyNames: ['Anderson', 'Andrews', 'Angelina', 'Aransas', 'Archer', 'Armstrong', 'Atascosa', 'Austin', 'Bailey', 'Bandera',
                    'Bastrop', 'Baylor', 'Bee', 'Bell', 'Bexar', 'Blanco', 'Borden', 'Bosque', 'Bowie', 'Brazoria',
                    'Brazos', 'Brewster', 'Briscoe', 'Brooks', 'Brown', 'Burleson', 'Burnet', 'Caldwell', 'Calhoun', 'Callahan', 
                    'Cameron', 'Camp', 'Carson', 'Cass', 'Castro', 'Chambers', 'Cherokee', 'Childress', 'Clay', 'Cochran', 
                    'Coke', 'Coleman', 'Collin', 'Collingsworth', 'Colorado', 'Comal', 'Comanche', 'Concho', 'Cooke', 'Coryell', 
                    'Cottle', 'Crane', 'Crockett', 'Crosby', 'Culberson', 'Dallam', 'Dallas', 'Dawson', 'De Witt', 'Deaf Smith', 
                    'Delta', 'Denton', 'Dickens', 'Dimmit', 'Donley', 'Duval', 'Eastland', 'Ector', 'Edwards', 'El Paso', 
                    'Ellis', 'Erath', 'Falls', 'Fannin', 'Fayette', 'Fisher', 'Floyd', 'Foard', 'Fort Bend', 'Franklin', 
                    'Freestone', 'Frio', 'Gaines', 'Galveston', 'Garza', 'Gillespie', 'Glasscock', 'Goliad', 'Gonzales', 'Gray', 
                    'Grayson', 'Gregg', 'Grimes', 'Guadalupe', 'Hale', 'Hall', 'Hamilton', 'Hansford', 'Hardeman', 'Hardin',
                    'Harris', 'Harrison', 'Hartley', 'Haskell', 'Hays', 'Hemphill', 'Henderson', 'Hidalgo', 'Hill',
                    'Hockley', 'Hood', 'Hopkins', 'Houston', 'Howard', 'Hudspeth', 'Hunt', 'Hutchinson', 'Irion', 
                    'Jack', 'Jackson', 'Jasper', 'Jeff Davis', 'Jefferson', 'Jim Hogg', 'Jim Wells', 'Johnson', 'Jones',
                    'Karnes', 'Kaufman', 'Kendall', 'Kenedy', 'Kent', 'Kerr', 'Kimble', 'King', 'Kinney', 'Kleberg',
                    'Knox', 'La Salle', 'Lamar', 'Lamb', 'Lampasas', 'Lavaca', 'Lee', 'Leon', 'Liberty', 
                    'Limestone', 'Lipscomb', 'Live Oak', 'Llano', 'Loving', 'Lubbock', 'Lynn', 'Madison', 'Marion',
                    'Martin', 'Mason', 'Matagorda', 'Maverick', 'McCulloch', 'McLennan', 'McMullen', 'Medina',
                    'Menard', 'Midland', 'Milam', 'Mills', 'Mitchell', 'Montague', 'Montgomery', 'Moore', 'Morris', 
                    'Motley', 'Nacogdoches', 'Navarro', 'Newton', 'Nolan', 'Nueces', 'Ochiltree', 'Oldham', 'Orange',
                    'Palo Pinto', 'Panola', 'Parker', 'Parmer', 'Pecos', 'Polk', 'Potter', 'Presidio', 'Rains', 
                    'Randall', 'Reagan', 'Real', 'Red River', 'Reeves', 'Refugio', 'Roberts', 'Robertson', 'Rockwall',
                    'Runnels', 'Rusk', 'Sabine', 'San Augustine', 'San Jacinto', 'San Patricio', 'San Saba', 'Schleicher', 
                    'Scurry', 'Shackelford', 'Shelby', 'Sherman', 'Smith', 'Somervell', 'Starr', 'Stephens', 
                    'Sterling', 'Stonewall', 'Sutton', 'Tarrant', 'Taylor', 'Terrell', 'Terry', 'Throckmorton', 
                    'Titus', 'Tom Green', 'Travis', 'Trinity', 'Tyler', 'Upshur', 'Upton', 'Uvalde', 'Val Verde', 
                    'Van Zandt', 'Victoria', 'Walker', 'Waller', 'Ward', 'Washington', 'Webb', 'Wharton', 'Wheeler', 
                    'Wichita', 'Wilbarger', 'Willacy', 'Williamson', 'Wilson', 'Winkler', 'Wise', 'Wood', 'Yoakum', 
                    'Young', 'Zapata', 'Zavala', 'Swisher'],
          pickCounty: '',
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
      this.statusMessageFalse =`Welcome To TxDOTs County Road Inventory App`
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
          if(document.getElementById('loginButton').baseURI === 'http://localhost:8080/login'){
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
        let getCounty = username.split('_')[1]
        let getCountyNbr = Object.keys(cntyNbrNm[0]).find(x => cntyNbrNm[0][x] === getCounty)
        console.log(getCountyNbr)
        if(getCountyNbr){
          let whereStatement = `County_NBR = '${getCountyNbr}'`
          const query = new Query();
          query.where = whereStatement
          query.outFields = [ "*" ]
          let queryResult = await countyOfficialInfo.queryFeatures(query)
          this.countyNumber = getCountyNbr
          console.log(queryResult, queryResult.features[0].attributes['Total_Mileage'], getCountyNbr)
          localStorage.setItem('county',JSON.stringify([getCounty,getCountyNbr,queryResult.features[0].attributes['Total_Mileage']]))
          return [getCounty, Number(getCountyNbr), queryResult.features[0].attributes['Total_Mileage']]
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