// import methods and functions into file
import { countyOfficialInfo, view, txCounties, search, viewPoint, home, featLayer, clientSideGeoJson} from './map'
import { queryEditsLayer } from './crud'
import { defineGraphic, geomToMiles, getCentroid, queryFeat } from './helper';
import { cntyNbrNm } from '../../common/txCnt'
import Query from "@arcgis/core/rest/support/Query";
// import { criConstants } from '../../common/cri_constants';
import { store } from '../../store'
import router from '../../router';
import * as webMercatorUtils from "@arcgis/core/geometry/support/webMercatorUtils";
// on successful login gets county name and road mileage totals. Filters county for map zoom and definition query
export async function countyInfo(){
  let countyInfoPromise =  new Promise(function(res){
    let queryUrl = window.location.href
    let regExUrl = /\/(?:.(?!\/))+$/
    let crInfo = queryUrl.match(regExUrl)[0].split('/')[1]
    if(crInfo === 'login#'){return router.push('/load')}
    for (let j=0; j < cntyNbrNm.length; j++){
      if(cntyNbrNm[j][crInfo]){
        let whereStatement = `CNTY_NBR = '${crInfo}'`
        // roadInfo.getcntyNmbr = crInfo
        store.commit('setCntyNmbr', crInfo)
        // roadInfo.getcntyName = cntyNbrNm[j][crInfo]
        store.commit('setCntyName', cntyNbrNm[j][crInfo])
        const query = new Query();
        query.where = whereStatement
        query.outFields = [ "*" ]
        let newQuery = countyOfficialInfo.queryFeatures(query)
        // query county extent for dynamic home button
        const geomQuery = new Query();
        //geomQuery.where = `CNTY_NM = '${store.getters.getCntyName}'`;
        geomQuery.outFields = [ "*" ];
        geomQuery.returnGeometry = true;
        let returnGeom = txCounties.queryFeatures(geomQuery);
        //Dynamically adding County NBR to search definition expression via data store
        // let countyExtent = returnGeom;
        // countyExtent.then(function(result) {
        //   viewPoint.targetGeometry = result.features[0].geometry.extent;
        //   viewPoint.scale = 500000
        //   //need to set a buffer on mapview zoom level
        //   home.viewpoint = viewPoint;
        // });

        res({response:true, nbr:parseInt(crInfo), query:newQuery, extent: returnGeom})
      }
      else{
        res({response:false})
      }
    }
    //let crValidation = /^[0-9]{1,3}$/
  })
  
  let countyInfoReturn = await countyInfoPromise;
  return countyInfoReturn
}



//reloads edits from EDITS Feature Service to Graphics Layer
//need to rework this function
export async function reloadEdits(){
    store.commit('setDeltaDis',[0, 'Reset'])
    //while user is logging in, query edits service and display currents from count
    let currentEditRoads = queryEditsLayer();
    let createGraphics = await currentEditRoads
    //first add all Adds together
    //second query and and compare Ref layer length against add route length and apply to total length
    //finally subtract delete roads from total length 
    let mileSetUp = 0;
    for(let i=0; i < createGraphics.features.length; i++){
      
      let length = geomToMiles(createGraphics.features[i].geometry,true,3)
      //reset Edit TYPE_ID to add/edit/delete so that criConstants.editType can be used in defineGraphic func
      if(createGraphics.features[i].attributes.EDIT_TYPE_ID === 1){
        mileSetUp += length
        // let replaceItem = parseNReplace(createGraphics.features[i].attributes.ASSET_ST_DEFN_NM, createGraphics.features[i].attributes.ASSET_SRFC_TYPE_DSCR, createGraphics.features[i].attributes.ASSET_RDWAY_DSGN_TYPE_DSCR)
        // createGraphics.features[i].attributes.ASSET_ST_DEFN_NM = JSON.stringify(replaceItem[0])
        // createGraphics.features[i].attributes.ASSET_SRFC_TYPE_DSCR = JSON.stringify(replaceItem[2])
        // createGraphics.features[i].attributes.ASSET_RDWAY_DSGN_TYPE_DSCR = JSON.stringify(replaceItem[1])
        createGraphics.features[i].attributes.GID = 9999
        createGraphics.features[i].attributes.EDIT_TYPE_ID = 'add'
      }
      else if(createGraphics.features[i].attributes.EDIT_TYPE_ID === 5){
        
        let returnRoad = await queryFeat(createGraphics.features[i])
      
        let oldLength = geomToMiles(returnRoad.features[0].geometry,true,3)
        let diff = length - oldLength
        mileSetUp += diff
        //detlete
        createGraphics.features[i].attributes.RTE_DEFN_LN_CREATE_DT = new Date()
        // let replaceItem = parseNReplace(createGraphics.features[i].attributes.ASSET_ST_DEFN_NM, createGraphics.features[i].attributes.ASSET_SRFC_TYPE_DSCR, createGraphics.features[i].attributes.ASSET_RDWAY_DSGN_TYPE_DSCR)
        // createGraphics.features[i].attributes.ASSET_ST_DEFN_NM = JSON.stringify(replaceItem[0])
        // createGraphics.features[i].attributes.ASSET_SRFC_TYPE_DSCR = JSON.stringify(replaceItem[2])
        // createGraphics.features[i].attributes.ASSET_RDWAY_DSGN_TYPE_DSCR = JSON.stringify(replaceItem[1])

        createGraphics.features[i].attributes.oldLength = oldLength
        createGraphics.features[i].attributes.EDIT_TYPE_ID = 'edit'
      }
      else if(createGraphics.features[i].attributes.EDIT_TYPE_ID === 4){
        //delete
        mileSetUp -= length
        createGraphics.features[i].attributes.RTE_DEFN_LN_CREATE_DT = new Date()
        // let replaceItem = parseNReplace(createGraphics.features[i].attributes.ASSET_ST_DEFN_NM, createGraphics.features[i].attributes.ASSET_SRFC_TYPE_DSCR, createGraphics.features[i].attributes.ASSET_RDWAY_DSGN_TYPE_DSCR)
        // createGraphics.features[i].attributes.ASSET_ST_DEFN_NM = JSON.stringify(replaceItem[0])
        // createGraphics.features[i].attributes.ASSET_SRFC_TYPE_DSCR = JSON.stringify(replaceItem[2])
        // createGraphics.features[i].attributes.ASSET_RDWAY_DSGN_TYPE_DSCR = JSON.stringify(replaceItem[1])

        createGraphics.features[i].attributes.EDIT_TYPE_ID = 'delete'
        createGraphics.features[i].attributes.oldLength = length
      }
      defineGraphic(createGraphics.features[i], 'click')

    }
    //reloadItemsQuick(createGraphics.features)
    store.commit('setDeltaDis',[mileSetUp, 'Add'])
    return currentEditRoads
}

function queryLayer(cntyName, rdbdId){
  let query = new Query()
  query.num = 20000
  query.where = `CNTY_TYPE_NM = '${cntyName}' and RDBD_GMTRY_LN_ID > ${rdbdId}`
  query.outFields = [ "*" ]
  query.orderByFields = ["RDBD_GMTRY_LN_ID"]
  query.returnM = true
  // query.hasM = true
  query.hasZ = true
  query.returnGeometry = true
  return query
}

//convert REF layer service (i.e County) to GeoJSON layer. Client side querying.
export async function createGeoJson(cntyName){

  let geoJSONArr = {
    type: "FeatureCollection",
    features: []
  }; 
  let exceedTransLimt = true
  let roads = []
  let rdbdId = 0
  while(exceedTransLimt === true){
    let query = queryLayer(cntyName, rdbdId)
    let querySet = await featLayer.queryFeatures(query)
    let lastId = querySet.features.at(-1).attributes.RDBD_GMTRY_LN_ID
    rdbdId = lastId
    querySet.features.forEach(feat => roads.push(feat))
    exceedTransLimt = querySet.exceededTransferLimit
  }

  for(let i=0; i < roads.length; i++){
    let convertToGeo = webMercatorUtils.webMercatorToGeographic(roads[i].geometry)
    let geojson = {
          type: "Feature",
          id: roads[i].attributes.OBJECTID,
          geometry: {
            type: "LineString",
            coordinates:convertToGeo.paths[0]
          },
          properties: {
            ASSET_ID: roads[i].attributes.ASSET_ID,
            ASSET_LN_BEGIN_DFO_MS: roads[i].attributes.ASSET_LN_BEGIN_DFO_MS,
            ASSET_LN_END_DFO_MS: roads[i].attributes.ASSET_LN_END_DFO_MS,
            CNTY_TYPE_NBR: roads[i].attributes.CNTY_TYPE_NBR,
            CNTY_TYPE_NM: roads[i].attributes.CNTY_TYPE_NM,
            LENGTH: roads[i].attributes.LENGTH,
            OBJECTID: roads[i].attributes.OBJECTID,
            RDBD_GMTRY_LN_ID: roads[i].attributes.RDBD_GMTRY_LN_ID,
            RTE_DEFN_LN_NM: roads[i].attributes.RTE_DEFN_LN_NM,
            SHAPE__Length: roads[i].attributes.SHAPE__Length,
            SRCH_LONG: roads[i].attributes.SRCH_LONG,
            SRCH_SHORT: roads[i].attributes.SRCH_SHORT,
            ST_DEFN_NM: roads[i].attributes.ST_DEFN_NM,
            ST_PRFX_TYPE_CD: roads[i].attributes.ST_PRFX_TYPE_CD,
            ST_PRFX_TYPE_DSCR: roads[i].attributes.ST_PRFX_TYPE_DSCR,
            ST_PRFX_TYPE_ID: roads[i].attributes.ST_PRFX_TYPE_ID,
            //ST_SFX_TYPE_CD: cntyRoad.features[i].attributes.ST_SFX_TYPE_CD,
           // ST_SFX_TYPE_DSCR: cntyRoad.features[i].attributes.ST_SFX_TYPE_DSCR,
           // ST_SFX_TYPE_ID: cntyRoad.features[i].attributes.ST_SFX_TYPE_ID,
            ST_TYPE_DSCR: roads[i].attributes.ST_TYPE_DSCR,
          }
        }

    geoJSONArr.features.push(geojson)
  }
  
  // create a new blob from geojson featurecollection
  const blob = new Blob([JSON.stringify(geoJSONArr)], {
    type: "application/json"
  });
  
  // URL reference to the blob
  const url = URL.createObjectURL(blob);
  // create new geojson layer using the blob url
  clientSideGeoJson.url = url

  return;
}

//function to query ref table by OID and COUNTY NAME and go and load map
export async function goToMap(name, nbr){
    await createGeoJson(name)
    let road = await reloadEdits()
    let objectidList = [];
    for(let id in road.features){
      if(road.features[id].attributes !== null){
        let objectid = road.features[id].attributes.gid || road.features[id].attributes.RDBD_GMTRY_LN_ID
        objectidList.push(objectid)
      }
    }
    // need to adjust objectid to asset id
    //featLayer.definitionExpression = objectidList.length ? `RDBD_GMTRY_LN_ID not in (${objectidList}) and CNTY_TYPE_NM = '${name}'`: `CNTY_TYPE_NM = '${name}'`
    txCounties.definitionExpression=`CNTY_NM='${name}'`
    //let rdbdQuery = featLayer.createQuery()
    //rdbdQuery.geometry = extentForRegionOfInterest;
    //rdbdQuery.where = `RDBD_GMTRY_LN_ID not in (${objectidList}) and CNTY_TYPE_NM = '${name}'`
    
    const query = new Query();
    query.where = `CNTY_NM = '${name}'`
    query.outFields = [ "*" ]
    query.returnGeometry = true

    let countyQuery = txCounties.queryFeatures(query)
    
    let returnCountyObj = await countyQuery
    getCentroid(returnCountyObj.features[0].geometry)
    store.commit('setDistrict', returnCountyObj.features[0].attributes.TXDOT_DIST_NBR)
    //set search sources to selected county
    search.sources._items[0].layer.definitionExpression = `CNTY_TYPE_NBR = ${nbr}`;
    // zoom to selected county geometry      
    view.goTo({
      target: returnCountyObj.features[0].geometry
    })
    // set home button viewpoint with geom from query
    viewPoint.targetGeometry = returnCountyObj.features[0].geometry.extent;
    viewPoint.scale = 500000;
    home.viewpoint = viewPoint;
    // set mapview constraints to county geometry
    view.constraints.geometry = returnCountyObj.features[0].geometry.extent;
    view.constraints.minZoom = 8;
    return;
} 
//sets store for Advanced page Access
export async function isTrainingAccess(groupsArr){
  let esriGroups = await groupsArr
  const belongCRI = esriGroups.some(x => x.title === "County Road Inventory")
  console.log(belongCRI)
  if(belongCRI === true){
    let isGroup = esriGroups.some(t => t.title === 'County Road Inventory Advanced')
    store.commit('setCertifiedCheck', isGroup)
    return;
  }

  router.push({name: "Login"})
  // groupsArr.then((x) => {
  //   let isGroup = x.some(t => t.title === 'County Road Inventory Advanced')
  //   store.commit('setCertifiedCheck', isGroup)
  // })
  
  //check if user has the correct permsssions. user Portal library

  //if User has correct permissions -> allow access to Advanced Button
  //if user does not have correct permission -> A new Button to request permission to request training
}

// export function parseNReplace(roadNmObj, assetSrfcType, assetRdwyDsgn){
//   let rdName = JSON.parse(roadNmObj)
//   let rdwyDsgn = JSON.parse(assetRdwyDsgn)
//   let srfcType = JSON.parse(assetSrfcType)
//   rdName.forEach((x) => {
//     if(typeof x.prefix === 'number'){
//       let preDir = criConstants.suffixPrefixNum[0][x.prefix]
//       x.prefix = preDir
//     }

//     if(typeof x.suffix === 'number'){
//       let sufDir = criConstants.suffixPrefixNum[0][x.suffix]
//       x.suffix = sufDir
//     }

//     if(typeof x.streetType === 'number'){
//       let strType = criConstants.rdNameType.find(z => z[x.streetType])
//       x.streetType = Object.values(strType)[0]
//     }
//   })

//   rdwyDsgn.forEach((a)=>{
//     if(typeof a.SRFC_TYPE_ID === 'number'){
//       let asset = criConstants.design.find(t => String(t[a.SRFC_TYPE_ID]))
//       a.SRFC_TYPE_ID = asset.name
//     }
//   })

//   srfcType.forEach((b)=>{
//     if(typeof b.SRFC_TYPE_ID === 'number'){
//       let asset = criConstants.surface.find(y => String(y[b.SRFC_TYPE_ID]))
//       b.SRFC_TYPE_ID = asset.name
//     }
//   })

  
//   return [rdName, rdwyDsgn, srfcType]
// }
