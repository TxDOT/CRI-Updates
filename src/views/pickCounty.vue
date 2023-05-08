<!-- dropdown menu for county -->
<template>
    <v-container>
        <v-dialog v-model="pick" persistent max-width="320" class="borderRadius">
        <v-card class="borderRadius" height=200 max-width="100%">
            <v-card-title class="surfaceTitle">
                <v-card-text id="pickerTitle">County Road Inventory Map</v-card-text>
            </v-card-title>
            <v-card-text class="textSymb" id="pickerTxt">
                Select a county to begin work.
            </v-card-text>
            <v-autocomplete id="pickCount" class="countyPicker" persistent-placeholder outlined dense tile v-model="pickCounty" :items="cntyNames" label="County Name"></v-autocomplete>

            <div>
              <v-btn :disabled="pickCounty.length === 0" outlined id="continueBtn" depressed color="#204E70" tile @click="getCountyInfo()"><u>Continue</u></v-btn>
              <v-btn id="cancelBtn" depressed text color="#204E70" tile @click="cancel()"><u>Cancel</u></v-btn>
            </div>
        </v-card>
        
        </v-dialog>
        <loader v-if="load"/>
    </v-container>

</template>

<script>
import {countyOfficialInfo} from '../components/Map/map'
import {goToMap} from '../components/Map/login'
import {cntyNbrNm} from '../common/txCnt'
import Query from "@arcgis/core/rest/support/Query"
import loader from '../components/Map/loader.vue'
import esriId from "@arcgis/core/identity/IdentityManager";

export default {
    name: 'PickCounty',
    components: {loader},
    props:['id'],
    data(){
        return{
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
            pick: true, 
            load: false
        }
    },
    methods:{
      cancel(){
        esriId.checkSignInStatus("https://txdot.maps.arcgis.com/sharing")
          .then(()=>{
            esriId.destroyCredentials()
            localStorage.removeItem('county')
            this.$router.push('/login')
          })
          .catch(()=>{
            this.$router.push('/login')
          })
      },
      getCountyInfo(){
        this.pick=false
        this.load=true
        let getCountyNbr = Object.keys(cntyNbrNm[0]).find(x => cntyNbrNm[0][x] === this.pickCounty)
        console.log(getCountyNbr)
        let whereStatement = `CNTY_NBR = '${getCountyNbr}'`

        const query = new Query();
        query.where = whereStatement
        query.outFields = [ "*" ]
        let queryResult = countyOfficialInfo.queryFeatures(query)
        queryResult.then((result)=>{
          console.log(result)
          this.countyNumber = getCountyNbr
          this.countyName = this.pickCounty
          this.judgeCntyOid = result.features[0].attributes['OBJECTID_1']
          this.countyMiles = result.features[0].attributes['TOT_MLGE']
          this.judgeNameSend = result.features[0].attributes['JUDGE_NM'].trim()
          this.judgeEmailSend = result.features[0].attributes['JUDGE_EML']
          console.log(this.judgeNameSend)
          this.loadData(this.pickCounty, getCountyNbr)
        })
      },
      async loadData(name, nbr){
        goToMap(name, nbr)
          .then(() =>{
            this.$router.push('/map')
            this.load=false
          })
          .catch(()=>{
            this.$router.push({name: "error"})
          })

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
      }
    }
    
}
</script>
<style scoped>
.countyPicker{
  position: absolute;
  width: 48%; 
  right: 8.9rem; 
  top: 6rem; 
  border-radius: 0%;
}
#pickCount input {
  cursor: pointer;
}
.surfaceTitle{
  background-color: #204E70;
  color: white;
  height:30px;
  width: 100%;
  font-size: 25px; 
}
.surfaceTitleWarn{
  background-color: yellow;
  color: white;
  height:30px;
  width: 100%;
  font-size: 25px; 
  border-radius: 0%;
}
.borderRadius{
  border-radius:0%;
}
#pickerTitle{
  position:relative; 
  bottom: 27px; 
  right: 20px; 
  font-size: 15px; 
  text-align: left;
  color:white; 
  padding: none;
}
#pickerTxt{
  position: relative; 
  top: 30px;
}
#continueBtn{
  top:5rem; 
  left: 9rem; 
  width: 100px; 
  border: 1px solid black
}
#cancelBtn{
  top:5rem; 
  right: 3rem
}
</style>