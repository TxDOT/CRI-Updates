<template>
    <v-container>
        <v-dialog v-model="pick" persistent max-width="600">
        <v-card>
            <v-card-title class="surfaceTitleWarn">
                <v-card-text style="bottom:28px; position:relative; font-size: 15px; text-align: left; color:black">Information:</v-card-text>
                <v-card-text style="bottom:80px; position:relative; font-size: 15px; text-align: right; color:black">USERNAME: <b>{{userName}}</b></v-card-text>
            </v-card-title>
            <v-card-text>
                Your username does not specify a county.  Please a select a county to enter the County Road Inventory App.
            </v-card-text>
        </v-card>
        <v-spacer></v-spacer>
        <v-card>
            <v-card-title class="surfaceTitle">
                <v-card-text style="bottom:28px; position:relative; font-size: 15px; text-align: left;">Pick A County To Start Editing</v-card-text>
            </v-card-title>
            <v-autocomplete v-model="pickCounty" :items="cntyNames" @change="getUserName()"></v-autocomplete>
        </v-card>
        
        </v-dialog>
        <loader v-if="load"/>
    </v-container>

</template>

<script>
import {txCounties,view, featLayer, viewPoint,countyOfficialInfo} from '../components/Map/map'
import {reloadEdits} from '../components/Map/editFunc'
import {cntyNbrNm} from '../common/txCnt'
import Query from "@arcgis/core/rest/support/Query"
import loader from '../components/Map/loader.vue'

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
      getUserName(){
        console.log('autocopmplete')
        this.pick=false
        this.load=true
        let getCountyNbr = Object.keys(cntyNbrNm[0]).find(x => cntyNbrNm[0][x] === this.pickCounty)
        let whereStatement = `County_NBR = '${getCountyNbr}'`
        const query = new Query();
        query.where = whereStatement
        query.outFields = [ "*" ]
        let queryResult = countyOfficialInfo.queryFeatures(query)
        queryResult.then((result)=>{
            console.log(result, result.features[0].attributes['Total_Mileage'], getCountyNbr)
            this.countyNumber = getCountyNbr
            this.countyName = this.pickCounty
            this.countyMiles = result.features[0].attributes['Total_Mileage']
            this.goToMap(this.pickCounty, this.getCountyNbr)
        })
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
        this.load=false
        //view.goTo(viewPoint);
        //autoDrawAsset(queryFeat)
      },
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
<style scoped>
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
}
</style>