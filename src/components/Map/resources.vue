<!-- Resources component contains: Advanced, Citeria, Training, About -->
<template>
  <v-container>
    <v-list class="outlineColor" id="advanceList">
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
      <v-card v-model="display" height="810px" id="advancedCard">
        <v-card-title class="surfaceTitle">
          <p id="advCardTitleTxt">Advanced Page</p>
        </v-card-title>
        <v-icon id="tableIcon">mdi-table-large</v-icon>
        <v-card-text class="textSymb" id="roadLogTxt">
          <b>DOWNLOAD ROAD LOG<br>
          Download a table of your county's road information.</b><br>
          <p class="itemText">This is a CSV file that anyone can open using a spreadsheet software such as Microsoft Excel or<br>Google Sheets.</p>
        </v-card-text>
        <v-btn small outlined tile @click="display = false; downloadRoadLog(); isFileDwnload=true" color="#14375A" id="dwnloadBtn">
          <u>Download</u>
        </v-btn>
        <v-icon id="layerIcon">mdi-layers</v-icon>
        <v-card-text class="textSymb" id="dwnldInvTxt">
          <b>DOWNLOAD INVENTORY<br>
          Download TxDOT's county road inventory for your county.</b><br>
          <p class="itemText">This is GIS data which allows GIS professionals to compare TxDOT's CRI with their inventory for<br>discrepancies.</p>
        </v-card-text>
        <v-btn outlined tile small @click="display = false; exitApp = true; cntyQueryTab()" color="#14375A" id="downloadBtn">
          <u>Download</u>
        </v-btn> 
        <v-divider id="divider"></v-divider>
        <v-alert :id="isCert === false ? 'disclaimer' : 'disclaimerF'" tile>
          <p id="disclaimerTxt" v-if="isCert === true">The optional features below are for advanced GIS users only.</p>
          <p id="disclaimerTxt" v-if="isCert === false">The optional features below are for advanced GIS users only.<br>Training is required in order to access these features.</p>
          <v-btn id="trainingBtn" :href="reqTrainingEmail()" tile outlined color="#14375A" @click="close('isUserCertify')" small v-if="isCert === false">Request Training</v-btn>
        </v-alert>
        <v-icon id="uploadIcon" :disabled="isCert === false">mdi-download</v-icon>
        <v-card-text id="uploadTxt" :class="isCert === false ? 'textSymbDisable' : 'textSymb'">
          <b>DOWNLOAD TEMPLATE<br>
          Download an empty feature class template.</b><br>
          <p class="itemText">This file geodatabase contains an empty feature class formatted for uploading your GIS inventory<br>updates using the upload feature below.</p>
        </v-card-text>
        <v-btn outlined tile small @click="display = false; downloadTemp()" color="#14375A" :id="isCert === false ? 'dwnloadTempBtn' : 'dwnloadTempBtnF'" :disabled="isCert===false">
          <u>Download</u>
        </v-btn>
        <div id="downloadInst">
          <v-icon small>mdi-information</v-icon><a @click="downloadPdf()" :id="isCert===false ? 'disableDwnldInstruct': 'dwnloadInstruct'" :disabled="isCert===false">Click here to download instructions.</a>
        </div>
        <v-icon id="uploadIcon" :disabled="isCert===false">mdi-upload</v-icon>
        <v-card-text id="uploadTxt" :class="isCert === false ? 'textSymbDisable' : 'textSymb'">
          <b>UPLOAD GIS DATA<br>
          Drag and drop your suggested road edits.</b><br>
          <p class="itemText">Upload inventory updates loaded into the template provided above. Only submit<br>changes to your inventory with adds, removes, and updates. Please do not submit your<br>county's entire road inventory.</p>
        </v-card-text>
        <v-btn outlined tile small @click="display = false; dragDropClick = true;" color="#14375A" :id="isCert === false ? 'uploadBtn' : 'uploadBtnF'" :disabled="isCert===false || this.disable === true">
          <u>{{ uploadGISData }}</u>
        </v-btn>
        <v-btn id="closeBtn" tile outlined color="#14375A" @click="display = false">Close</v-btn>
      </v-card>
    </v-dialog>
    <v-dialog v-model="isFileDwnload" width="500">
      <v-card tile>
        <v-card-title class="titles"><p style="position: relative">Downloading Road Log</p></v-card-title>
        <v-progress-linear background-color="white" indeterminate color="green" id="progressLoad"></v-progress-linear>
      </v-card>
    </v-dialog>
    <v-dialog v-model="isFileSuccess" max-width="350" >
      <v-card tile style="height:10rem;">
        <v-card-title class="surfaceTitle titles"><p id="rdLogSucc"><v-icon color="green" id="rdLogIcon">mdi-check-bold</v-icon>Road Log Success</p></v-card-title>
        <v-card-text class="textSymb" id="rdLogTxt">
          Road Log has Succesfully downloaded. Look in Downloads folder or user save location.
        </v-card-text>
      </v-card>
    </v-dialog>
    <v-dialog v-model="isWebexTraining" max-width="500" persistent>
      <v-card tile style="height:19rem;">
        <v-card-title class="surfaceTitle titles"><p id="webExTraining">Webex Training Schedule</p></v-card-title>
        <v-card-text class="textSymb" id="rdLogTxt">
          For those who need assistance, TxDOT will be hosting live WebEx video training on these dates:<br><br>
          <ul>
            <li>Thursday, June 13, 2024, 2:00 – 3:00 pm<br></li>
            <li>Thursday, July 18, 2024, 2:00 – 3:00 pm<br></li>
            <li>Thursday, August 15, 2024, 2:00 – 3:00 pm<br></li>
          </ul>
          <br>
          To join training, click the following link: <a href="https://txdot.webex.com/join/jferrell" target="_blank">https://txdot.webex.com/join/jferrell</a>
        </v-card-text>
        <v-btn outlined tile color="#14375A" id="webexbtn" @click="webexClose()">CLOSE</v-btn>
      </v-card>
    </v-dialog>
    <v-dialog v-model="isHelpTraining" width="1000" persistent>
      <v-card tile height="315">
        <v-card-title class="surfaceTitle"><p id="helpTrainPos">Help and Training</p></v-card-title>
          <v-card-text>
            <v-item-group>
              <v-container>
                <v-row>
                  <v-col v-for="n in 5" :key="n" md="2.6" >
                    <v-item>
                      <v-tooltip bottom max-width="200" color="#204E70" style="border-radius: 0px;"> 
                        <template v-slot:activator="{ on, attrs }">
                          <v-card v-bind="attrs" v-on="on" tile ripple dark height="200" @click="openPage(mediaType[n])" color="green"><p id="helpTrainContent">{{mediaType[n]}}</p><v-icon id="helpTrainIcon">{{iconType[n]}}</v-icon></v-card>
                        </template>
                        <span>{{tooltips[n]}}</span>
                      </v-tooltip>
                    </v-item>
                  </v-col>
                </v-row>
                <v-btn id="tourBtn" tile text @click="takeTour()">take a tour</v-btn>
              </v-container>
            </v-item-group>
          </v-card-text>
          <v-btn id="clseBtnHelp" outlined tile color="#204E70" @click="close('isHelpTraining')">close</v-btn>
      </v-card>
    </v-dialog>
    <v-dialog v-model="faqs" id="faqDialog" persistent>
      <v-card class="card" id="dialogWidth" >
        <v-card-title class="cardTitle" id="faqTitle">
          <p id="faqsName">FAQs</p>
        </v-card-title>
        <v-card-text>
          <v-expansion-panels accordion flat>
            <v-expansion-panel>
              <v-expansion-panel-header>Can I add a county road that’s inside a city boundary?</v-expansion-panel-header>
              <v-expansion-panel-content class="expandPanelContent">
                No. Roads inside a city boundary are considered city streets, regardless of maintenance agreements. Exceptions may include small stretches of county roads that begin or end inside a city limit, or cross through a corner or small portion of the boundary (e.g. less than ~150’).
              </v-expansion-panel-content>
            </v-expansion-panel>
            <v-expansion-panel>
              <v-expansion-panel-header>Can I add a county road that’s outside of my county boundary?</v-expansion-panel-header>
              <v-expansion-panel-content class="expandPanelContent">
                No, not generally. Although, exceptions may include small stretches of county roads that begin or end inside another county, or cross through a corner or small portion of the boundary.
              </v-expansion-panel-content>
            </v-expansion-panel>
            <v-expansion-panel>
              <v-expansion-panel-header>Should I remove a road that the county does not maintain?</v-expansion-panel-header>
              <v-expansion-panel-content class="expandPanelContent">
                No. A county road that is maintained by another entity is still considered a public road and must be included. However, if the road is owned by another entity such as the federal government or private home owners association, etc., it can be removed from the county road inventory.
              </v-expansion-panel-content>
            </v-expansion-panel>
            <v-expansion-panel>
              <v-expansion-panel-header>A new subdivision was built, but the county commission has not accepted the roads from the developer. Should I add these roads?</v-expansion-panel-header>
              <v-expansion-panel-content class="expandPanelContent">
                Yes, any such road that is open to public travel should be added to the inventory, regardless of whether or not the county commission has formally accepted the road. If TxDOT has already added the road, do not mark it for removal, as we will not remove it. TxDOT has a federal mandate to include such roads in the inventory. Often such roads are platted as public right of way.
              </v-expansion-panel-content>
            </v-expansion-panel>
            <v-expansion-panel>
              <v-expansion-panel-header>Is a road that is closed during certain hours or times of the year still considered a county road?</v-expansion-panel-header>
              <v-expansion-panel-content class="expandPanelContent">
                Yes, as long as the hours are posted, certain public roads, such as park roads or roads that provide access to landfills, may be closed during certain times of the day or parts of the year. Public roads may also be closed temporarily due to extreme weather or emergency conditions.
              </v-expansion-panel-content>
            </v-expansion-panel>
          </v-expansion-panels>
          <v-btn class="closeBtnUnderline" id="faqBtn" depressed outlined color="#14375A" tile @click="closeFaqBtn()"><u>Close</u></v-btn>
        </v-card-text>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script>
  import { downloadRdLog } from "./advanced"

  export default {
    name: 'aboutHelp',
    data (){
      return {
        isCert: false,
        countyNm: null,
        isFileSuccess: false,
        isFileDwnload: false,
        isWebexTraining: false,
        uploadGISData: "Upload",
        disable: false,
        disclaimer: false,
        exitApp: false,
        display:false,
        drawer: true,
        faqs: false,
        isHelpTraining: false,
        tooltips: ['',"Click here to access TxDOT's County Road Inventory YouTube Channel", "Click here to access FAQs", "Click here to access a sandbox environment for practicing edits without affecting your county's inventory",
                   "Click here to download Bulk Submission Instructions", "Click here to see WebEx Training Schedule"],
        mediaType: ['', 'TxDOT Youtube Channel', 'FAQs','Access Sandbox Environment', "Download Advanced Bulk Upload Instructions", "WebEx Training"],
        iconType: ['', 'mdi-video-image', 'mdi-text-box', 'mdi-github', "mdi-download-circle", "mdi-calendar"],
        items: [
          { title: 'Advanced', icon: 'mdi-cog', action: ()=>{
              this.isUserCertify === false ? this.certifiedFalse() : this.certifiedTrue()
              // this.display = true
              // this.clearEditBtn = true
              // this.dragDropClick = false
              // this.removeBtnFocus();
            }},
          { title: 'Criteria', icon: 'mdi-clipboard-text', action: ()=>{
              window.open('https://www.txdot.gov/data-maps/roadway-inventory/county-road-criteria.html', '_blank')
              this.removeBtnFocus();
            }
          },
          { title: 'Help & Training', icon: 'mdi-help-circle', action: ()=>{
              this.isHelpTraining = true
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
      takeTour(){
        this.isTour = true
        this.isHelpTraining = false
      },
      closeFaqBtn(){
        this.faqs = false;
      },
      reqTrainingEmail(){
        return `mailto:TPP_CRI@txdot.gov?subject=Advanced Training Request from ${this.userName}, ${this.countyNm} County&body=Requesting training and access for the 'Advanced' features and functionality in the County Road Inventory Map.`
      },
      downloadTemp(){
        let tempdwnl = document.createElement('a')
        tempdwnl.href = 'https://raw.githubusercontent.com/TxDOT/CRI/main/CRI_Template.gdb.zip'
        tempdwnl.click()
      },
      downloadPdf(){
        let pdf = document.createElement('a')
        pdf.href = 'https://raw.githubusercontent.com/TxDOT/CRI/main/CountyRoadInventoryMap_BulkLoad_BestPracticeWorkflow_DataDictionary.pdf'
        pdf.download = "CountyRoadInventoryMap_BulkLoad_BestPracticeWorkflow_DataDictionary.pdf"
        pdf.mediaType = "application/pdf"
        pdf.target = "_blank"
        pdf.click()
      },
      getWebEx(){
        this.isWebexTraining = true;
        this.isHelpTraining = false;
      },
      close(x){
          x === 'isUserCertify' ? this.display = false : this.isHelpTraining = false
      },
      certifiedTrue(){
        this.display = true
        this.clearEditBtn = true
        this.dragDropClick = false
        this.removeBtnFocus();
      },
      certifiedFalse(){
        this.display = true
        this.clearEditBtn = true
        this.dragDropClick = false
        this.isUserCertify = false
        this.removeBtnFocus();
      },
      webexClose(){
        this.isWebexTraining = false
      },
      openPage(event){
        if(event === 'Access Sandbox Environment'){
          window.open('https://txdot.github.io/CRI-Updates/login')
        }
        else if(event === 'FAQs'){
          this.isHelpTraining = false;
          this.faqs = true;
        }
        else if(event === 'TxDOT Youtube Channel'){
          window.open('https://youtube.com/playlist?list=PLyLWQADRroOUeiQ8sXX3JMVQeu87sgig2')
        }
        else if(event === 'Download Advanced Bulk Upload Instructions'){
          this.downloadPdf()
        }
        else if(event === 'WebEx Training'){
          this.getWebEx()
        }
      },
      cntyQueryTab(){
        window.open('https://txdot.maps.arcgis.com/home/item.html?id=8c07970b38c5471c9b862ca411cc3841')
        this.exitApp = false
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
      isFmeRun:{
        handler: function(){
          this.disable = this.isFmeRun[0]
          this.uploadGISData = this.isFmeRun[0] === true ? "Running" : "Upload"
        },
        immediate: true
      },
      isUserCertify:{
        handler: function(){
          this.isCert = this.isUserCertify
        },
        immediate: true
      },
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
      isUserCertify:{
        get(){
          return this.$store.state.isCertified
        },
        set(bool){
          this.$store.commit('setCertifiedCheck',bool)
        }
      },
      userName:{
        get(){
          return this.$store.state.username
        },
      },
      isFmeRun:{
        get(){
          return this.$store.state.isFmeProcess
        },
        set(bool){
          this.$store.commit('setIsFmeProcess', bool)
        }
      },
      isTour:{
        get(){
          return this.$store.state.isTour
        },
        set(bool){
          this.$store.commit("setShowTour", bool)
        }
      },
    }
  }
</script>
<style scoped>
#tourBtn{
  position: relative;
  right: 26rem;
  top: 10px;
  text-decoration: underline;
  color: #14375A;
  opacity: 1 !important;
}
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
#advanceList{
  position: fixed;
  /* bottom: 1rem;  */
  width: 98%
}
#advancedCard{
  border-radius:0%;
  display:flex;
  min-height: 20vh;
  max-height: 90vh;
  flex-direction: column;
  overflow-y: auto; 
  overflow-x: hidden;
}
#advCardTitleTxt{
  bottom: .7rem; 
  position:relative; 
  right: .5rem;
}
#tableIcon{
  position: relative; 
  font-size: 2rem; 
  top: 1.8rem; 
  right: 18rem; 
  color:black
}
#roadLogTxt{
  bottom: 0.2rem; 
  position: relative; 
  left: 5rem;
}
.itemText{
  font-size: .8rem;
}
#dwnloadBtn{
  position: absolute; 
  left: 6.5rem; 
  top: 10rem; 
  border: 1px solid black
}
#divider{
  width: 90%;
  position: relative;
  top: .1rem;
  left: 2rem;
  border-color:black
}
#disclaimer{
  width: 90%;
  height: 7%;
  text-align:left;
  background-color: rgba(255,153,102,.4);
  /* color: ; */
  top: 1rem; 
  position: relative; 
  left: 2rem;
}
#disclaimerF{
  width: 90%;
  height: 4%;
  text-align:left;
  background-color: rgba(255,153,102,.4);
  /* color: ; */
  top: 1rem; 
  position: relative; 
  left: 2rem;
}
#disclaimerTxt{
  position:relative;
  bottom: .5rem;
  font-size: .9rem;
  color: rgba(150,75,0,1);
}
#layerIcon{
  position: relative; 
  font-size: 2rem; 
  top: 1rem; 
  right: 18rem; 
  color:black
}
#dwnldInvTxt{
  bottom: 1.1rem; 
  position: relative; 
  left: 5rem;
}
#downloadBtn{
  position: absolute; 
  left: 6.5rem; 
  top: 18.8rem; 
  border: 1px solid black
}
#dwnloadTempBtn{
  position: absolute; 
  left: 6.5rem; 
  top: 33rem; 
}
#dwnloadTempBtnF{
  position: absolute; 
  left: 6.5rem; 
  top: 31.5rem; 
}
#uploadIcon{
  position: relative; 
  font-size: 2rem; 
  top: .8rem; 
  right: 18rem; 
  color: black;
}
#uploadTxt{
  bottom: 1.3rem; 
  position: relative; 
  left: 5rem;
}
#uploadBtn{
  position: relative; 
  left: 6.5rem; 
  width: 5rem;
  bottom: 3.2rem; 
}
#uploadBtnF{
  position: absolute; 
  left: 6.5rem; 
  top: 44rem; 
}
#trainingBtn{
  position: relative;
  bottom: 3.8rem;
  left: 27rem;
  font-size: .7rem;
  text-decoration: underline;
}
.titles{
  background-color:#14375A; 
  color:white;
}
#progressLoad{
  position:absolute;
  bottom: .2rem;
}
#rdLogSucc{
  position:absolute; 
  top: .4rem; 
  left: 1rem;
}
#rdLogIcon{
  position:relative;
  bottom:.1rem;
}
#rdLogTxt{
  position:absolute; 
  top: 4rem; 
  right: .5rem;
}
#helpTrainPos{
  bottom: .7rem; 
  position:relative; 
  right: .5rem;
}
#helpTrainContent{
  position: relative; 
  text-align: left; 
  top: 1rem; 
  right: .3rem; 
  padding-left: 1rem;
}
#helpTrainIcon{
  position:absolute; 
  top:5.3rem; 
  right: 3.5rem; 
  font-size: 3.5rem;
}
#closeBtn{
  position: relative;
  bottom: .8rem; 
  left: 36rem;
  width: 5rem;
  text-decoration: underline;
}
#clseBtnHelp{
  position: absolute;
  bottom: .5rem;
  right: 1rem;
  text-decoration: underline;
}
#dialogWidth{
  position: relative;
  display: flex;
  width: 40rem;
  left: 35%;
  min-height: 5vh;
  flex-direction: column;
  max-height: 82vh;
  overflow-y: auto;
  border-radius: 0%;
}
.faqHead{
  position: relative;
  top: 1rem;
  text-align: left;
}

#faqTitle{
  position: relative;
  text-align: left;
}

#faqsName{
  position: relative;
  bottom: .7rem;
}

#faqDialog{
  position: relative;
  height: 11rem;
  flex-direction: column;
  max-height: 30rem;
}

.textColor{
  color:black
}
#faqBtn{
  position: relative;
  top: .6rem;
  left: 15rem;
}
.expandPanelContent{
  text-align: left;
  color: #14375A;
  padding-left: 1rem;
}

#dwnloadInstruct{
  font-size: .7rem;
  padding-left: .3rem;
  text-decoration: underline;
  /* position: relative;
  left: 1.5rem;
  bottom: 1rem; */
}

#disableDwnldInstruct{
  font-size: .7rem;
  padding-left: .3rem;
  text-decoration: underline;
  pointer-events: none;
  color: grey;
}

#downloadInst{
  position: relative;
  right: 9rem;
  bottom: .5rem;
}

#webExTraining{
  position: relative;
  padding: none;
  right: .5rem;
  bottom: .5rem;
}

#webexbtn{
  position: absolute;
  bottom: .7rem;
  right: 1.4rem;
}

</style>