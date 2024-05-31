<template>
   <v-card height="675" class="signup-card" tile>
        <v-progress-circular
        :size="50"
        color="primary"
        indeterminate
        class="spinner"
        v-if="isSpinner"
        ></v-progress-circular>
        <v-card-actions>
          <div id="registerBannerPos">
            <v-alert color="#14375A" border="top" dark v-html="statusMessageFalseRegister" id="loginBannerTxt"></v-alert>
          </div>
          <v-card-text id="formtext">Complete this form to create an account for reviewing and updating your county roads in the County Road Inventory Map. You will receive an
            email within 24 hours containing your username and password.
          </v-card-text>
          <v-form class = "formPos">
            <v-col>
              <v-row class="signup-form">
                <v-text-field v-model="firstName" required label="First Name" :rules="firstNameRequired" :outlined=true :dense=true class="custom-border-radius" id= 'form-input' tile></v-text-field>
              </v-row>
              <v-row class="signup-form">
                <v-text-field v-model="lastName" required label="Last Name" :rules="lastNameRequired" :outlined=true :dense=true class="custom-border-radius" id= 'form-input' ></v-text-field>
              </v-row>
              <v-row class="signup-form">
                <v-text-field v-model="email" required label="Email" :rules="emailRequired" :outlined=true :dense=true class="custom-border-radius" id= 'form-input-email' ></v-text-field>
              </v-row>
              <v-row class="signup-form">
                <v-text-field v-model="phone" required label="Phone" :rules="phoneRequired" :outlined=true :dense=true class="custom-border-radius" id= 'form-input'  @input="formatPhone" ></v-text-field>
              </v-row>
              <v-row class="signup-form">
                <v-autocomplete v-model="county" :items="cntyNames" required label="County" :rules="countyRequired" :outlined=true :dense=true class="custom-border-radius" attach id= 'form-select' :clearable=true ></v-autocomplete>
              </v-row>
            </v-col>
          </v-form>
          <v-card-text id="termstext">
            Terms and Conditions: 
            <br>
            <ol>
              <li>I am authorized by the county judge to make edits to the County Road Inventory for my county.</li>
              <li> I will not share my username and password. If another individual from my county needs access to the County Road Inventory, I will advise this person to submit a request for their own account.</li>
              <li> If I no longer need access to the County Road Inventory, I will contact TxDOT to request deactivation of my account. Accounts will be reviewed periodically for inactivity by TxDOT and deactivated if deemed appropriate.</li>
           </ol>
           
            <v-checkbox v-model="checkboxvalue" label="I accept the terms and conditions." :dense=true class="custom-checkbox" ></v-checkbox>
            Please be aware that all information (except your email address) submitted on this form is subject to public disclosure under the Texas Public Information Act. For any questions, problems, to reset your password, or to check the status of your account, please send an email to <a style="text-decoration:none" href="mailto:TPP_CRI@txdot.gov">TPP_CRI@txdot.gov.</a>
          </v-card-text>
          <div class=btnblocker :style="{pointerEvents: btnBlockerPointerEvents}">
            <div class="buttonPos">
              <v-btn @click="togglepopup(); clearValues()" class="cancelButton" depressed text tile>cancel</v-btn>
              <v-btn class="continueButton" outlined tile color="#14375A"  @click="handlesubmit()" :disabled="formDisabled"><u>submit</u></v-btn>
            </div>
          </div>
        </v-card-actions>

      </v-card>
</template>
<script>
       export default{
        name:'Signupform',
        data(){
            return{
                btnBlockerPointerEvents: 'all',
                isAlert: false,
                isSpinner: false,
                checkboxvalue: false,
                countyvalid: false,
                emailvalid: false,
                firstnvalid: false,
                lastnvalid: false,
                phonevalid: false,
                registerpopup: false,
                statusMessageFalse:'',
                statusMessageFalseRegister: '',
                cntyNme:'',
                signup: false,
                firstName:"",        
                firstNameRequired:[
                value => {
                    if(value.length){
                        return true
                    }
                    else{
                        return "First Name is required"

                    }
                },
                value => {
                    if(value.length >= 3){
                    this.firstnvalid = true

                    return true
                    } 
                    else{
                    this.firstnvalid = false
                    return "First Name must be greater than 3 characters" 
                    }
                
                }
                ],
                lastName:"",
                lastNameRequired:[
                value => {
                    if(value) {
                    return true

                    }
                    else{
                    return "Last Name is required"

                    } 
                },
                value => {
                    if(value.length >= 3){
                    this.lastnvalid = true
                    return true

                    }
                    this.lastnvalid = false
                    return "Last Name must be greater than 3 characters" 
                }
                ],
                email:"",
                emailRequired:[
                value => {
                    if(/.+@.+\..+/.test(value)){
                    this.emailvalid = true
                    return true
                    } 
                    else{
                    this.emailvalid = false
                    return "E-mail must be valid"

                    }
                }
                ],
                phone:"",
                phoneRequired:[
                value => {
                    if (value.length == 14)
                    {
                    this.phonevalid = true
                    return true
                    } 
                    else{
                    this.phonevalid = false
                    return "Phone number must be valid"

                    }
                }
                ],
                county: "",
                countyRequired:[
                value => {
                if(value) {
                    this.countyvalid = true
                    return true
                }
                else{
                    this.countyvalid = false
                    return "County is required"
                }
        }
          
        ],
        cntyNames: ['ANDERSON', 'ANDREWS', 'ANGELINA', 'ARANSAS', 'ARCHER', 'ARMSTRONG', 'ATASCOSA', 'AUSTIN', 'BAILEY', 'BANDERA',
            'BASTROP', 'BAYLOR', 'BEE', 'BELL', 'BEXAR', 'BLANCO', 'BORDEN', 'BOSQUE', 'BOWIE', 'BRAZORIA',
            'BRAZOS', 'BREWSTER', 'BRISCOE', 'BROOKS', 'BROWN', 'BURLESON', 'BURNET', 'CALDWELL', 'CALHOUN', 'CALLAHAN', 
            'CAMERON', 'CAMP', 'CARSON', 'CASS', 'CASTRO', 'CHAMBERS', 'CHEROKEE', 'CHILDRESS', 'CLAY', 'COCHRAN', 
            'COKE', 'COLEMAN', 'COLLIN', 'COLLINGSWORTH', 'COLORADO', 'COMAL', 'COMANCHE', 'CONCHO', 'COOKE', 'CORYELL', 
            'COTTLE', 'CRANE', 'CROCKETT', 'CROSBY', 'CULBERSON', 'DALLAM', 'DALLAS', 'DAWSON', 'DE WITT', 'DEAF SMITH', 
            'DELTA', 'DENTON', 'DICKENS', 'DIMMIT', 'DONLEY', 'DUVAL', 'EASTLAND', 'ECTOR', 'EDWARDS', 'EL PASO', 
            'ELLIS', 'ERATH', 'FALLS', 'FANNIN', 'FAYETTE', 'FISHER', 'FLOYD', 'FOARD', 'FORT BEND', 'FRANKLIN', 
            'FREESTONE', 'FRIO', 'GAINES', 'GALVESTON', 'GARZA', 'GILLESPIE', 'GLASSCOCK', 'GOLIAD', 'GONZALES', 'GRAY', 
            'GRAYSON', 'GREGG', 'GRIMES', 'GUADALUPE', 'HALE', 'HALL', 'HAMILTON', 'HANSFORD', 'HARDEMAN', 'HARDIN',
            'HARRIS', 'HARRISON', 'HARTLEY', 'HASKELL', 'HAYS', 'HEMPHILL', 'HENDERSON', 'HIDALGO', 'HILL',
            'HOCKLEY', 'HOOD', 'HOPKINS', 'HOUSTON', 'HOWARD', 'HUDSPETH', 'HUNT', 'HUTCHINSON', 'IRION', 
            'JACK', 'JACKSON', 'JASPER', 'JEFF DAVIS', 'JEFFERSON', 'JIM HOGG', 'JIM WELLS', 'JOHNSON', 'JONES',
            'KARNES', 'KAUFMAN', 'KENDALL', 'KENEDY', 'KENT', 'KERR', 'KIMBLE', 'KING', 'KINNEY', 'KLEBERG',
            'KNOX', 'LA SALLE', 'LAMAR', 'LAMB', 'LAMPASAS', 'LAVACA', 'LEE', 'LEON', 'LIBERTY', 
            'LIMESTONE', 'LIPSCOMB', 'LIVE OAK', 'LLANO', 'LOVING', 'LUBBOCK', 'LYNN', 'MADISON', 'MARION',
            'MARTIN', 'MASON', 'MATAGORDA', 'MAVERICK', 'MCCULLOCH', 'MCLENNAN', 'MCMULLEN', 'MEDINA',
            'MENARD', 'MIDLAND', 'MILAM', 'MILLS', 'MITCHELL', 'MONTAGUE', 'MONTGOMERY', 'MOORE', 'MORRIS', 
            'MOTLEY', 'NACOGDOCHES', 'NAVARRO', 'NEWTON', 'NOLAN', 'NUECES', 'OCHILTREE', 'OLDHAM', 'ORANGE',
            'PALO PINTO', 'PANOLA', 'PARKER', 'PARMER', 'PECOS', 'POLK', 'POTTER', 'PRESIDIO', 'RAINS', 
            'RANDALL', 'REAGAN', 'REAL', 'RED RIVER', 'REEVES', 'REFUGIO', 'ROBERTS', 'ROBERTSON', 'ROCKWALL',
            'RUNNELS', 'RUSK', 'SABINE', 'SAN AUGUSTINE', 'SAN JACINTO', 'SAN PATRICIO', 'SAN SABA', 'SCHLEICHER', 
            'SCURRY', 'SHACKELFORD', 'SHELBY', 'SHERMAN', 'SMITH', 'SOMERVELL', 'STARR', 'STEPHENS', 
            'STERLING', 'STONEWALL', 'SUTTON', 'TARRANT', 'TAYLOR', 'TERRELL', 'TERRY', 'THROCKMORTON', 
            'TITUS', 'TOM GREEN', 'TRAVIS', 'TRINITY', 'TYLER', 'UPSHUR', 'UPTON', 'UVALDE', 'VAL VERDE', 
            'VAN ZANDT', 'VICTORIA', 'WALKER', 'WALLER', 'WARD', 'WASHINGTON', 'WEBB', 'WHARTON', 'WHEELER', 
            'WICHITA', 'WILBARGER', 'WILLACY', 'WILLIAMSON', 'WILSON', 'WINKLER', 'WISE', 'WOOD', 'YOAKUM', 
            'YOUNG', 'ZAPATA', 'ZAVALA', 'SWISHER'],
            }
        },
        mounted(){
            this.statusMessageFalseRegister = 'County Road Inventory Registration'
        },
        methods:{
            
            handlesubmit(){
            let url= `https://gis-batch-dev.txdot.gov/fmejobsubmitter/TPP-MB/CountyAGOemailer.fmw?First_Name=${this.firstName}&Last_Name=${this.lastName}&Email=${this.email}&Phone=${this.phone}&COUNTY=${this.county}&opt_showresult=false&opt_servicemode=sync&token=96055a7cb4bd9efb11e3f3accb044f026f4885a0`
            this.sendRequest(url)

            },
            async sendRequest(url) {
            
                this.btnBlockerPointerEvents = 'none'
                this.registerPopup=false
                this.clearValues()
                this.checkboxvalue = false
                this.btnBlockerPointerEvents = 'all'
                //const response = await fetch(url)
                fetch(url)
                .then(()=>{
                    this.alert = true
                    setTimeout(() => {
                        this.alert = false
                    }, 5000)
                    })
                .catch((err) => {
                    console.error('Error:', err);
                    return;
                })
            },
            formatPhone(){
                // Remove non-numeric characters from the input value
                let formattedNumber = this.phone.replace(/\D/g, '');

                // Check if the input is not empty and format it as a phone number
                if (formattedNumber.length > 0) {
                    formattedNumber = formattedNumber.replace(/(\d{3})(\d{3})(\d{4})/, '($1) $2-$3');
                }

                // Update the model with the formatted phone number
                this.phone = formattedNumber;
            },
            togglepopup(){
                this.registerPopup = false
            },
            clearValues(){
                this.firstName = "",
                this.lastName="",
                this.email="",
                this.phone="",
                this.county=""
            }
        },
        computed:{
            registerPopup:{
                get(){
                    return this.$store.state.registerpopup
                },
                set(bool){
                    this.$store.commit('setIsRegisterPopup', bool)
                }
            },
            formDisabled(){

                if (this.emailvalid && this.lastnvalid && this.firstnvalid && this.phonevalid && this.countyvalid && this.checkboxvalue){
                    return false
                }
                else{
                    return true
                }
            },
            alert:{
                get(){
                    return this.$store.state.alerstatus
                },
                set(bool){
                    this.$store.commit('setIsAlert', bool)
                }
            },
        }
       } 
</script>
<style >
.valert{
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  margin: auto;
}
.spinner{
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  margin: auto;}
.custom-checkbox .v-label {
  color: black; /* Set the desired label font color here */
  font-size: 14px;
}
.custom-border-radius .v-input__control {
  border-radius: 0px; /* Adjust the border radius as needed */
}
.v-input #form-input {
    font-size: 14px !important;

}
.v-input #form-select {
    font-size: 14px !important;

}
.v-input #form-input-email {
    text-transform: lowercase !important;
    font-size: 14px !important;

}

.custom-border-radius .v-select__selection{
  font-size: 14px !important;
}
.custom-border-radius .v-input__slot{
  min-width:400px ;
  max-width: 400px;
}
.custom-border-radius .v-text-field__details{
  
    left: 400px;
    top: -30px;
    position: relative;

}

.custom-border-radius .v-menu__content{
  position:relative;
  top: 40px !important;
  left:-400px !important;
}
.v-dialog {
  border-radius: 0px;
}

#loginBannerPos{
  position:absolute; 
  top:0%; 
  left: 0%; 
  width:100%;
}
#registerBannerPos{
  position:absolute; 
  top:0%; 
  left: 0%; 
  width:100%;
}
#loginBannerTxt{
  border-radius: 0px; 
  text-align: left;
  font-size:20px;
  font-weight: 400;

}
#loginTxt{
  position:absolute; 
  top:15%; 
  left: 5%; 
  text-align: left;
}
#loginBtnPos{
  position:absolute; 
  right:4%; 
  bottom:10%
}
#SignupBtnPos{
  position:absolute; 
  left:4%; 
  bottom:13%
}
.login-card{
  border-radius: 0px !important;
  
}
.signup-card{
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  margin: auto;
  width: 900px;
  overflow: hidden;;
}
.signup-form{
  padding-left: 3rem !important;
  padding-right: 2rem !important;
  margin-bottom: -30px;
  height: 65px;
  

}
#formtext{
  position: absolute;
  top:60px;
  text-align: left;
  padding-left: 1px;
  padding-right:2rem;
  font-size: 14px;
  }

#termstext{
  position: absolute;
  text-align: left;
  top: 365px;
  padding-left: 1px;
  padding-right:2rem;
  font-size: 14px;

}
.formPos{
  position: absolute;
  top: 140px;
}
 .cancelButton{
  right: 10px;
  bottom: 8px;
} 
.continueButton{
  right: 12px;
} 
.buttonPos{
  position: absolute;
  bottom: 0px;
  right: 0;
  
  }
  .btnblocker{
    position: absolute;
    bottom: 10px;
    right: 5px;
    height: 40px;
    width: 188px;
    background-color: transparent ;
    /* pointer-events: none  ; */
    
  }
</style>