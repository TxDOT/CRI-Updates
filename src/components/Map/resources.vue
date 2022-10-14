<template>
  <v-container>
    <v-list class="outlineColor" style="position: absolute; bottom: 3vh; width: 98%">
      <v-list-item-group v-model="clearEditBtn" color="#15648C">
        <v-list-item v-for="(item,i) in items" :key="i" @click="item.action" :disabled="item.disabled" :id="item.id">
          <v-list-item-icon>
            <v-icon v-text="item.icon" color="black" :disabled="item.disabled"></v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title v-text="item.title"></v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list-item-group>
    </v-list>
    <v-dialog
      v-model="display"
      max-width="700"
      persistent>
      <v-card v-model="display" height="590" style="border-radius:0%; overflow-y: hidden; overflow-x: hidden;">
          <v-card-title class="surfaceTitle"><p style="bottom: .7rem; position:relative; right: .5rem;">Advanced Page</p></v-card-title>
            <v-icon style="position: relative; font-size: 2rem; top: 1.8rem; right: 18rem; color:black">mdi-table-large</v-icon>
            <v-card-text style="text-align:left; color: black; bottom: 0.2rem; position: relative; left: 5rem;">
              <b>DOWNLOAD ROAD LOG<br>
              Download a table of your county's road information.</b><br>
              <p style="font-size: .8rem;">This is a CSV file that anyone can open using a spreadsheet software such as Microsoft Excel or<br>
              Google Sheets.</p>
            </v-card-text>
            <v-btn small outlined tile @click="display = false; downloadRoadLog(); isFileDwnload=true" color="#14375A" style="position: absolute; left: 6.5rem; top: 10rem; border: 1px solid black" >
              <u>Download</u>
            </v-btn>
            <v-divider style="width: 90%; position: relative; top: .8rem; left: 2rem; border-color:black"></v-divider>
            <v-card-text style="text-align:left; color: red; top: 1.5rem; position: relative; left: 2rem;">
              <b>Disclaimer:</b> This section is for advanced GIS users.
            </v-card-text>
            <v-icon style="position: relative; font-size: 2rem; top: 1rem; right: 18rem; color:black">mdi-layers</v-icon>
            <v-card-text style="text-align:left; color: black; bottom: 1.1rem; position: relative; left: 5rem;">
              <b>DOWNLOAD INVENTORY<br>
              Download TxDOT's county road inventory for your county.</b><br>
              <p style="font-size: .8rem;">This is GIS data which allows GIS professionals to compare TxDOT's CRI with their inventory for<br>discrepancies.</p>
            </v-card-text>
            <v-btn outlined tile small @click="display = false; exitApp = true; cntyQueryTab()" color="#14375A" style="position: absolute; left: 6.5rem; top: 21.5rem; border: 1px solid black">
              <u>Download</u>
            </v-btn>
            <v-icon style="position: relative; font-size: 2rem; top: .8rem; right: 18rem; color:black">mdi-upload</v-icon>
            <v-card-text style="text-align:left; color: black; bottom: 1.3rem; position: relative; left: 5rem;">
              <b>UPLOAD GIS DATA<br>
                Drag and drop your suggested road edits.</b><br>
              <p style="font-size: .8rem;">Acceptable file formats include shapefiles, and file geodatabases. Only submit<br>changes to your inventory with adds, removes, and updates. Please do not submit your<br>county's entire road inventory.</p>
            </v-card-text>
            <v-btn outlined tile small @click="display = false; dragDropClick = true;" color="#14375A" style="position: absolute; left: 6.5rem; top: 32.5rem; border: 1px solid black">
              <u>Upload</u>
            </v-btn>
          </v-card>
      </v-dialog>
      <v-dialog v-model="exitApp" max-width="350">
        <v-card style="border-radius:0%; overflow-y: hidden; overflow-x: hidden;">
          <v-card-title>External Site</v-card-title>
          <v-card-text style="text-align: left; color:black">You can download your counties roads via the new tab.</v-card-text>
       </v-card>
      </v-dialog>
      <v-dialog v-model="isFileDwnload" width="500">
        <v-card tile>
          <v-card-title style="background-color:#14375A; color:white;"><p style="position: relative; bottom: 0rem;">Downloading Road Log</p></v-card-title>
          <v-progress-linear background-color="white" indeterminate color="green" style="position:absolute; bottom: .2rem;"></v-progress-linear>
        </v-card>
      </v-dialog>
      <v-dialog v-model="isFileSuccess" max-width="350" >
        <v-card tile style="height:10rem;">
          <v-card-title class="surfaceTitle" style="background-color:#14375A; color:white;"><p style="position:absolute; top: .4rem; left: 1rem;"><v-icon color="green" style="position:relative; bottom:.1rem;">mdi-check-bold</v-icon>  Road Log Success</p></v-card-title>
          <v-card-text style="position:absolute; top: 4rem; text-align: left; color:black; right: .5rem;">
            Road Log has Succesfully downloaded. Look in Downloads folder or user save location.
          </v-card-text>
        </v-card>
      </v-dialog>

  </v-container>
</template>

<script>
  import { downloadRdLog } from "./editFunc"
  //import stepper from "../components/stepperQuestion.vue"
  //import alert from './Map/alert.vue'
  export default {
    name: 'aboutHelp',
    data (){
      return {
        countyNm: null,
        isFileSuccess: false,
        isFileDwnload: false,
        disclaimer: false,
        exitApp: false,
        display:false,
        drawer: true,
        items: [
          { title: 'Advanced', icon: 'mdi-cog', action: ()=>{
              this.display = true
              this.clearEditBtn = true
              this.removeBtnFocus();
            }},
          { title: 'Criteria', icon: 'mdi-clipboard-text', action: ()=>{
              window.open('https://www.txdot.gov/data-maps/roadway-inventory/county-road-criteria.html', '_blank')
              this.removeBtnFocus();
            }
          },
          { title: 'Help & Training', icon: 'mdi-help-circle', action: ()=>{
              window.open('https://youtube.com/playlist?list=PLyLWQADRroOUeiQ8sXX3JMVQeu87sgig2', '_blank')
              this.clearEditBtn = true
              this.removeBtnFocus();
            }
          },
          { title: 'About', icon: 'mdi-home', action: ()=>{
              this.aboutClick = true
            }
          }
        ],
      }
    },
    methods:{
      cntyQueryTab(){
        setTimeout(()=>{
          window.open(`https://opendata.arcgis.com/api/v3/datasets/008906d83772435bb757cb76c9644e5d_0/downloads/data?format=shp&spatialRefId=4326&where=(COUNTY+IN+('${this.countyNm}'))`, '_blank')
          //https://opendata.arcgis.com/api/v3/datasets/008906d83772435bb757cb76c9644e5d_0/downloads?spatialRefId=4326&formats=shp&where=(COUNTY IN ('Fort Bend'))
          this.exitApp = false
        },3000)
      },
      async downloadRoadLog(){
        await downloadRdLog()
      },
      removeBtnFocus(){
        setTimeout(()=>{
          this.clearEditBtn = false
        },1000)
      },
      removeFileSuccess(){
        setTimeout(()=>{
          this.isFileSuccess = false
          this.isDownloadRoadLog = false
        },2000)
      }
    },
    watch:{
      isDownloadRoadLog:{
        handler: function(){
          if(this.isDownloadRoadLog === true){
            this.isFileSuccess = true
            this.isFileDwnload = false
            this.removeFileSuccess()
            return
          }
          return
        },
        immediate: true
      },
      countyName:{
        handler: function(){
          this.countyNm = this.countyName
        },
        immediate: true
      }
    },
    computed:{
      aboutClick:{
        get(){
          return this.$store.state.isAbout
        },
        set(bool){
          this.$store.commit('setIsAbout', bool)
        }
      },
      clearEditBtn:{
        get(){
          return this.$store.state.isClearAboutHelpTools
        },
        set(isBool){
          this.$store.commit('setIsAboutHelpTools', isBool)
        }
      },
      dragDropClick:{
        get(){
          return this.$store.state.isDragDrop
        },
        set(isBool){
          this.$store.commit('setIsDragDrop', isBool)
        }
      },
      isDownloadRoadLog:{
        get(){
          return this.$store.state.isDownload
        },
        set(isBool){
          this.$store.commit('setIsDownload', isBool)
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
    }
  }
</script>
<style scoped>
.v-list-item{
  display: flex;
  text-align: left;
}

.outlineColor .v-list-item-group .v-list-item--active{
  outline: #15648C solid 2px;
}

.v-application--is-ltr .v-list-item__action:first-child, .v-application--is-ltr .v-list-item__icon:first-child{
  margin-right: 16px;
}
.surfaceTitle{
  background-color: #14375A;
  text-align: left;
  top:0%;
  color: white;
  bottom:40px;
  height:40px;
  padding: none;
  width: 100%;
  font-size: 16px;
}
</style>