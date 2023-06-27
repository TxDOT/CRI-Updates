import { sketch, sketchPoint, view, gLayer, clientSideGeoJson } from './map' //featLayer
import { criConstants } from '../../common/cri_constants';
import {initGraphicCheck, queryEditsLayer} from './crud'
import {store} from '../../store'
import { setDataToStore, queryFeat, queryFeatureTables, defineGraphic , geomToMiles} from './helper';
import { getNewDfoDist, epochToHumanTime } from './roadInfo' 
import * as geometryEngine from "@arcgis/core/geometry/geometryEngine";
import Graphic from "@arcgis/core/Graphic";
import * as webMercatorUtils from "@arcgis/core/geometry/support/webMercatorUtils"
import * as geodesicUtils from "@arcgis/core/geometry/support/geodesicUtils";

export async function addRoadbed(){
  try{
    let addNewRoad = new Promise(function(res,rej){
        sketch.create("polyline",{mode:"click", hasZ: false})
        sketch.on('create', (event) => {
          let lengthMiles;
          if(event.state === "start"){
            mouseHoverDfoDisplay('addRoad');
          }
          else if(event.state === "active"){
            let seglengthMiles = geometryEngine.geodesicLength(event.graphic.geometry, "miles")
            store.commit('setDfoReturn', seglengthMiles)
            geomCheck(event.graphic.geometry, true)
          }
    
          if(event.state === "complete"){
            store.commit('setIsDfoReturn', false)
            store.commit('setDfoReturn', 0)
            store.commit('setIsInitAdd', true)
            //creating the length of road in miles for user
            
            lengthMiles = geometryEngine.geodesicLength(event.graphic.geometry, "miles")
            res([lengthMiles, event.graphic.geometry, 'add']);
            rej('cancel')
            sketchCompete();
          }

        });
    })

    let returnAddNewRoad = await addNewRoad
    createInfoSendToStore(returnAddNewRoad)
  }
  catch(Error){
    console.log(Error)
  }
    //retreiving latest edit in the sketch array
    
    return;
}

function createInfoSendToStore(newRoad){
  sketch.layer.graphics.items.at(-1).geometry.hasM = true
    const date = new Date();
    //applying values to sketch attributes and assets
    sketch.layer.graphics.items.at(-1).attributes = {
      editType: criConstants.editType[`${newRoad[2]}`][1],
      gid: 9999,
      objectid: Number(date.getTime().toFixed(7)),
      roadbedName: JSON.stringify(null),
      roadbedDesign: JSON.stringify([{
        SRFC_TYPE_ID: "Two-way",
        ASSET_LN_BEGIN_DFO_MS: 0,
        ASSET_LN_END_DFO_MS: Number(newRoad[0].toFixed(3))
      }]),
      roadbedSurface: JSON.stringify([{
        SRFC_TYPE_ID: "Paved",
        ASSET_LN_BEGIN_DFO_MS: 0,
        ASSET_LN_END_DFO_MS: Number(newRoad[0].toFixed(3))
      }]),
      numLane: JSON.stringify([{
        SRFC_TYPE_ID: "2",
        ASSET_LN_BEGIN_DFO_MS: 0,
        ASSET_LN_END_DFO_MS: Number(newRoad[0].toFixed(3))
      }]),
      originalLength: Number(newRoad[0].toFixed(3)),
      createDt: date,
      createNm: store.getters.getUserName,
      isCreatedAssets: false,
    }
    //setting add graphic symbol
    sketch.layer.graphics.items.at(-1).symbol = {
      type: "simple-line",
      color: criConstants.editType[`${newRoad[2]}`][0],
      width: 2,
      style: "dash"
    }
    showVerticies(sketch.layer.graphics.items.at(-1))
    let timestamp = epochToHumanTime(date)
    //Apply M Measures function
    reapplyM(gLayer.graphics.items.at(-1))
    //commiting add road values to the store
    store.commit('setOldLength',Number(newRoad[0].toFixed(3)))
    store.commit('setRoadGeom', gLayer.graphics.items.at(-1).geometry.clone())
    store.commit('setModifyRd', false)
    store.commit('setEditInfo' ,[null, null, store.getters.getUserName, timestamp[1]])
  
    setDataToStore(sketch.layer.graphics.items.at(-1).attributes.roadbedSurface,
                   sketch.layer.graphics.items.at(-1).attributes.roadbedDesign,
                   sketch.layer.graphics.items.at(-1).attributes.roadbedName,
                   sketch.layer.graphics.items.at(-1).attributes.numLane,
                   sketch.layer.graphics.items.at(-1).attributes.objectid,
                   '')
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
        let opts = { include: clientSideGeoJson }
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
        if(x.attributes.gid !== 9999){
          x.attributes.objectid === store.getters.getObjectid ? null : objectidList.push(x.attributes.gid)
        }
      })
      objectidList.length === 0 ? clientSideGeoJson.definitionExpression = `CNTY_TYPE_NM = '${store.getters.getCntyName}'` : clientSideGeoJson.definitionExpression = `RDBD_GMTRY_LN_ID not in (${objectidList}) and CNTY_TYPE_NM = '${store.getters.getCntyName}'`
      return;
    }
    
    let items = !graphicL.graphics ? graphicL.features : graphicL.graphics.items 
    
    for(let id in items){
      if(items[id].attributes !== null){
        let gids = items[id].attributes.gid || items[id].attributes.RDBD_GMTRY_LN_ID
        if(items[id].attributes.editType !== 'ADD'){
          objectidList.push(gids)
        }
      }
    }
    clientSideGeoJson.definitionExpression = `RDBD_GMTRY_LN_ID not in (${objectidList}) and CNTY_TYPE_NM = '${store.getters.getCntyName}'`
    
  }


//updateLength() gets new length of selected graphic and sends new length to store
export function updateLength(){
  try{
    let oldLen; 
    setUpGraphic();
    sketch.on('update', (event)=>{
      if(event.state === 'start'){
        oldLen = Number(geometryEngine.geodesicLength(event.graphics[0].geometry, "miles").toFixed(3))
      }

      if(event.state === 'active'){ 
        if(event.toolEventInfo.type === 'reshape-stop'){
          geomCheck(event.graphics[0].geometry, false)
          //controls undo/redo edtis
          sketch['_operationHandle'].history.redo.length ?  store.commit('setIsRedoDisable', false) : store.commit('setIsRedoDisable', true)
          sketch['_operationHandle'].history.undo.length ?  store.commit('setIsUndoDisable', false) : store.commit('setIsUndoDisable', true)
        }
        else if(event.toolEventInfo.type === 'vertex-remove'){
          geomCheck(event.graphics[0].geometry, false)
        }
      }

  
      if(event.state === 'complete'){
        geomCheck(event.graphics[0].geometry, false)
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
          console.log(newLengths, oldLen)
          let modifyChange = newLengths - oldLen
          store.commit('setDeltaDis',[modifyChange, 'Modify'])
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
    // if(store.getters.getIsInitAdd === true){
    //   store.commit('setIsInitAdd', false)
    //   return;
    // }
    store.commit('setDeltaDis',[length, 'Delete'])
  }
  else if(graphicR[0].attributes.editType === 'DELETE'){
    store.commit('setDeltaDis',[graphicR[0].attributes.originalLength, 'Add'])
  }
  else if(graphicR[0].attributes.editType === 'EDIT'){
    console.log(graphicR[0].attributes.originalLength, length)
    let diffAdded = length - graphicR[0].attributes.originalLength
    console.log(diffAdded)
    store.commit('setDeltaDis',[diffAdded, 'Edit'])
  }
}
// //Stop Editing by calling the sketch cancel() method.
// export function stopEditing(){
//   sketch.cancel()
// }

// export function removeHighlight(){
//   let delHighlight = view.allLayerViews.items.filter(x => x.layer.type === 'feature' && x._highlightIds)
//   delHighlight[0]._highlightIds.delete(store.getters.getObjectid)
// }

export function mouseHoverDfoDisplay(type){
  let pickRoute = {
    dfo: (event) =>{
      try{
        let opts = {include:[gLayer]}
        view.hitTest(event,opts).then((response)=>{
          if(response.results.length){
            let mousePixXY = webMercatorUtils.webMercatorToGeographic(view.toMap({x: event.x, y: event.y}))
            webMercatorUtils.webMercatorToGeographic(view.toMap({x: event.x, y: event.y}))
            let mouseWebNerXY = webMercatorUtils.geographicToWebMercator({x:mousePixXY.x, y:mousePixXY.y})
            if(store.getters.getObjectid === response.results[0].graphic.attributes['objectid']){
              store.commit('setIsDfoReturn', true)
              let returnDFO = getNewDfoDist(store.getters.getObjectid, mouseWebNerXY.x, mouseWebNerXY.y, true)
              let dfoHover = document.getElementById('dfoBox')
              if(dfoHover){
                dfoHover.style.left = `${event.x}px`
                dfoHover.style.top = `${event.y}px`
                store.commit('setDfoReturn', returnDFO)
              }
              else{
                store.commit('setIsDfoReturn', false)
                store.commit('setDfoReturn', 0)
                return;
              }
            }
          }
          else{
           return;
          }
        })
      }
      catch{
       return;
      }
    },
    addRoad: (event)=>{

      try{
        let dfoHover = document.getElementById('dfoBox')
        dfoHover.style.left = `${event.x}px`
        dfoHover.style.top = `${event.y}px`
      }
      catch{
        return 0;
      }
    }
  }

  view.on('pointer-move', pickRoute[`${type}`])
}

//editing geometry check
export function geomCheck(polyline, isEditing){
  //check for less than a specific length
  let isLength = geometryEngine.geodesicLength(polyline, 'miles')
  if(isLength < 0.007){
    if(isEditing === false){
      store.commit('setGeomCheck', 1) //road is less than .007 length
    }
    return;
  }
  //check for self interesecting lines
  let splitGeom = [];
  for(let i=0; i < polyline.paths[0].length; i++){
    try{
      if(polyline.paths[0].at(-1) === polyline.paths[0][i]){
        //
      }
      else{
        splitGeom.push( //push created lines to splitGeom array
          new Graphic({
            geometry:{
              type: "polyline",
              paths:[polyline.paths[0][i], polyline.paths[0][i+1]]
            }
          })
        )
      }
      
    }
    catch{
      //The last index will not have a preceding vertex and throw an error
    }
  }
  let step = 0;
  while(step < splitGeom.length){
    try{
      for(let s=0; s < splitGeom.length; s++){
        let isSelfInter = geometryEngine.crosses(splitGeom[step].geometry, splitGeom[s].geometry)
        if(isSelfInter){
          store.commit('setGeomCheck', 2) //road has self intersection
          return;
        }
      } 
      step++
    }
    catch{
      //
    }
  }
  store.commit('setGeomCheck', 0)
  splitGeom.length = 0
}

export function sketchCompete(){
  sketch.complete()
}

export async function cancelEditStepper(){
  let returnData = await queryEditsLayer()
  let filterEdits = returnData.features.filter(x => x.attributes.OBJECTID === store.getters.getObjectid)
  if(filterEdits.length){
    let returnRoad = filterEdits[0].attributes.EDIT_TYPE_ID === 1 ? filterEdits[0] : await queryFeat(filterEdits[0])
    //let convGeom;
    // if(filterEdits[0].attributes.EDIT_TYPE_ID != 1){
    //   convGeom = webMercatorUtils.geographicToWebMercator(returnRoad.features[0].geometry)
    // }
    let oldLength = filterEdits[0].attributes.EDIT_TYPE_ID === 1 ? geomToMiles(returnRoad.geometry,true,3) : geomToMiles(returnRoad.features[0].geometry,true,3)
    let getGraphicsLayer = gLayer.graphics.items.filter(x=> x.attributes.objectid === store.getters.getObjectid)
    let graphicLength = geomToMiles(getGraphicsLayer[0].geometry, true, 3) 
    let editsLength = geomToMiles(filterEdits[0].geometry, true, 3)
    let diff = editsLength - graphicLength
    store.commit('setIsStepCancel', true)
    let mileageAction = graphicLength < editsLength ? 'Add' : 'Delete'
    if(filterEdits[0].attributes.EDIT_TYPE_ID === 1) {
      store.commit('setDeltaDis',[Math.abs(diff), mileageAction])
      filterEdits[0].attributes.EDIT_TYPE_ID = 'add'
    }
    else if(filterEdits[0].attributes.EDIT_TYPE_ID === 5){
      filterEdits[0].attributes.oldLength = oldLength
      store.commit('setDeltaDis',[Math.abs(diff), mileageAction])
      filterEdits[0].attributes.EDIT_TYPE_ID = 'edit'
    }
    gLayer.remove(getGraphicsLayer[0])
    defineGraphic(filterEdits[0], 'click', null)
    store.commit('setIsStepCancel', false)
    return;    
  }
  return null
}
// LOCAL EDITING FUNCTIONS (NOT EXPORTED)

//setting M-Vaules on geometry changes
function reapplyM(arr){
  let gl = gLayer.graphics.items.filter(x => x.objectid = arr.attributes.objectid).at(-1)
  let getFirstAsset = JSON.parse(gl.attributes.roadbedSurface)
  let applyM = [];
  try{
    let segMil = getFirstAsset.at(0).ASSET_LN_BEGIN_DFO_MS;
    arr.geometry.paths[0][0][2] ? applyM.push(arr.geometry.paths[0][0][2]) : applyM.push(segMil);
    for(let i=0; i < arr.geometry.paths[0].length; i++){
      
      let pointA = new Graphic({
        geometry:{
          type: "point",
          longitude: arr.geometry.paths[0][i][0],
          latitude: arr.geometry.paths[0][i][1]
        }
      })
        
      let pointB = new Graphic({
        geometry:{
          type: "point",
          longitude: arr.geometry.paths[0][i+1][0],
          latitude: arr.geometry.paths[0][i+1][1]
        }
      })
      let miles = geodesicUtils.geodesicDistance(webMercatorUtils.webMercatorToGeographic(pointB.geometry), webMercatorUtils.webMercatorToGeographic(pointA.geometry), "miles")
      segMil += miles.distance
      applyM.push(segMil)
    }
  }
  catch{
    //console.log('end of the line')
  }
  if(gl){
    for(let j=0; j < applyM.length; j++){
      gl.geometry.setPoint(0,j,[arr.geometry.paths[0][j][0],arr.geometry.paths[0][j][1],applyM[j]])
    }
  }
  store.commit('setRoadGeom',gl.geometry.clone())
  return;
}

//setUpGraphic() gets old length of selected graphic and send old length to store
function setUpGraphic(){
  view.on('click',(event)=>{
    // if(sketch.state === 'active'){
    //   return;
    // }
    let opts = [gLayer]
    store.commit('setIsDfoReturn', false)
    view.hitTest(event,opts).then((response)=>{
      //prevents users from selecting a new road if stepper is open and past step 1. or if edit dialog boxes are open
      if((response.results.length && store.getters.getStepperClose === true && store.getters.getStepNumber > 1) || (response.results.length && (store.getters.getEditExisting === true || store.getters.getDeleteRd === true))){
        return;
      }
      response.results.forEach((result)=>{
        if(result.graphic.attributes.objectid !== store.getters.getObjectid){
          return;
        }
        //Can only proceed forward if edit type is add or edit. And road info stepper and edit stepper is not open
        if((result.graphic.attributes.editType === 'ADD' || result.graphic.attributes.editType === 'EDIT') && (store.getters.getInfoRd === false && store.getters.getIsStepCancel === false)){
          if(result.graphic.layer === sketch.layer && result.graphic.attributes){
            let oldLength = Number(geometryEngine.geodesicLength(result.graphic.geometry, "miles").toFixed(3))
            store.commit('setRoadGeom', result.graphic.geometry)
            store.commit('setOldLength',oldLength)
            sketch.update([result.graphic], {tool:"reshape"});
          }
        }
        else if(result.graphic.attributes.editType === 'DELETE'){
          return;
        }
      });
    });
  });
}

function updateGraphicsLayer(oid, length){
  length;
  for(let i=0; i < gLayer.graphics.items.length; i++){
    let assetArr = ['roadbedDesign', 'roadbedSurface', 'numLane']
    if(gLayer.graphics.items[i].attributes.objectid === oid){
      for(let x=0; x < assetArr.length; x++){
        let asset = JSON.parse(gLayer.graphics.items[i].attributes[assetArr[x]])
        let endDFO = gLayer.graphics.items[i].geometry.paths.at(-1)[0][0][2]
        if(!asset) return;
        if(!endDFO) return;
        asset.at(-1).ASSET_LN_END_DFO_MS = Number(endDFO.toFixed(3))
        gLayer.graphics.items[i].attributes[assetArr[x]] = JSON.stringify(asset)
        
        let commitToStore = {
          roadbedDesign: ()=>{
            return store.commit('setRoadbedDesign', JSON.stringify(asset))
          },
          roadbedSurface: ()=>{
            return store.commit('setRoadbedSurface', JSON.stringify(asset))
          },
          numLane: ()=>{
            return store.commit('setNumLane',JSON.stringify(asset))
          }
        }
        commitToStore[assetArr[x]]()
      }
    }
  }
}

//hides feature roadbeds when converted to graphic
// function hideEditedRoads(graphicL, update){
//   let objectidList = [];

//   if(update === true){
//     if(objectidList.length){
//       objectidList.length = 0
//     }

//     gLayer.graphics.items.forEach((x) => {
//       x.attributes.objectid === store.getters.getObjectid ? null : objectidList.push(x.attributes.objectid)
//     })
//     objectidList.length === 0 ? featLayer.definitionExpression = `CNTY_TYPE_NM = '${store.getters.getCntyName}'` : featLayer.definitionExpression = `OBJECTID not in (${objectidList}) and CNTY_TYPE_NM = '${store.getters.getCntyName}'`
//     return;
//   }
  
//   let items = !graphicL.graphics ? graphicL.features : graphicL.graphics.items 
  
//   for(let id in items){
//     if(items[id].attributes !== null){
//       let objectid = items[id].attributes.objectid || items[id].attributes.OBJECTID
//       objectidList.push(objectid)
//     }
//   }
//   featLayer.definitionExpression = `OBJECTID not in (${objectidList}) and CNTY_TYPE_NM = '${store.getters.getCntyName}'`
// }

export function saveToEditsLayer(){
  let editGraphic = gLayer.graphics.items.find(x => x.attributes.objectid === store.getters.getObjectid)
  initGraphicCheck(editGraphic, false)
}





