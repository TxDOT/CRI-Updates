<template>
    <v-main>
    <v-dialog
      v-model="dialog"
      persistent
      max-width="1100">
      <v-card>
        <v-card-title class="text-h5">
         <v-img><img src="@/assets/txdotLogo.png"></v-img>
        </v-card-title>
        <v-card-text justify="left" v-html="txt"></v-card-text>

            <!-- <a style="position:relative;" href="https://www.dot.state.tx.us/apps-cg/contact_us/form/dusa-form.htm" class="text-decoration-none; caption"><small>Register for County Road Inventory Account</small></a> -->       
        <v-card-actions>
          <v-row>
          <v-col>
          <v-spacer></v-spacer>
            <div id="disagree">
            <v-btn 
            small
            dark
            color="red"
            @click="dialog=false; disagree = true; "><!-- goToMap() -->
            Review & Edit
            </v-btn>
            </div>
            <div id="agree">
            <v-btn
            small 
            dark
            color="blue"
            @click="dialog = false; agree = true;">
            Agree & Certify
            </v-btn>
            </div>
            <div id="delegate">
            <v-btn
            small 
            outlined
            @click="dialog=false; delegate=true;">
            Assign Delegate
            </v-btn>
            </div>
          </v-col>
        </v-row>
        </v-card-actions>
      </v-card>
    </v-dialog>
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
              <v-btn elevation="2" @click="disagree = false; goToMap()" color="primary">
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
    <v-row justify="center"> 
    <v-dialog v-model="agree" persistent max-width="600px">
      <v-card>
        <v-card-text>
            <p class="text-body-1" v-html="agreeTxt"></p>
        </v-card-text>
        <div id="agreeTxtBox">
        <v-text-field
            disabled
            v-model="judgeName"
            required
            outlined
            label="County Judge Name"
        ></v-text-field>
        <v-text-field
            disabled
            v-model="judgeEmail"
            label="County Judge E-mail"
            required
            outlined
        ></v-text-field>
        <v-text-field v-for="item in emailList" :key="item"
            :rules="emailRules"
            label="CC E-mail"
            required
            outlined
            :append-icon="trash"
            @click:append="deleteEmail(index)"
        >{{item}}
        <template v-slot:append >
          <v-icon @click="deleteEmail(index)">mdi-delete</v-icon>
        </template>
        </v-text-field>
        <div>
        <a id="addEmail" x-small @click="addEmail" style="color: blue">Add CC</a>
        </div>
        
        <!-- <v-btn @click ="signature = true">Click to Sign</v-btn>
        <v-card-text v-model="signature" style="font-family:Brush Script MT; font-size:30px" v-show="signature">{{this.judgeName}}</v-card-text> -->
        
        <v-form ref="form" v-model="valid">
        <v-text-field :rules="sigRules" v-model="message" outlined placeholder="Gimme your John Hancock"></v-text-field>
        </v-form>
        <p style="font-family:Brush Script MT; font-size:30px">Signature: {{message}}</p>
        <!-- <p class="font-weight-regular; lime darken-2--text">By Clicking submit, an email will be sent<br>to the county judge email address that we have on file</p> -->
        <div id="CCEmail">
          <input type="checkbox" v-model="valid">
          <label> I certify, I am {{judgeName}}</label>
        </div>
        <v-spacer></v-spacer>
        <v-btn outlined color="blue" :disabled="!valid" @click="alert = true; agree=false;">Submit</v-btn>
      </div>
        <v-spacer></v-spacer>
        <v-alert style="left:15px; top:5px" borderd="bottom" type="info" v-html="certiAlert" max-width=550></v-alert>
    
    </v-card>
    </v-dialog>
    </v-row>
    <v-dialog v-model="alert" persistent max-width="600px">
    <v-card>
      <v-icon style="left: 0%" color="green">
        mdi-check
      </v-icon>
    Thank you for certifing your mileage! Be on the lookout for an email confirming your certification.
    </v-card>
    </v-dialog>
    <v-dialog v-model="delegate" persistent max-width="650px">
      <v-card>
        <v-spacer></v-spacer>
        <v-card-text justify="center" v-html="delegateTxt">
          <!-- <p class="text-body-1" v-html="delegateTxt"></p> -->
        </v-card-text>
        <div>
          <v-card-action>
          <v-text-field
            :counter="30"
            required
            outlined
            label="Name"
            style="width:60%; left:20%"
          ></v-text-field>
          <v-text-field
            :rules="emailRules"
            label="E-mail"
            required
            outlined
            style="width:60%; left:20%"
          ></v-text-field>
          </v-card-action>
        </div>
        <v-divider></v-divider>
        <div v-for="item in emailList" :key="item">
        <v-card-action>
        <v-text-field
            :counter="30"
            required
            outlined
            label="Name"
            style="width:60%; left:20%"
        ></v-text-field>
        <v-text-field
            :rules="emailRules"
            label="E-mail"
            required
            outlined
            style="width:60%; left:20%"
        ></v-text-field>
        <v-divider></v-divider>
      </v-card-action>
      <div style="position:relative; left:40%; bottom: 110px">
        <v-icon @click="deleteEmail(index)">mdi-delete</v-icon>
      </div>
      </div>
      <div style="position:relative; left:0px; bottom: 3px">
        <a x-small @click="addEmail" style="color:blue">Add CC</a>
      </div>
      <v-btn-toggle>
        <v-btn color="primary" @click="dialog=true; delegate=false">Back to Certification Page</v-btn>
        <v-btn color="primary">Send</v-btn>
        <v-btn color="primary" href="https://www.txdot.gov/">Exit</v-btn>
      </v-btn-toggle>
     </v-card>
    </v-dialog>
  </v-main>
</template>

<script>
import {countyInfo} from '../components/Map/editFunc'
import {featLayer,txCounties,view,rdbdSrfcGeom} from '../components/Map/map'
import Query from "@arcgis/core/rest/support/Query"
import {roadInfo} from '../store'
//import MileSignConfirmation from '../components/Map/mileageConfirmation.vue'
export default {
        name:"MileSign",
        //components: {MileSignConfirmation},
        props: ["id"],
        data(){
          return {
            certify: false,
            statusMessageFalse: '',
            statusMessageTrue: '',
            valid: true,
            sigRules: [x => !!x || 'Name is required',
            x => (x && x.length >= 5) || 'Name must be greater than 5 characters'],
            disabled:true,
            checkbox: false,
            sign:false,
            delegate: false,
            alert:false,
            dialog: false,
            txt:'',
            disagree: false,
            agree: false,
            disagreeTxt:'<br><br>Click on the Login button to use your CRI credentials to access DUSA. If you do not have a DUSA account, click on the sign up button to register.',
            agreeTxt: '',
            currentMiles: 0,
            date:0,
            sendData: 0,
            signed: false,
            countyNbr: '',
            judgeName: '',
            judgeEmail:'',
            county:'',
            enabled: false,
            emailRules: [
              v => !!v || 'E-mail is required',
              v => /.+@.+\..+/.test(v) || 'E-mail must be valid',
            ],
            select: null,
            emailList:[],
            counter:0,
            message:'',
            certiAlert:'',
            delegateTxt:''
            //signature: false
          }
        },

        async mounted(){
          this.certify = false;
          let readCntyInfo = await countyInfo()
          let getCntyInfoQuery = await readCntyInfo['query']
          this.judgeName = getCntyInfoQuery.features[0].attributes['Judge_Name']
          this.judgeEmail = getCntyInfoQuery.features[0].attributes['Judge_Email']
          this.countyNbr = getCntyInfoQuery.features[0].attributes['County_NBR']
          this.currentMiles = getCntyInfoQuery.features[0].attributes['Total_Mileage']
          this.county = getCntyInfoQuery.features[0].attributes['County_Name']
          this.sendData = parseInt(this.currentMiles)
          this.sendCountyName();
          //this.sendCountyName(Number(getCntyInfoQuery.features[0].attributes['Total_Mileage']))
          roadInfo.getcntyMiles = this.currentMiles
          this.dialog = true
          this.agreeTxt = `<br><br><p align="justify">You are about to certify your county mileage. The current mileage for <b>${this.county}</b> is <b>${this.currentMiles}</b>. Only the county judge can certify the county road inventory.<br><br>
                          If you are not the county judge, please exit this form, or proceed to the DUSA application to start making edits.<br></p><br>`
          this.delegateTxt = `<p align="justify">Use this form to delegate persons to make edits to the ${this.county} County Road Inventory.<br><br> Delegates will receive an email stating that you, ${this.judgeName}, have granted them this authority.<br>
                              You will be copied on all delegation emails. Delegating others to assist with review and edits of your county road inventory does not prevent you from making edits yourself.<br>
                              Furthermore, as county judge, you will have to certify the changes upon their completion and submittal of edits.</p>`
          const todayDate = new Date();
          this.certiAlert = `<p>By clicking submit, you are certifying the mileage for your county and completing the process for ${todayDate.getFullYear()-1}.<br> Edits made in ${todayDate.getFullYear()} after certifying are allowed, but will need to be recertified by the county judge prior to <DATE> in order to be accepted.`
          todayDate.toDateString()
          this.statusMessageFalse =`As of today, ${todayDate.toDateString().substring(4,15)}, ${this.judgeName}, has not certified the mileage for County ${this.county}`
          this.statusMessageTrue =`As of today, ${todayDate.toDateString().substring(4,15)}, ${this.judgeName}, has certified the mileage for County ${this.county}`
          this.date = todayDate.toDateString().substring(4,15)
          this.txt = `<p align="justify">${todayDate.toDateString().substring(4,15)}</p>
          </br>

          <p align="justify" style=font-family: Arial, Helvetica, sans-serif>Dear ${this.judgeName},</p><br>

          <p align="justify" style=font-family: Arial, Helvetica, sans-serif>The Texas Department of Transportation (TxDOT) is soliciting updates to the county road inventory (CRI) from your county. The deadline for the ${todayDate.getFullYear()} submission is <u>August 31</u>.<br><br>
           
          In September ${todayDate.getFullYear()}, the certified county-maintained road mileage from ${todayDate.getFullYear()-1} will be submitted to the Texas Department of Motor Vehicles for disbursement of the tile
          and registration fees and to the State Comptroller's Office for disbursement of the Lateral Road and Bridge funds. Updates made by Ausgust 31, ${todayDate.getFullYear()} will be reviewed and updated in our system then reported
          in September of ${todayDate.getFullYear()+1}<br><br>
            
          Your ${todayDate.getFullYear()} certified mileage is: <b><u>${this.currentMiles}</b></u><br><br>
            
          Please click the appropriate response below to agree or disagree with this mileage.  You may also delegate the certification to another county official.<br><br>

          Thank you for your assistance in keeping the county road inventory up to date. If you have any questions or need clarification, please contact us by email or phone. <br><br>

          Sincerely,<br><br> 
          Michael Chamberlain<br>  
          Transportation Planning and Programming Division<br>  
          Director of Data Management<br>  
          TPP-GIS@txdot.gov<br>  
          (512) 486-5054<br><br></p>
                                                       <br><br><br> 
                                                       <footer style="text-align: center;font-size:12px"><p style=font-family: Arial, Helvetica, sans-serif>OUR VALUES: People • Accountability • Trust • Honesty<br>
                                                              OUR MISSION:  Connecting You With Texas<br>
                                                                  An Equal Opportunity Employer</p></footer>`
        },
         methods:{
           addSignature(){
             return this.signature
           },
           addEmail(){
             let count= this.counter++
             this.emailList.push(count)
           },
           async goToMap(){
            this.$router.push('/map')
            featLayer.definitionExpression =`cnty_nm = '${this.county}'`
            txCounties.definitionExpression=`CNTY_NM='${this.county}'`
            rdbdSrfcGeom.definitionExpression=`cnty_nm='${this.county}'`
            const query = new Query();
            query.where = `CNTY_NM = '${this.county}'`
            query.outFields = [ "*" ]
            query.returnGeometry = true
            let countyQuery = txCounties.queryFeatures(query)
            let returnCountyObj = await countyQuery
            view.goTo({
              target: returnCountyObj.features[0].geometry
            })
          },
          sendCountyName(){
            this.sendData = parseInt(this.currentMiles)
            this.$emit("county-miles", this.sendData)
          },
          deleteEmail(index){
          this.emailList.splice(index, 1)
          },
          // validate(){
          //   this.$refs.form.validate()
          // }
        },
}
</script>
<style scoped>
  #agree{
    position: absolute;
    bottom: 17%;
    right: 56%;
    
  }
  #disagree{
    position: absolute;
    bottom: 17%;
    right: 44%;
  }
  #delegate{
    /* border: 3px solid green; */
    bottom:17%;
    position: absolute;
    right: 29.5%;
  }

  #agreeTxtBox{
    /* border: 3px solid green; */
    left:120px;
    position: relative;
    width:50%;
  }

  #sign{
    /* border: 3px solid green; */
    top: 550px;
    position: absolute;
    width:30%;
    right: 200px
  }
  
  .submitBtn button{
    position: absolute;
    right: 20px;
    bottom: 10px;
    display: block;
  }
  #addEmail{
    right: 315px;
    bottom: 69%;
    position: absolute;
    display: inline;
    width: 20%;
  }
  #addEmail{
    position: relative;
    right: 0%;
    bottom: 9%;
  }
  v-btn{
    cursor: pointer;
  }
</style>
