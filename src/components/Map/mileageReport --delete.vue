<template>
    <v-row justify="center">
    <v-dialog
      v-model="dialog"
      persistent
      max-width="1100">
      <v-card>
        <v-card-title class="text-h5">
         <v-img><img src="@/assets/txdotLogo.png"></v-img>
        </v-card-title>
        <v-card-text v-html="txt"></v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            color="red"
            text
            @click="dialog=false; disagree = true" >
            Disagree
          </v-btn>
          <v-btn
            color="blue"
            text
            @click="dialog = false; agree();">
            Agree
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog
      v-model="disagree"
      persistent
      max-width="1100">
      <v-card v-if="disagree" style="height: 100%;">
        <v-card-text>
          <p class="font-weight-regular" v-html="disagreeTxt"></p>
        </v-card-text>
        <v-card-actions>
          <v-btn
          block
          elevation="2" 
          @click="disagree = false"
          color="primary">
            Close
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-row>
</template>


<script src="./plugins/fmeserver.js"></script>


<script>

import {criConstants} from '@/common/cri_constants'

    export default {
        name:"mileageReport",
        data(){
            return {
                dialog: false,
                txt:'',
                disagree: false,
                disagreeTxt:'<br><br>Thanks for disagreeing with TxDOT.  Update your county Roads<br><br> Thanks!',
                currentMiles: 0,
                date:0,
                signed: false
            }
        },

        mounted(){
            
            this.dialog = true
            const todayDate = new Date();
            todayDate.toDateString()
            console.log(todayDate)
            let mileage = 1010;
            this.currentMiles = mileage
            this.date = todayDate.toDateString().substring(4,15)
            this.txt = `${todayDate.toDateString().substring(4,15)}
            </br>
            </br>
            The Texas Department of Transportation (TxDOT) is soliciting updates to the county road inventory (CRI) from your county. TxDOT accepts updates from every county, every year. The deadline for the 2021 submission is August 31, 2021.<br><br>
            
            The CRI program received over 6,500 markups in 2020 submitted through the Data Updates & Sharing Application (DUSA) resulting in 449 miles of county roads added. This application greatly enhances reporting accuracy and timeliness for CRI.<br><br>
            
            If your county previously registered to access DUSA, you may proceed with updates for 2021 at any time. However, if your county has not yet registered to access DUSA, please forward the instructions outlined on pages 4 & 5 to your staff or whomever you wish to delegate responsibility for making updates for your county.<br><br>
            
            A few things to note about DUSA for 2021: <br><br>
            1)	In May 2021, the valid updates submitted from 2020 were updated in DUSA.<br>
            2)	A ‘reference layer’ is included to show the markups submitted in 2020 that did not<br>
            meet the criteria for a county road, or were not updated for another reason.<br>
            3)	TxDOT is proactively updating city limit boundaries, which subsequently may affect the total county road mileage for your county.<br><br>
            
            In 2020, TxDOT began corresponding with your county via email only and no longer via USPS mail. In addition, we began using DocuSign for the mileage certification. DocuSign is a widely used and accepted tool for securely obtaining electronic signatures.<br><br>

            CERTIFICATION<br>
            
            In September 2021, the certified county-maintained road mileage from 2020 will be submitted to the Texas Department of Motor Vehicles for disbursement of the title and registration fees and to the State Comptroller’s Office for disbursement of the Lateral Road and Bridge funds. Updates made by August 31st, 2021 will be reported in September of 2022.<br><br><br>

            Your 2020 certified mileage is: <b><u>${mileage}</b></u><br><br>
            
            If the mileage for your county is correct, please sign below.<br><br>

            County Judge	Date<br><br>

            IMPORTANT - If the mileage is incorrect, do not sign this document. Instead, please download a copy of this document using the download button above then follow the instructions on pages 4 & 5 to submit updates.<br><br>
      
                                                         <footer style="text-align: center;font-size:12px"><p>OUR VALUES: People • Accountability • Trust • Honesty<br>
                                                                OUR MISSION:  Connecting You With Texas<br>
                                                                    An Equal Opportunity Employer</p></footer>`
        },

        methods: {
          agree(){
            let serverNew = {
              server: "http://txdot4awtgcm01",
              token: '<add token>',
              mileage: this.currentMiles
            }
            FMEServer.init(serverNew);
            // console.log(FMEServer.init(serverNew))
            FMEServer.generateToken(criConstants.user,criConstants.password,60,"second", newToken);
            function newToken(z){
              console.log(z)
              serverNew.server = "http://txdot4awtgcm01"
              serverNew.token = z
              FMEServer.init(serverNew)
              let gidParam = 51
              console.log(gidParam)
              
              FMEServer.runDataStreaming('CRIEmail', 'sendEmail.fmw','noMiles='+serverNew.mileage, returnValue)
              function returnValue(object){
                console.log(object)
                //let jobid = object[0].name;
                //console.log(object[0].name)
            //     //document.getElementById('header').innerHTML = `<button onclick="display('${jobid}')">${jobid}</button>`
              }
            }
          }
        }
    }
</script>