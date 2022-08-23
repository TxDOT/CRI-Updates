(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["PickCounty"],{"4c12":function(e,t,n){"use strict";n("6a40")},"6a40":function(e,t,n){},9708:function(e,t,n){"use strict";n.r(t);var a=function(){var e=this,t=e.$createElement,n=e._self._c||t;return n("v-container",[n("v-dialog",{staticStyle:{"border-radius":"0%"},attrs:{persistent:"","max-width":"320"},model:{value:e.pick,callback:function(t){e.pick=t},expression:"pick"}},[n("v-card",{staticStyle:{"border-radius":"0%"},attrs:{height:"200","max-width":"100%"}},[n("v-card-title",{staticClass:"surfaceTitle"},[n("v-card-text",{staticStyle:{position:"relative",bottom:"27px",right:"20px","font-size":"15px","text-align":"left",color:"white",padding:"none"}},[e._v("County Road Inventory Map")])],1),n("v-card-text",{staticStyle:{position:"relative",color:"black","text-align":"left",top:"30px",rught:"5px"}},[e._v(" Select a county to begin work. ")]),n("v-autocomplete",{staticStyle:{position:"absolute",width:"48%",right:"8.9rem",top:"6rem","border-radius":"0%"},attrs:{"persistent-placeholder":"",outlined:"",dense:"",tile:"",items:e.cntyNames,label:"County Name"},model:{value:e.pickCounty,callback:function(t){e.pickCounty=t},expression:"pickCounty"}}),n("div",[n("v-btn",{staticStyle:{top:"5rem",left:"9rem",width:"100px"},attrs:{disabled:0===e.pickCounty.length,outlined:"",depressed:"",color:"#204E70",plain:"",tile:""},on:{click:function(t){return e.getCountyInfo()}}},[e._v("Continue")]),n("v-btn",{staticStyle:{top:"5rem",right:"3rem"},attrs:{depressed:"",color:"#204E70",plain:"",tile:""},on:{click:function(t){return e.cancel()}}},[e._v("Cancel")])],1)],1)],1),e.load?n("loader"):e._e()],1)},o=[],r=n("1da1"),i=(n("96cf"),n("7db0"),n("d3b7"),n("b64b"),n("99af"),n("3514")),s=n("2316"),l=n("1baa"),c=n("69dd"),u=n("f596"),d=n("d81c8"),m={name:"PickCounty",components:{loader:u["a"]},props:["id"],data:function(){return{cntyNames:["Anderson","Andrews","Angelina","Aransas","Archer","Armstrong","Atascosa","Austin","Bailey","Bandera","Bastrop","Baylor","Bee","Bell","Bexar","Blanco","Borden","Bosque","Bowie","Brazoria","Brazos","Brewster","Briscoe","Brooks","Brown","Burleson","Burnet","Caldwell","Calhoun","Callahan","Cameron","Camp","Carson","Cass","Castro","Chambers","Cherokee","Childress","Clay","Cochran","Coke","Coleman","Collin","Collingsworth","Colorado","Comal","Comanche","Concho","Cooke","Coryell","Cottle","Crane","Crockett","Crosby","Culberson","Dallam","Dallas","Dawson","De Witt","Deaf Smith","Delta","Denton","Dickens","Dimmit","Donley","Duval","Eastland","Ector","Edwards","El Paso","Ellis","Erath","Falls","Fannin","Fayette","Fisher","Floyd","Foard","Fort Bend","Franklin","Freestone","Frio","Gaines","Galveston","Garza","Gillespie","Glasscock","Goliad","Gonzales","Gray","Grayson","Gregg","Grimes","Guadalupe","Hale","Hall","Hamilton","Hansford","Hardeman","Hardin","Harris","Harrison","Hartley","Haskell","Hays","Hemphill","Henderson","Hidalgo","Hill","Hockley","Hood","Hopkins","Houston","Howard","Hudspeth","Hunt","Hutchinson","Irion","Jack","Jackson","Jasper","Jeff Davis","Jefferson","Jim Hogg","Jim Wells","Johnson","Jones","Karnes","Kaufman","Kendall","Kenedy","Kent","Kerr","Kimble","King","Kinney","Kleberg","Knox","La Salle","Lamar","Lamb","Lampasas","Lavaca","Lee","Leon","Liberty","Limestone","Lipscomb","Live Oak","Llano","Loving","Lubbock","Lynn","Madison","Marion","Martin","Mason","Matagorda","Maverick","McCulloch","McLennan","McMullen","Medina","Menard","Midland","Milam","Mills","Mitchell","Montague","Montgomery","Moore","Morris","Motley","Nacogdoches","Navarro","Newton","Nolan","Nueces","Ochiltree","Oldham","Orange","Palo Pinto","Panola","Parker","Parmer","Pecos","Polk","Potter","Presidio","Rains","Randall","Reagan","Real","Red River","Reeves","Refugio","Roberts","Robertson","Rockwall","Runnels","Rusk","Sabine","San Augustine","San Jacinto","San Patricio","San Saba","Schleicher","Scurry","Shackelford","Shelby","Sherman","Smith","Somervell","Starr","Stephens","Sterling","Stonewall","Sutton","Tarrant","Taylor","Terrell","Terry","Throckmorton","Titus","Tom Green","Travis","Trinity","Tyler","Upshur","Upton","Uvalde","Val Verde","Van Zandt","Victoria","Walker","Waller","Ward","Washington","Webb","Wharton","Wheeler","Wichita","Wilbarger","Willacy","Williamson","Wilson","Winkler","Wise","Wood","Yoakum","Young","Zapata","Zavala","Swisher"],pickCounty:"",pick:!0,load:!1}},methods:{cancel:function(){var e=this;d["default"].checkSignInStatus("https://txdot.maps.arcgis.com/sharing").then((function(){d["default"].destroyCredentials(),localStorage.removeItem("county"),e.$router.push("/login")})).catch((function(){e.$router.push("/login")}))},getCountyInfo:function(){var e=this;console.log("autocopmplete"),this.pick=!1,this.load=!0;var t=Object.keys(l["a"][0]).find((function(t){return l["a"][0][t]===e.pickCounty})),n="County_NBR = '".concat(t,"'"),a=new c["a"];a.where=n,a.outFields=["*"];var o=i["countyOfficialInfo"].queryFeatures(a);o.then((function(n){console.log(n,n.features[0].attributes["Total_Mileage"],t),e.countyNumber=t,e.countyName=e.pickCounty,e.countyMiles=n.features[0].attributes["Total_Mileage"],e.goToMap(e.pickCounty,e.getCountyNbr)}))},goToMap:function(e,t){var n=this;return Object(r["a"])(regeneratorRuntime.mark((function a(){var o,r,l,u,d,m,p;return regeneratorRuntime.wrap((function(a){while(1)switch(a.prev=a.next){case 0:return a.next=2,Object(s["reloadEdits"])();case 2:for(l in o=a.sent,r=[],o.features)null!==o.features[l].attributes&&(u=o.features[l].attributes.objectid||o.features[l].attributes.OBJECTID,r.push(u));return console.log(r),i["featLayer"].definitionExpression=r.length?"OBJECTID not in (".concat(r,") and CNTY_TYPE_NM = '").concat(e,"'"):"CNTY_TYPE_NM = '".concat(e,"'"),console.log(t),i["txCounties"].definitionExpression="CNTY_NM='".concat(e,"'"),d=new c["a"],d.where="CNTY_NM = '".concat(e,"'"),d.outFields=["*"],d.returnGeometry=!0,m=i["txCounties"].queryFeatures(d),a.next=16,m;case 16:p=a.sent,i["view"].goTo({target:p.features[0].geometry}),console.log(i["viewPoint"]),n.$router.push("/map"),n.load=!1;case 21:case"end":return a.stop()}}),a)})))()}},computed:{countyName:{get:function(){return this.$store.state.cntyName},set:function(e){this.$store.commit("setCntyName",e)}},countyNumber:{get:function(){return this.$store.state.cntyNmbr},set:function(e){console.log(e),this.$store.commit("setCntyNmbr",e)}},countyMiles:{get:function(){return this.$store.state.cntyMiles},set:function(e){this.$store.commit("setCntyMiles",e)}},userName:{get:function(){return this.$store.state.username},set:function(e){this.$store.commit("setUserName",e)}}}},p=m,h=(n("4c12"),n("2877")),y=Object(h["a"])(p,a,o,!1,null,"429131f1",null);t["default"]=y.exports},b64b:function(e,t,n){var a=n("23e7"),o=n("7b0b"),r=n("df75"),i=n("d039"),s=i((function(){r(1)}));a({target:"Object",stat:!0,forced:s},{keys:function(e){return r(o(e))}})},f596:function(e,t,n){"use strict";var a=function(){var e=this,t=e.$createElement,n=e._self._c||t;return n("v-progress-circular",{staticStyle:{top:"400px"},attrs:{indeterminate:"",color:"primary"}})},o=[],r={name:"loader"},i=r,s=n("2877"),l=Object(s["a"])(i,a,o,!1,null,null,null);t["a"]=l.exports}}]);
//# sourceMappingURL=PickCounty.7e2e1417.js.map