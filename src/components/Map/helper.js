// import methods and functions into file
import { view, clientSideGeoJson, gLayer, rdbdSrfcAsst, rdbdDsgnAsst, rdbdLaneAsst } from './map' //importing from ESRI API via map.js
import { criConstants } from '../../common/cri_constants';
import { store } from '../../store'
import { getTime } from '../Map/advanced'
import { showVerticies, hideEditedRoads} from './edit'
import * as geometryEngine from "@arcgis/core/geometry/geometryEngine";
import Graphic from "@arcgis/core/Graphic";
import Query from "@arcgis/core/rest/support/Query";
import * as webMercatorUtils from "@arcgis/core/geometry/support/webMercatorUtils";


//Sets Road Data in the data store. 
export async function setDataToStore(surface, design, name, lane, objectid, comment, editInfo){
    store.commit('setRoadbedSurface', surface) //push surface type values to getSurface setter
    store.commit('setRoadbedDesign', design) 
    store.commit('setRoadbedName', name)
    store.commit('setNumLane', lane)
    store.commit('setObjectid', objectid)
    store.commit('setComment', comment)
    store.commit('setEditInfo', editInfo)
}

//querys the Refernce Layer table returns geometry/attributes
export async function queryFeat(qry){
    let queryFeat = await clientSideGeoJson.queryFeatures({
      objectIds: qry.results ? [qry.results[0].graphic.attributes.OBJECTID] : null,
      where: qry.results ? null : `RDBD_GMTRY_LN_ID = ${qry.attributes.GID}`,
      returnM: true,
      outFields: ["*"],
      returnGeometry: true,

    })
    return queryFeat
  }

//Querying asset (nonGeom) tables and pushing values to store
export async function queryFeatureTables(tblqry){
    //this function is called when a user makes an initial edit (first part of the ternery) and on reload of the map (second part of the ternery).
    let queryStatment = tblqry.features ? tblqry.features[0].attributes.RDBD_GMTRY_LN_ID : tblqry.attributes.RDBD_GMTRY_LN_ID
    const query = new Query();
    query.where = `RDBD_GMTRY_LN_ID = ${queryStatment}`
    query.outFields = [ "*" ]
    const rdbdSrfc = rdbdSrfcAsst.queryFeatures(query)
    const rdbdDsgn = rdbdDsgnAsst.queryFeatures(query)
    const rdbdLane = rdbdLaneAsst.queryFeatures(query)
    const rdbdSrfcAtt = await rdbdSrfc
    const rdbdDsgnAtt = await rdbdDsgn
    const rdbdLaneAtt = await rdbdLane
    // parse and match coded values (cri_constants.js) and push to empty array
    let rdbdSrfArry = [];
    let rdbdDsgnArry = [];
    let rdbdNumLnArry = [];
  
    if(rdbdSrfArry.length){
      rdbdSrfArry.length = 0
    }
    //auto extend assets
    let lengthRd = geometryEngine.geodesicLength(tblqry.features[0].geometry, "miles")
    // looping through Roadbed Surface items and replacing with coded values, located in cri_constants.js
    for(let srf in rdbdSrfcAtt.features){
      let surface = criConstants.surface
      //**this can be modified to include the Array.Splice method
      for(let i in surface){
        if(surface[i]['num'] === rdbdSrfcAtt.features[srf].attributes.SRFC_TYPE_ID){
          rdbdSrfcAtt.features[srf].attributes.SRFC_TYPE_ID = surface[i]['name']
        }
      }
      //**
      rdbdSrfArry.push(rdbdSrfcAtt.features[srf].attributes)
    }
    //looping through roadbed design and creating a new object
    for(let z=0; z < rdbdDsgnAtt.features.length; z++){
      rdbdDsgnArry.push({
        SRFC_TYPE_ID: rdbdDsgnAtt.features[z].attributes.RDWAY_DSGN_TYPE_DSCR,
        ASSET_LN_BEGIN_DFO_MS: Number(rdbdDsgnAtt.features[z].attributes.ASSET_LN_BEGIN_DFO_MS.toFixed(3)),
        ASSET_LN_END_DFO_MS: Number(rdbdDsgnAtt.features[z].attributes.ASSET_LN_END_DFO_MS.toFixed(3)),
        OBJECTID: null
      })
    }
    //looping through number of lanes and creating a new object
    for(let a=0; a < rdbdLaneAtt.features.length; a++){
      rdbdNumLnArry.push({
        SRFC_TYPE_ID:  rdbdLaneAtt.features[a].attributes.NBR_THRU_LANE_CNT.toString(),
        ASSET_LN_BEGIN_DFO_MS:  Number(rdbdLaneAtt.features[a].attributes.ASSET_LN_BEGIN_DFO_MS.toFixed(3)),
        ASSET_LN_END_DFO_MS:  Number(rdbdLaneAtt.features[a].attributes.ASSET_LN_END_DFO_MS.toFixed(3)),
        OBJECTID: null
      })
    }
    //sort the array by begin dfo asc
    rdbdSrfArry.sort((a,b)=>(a.ASSET_LN_BEGIN_DFO_MS > b.ASSET_LN_BEGIN_DFO_MS)? 1:-1)
    rdbdDsgnArry.sort((a,b)=>(a.ASSET_LN_BEGIN_DFO_MS > b.ASSET_LN_BEGIN_DFO_MS)? 1:-1)
    rdbdNumLnArry.sort((a,b)=>(a.ASSET_LN_BEGIN_DFO_MS > b.ASSET_LN_BEGIN_DFO_MS)? 1:-1)
    //converting begin/end dfo to a Number
    for(let i=0; i < rdbdSrfArry.length; i++){
      rdbdSrfArry[i].ASSET_LN_BEGIN_DFO_MS = Number(rdbdSrfArry[i].ASSET_LN_BEGIN_DFO_MS.toFixed(3))
      rdbdSrfArry[i].ASSET_LN_END_DFO_MS = Number(rdbdSrfArry[i].ASSET_LN_END_DFO_MS.toFixed(3))
      delete rdbdSrfArry.objectid
    }
    //creating the Street Name Object
    let roadNameObj = {streetName:tblqry.features[0].attributes.ST_DEFN_NM, 
      prefix: tblqry.features[0].attributes.ST_PRFX_TYPE_DSCR ? tblqry.features[0].attributes.ST_PRFX_TYPE_DSCR.toUpperCase() : null, 
      suffix: tblqry.features[0].attributes.ST_SFX_TYPE_DSCR ? tblqry.features[0].attributes.ST_SFX_TYPE_DSCR.toUpperCase() : null,
      streetType: tblqry.features[0].attributes.ST_TYPE_DSCR,
    }
    //auto extend Asset Lengths
    rdbdSrfArry.at(-1).ASSET_LN_END_DFO_MS = Number((rdbdSrfArry.at(0).ASSET_LN_BEGIN_DFO_MS + lengthRd).toFixed(3))
    rdbdDsgnArry.at(-1).ASSET_LN_END_DFO_MS = Number((rdbdDsgnArry.at(0).ASSET_LN_BEGIN_DFO_MS + lengthRd).toFixed(3))
    rdbdNumLnArry.at(-1).ASSET_LN_END_DFO_MS = Number((rdbdNumLnArry.at(0).ASSET_LN_BEGIN_DFO_MS + lengthRd).toFixed(3))

    setDataToStore(JSON.stringify(rdbdSrfArry), JSON.stringify(rdbdDsgnArry), JSON.stringify([roadNameObj]), JSON.stringify(rdbdNumLnArry), tblqry.features[0].attributes.OBJECTID)
    return;
}

//creating roadbed graphic and setting attributes to graphics layer (gLayer)
//called in modifyRoadbed function
export async function defineGraphic(graphics, clickType, editType){
    let exist = graphics.features ? gLayer.graphics.items.filter(x => x.attributes.objectid === graphics.features[0].attributes.OBJECTID) : gLayer.graphics.items.filter(x => x.attributes.objectid === graphics.attributes.OBJECTID)
    if(exist.length){
      return;
    }

    let graphicGeom;

    if(graphics.features){
      graphicGeom = webMercatorUtils.geographicToWebMercator(graphics.features[0].geometry)
    }
    

    if (clickType === "click"){
      let oldLength = graphics.features ? Number(geometryEngine.geodesicLength(graphics.features[0].geometry, "miles").toFixed(3)) :  graphics.attributes.oldLength
      document.body.style.cursor = 'context-menu'

      let graphicPromise = new Promise(function(res){
        const date = new Date();
        let newGraphic = new Graphic({
          geometry: {
            type: "polyline",
            paths: graphics.features ? graphicGeom.paths[0] : graphics.geometry.paths[0],
            hasM: true,
            spatialReference: {
              wkid: 3857
            }
          },
      
          attributes: {
            editType: graphics.features ? criConstants.editType[`${editType}`][1] : criConstants.editType[`${graphics.attributes.EDIT_TYPE_ID}`][1], 
            gid: graphics.features ? graphics.features[0].attributes.RDBD_GMTRY_LN_ID : graphics.attributes.GID,
            objectid: graphics.features ? graphics.features[0].attributes.OBJECTID : graphics.attributes.OBJECTID,
            roadbedName: graphics.features ? store.getters.getRoadbedName : graphics.attributes.ASSET_ST_DEFN_NM,
            roadbedDesign: graphics.features ? store.getters.getRoadbedDesign : graphics.attributes.ASSET_RDWAY_DSGN_TYPE_DSCR,
            roadbedSurface: graphics.features ? store.getters.getRoadbedSurface : graphics.attributes.ASSET_SRFC_TYPE_DSCR,
            numLane: graphics.features ? store.getters.getNumLane : graphics.attributes.ASSET_NBR_THRU_LANE_CNT,
            originalLength: oldLength,
            isCreatedAssets: true,
            createDt: graphics.features ? date : graphics.attributes.RTE_DEFN_LN_CREATE_DT,
            createNm: graphics.features ? store.getters.getUserName : graphics.attributes.RTE_DEFN_LN_CREATE_USER_NM, //replace with user login info. TODO,
            editNm: graphics.features ? null: graphics.attributes.RTE_DEFN_LN_EDIT_USER_NM,
            editDt: graphics.features ? null: graphics.attributes.RTE_DEFN_LN_EDIT_DT,
            comment: graphics.features ? store.getters.getComment : graphics.attributes.EDIT_NOTES,
          },
                    
          symbol: {
            type: "simple-line",
            color: graphics.features ? criConstants.editType[`${editType}`][0] : criConstants.editType[`${graphics.attributes.EDIT_TYPE_ID}`][0],
            width: 2,
            style: "dash"
          }
        })
        gLayer.graphics.add(newGraphic);
        newGraphic.attributes.editType === 'EDIT' && editType ? showVerticies(newGraphic) : null
  
        store.commit('setOldLength',oldLength)
        store.commit('setModifyRd', true)
        // newGraphic.attributes.editType === 'DELETE' ? store.commit('setDeltaDis',[oldLength, 'Delete']) : null
        res(gLayer)
      })
  
      let returnGraphicPromise = await graphicPromise
      hideEditedRoads(returnGraphicPromise) //imported from edit.js
    }
}

//highlightes reference layer geometry when mouse moves over
export function highLightFeat(eventType){
    let highlight;
    if(highlight){
      highlight.remove()
      highlight = null
    }
    view.when()
      .then(()=>{
        view.on(eventType, (event)=>{
          const opts = {
            include: [gLayer, clientSideGeoJson]
          }
          view.hitTest(event, opts).then((response)=>{
            if(response.results.length){
              view.whenLayerView(response.results[0].graphic.layer).then(function(layerView){
                document.body.style.cursor = 'pointer'
                if(highlight){
                  highlight.remove()
                }
                highlight = layerView.highlight(response.results[0].graphic)
              })
            }
            else{
              if(highlight){
                highlight.remove()
                highlight = null
              }
              document.body.style.cursor = 'context-menu'
              return;
            }
          })
        })
      })
}

//convert geometry to miles
export function geomToMiles(geometry, isNum, precision){
    if(isNum){
      return Number(geometryEngine.geodesicLength(geometry, "miles").toFixed(precision))
    }
    else{
      return geometryEngine.geodesicLength(geometry, "miles")
    }
}

//create epoch date
export function createEpoch(){
  let epochDate = Number((new Date().getTime()/1000).toFixed(0))
  return epochDate
}

//data mapping from client fields to txdot fields
export function submitListAttr(submit){

  let objKeys = {GID: 'GID', RTE_DEFN_L: 'RTE_DEFN_LN_NM'}
  let finalArr = []

  for(let i=0; i<submit.featureSet.features.length; i++){
    let a = Object.entries(submit.featureSet.features[i].attributes).reduce((acc, [key, value])=>{
      acc[objKeys[key]] = (value)
      return acc
    },{})
    finalArr.push(a)
  }
  
  //take incoming fields and convert to our schema
}

//get upate featLayerURLs
export async function getFeatLayURL(){
  let urlFetch = await fetch('https://services.arcgis.com/KTcxiTD9dsQw4r7Z/ArcGIS/rest/services/Route_County/FeatureServer', {'method':'GET', 'Content-Type': 'text/plain'})
  let respHTML = await urlFetch.text()
  const initReg =  new RegExp(/(.*)Route_County<\/a>/g)
  let getValue = initReg.exec(respHTML)
  const re = new RegExp(/\/KTcxiTD9dsQw4r7Z\/ArcGIS\/rest\/services\/Route_County\/FeatureServer\/[0-9]{1}/g)
  console.log(re.exec(getValue[1]))
}

//getFeatLayURL()

//send Judge Emails
export function sendJudgeEmail(step, ccDelName, ccEmailList, jdgeSign, jdgeCntyObj, updMileage){ 
  let dateTime = getTime()
  let theJson = {
    "workflow":{
        "step": step,
        "countyInfo": {
            "countyName": store.getters.getCntyName,
            "countyMileage": store.getters.getCntyMiles,
            "countyNumber":store.getters.getCntyNmbr
        },
        "judgeName": store.getters.getJudgeName,
        "delegateName": ccDelName,
        "email": [store.getters.getJudgeEmail],
        "ccEmails": ccEmailList,
        "timestamp" : `${dateTime[1]} ${dateTime[0]}`,
        "judgeSign" : jdgeSign,
        "jdgeCntyObj": jdgeCntyObj,
        "updMileage": updMileage
      }
  };
  let params = encodeURIComponent(JSON.stringify(theJson));
  let theService = `https://gis-batch-dnd.txdot.gov/fmejobsubmitter/TPP-MB/TPP_Email_Dev.fmw?params=${params}&opt_showresult=false&opt_servicemode=sync`;
  let resp = fetch(theService, {headers:{'Authorization' : 'fmetoken token=baa7b875b9c229d397fb91661280ccb894559885'},'Content-Type': 'text/plain'})
  resp.then(x=> console.log('Webhook fired! Check your email...',x))
}

//get total mileage
export function updateTotalMileage(){
  let totalMileage = Number(Math.floor(store.getters.getDeltaDistance *100)/100) + Number(store.getters.getCntyMiles)
  //still need -- get county name object from countyOfficialInfo
  return totalMileage;
}


export function getCentroid(cntyPoly){
  let n = cntyPoly.rings[0].length
  let xSum = 0
  let ySum = 0
  let centroid = []
  for(let i=0; i < cntyPoly.rings[0].length; i++){
    xSum += cntyPoly.rings[0][i][0]
    ySum += cntyPoly.rings[0][i][1]
  }

  centroid.push(xSum/n)
  centroid.push(ySum/n)
  store.commit('setCntyCentroid', centroid)
  return;
  
}