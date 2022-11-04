// import methods and functions into file
import { view, featLayer, txCounties, search, viewPoint, home } from './map'
import { queryEditsLayer } from './crud'
import { defineGraphic, geomToMiles, queryFeat } from './_helper';
import Query from "@arcgis/core/rest/support/Query";
import {store} from '../../store'

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

// import from _edit.js
// defineGraphic