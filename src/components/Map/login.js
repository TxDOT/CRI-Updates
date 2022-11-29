// import methods and functions into file
import { countyOfficialInfo, view, featLayer, txCounties, search, viewPoint, home } from './map'
import { queryEditsLayer } from './crud'
import { defineGraphic, geomToMiles, queryFeat } from './helper';
import { cntyNbrNm } from '../../common/txCnt'
import Query from "@arcgis/core/rest/support/Query";
import { store } from '../../store'
import router from '../../router';
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
export async function reloadEdits(){
    //while user is logging in, query edits service and display currents from count
    let currentEditRoads = queryEditsLayer();
    
    let createGraphics = await currentEditRoads
    console.log(createGraphics)
    //first add all Adds together
    //second query and and compare Ref layer length against add route length and apply to total length
    //finally subtract delete roads from total length 
    let mileSetUp = 0;
    for(let i=0; i < createGraphics.features.length; i++){
      let length = geomToMiles(createGraphics.features[i].geometry,true,3)
      //reset Edit TYPE_ID to add/edit/delete so that criConstants.editType can be used in defineGraphic func
      if(createGraphics.features[i].attributes.EDIT_TYPE_ID === 1){
        mileSetUp += length
        createGraphics.features[i].attributes.EDIT_TYPE_ID = 'add'
      }
      else if(createGraphics.features[i].attributes.EDIT_TYPE_ID === 5){
        let returnRoad = await queryFeat(createGraphics.features[i])
        let oldLength = geomToMiles(returnRoad.features[0].geometry,true,3)
        let diff = length - oldLength
        mileSetUp += diff
        createGraphics.features[i].attributes.oldLength = oldLength
        createGraphics.features[i].attributes.EDIT_TYPE_ID = 'edit'
      }
      else if(createGraphics.features[i].attributes.EDIT_TYPE_ID === 4){
        createGraphics.features[i].attributes.EDIT_TYPE_ID = 'delete'
        createGraphics.features[i].attributes.oldLength = length
      }
      
      defineGraphic(createGraphics.features[i], 'click')
    }
    store.commit('setDeltaDis',[mileSetUp, 'Add'])
    return currentEditRoads
}

//function to query ref table by OID and COUNTY NAME and go and load map
export async function goToMap(name, nbr){
    let road = await reloadEdits()
    let objectidList = [];
    for(let id in road.features){
      if(road.features[id].attributes !== null){
        let objectid = road.features[id].attributes.objectid || road.features[id].attributes.OBJECTID
        objectidList.push(objectid)
      }
    }
    // need to adjust objectid to asset id
    featLayer.definitionExpression = objectidList.length ? `OBJECTID not in (${objectidList}) and CNTY_TYPE_NM = '${name}'`: `CNTY_TYPE_NM = '${name}'`
    txCounties.definitionExpression=`CNTY_NM='${name}'`
          
    const query = new Query();
    query.where = `CNTY_NM = '${name}'`
    query.outFields = [ "*" ]
    query.returnGeometry = true
    let countyQuery = txCounties.queryFeatures(query)
    let returnCountyObj = await countyQuery
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

export function isTrainingAccess(groupsArr){
  console.log(groupsArr)
  groupsArr.then((x) => {
    let isGroup = x.some(t => t.title === 'County Road Inventory Advanced')
    store.commit('setCertifiedrCheck', isGroup)
  })
  
  //check if user has the correct permsssions. user Portal library

  //if User has correct permissions -> allow access to Advanced Button
  //if user does not have correct permission -> A new Button to request permission to request training
}