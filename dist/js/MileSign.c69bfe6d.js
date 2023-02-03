(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["MileSign"],{"382f":function(t,e,i){"use strict";i("abac")},"3c42":function(t,e,i){"use strict";i.r(e);var n=function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("v-main",[n("v-dialog",{attrs:{persistent:"","max-width":"1000",id:"judgeDialog"},model:{value:t.judgeLetter,callback:function(e){t.judgeLetter=e},expression:"judgeLetter"}},[n("v-card",{attrs:{id:"judgeLetter"}},[n("v-card-title",[n("v-img",{attrs:{src:i("d79a"),id:"judgeLetterLogo"}})],1),n("v-card-text",{staticClass:"letterTxt",attrs:{justify:"left",id:"mainTxt"},domProps:{innerHTML:t._s(t.mainTxt)}}),n("v-btn",{staticClass:"buttonColor",attrs:{small:"",tile:"",color:"green",id:"acceptCert"},on:{click:function(e){t.judgeLetter=!1,t.assignDel=!1,t.accptCertify=!0}}},[n("v-icon",{attrs:{left:"",color:"white"}},[t._v("mdi-certificate")]),t._v("Accept & Certify")],1),n("v-btn",{staticClass:"buttonColor",attrs:{small:"",tile:"",color:"blue"},on:{click:function(e){return t.logMeIn()}}},[n("v-icon",{attrs:{left:"",color:"white"}},[t._v("mdi-vector-polyline-edit")]),t._v("Review & Edit")],1),n("v-btn",{staticClass:"buttonColor",attrs:{small:"",tile:"",color:"black",id:"assignDelegate"},on:{click:function(e){t.judgeLetter=!1,t.accptCertify=!1,t.assignDel=!0}}},[n("v-icon",{attrs:{left:"",color:"white"}},[t._v("mdi-account-multiple-plus")]),t._v("Assign Delegate")],1),n("v-card-text",{staticClass:"letterTxt",attrs:{id:"subTxt"},domProps:{innerHTML:t._s(t.subTxt)}})],1)],1),n("v-dialog",{attrs:{width:"700",persistent:""},model:{value:t.assignDel,callback:function(e){t.assignDel=e},expression:"assignDel"}},[n("AssignDelegate")],1),n("v-dialog",{attrs:{width:"490",persistent:""},model:{value:t.accptCertify,callback:function(e){t.accptCertify=e},expression:"accptCertify"}},[n("acceptCertify")],1)],1)},a=[],r=i("1da1"),s=(i("96cf"),i("e9c4"),i("99af"),i("9e3e")),o=function(){var t=this,e=t.$createElement,i=t._self._c||e;return i("v-card",{attrs:{tile:"",id:"assignDelCard"}},[i("v-card-title",{staticClass:"cardTitle"},[i("v-icon",{attrs:{id:"assignDelIcon"}},[t._v("mdi-account-multiple-plus")]),i("p",{attrs:{id:"titleTxt"}},[t._v("Assign Delegate")])],1),i("v-card-text",{attrs:{id:"addDelgTxt"},domProps:{innerHTML:t._s(t.delTxt)}}),t._l(t.emailCounter,(function(e,n){return i("v-row",{key:n},[i("v-col",{attrs:{cols:"12",md:"4",id:"txtFieldName"}},[i("v-text-field",{attrs:{dense:"",required:"",outlined:"",label:"Delegate Name"},model:{value:e.delUserName,callback:function(i){t.$set(e,"delUserName",i)},expression:"i.delUserName"}})],1),i("v-col",{attrs:{cols:"12",md:"8",id:"txtFieldEmail"}},[i("v-text-field",{staticStyle:{width:"60%",left:"20%"},attrs:{dense:"",rules:t.emailRules,label:"Delegate email address",required:"",outlined:""},model:{value:e.delEmail,callback:function(i){t.$set(e,"delEmail",i)},expression:"i.delEmail"}})],1),i("v-col",{attrs:{id:"trashIcon"}},[i("v-icon",{attrs:{color:"red",disabled:1===t.emailCounter.length},on:{click:function(e){return t.deleteEmail(n)}}},[t._v("mdi-delete")])],1)],1)})),i("a",{attrs:{"x-small":"",id:"addDelegate"},on:{click:t.addEmail}},[t._v("Add additional delegate")]),i("v-btn",{attrs:{text:"",color:"#204E70",id:"cancelBtn"},on:{click:function(e){return t.returnToLetter()}}},[t._v("Cancel")]),i("v-btn",{attrs:{tile:"",outlined:"",color:"#204E70",id:"acceptBtn"},on:{click:function(e){return t.submit("delegate")}}},[i("u",[t._v("Accept")])])],2)},l=[],c=(i("ac1f"),i("00b4"),i("a434"),i("d3b7"),i("159b"),i("0fc3")),u={name:"AssignDelegate",data:function(){return{delTxt:"",del:!0,counter:0,emailCounter:[{counter:0,delEmail:"",delUserName:""}],emailRules:[function(t){return!!t||"E-mail is required"},function(t){return/.+@.+\..+/.test(t)||"E-mail must be valid"}]}},mounted:function(){this.delTxt='<p align="justify">Use this form to assign delegates to make edits to the '.concat(this.countyNm,' County Road Inventory.</p>\n                       <p align="justify">Delegates will receive an email stating that you, ').concat(this.countyJudgeNm,", have granted them authority\n                        to make edits to the County Road Inventory on your behalf. Delegating others to assist with review and edits\n                        does not preclude you from making edits yourself. Furthermore, as county judge, you will have to certify changes\n                        made by your delegate(s) upon their completion and submittal of edits.")},methods:{addEmail:function(){var t=this.counter++;this.emailCounter.push({counter:t,delEmail:"",delUserName:""})},deleteEmail:function(t){console.log(t),console.log(this.emailCounter),this.emailCounter.splice(t,1)},returnToLetter:function(){this.isJudgeLetter=!this.isJudgeLetter},submit:function(t){var e=[],i=[];this.emailCounter.forEach((function(t){e.push(t.delEmail),i.push(t.delUserName)})),Object(c["g"])(t,i,e)}},computed:{isJudgeLetter:{get:function(){return this.$store.state.isJudgeLtter},set:function(t){this.$store.commit("setIsJudgeLetter",t)}}}},d=u,m=(i("f490"),i("2877")),g=Object(m["a"])(d,o,l,!1,null,"7c089a20",null),f=g.exports,h=function(){var t=this,e=t.$createElement,i=t._self._c||e;return i("v-card",{attrs:{tile:"",id:"acceptCard"}},[i("v-card-title",{staticClass:"cardTitle"},[i("v-icon",{attrs:{color:"white",id:"certIcon"}},[t._v("mdi-certificate")]),i("p",{attrs:{id:"certTitle"}},[t._v("Mileage Certification")])],1),i("v-card-text",{staticClass:"textSymb",attrs:{id:"countyMileTxt"}},[t._v("Sign below to certify your county's mileage.")]),i("v-card-text",{staticClass:"textSymb",domProps:{innerHTML:t._s(t.countyMileageTxt())}}),i("v-row",[i("v-col",{attrs:{cols:"12",md:"5",id:"judgeName"}},[i("v-text-field",{attrs:{disabled:"",dense:"",label:"County Judge Name",outlined:""},model:{value:this.judgeNameSend,callback:function(e){t.$set(this,"judgeNameSend",e)},expression:"this.judgeNameSend"}})],1),i("v-col",{attrs:{cols:"12",md:"6",id:"judgeEmail"}},[i("v-text-field",{attrs:{disabled:"",dense:"",label:"County Judge E-mail",outlined:""},model:{value:this.judgeEmailSend,callback:function(e){t.$set(this,"judgeEmailSend",e)},expression:"this.judgeEmailSend"}})],1)],1),t._l(t.ccEmail,(function(e,n){return i("v-row",{key:n},[i("v-col",{attrs:{cols:"12",md:"5",id:"emailCC"}},[i("v-text-field",{attrs:{dense:"",outlined:"",label:"CC Email"},model:{value:e.EmailAdd,callback:function(i){t.$set(e,"EmailAdd",i)},expression:"i.EmailAdd"}})],1),i("v-col",[i("v-icon",{attrs:{id:"trashIcon"},on:{click:function(e){return t.deleteEmail(n)}}},[t._v("mdi-delete")])],1)],1)})),i("a",{attrs:{"x-small":"",id:"addCCEmail"},on:{click:t.addEmail}},[t._v("Add CC Email")]),i("p",{attrs:{id:"signature"}},[t._v("Signature: "+t._s(t.signature))]),i("v-text-field",{staticClass:"signatureBox",attrs:{rules:t.sigRules,outlined:"",placeholder:"Gimme your John Hancock","v-if":t.toggleSubTxt()},model:{value:t.signature,callback:function(e){t.signature=e},expression:"signature"}}),t.hideSubText?i("div",[i("p",{attrs:{id:"signNote"},domProps:{innerHTML:t._s(t.signatureNote)}}),i("v-checkbox",{staticClass:"acceptCheckbox",attrs:{label:"I am the county judge listed above."},model:{value:t.isCountyJudge,callback:function(e){t.isCountyJudge=e},expression:"isCountyJudge"}})],1):t._e(),i("v-btn",{attrs:{text:"",color:"#204E70",id:"cancelBtn"},on:{click:function(e){return t.returnToLetter()}}},[t._v("Cancel")]),i("v-btn",{attrs:{tile:"",outlined:"",color:"#204E70",id:"acceptBtn",disabled:!1===t.hideSubText||!1===t.isCountyJudge},on:{click:function(e){return t.submit("certify")}}},[t._v("Accept")])],2)},b=[],p={name:"acceptCertify",acceptCertify:!0,data:function(){return{date:"",ccEmailAdd:"",ccEmail:[],sigRules:[function(t){return!!t||"Signature is required"},function(t){return t&&t.length>=5||"Name must be greater than 5 characters"}],signature:"",signatureNote:"By clicking submit, you are certifying the mileage for your county and completing the process for ".concat((new Date).getFullYear(),".\n                            <br><br> <b>Note</b>: any subsequent edits made in the CRI Map up until August 31 will need to be recertified."),hideSubText:!1,isCountyJudge:!1}},methods:{addEmail:function(){this.ccEmail.push({EmailAdd:""})},deleteEmail:function(t){this.ccEmail.splice(t,1)},toggleSubTxt:function(){this.signature.length>=5?this.hideSubText=!0:this.hideSubText=!1},countyMileageTxt:function(){return"The current mileage for ".concat(this.countyName," is ").concat(this.countyMileage)},returnToLetter:function(){this.isJudgeLetter=!this.isJudgeLetter},submit:function(t){var e=[],i=[];this.ccEmail.forEach((function(t){e.push(t.EmailAdd),i.push(t.delUserName)})),Object(c["g"])(t,null,e)}},computed:{judgeNameSend:{get:function(){return this.$store.state.judgeName}},judgeEmailSend:{get:function(){return this.$store.state.judgeEmail}},countyName:{get:function(){return this.$store.state.cntyName}},countyMileage:{get:function(){return this.$store.state.cntyMiles}},isJudgeLetter:{get:function(){return this.$store.state.isJudgeLtter},set:function(t){this.$store.commit("setIsJudgeLetter",t)}}}},v=p,y=(i("382f"),Object(m["a"])(v,h,b,!1,null,"6f6ca605",null)),x=y.exports,E={name:"JudgeIntro",components:{AssignDelegate:f,acceptCertify:x},props:["id"],data:function(){return{judgeLetter:!0,mainTxt:"",subTxt:"",judgeName:"",judgeEmail:"",countyNbr:"",sendData:"",assignDel:!1,accptCertify:!1}},mounted:function(){var t=this;return Object(r["a"])(regeneratorRuntime.mark((function e(){var i,n;return regeneratorRuntime.wrap((function(e){while(1)switch(e.prev=e.next){case 0:return e.next=2,Object(s["a"])();case 2:return i=e.sent,e.next=5,i["query"];case 5:n=e.sent,t.judgeName=n.features[0].attributes["JUDGE_NM"],t.judgeNameSend=n.features[0].attributes["JUDGE_NM"],t.judgeEmail=n.features[0].attributes["JUDGE_EML"],t.judgeEmailSend=n.features[0].attributes["JUDGE_EML"],t.countyNbr=n.features[0].attributes["CNTY_NBR"],t.currentMiles=n.features[0].attributes["TOT_MLGE"],t.county=n.features[0].attributes["CNTY_NM"],t.sendData=parseInt(t.currentMiles),localStorage.setItem("county",JSON.stringify([t.county,t.countyNbr,t.currentMiles])),t.$store.commit("setCntyMiles",t.currentMiles),t.mainTxt='\n          <p align="justify">Dear '.concat(t.judgeName,',</p>\n          <p align="justify">The Texas Department of Transportation (TxDOT) is soliciting updates to the County Road Inventory (CRI) from your county.  The deadline for the ').concat((new Date).getFullYear()," submission is <u>August 31</u>.<br><br>\n            \n          Your ").concat((new Date).getFullYear()," certified mileage is: <b><u>").concat(t.currentMiles,"</b></u><br><br>\n            \n          If you agree with this mileage, please click the AGREE & CERTIFY button below.  To review your CRI and make edits, please click the REVIEW & EDIT button below.  To delegate the responsibility of making updates to a trusted partner, please click the ASSIGN DELEGATE button below.<br><br>\n          Thank you for your assistance in keeping the county road inventory up to date. If you have any questions or need clarification, please contact us by email or phone. <br><br>\n          Sincerely,<br><br> \n          Michael Chamberlain<br>  \n          Transportation Planning and Programming Division<br>  \n          Director of Data Management<br>  \n          TPP-GIS@txdot.gov<br>  \n          (512) 851-9039<br><br></p>"),t.subTxt="<br><p align=\"justify\">If you would like to review your inventory using the Review & Edit button above, but have not yet created an account for yourself, you can <a href='https://www.txdot.gov/data-maps/roadway-inventory/cri-form.html' target='_blank'><u>register here</u></a>.</p>\n                         <p align=\"justify\">TxDOT reports county road mileage to the Texas State Comptroller and Department of Motor Vehicles. That data is used to calculate funds to be distributed to each county. \n                         Your participation in the County Road Inventory program is essential for ensuring an accurate and complete inventory.</p>";case 18:case"end":return e.stop()}}),e)})))()},methods:{logMeIn:function(){this.$router.push("/login")}},watch:{isJdgeLetter:{handler:function(){this.assignDel=!1,this.judgeLetter=!0,this.accptCertify=!1,console.log(this.judgeLetter)},immediate:!0}},computed:{isJdgeLetter:{get:function(){return this.$store.state.isJudgeLtter},set:function(t){this.$store.commit("setIsJudgeLetter",t)}},judgeNameSend:{get:function(){return this.$store.state.judgeName},set:function(t){this.$store.commit("setJudgeName",t)}},judgeEmailSend:{get:function(){return this.$store.state.judgeEmail},set:function(t){this.$store.commit("setJudgeEmail",t)}},county:{get:function(){return this.$store.state.cntyName},set:function(t){this.$store.commit("setCntyName",t)}},currentMiles:{get:function(){return this.$store.state.cntyMiles},set:function(t){this.$store.commit("setCntyMiles",t)}}}},C=E,T=(i("adfc"),Object(m["a"])(C,n,a,!1,null,"4ee3d1e6",null));e["default"]=T.exports},a434:function(t,e,i){"use strict";var n=i("23e7"),a=i("da84"),r=i("23cb"),s=i("5926"),o=i("07fa"),l=i("7b0b"),c=i("65f0"),u=i("8418"),d=i("1dde"),m=d("splice"),g=a.TypeError,f=Math.max,h=Math.min,b=9007199254740991,p="Maximum allowed length exceeded";n({target:"Array",proto:!0,forced:!m},{splice:function(t,e){var i,n,a,d,m,v,y=l(this),x=o(y),E=r(t,x),C=arguments.length;if(0===C?i=n=0:1===C?(i=0,n=x-E):(i=C-2,n=h(f(s(e),0),x-E)),x+i-n>b)throw g(p);for(a=c(y,n),d=0;d<n;d++)m=E+d,m in y&&u(a,d,y[m]);if(a.length=n,i<n){for(d=E;d<x-n;d++)m=d+n,v=d+i,m in y?y[v]=y[m]:delete y[v];for(d=x;d>x-n+i;d--)delete y[d-1]}else if(i>n)for(d=x-n;d>E;d--)m=d+n-1,v=d+i-1,m in y?y[v]=y[m]:delete y[v];for(d=0;d<i;d++)y[d+E]=arguments[d+2];return y.length=x-n+i,a}})},a97c:function(t,e,i){},abac:function(t,e,i){},adfc:function(t,e,i){"use strict";i("b5b2")},b5b2:function(t,e,i){},d79a:function(t,e,i){t.exports=i.p+"img/txdotLogo.cd18eab1.jpeg"},f490:function(t,e,i){"use strict";i("a97c")}}]);
//# sourceMappingURL=MileSign.c69bfe6d.js.map