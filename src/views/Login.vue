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
              <v-btn elevation="2" @click="disagree = false;" color="primary"> <!-- goToMap() -->
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
//import {countyInfo} from '../components/Map/editFunc'
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
        county:''
        }
    },
    async mounted(){
        this.certify = false;
        // let readCntyInfo = await countyInfo()
        // let getCntyInfoQuery = await readCntyInfo['query']
        // this.judgeName = getCntyInfoQuery.features[0].attributes['Judge_Name']
        // this.county = getCntyInfoQuery.features[0].attributes['County_Name']
        const todayDate = new Date();
        this.certiAlert = `<p>By clicking submit, you are certifying the mileage for your county and completing the process for ${todayDate.getFullYear()-1}.<br> Edits made in ${todayDate.getFullYear()} after certifying are allowed, but will need to be recertified by the county judge prior to <DATE> in order to be accepted.`
        todayDate.toDateString()
        this.statusMessageFalse =`As of today, ${todayDate.toDateString().substring(4,15)}, Judge David P, has not certified the mileage for County Fake `
        this.statusMessageTrue =`As of today, ${todayDate.toDateString().substring(4,15)}, Judge David P, has certified the mileage for County Fake`
    }
}
</script>
