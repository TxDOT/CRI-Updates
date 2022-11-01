import {sketch, sketchPoint, view, featLayer, gLayer, countyOfficialInfo, txCounties, search, viewPoint, home, rdbdSrfcAsst, rdbdDsgnAsst, rdbdLaneAsst, rdbdAssetPt, rdbdAssetLine} from '../Map/map' //importing from ESRI API via map.js
import {cntyNbrNm} from '../../common/txCnt' //importing county name/nbr table via txCnt.js
import { criConstants } from '../../common/cri_constants';
import {initGraphicCheck, queryEditsLayer} from '../Map/crud'
//import esri js classes via ESM
import * as geometryEngine from "@arcgis/core/geometry/geometryEngine";
import Graphic from "@arcgis/core/Graphic";
import Query from "@arcgis/core/rest/support/Query";
import * as webMercatorUtils from "@arcgis/core/geometry/support/webMercatorUtils"
import * as geodesicUtils from "@arcgis/core/geometry/support/geodesicUtils";
import esriRequest from "@arcgis/core/request";
import {store} from '../../store'
import { showVerticies } from './editFunc';


export async function addRoadbed(){
    let addNewRoad = new Promise(function(res){
      sketch.create("polyline",{mode:"click", hasZ: false})
      sketch.on('create', (event) => {
        let lengthMiles;
        if(event.state === "start"){
          mouseHoverDfoDisplay('addRoad');
        }
        else if(event.state === "active"){
          let seglengthMiles = geometryEngine.geodesicLength(event.graphic.geometry, "miles")
          geomCheck(event.graphic.geometry)
          store.commit('setDfoReturn', seglengthMiles)
        }
  
        if(event.state === "complete"){
          store.commit('setIsDfoReturn', false)
          store.commit('setIsInitAdd', true)
          //creating the length of road in miles for user
          lengthMiles = geometryEngine.geodesicLength(event.graphic.geometry, "miles")
          res([lengthMiles, event.graphic.geometry, 'add']);
          sketchCompete();
        }
      });
    })
    let returnAddNewRoad = await addNewRoad
    //retreiving latest edit in the sketch array
    sketch.layer.graphics.items.at(-1).geometry.hasM = true
    const date = new Date();
    //applying values to sketch attributes and assets
    sketch.layer.graphics.items.at(-1).attributes = {
      editType: criConstants.editType[`${returnAddNewRoad[2]}`][1],
      gid: 9999,
      objectid: Number(date.getTime().toFixed(7)),
      roadbedName: JSON.stringify(null),
      roadbedDesign: JSON.stringify([{
        SRFC_TYPE_ID: "Two-way",
        ASSET_LN_BEGIN_DFO_MS: 0,
        ASSET_LN_END_DFO_MS: Number(returnAddNewRoad[0].toFixed(3))
      }]),
      roadbedSurface: JSON.stringify([{
        SRFC_TYPE_ID: "Paved",
        ASSET_LN_BEGIN_DFO_MS: 0,
        ASSET_LN_END_DFO_MS: Number(returnAddNewRoad[0].toFixed(3))
      }]),
      numLane: JSON.stringify([{
        SRFC_TYPE_ID: "2",
        ASSET_LN_BEGIN_DFO_MS: 0,
        ASSET_LN_END_DFO_MS: Number(returnAddNewRoad[0].toFixed(3))
      }]),
      originalLength: Number(returnAddNewRoad[0].toFixed(3)),
      createDt: date,
      createNm: store.getters.getUserName,
      isCreatedAssets: false,
    }
    //setting add graphic symbol
    sketch.layer.graphics.items.at(-1).symbol = {
      type: "simple-line",
      color: criConstants.editType[`${returnAddNewRoad[2]}`][0],
      width: 2,
      style: "dash"
    }
    showVerticies(sketch.layer.graphics.items.at(-1))
    let timestamp = epochToHumanTime(date)
    //Apply M Measures function
    reapplyM(gLayer.graphics.items.at(-1))
    //commiting add road values to the store
    store.commit('setOldLength',Number(returnAddNewRoad[0].toFixed(3)))
    store.commit('setDeltaDis',[Number(returnAddNewRoad[0].toFixed(5)), 'Add'])
    store.commit('setRoadGeom', gLayer.graphics.items.at(-1).geometry.clone())
    store.commit('setModifyRd', false)
    store.commit('setEditInfo' ,[null, null, store.getters.getUserName, timestamp[1]])
  
    setDataToStore(sketch.layer.graphics.items.at(-1).attributes.roadbedSurface,
                   sketch.layer.graphics.items.at(-1).attributes.roadbedDesign,
                   sketch.layer.graphics.items.at(-1).attributes.roadbedName,
                   sketch.layer.graphics.items.at(-1).attributes.numLane,
                   sketch.layer.graphics.items.at(-1).attributes.objectid,
                   '')
    return;
}

export async function modifyRoadbed(clickType, editType){
    let promise = new Promise(function(res, rej){
      view.on(clickType,(event) => {
        if(store.getters.getEditExisting === false && store.getters.getDeleteRd === false){
          store.commit('setEditExisting', null)
          store.commit('setDeleteRd', null)
          rej('cancel')
          return;
        }
        let opts = { include: featLayer }
        view.hitTest(event, opts)
        .then(function(response){
          for(let i=0; i < response.results.length; i++){
            if(store.getters.getEditExisting === true || store.getters.getDeleteRd === true){
              store.commit('setActiveLoader',true)
            }
            if(response.results[i].graphic.geometry !== null && response.results[i].graphic.sourceLayer !== null){
              let test = queryFeat(response)
              test
                .then(result=>res(result))
            }
          }
        })
      })
    })
    let feature = await promise
    store.commit('setRoadGeom', feature.features[0].geometry.clone())
    await queryFeatureTables(feature, true)
    defineGraphic(feature,clickType, editType)
    return feature
}

//hides feature roadbeds when converted to graphic
export async function hideEditedRoads(graphicL, update){
    let objectidList = [];
  
    if(update === true){
      if(objectidList.length){
        objectidList.length = 0
      }
  
      gLayer.graphics.items.forEach((x) => {
        x.attributes.objectid === store.getters.getObjectid ? null : objectidList.push(x.attributes.objectid)
      })
      objectidList.length === 0 ? featLayer.definitionExpression = `CNTY_TYPE_NM = '${store.getters.getCntyName}'` : featLayer.definitionExpression = `OBJECTID not in (${objectidList}) and CNTY_TYPE_NM = '${store.getters.getCntyName}'`
      return;
    }
    
    let items = !graphicL.graphics ? graphicL.features : graphicL.graphics.items 
    
    for(let id in items){
      if(items[id].attributes !== null){
        let objectid = items[id].attributes.objectid || items[id].attributes.OBJECTID
        objectidList.push(objectid)
      }
    }
    featLayer.definitionExpression = `OBJECTID not in (${objectidList}) and CNTY_TYPE_NM = '${store.getters.getCntyName}'`
}

//updateLength() gets new length of selected graphic and sends new length to store
export function updateLength(){
  try{
    setUpGraphic();
    sketch.on('update', (event)=>{
      if(event.state === 'active'){
        if(event.toolEventInfo.type === 'reshape-stop'){
          geomCheck(event.graphics[0].geometry)
          //controls undo/redo edtis
          sketch['_operationHandle'].history.redo.length ?  store.commit('setIsRedoDisable', false) : store.commit('setIsRedoDisable', true)
          sketch['_operationHandle'].history.undo.length ?  store.commit('setIsUndoDisable', false) : store.commit('setIsUndoDisable', true)
        }
        else if(event.toolEventInfo.type === 'vertex-remove'){
          geomCheck(event.graphics[0].geometry)
        }
      }
  
      if(event.state === 'complete'){
        let newLengths = Number(geometryEngine.geodesicLength(event.graphics[0].geometry, "miles").toFixed(3))//.toFixed(5)
        if(event.graphics[0].attributes.editType === 'ADD' && store.getters.getOldLength === 0){
         //store.commit('setDeltaDis',[newLengths, 'Add'])
        }
        else{
          //setting undo/redo edits to disabled
          if(sketch['_operationHandle'] === null){
            store.commit('setIsRedoDisable', true)
            store.commit('setIsUndoDisable', true) 

          }
          store.commit('setDeltaDis',[newLengths, 'Modify'])
          store.commit('setRoadGeom', event.graphics[0].geometry.clone())
          reapplyM(event.graphics[0])
          updateGraphicsLayer(event.graphics[0].attributes.objectid, newLengths)
        }
      } 
    })
    return;
  }
  catch(Error){
    console.log('updateLength error', Error)
  }
}

//Stop Editing by calling the sketch cancel() method.
export function stopEditing(){
  sketch.cancel()
}

//stop editing sketch Point 
export function stopEditingPoint(){
  sketchPoint.cancel()
}
//show verticies along line
export function showVerticies(x){
  sketch.update([x], {tool:'reshape'})
}
//Delete a road from inside the stepper and symbology
export function delRoad(){
  let graphicDel = gLayer.graphics.items.filter((x)=>{
    return x.attributes.objectid === store.getters.getObjectid
  })
  //changing edit type to delete
  graphicDel[0].attributes.editType = 'DELETE'
  let length = Number(geometryEngine.geodesicLength(graphicDel[0].geometry, "miles").toFixed(5))
  //sending length to recalculate mileage change in footer
  store.commit('setDeltaDis',[length, 'Delete'])
  //changing add/edit to delete symbol
  let symbol = graphicDel[0].symbol.clone()
  symbol.color = criConstants.editType['delete'][0]
  graphicDel[0].symbol = symbol
}
//removes highlight around road
export function removeHighlight(){
  let delHighlight = view.allLayerViews.items.filter(x => x.layer.type === 'feature' && x._highlightIds)
  delHighlight[0]._highlightIds.delete(store.getters.getObjectid)
}

export function removeGraphic(){
  stopEditing();
  let graphicR = gLayer.graphics.items.filter(x=> x.attributes.objectid === store.getters.getObjectid)
  initGraphicCheck(graphicR[0], true)
  gLayer.remove(graphicR[0])
  removeHighlight();
  hideEditedRoads(null,true)
  //sending length to recalculate mileage change in footer
  let length = Number(geometryEngine.geodesicLength(graphicR[0].geometry, "miles").toFixed(5))
  if(graphicR[0].attributes.editType === 'ADD'){
    store.commit('setDeltaDis',[length, 'Delete'])
  }
  else if(graphicR[0].attributes.editType === 'DELETE'){
    store.commit('setDeltaDis',[graphicR[0].attributes.originalLength, 'Add'])
  }
  else if(graphicR[0].attributes.editType === 'EDIT'){
    let diffAdded = Math.abs(graphicR[0].attributes.originalLength - length)
    store.commit('setDeltaDis',[diffAdded, 'Edit'])
  }
}

// local editing functions (not exported)
// mouseHoverDfoDisplay
// geomCheck
// sketchCompete
// showVerticies
// reapplyM
// setUpGraphic
// updateGraphicsLayer

// import from helper.js
// function setDataToStore
// queryFeat
// queryFeatureTables
// defineGraphic
// 


