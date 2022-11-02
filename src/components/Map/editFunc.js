// import methods and functions into file
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
import router from '../../router';


//querys the Refernce Layer table returns geometry/attributes
async function queryFeat(qry){
  let queryFeat = await featLayer.queryFeatures({
    objectIds: qry.results ? [qry.results[0].graphic.attributes.OBJECTID] : [qry.attributes.OBJECTID],
    outFields: ["*"],
    returnGeometry: true,
    returnM: true,
  })
  return queryFeat
}

//Querying asset (nonGeom) tables and pushing values to store
async function queryFeatureTables(tblqry){
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

  setDataToStore(JSON.stringify(rdbdSrfArry), JSON.stringify(rdbdDsgnArry), JSON.stringify([roadNameObj]), JSON.stringify(rdbdNumLnArry), tblqry.features[0].attributes.OBJECTID)
  return;
}
//Sets Road Data in the data store. 
function setDataToStore(surface, design, name, lane, objectid, comment, editInfo){
  store.commit('setRoadbedSurface', surface) //push surface type values to getSurface setter
  store.commit('setRoadbedDesign', design) 
  store.commit('setRoadbedName', name)
  store.commit('setNumLane', lane)
  store.commit('setObjectid', objectid)
  store.commit('setComment', comment)
  store.commit('setEditInfo', editInfo)
}

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
        geomQuery.where = `CNTY_NM = '${store.getters.getCntyName}'`;
        geomQuery.outFields = [ "*" ];
        geomQuery.returnGeometry = true;
        let returnGeom = txCounties.queryFeatures(geomQuery);
        //Dynamically adding County NBR to search definition expression via data store
        let countyExtent = returnGeom;
        countyExtent.then(function(result) {
          viewPoint.targetGeometry = result.features[0].geometry.extent;
          viewPoint.scale = 500000
          //need to set a buffer on mapview zoom level
          home.viewpoint = viewPoint;
        });

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

// Adding a new Roadbed to map
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
//Modifying Existing Road and gathering existing road attributes based on clickType variable
//clickType = immediate-click; returns attributes
//clickType = double-click; creates graphic for editing
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
//highlightes reference layer geometry when mouse moves over
export function hightlightFeat(eventType){
  let highlight;
  if(highlight){
    highlight.remove()
    highlight = null
  }
  view.when()
    .then(()=>{
      view.on(eventType, (event)=>{
        const opts = {
          include: [gLayer, featLayer]
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
//creating roadbed graphic and setting attributes to graphics layer (gLayer)
//called in modifyRoadbed function
export async function defineGraphic(graphics, clickType, editType){
  let exist = graphics.features ? gLayer.graphics.items.filter(x => x.attributes.objectid === graphics.features[0].attributes.OBJECTID) : gLayer.graphics.items.filter(x => x.attributes.objectid === graphics.attributes.OBJECTID)
  if(exist.length){
    return;
  }

  if (clickType === "click"){
    let oldLength = graphics.features ? Number(geometryEngine.geodesicLength(graphics.features[0].geometry, "miles").toFixed(3)) :  graphics.attributes.oldLength
    document.body.style.cursor = 'context-menu'
    let graphicPromise = new Promise(function(res){
      const date = new Date();
      console.log(date)
      let newGraphic = new Graphic({
        geometry: {
          type: "polyline",
          paths: graphics.features ? graphics.features[0].geometry.paths[0] : graphics.geometry.paths[0],
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
          createDt: graphics.features ? date : graphics.attributes.RTE_DEFN_LN_CREATE_DT ,
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
      newGraphic.attributes.editType === 'DELETE' ? store.commit('setDeltaDis',[oldLength, 'Delete']) : null
      res(gLayer)
    })

    let returnGraphicPromise = await graphicPromise
    hideEditedRoads(returnGraphicPromise)
  }
}

//hides feature roadbeds when converted to graphic
async function hideEditedRoads(graphicL, update){
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

//setUpGraphic() gets old length of selected graphic and send old length to store
function setUpGraphic(){
  view.on('click',(event)=>{
    if(sketch.state === 'active'){
      return;
    }
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
//Delete a sketch i.e the graphic
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
//set data for popup display
export async function popUpData(res){
  search.clear()
  let info = queryFeat(res)
  store.commit('setActiveLoader',true)
  info.then(async (x)=>{
    await queryFeatureTables(x, true)
    hightlightFeat('click')
    store.commit('setStepperClose', true)
    store.commit('setActiveLoader',false)
    store.commit('setFeatureGeom', x)
    store.commit('setRoadGeom', x.features[0].geometry.clone())
    store.commit('setInfoRd', true)
  })
  return;
}

//convert epoch time to Human readable. Date from AGOL is in Epoch.
function epochToHumanTime(editTime, createTime){
  let createTimestamp;
  let editTimestamp;
  if(createTime){
    const createHour = new Date(createTime).getHours();
    const createMins = new Date(createTime).getMinutes();
    createTimestamp = `${new Date(createTime).toLocaleDateString()} ${createHour}:${String(createMins).padStart(2, '0')}`
  }

  if(editTime){
    console.log(editTime)
    const editHour = new Date(editTime).getHours();
    const editMins = new Date(editTime).getMinutes();
    editTimestamp = `${new Date(editTime).toLocaleDateString()} ${editHour}:${String(editMins).padStart(2, '0')}`
  }
  return [createTimestamp, editTimestamp]
}

//populates stepper form when graphic is clicked.
export async function getGraphic(){
  let getGraphPromise = new Promise(function(resp){
    view.on("click", function(event){
      let option = {include: [featLayer,gLayer]}
      if (sketch.state === "active") {
        return;
      }
      view.when(function(){
        //get response from graphics and set getters in store.js
        view.hitTest(event,option)
          .then(async function(response){
            //dont populate stepper if user is in edit or delete workflow
            if(response.results.length && (store.getters.getEditExisting === true || store.getters.getDeleteRd === true) ){
              return;
            }
            if(response.results.length && store.getters.getdeleteGraphClick === true){
              return;
            }
            else if((response.results.length && store.getters.getStepperClose === true && store.getters.getStepNumber >= 1 && store.getters.getInfoRd === false && store.getters.getObjectid !== response.results[0].graphic.attributes['objectid'])){
              store.commit('setdenyFeatClick', true)
              return;
            }
            //update road information stepper
            else if(response.results.length){
              if(!response.results[0].graphic.attributes['editType']){
                popUpData(response)
                return;
              }

              let timestamp = epochToHumanTime(response.results[0].graphic.attributes['editDt'], response.results[0].graphic.attributes['createDt'])
              if(response.results[0].graphic.attributes['editType'] === 'ADD' || response.results[0].graphic.attributes['editType'] === 'EDIT'){
                response.results[0].graphic.attributes['editType'] === 'ADD' ? store.commit('setModifyRd', false) : store.commit('setModifyRd', true)
                //sketch.update([response.results[0].graphic], {tool:"reshape"});
                store.commit('setStepperClose', true)
                store.commit('setInfoRd', false)

                setDataToStore(response.results[0].graphic.attributes['roadbedSurface'],
                              response.results[0].graphic.attributes['roadbedDesign'],
                              response.results[0].graphic.attributes['roadbedName'],
                              response.results[0].graphic.attributes['numLane'],
                              response.results[0].graphic.attributes['objectid'],
                              response.results[0].graphic.attributes['comment'],
                              [response.results[0].graphic.attributes['editNm'], timestamp[1], response.results[0].graphic.attributes['createNm'], timestamp[0]]
                              )
                resp(response.results[0].graphic)
              }
              else if(response.results[0].graphic.attributes['editType'] === 'DELETE'){
                setDataToStore(response.results[0].graphic.attributes['roadbedSurface'],
                              response.results[0].graphic.attributes['roadbedDesign'],
                              response.results[0].graphic.attributes['roadbedName'],
                              response.results[0].graphic.attributes['numLane'],
                              response.results[0].graphic.attributes['objectid'],
                              response.results[0].graphic.attributes['comment'],
                              [response.results[0].graphic.attributes['editNm'], timestamp[1], response.results[0].graphic.attributes['createNm'], timestamp[0]])
                store.commit('setdeleteGraphClick', true)
              }
            }
          })
        })
    });
  });
  let returnGetGraph = await getGraphPromise;
  return returnGetGraph
}
//setting M-Vaules on geometry changes
function reapplyM(arr){
  let gl = gLayer.graphics.items.filter(x => x.objectid = arr.attributes.objectid).at(-1)
  let applyM = [];
  
  try{
    let segMil = arr.geometry.paths[0][0][2] ? arr.geometry.paths[0][0][2] : 0;
    arr.geometry.paths[0][0][2] ? applyM.push(arr.geometry.paths[0][0][2]) : applyM.push(0);
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
//Drawing the new Asset Graphics on the route
function createAssetGraph(pathArr,y){
  let assetGeom = rdbdAssetLine.graphics.items
  for(let a=0; a<assetGeom.length; a++){
    if(assetGeom[a].attributes.objectid === y[0].OBJECTID){
      rdbdAssetLine.graphics.remove(assetGeom[a])
    }
  }
 
  let densUpdate = pathArr.paths[0]
  
  let mArr = [];
  if(mArr.length){
    mArr.length = 0
  }


  for(let i = 0; i < densUpdate.length; i++){
    mArr.push(Number(parseFloat(densUpdate[i][2]).toFixed(3))) //mval
  }

  for(let d=0; d < y.length; d++){
    delete y[d].ASSET_LN_END_DFO_MS
    delete y[d].ASSET_LN_BEGIN_DFO_MS

    let getstart = (element) => element >= y[d].ASSET_LN_BEGIN;
    let endstart = (element) => element >= y[d].ASSET_LN_END;

    //extract closest index for begin/end dfo values

    let geom = mArr.findIndex(endstart) === -1 ? densUpdate.slice(mArr.findIndex(getstart),) : densUpdate.slice(mArr.findIndex(getstart),mArr.findIndex(endstart)+1)
    //let geom = densUpdate.slice(mArr.findIndex(endstart)-1,mArr.findIndex(endstart)+1)
    //convert to points to graphic and plot on route
    let assetLineType = y[d].SRFC_TYPE


    const assetLineSym = {
      type: "simple-line",
      color: criConstants.colorTable[`${assetLineType}`],
      width: 5,
      style: "solid"
    }

    let pavement = new Graphic({
      geometry: {
        type: "polyline",
        paths: geom,
        hasM: true,
        spatialReference: {
          wkid: 3857
        }
      },
  
      attributes: {
        objectid: y[d].OBJECTID,
      },
                
      symbol: assetLineSym
    })
    rdbdAssetLine.graphics.add(pavement);
  }
  return;
}
//adding new Asset vertex to pre-existing geometry line. An Anchor vertex  
export function addAssetBreakPts(y, type)
{
  let a = rdbdAssetPt.graphics.items.filter(al => al.attributes.objectid === y[0].OBJECTID)

  let updatedGeom;
  if(type !== 'click'){
    for(let x=0; x<a.length; x++){
      if(!a[x].attributes.edit){
        let returnDFO = getNewDfoDist(a[x].attributes.objectid, a[x].geometry.x, a[x].geometry.y, false)
        updatedGeom = returnDFO[1]
      }
      else{
        console.log('fail',a[x])
      }
    }
  }
  createAssetGraph(updatedGeom,y)
  return;
}
//gets asset break points and plots on the route
export function getCoordsRange(y){
  try{
    if(rdbdAssetPt.length){
      rdbdAssetPt.length = 0
      rdbdAssetLine.length = 0
    }
    let dens = store.getters.getRoadGeom;
      //get geometry x,y,m
    let densUpdate = dens.paths[0];
    
    let mArr = [];
    if(mArr.length){
      mArr.length = 0
    }
    //populates mArr with m-values
    for(let i = 0; i < densUpdate.length; i++){
      mArr.push(densUpdate[i][2]) //mval
    }
    //gets the closest M-values to the assetBegin/assetEnd DFO. Provided by the stepper
      
    for(let d in y){
      (element) => element >= y[d].ASSET_LN_BEGIN;
      let endstart = (element) => element >= y[d].ASSET_LN_END;
      //extract closest index for begin/end dfo values
      let geom = mArr.findIndex(endstart) === -1 ? densUpdate.slice(mArr.findIndex(endstart)-1,) : densUpdate.slice(mArr.findIndex(endstart)-1,mArr.findIndex(endstart)+1)
      //convert to points to graphic and plot on route

      const radius = (Math.abs(geom[0][2] - y[d].ASSET_LN_END)) * 1609.344
      const pointA = new Graphic({
        geometry: {
          type: "point", 
          longitude: geom[0][0],
          latitude: geom[0][1]
        },
      })
      const pointB = new Graphic({
        geometry: {
          type: "point", 
          longitude: geom[1][0],
          latitude: geom[1][1]
        },
      })
      let a = webMercatorUtils.webMercatorToGeographic(pointA.geometry)
      let b = webMercatorUtils.webMercatorToGeographic(pointB.geometry)
      const findAzmith = geodesicUtils.geodesicDistance(a, b)
      const pointDFO = Number(geom[1][2].toFixed(3)) === y[d].ASSET_LN_END ? {x:b.x, y:b.y} : geodesicUtils.pointFromDistance(a, radius,findAzmith.azimuth)
      webMercatorUtils.geographicToWebMercator(pointDFO)
  
      let assetType = y[d].SRFC_TYPE
  
      const assetSym = {
        type: "simple-marker",
        color: criConstants.colorTable[`${assetType}`]
      }
      const txtSymbol = {
        type: "text",
        color: "black",
        haloColor: "white",
        haloSize: 1,
        xoffset: 3,
        yoffset:10,
        font: {
          family: "Arial",
          style: "normal",
          size: 12,
          weight: "normal"
        },
        labelPlacement:"above-center",
        text: `${y[d].ASSET_LN_END}`
      }

      let assetPoint = new Graphic({
        geometry: {
          type: "point",
          hasM: true,
          longitude: pointDFO.x,
          latitude: pointDFO.y,
          spatialReference: {
            wkid: 3857
          }
        },
        attributes: {
          objectid: y[d].OBJECTID,
          assetTyp: assetType,
          bDfo: y[d].ASSET_LN_BEGIN,
          eDfo: y[d].ASSET_LN_END
        },
        symbol: assetSym
      })

      let assetPointClone = new Graphic({
        geometry: {
          type: "point",
          hasM: true,
          longitude: pointDFO.x,
          latitude: pointDFO.y,
          spatialReference: {
            wkid: 3857
          }
        },
        attributes: {
          objectid: y[d].OBJECTID,
          assetTyp: assetType,
          bDfo: y[d].ASSET_LN_BEGIN,
          eDfo: y[d].ASSET_LN_END
        },
        symbol: txtSymbol
      })

      rdbdAssetPt.graphics.addMany([assetPointClone,assetPoint])
    }
    addAssetBreakPts(y)
  }
  catch(error){
    console.log(error)
    return error;
  }
  return;
}

//Getting new M-Value for new asset Point
function getNewDfoDist(objectid, x, y, slide){
  objectid
  let objid = store.getters.getRoadGeom;
  let newDfo;
  let mnbv;
  let isPlus; 
  let isMinus;

  //new point clicked in the map
  let pointA = new Graphic({
    geometry:{
      type: "point",
      longitude: x,
      latitude: y
    }
  })
  // get nearest x,y on line from clicked pt
  let nearestCoord = geometryEngine.nearestCoordinate(objid, pointA.geometry)

  //convert new point to Geograpic i.e lat/long
  let webMercaPointA = webMercatorUtils.webMercatorToGeographic(nearestCoord.coordinate)

  //find neartest vertex for the new point along the line and return vertex Index
  let index = geometryEngine.nearestVertex(objid, nearestCoord.coordinate).vertexIndex
  let nearVert = objid.paths[0].at(index)

  //determine the direction of the line 
  let x2 = nearVert[0]
  let y2 = nearVert[1]
  //neareast vertex point
  let pointB = new Graphic({
    geometry:{
      type: "point",
      longitude: x2,
      latitude: y2,
    }
  })
  //convert nearest point to Geograpic i.e lat/long
  let webMercaPointB = webMercatorUtils.webMercatorToGeographic(pointB.geometry)
  //find distance between clicked point and nearest point
  const pointAPointB = geodesicUtils.geodesicDistance(webMercaPointB, webMercaPointA)
  
  if(Number(pointAPointB.distance.toFixed(3)) <= 1 && index === 0){
    newDfo = objid.paths[0].at(0)[2]
    let returnVal = slide ? newDfo : [newDfo, objid]
    return  returnVal
  }

  if(Number(pointAPointB.distance.toFixed(3)) <= 1 && index === objid.paths[0].at(-1)){
    newDfo = objid.paths[0].at(-1)[2]
    let returnVal = slide ? newDfo : [newDfo, objid]
    return  returnVal
  }

  else if(Number(pointAPointB.distance.toFixed(3)) <= 1){
    newDfo = objid.paths[0].at(index)[2]
    let returnVal = slide ? newDfo : [newDfo, objid]
    return  returnVal
  }

  if(objid.paths[0].length === 2 && objid.paths[0].at(-1) === nearVert){
    newDfo = Math.abs(nearVert[2] - (pointAPointB.distance/1609.344))
    objid.insertPoint(0,1, [x, y, Number(newDfo.toFixed(3))])
    let returnVal = slide ? newDfo : [newDfo, objid]
    return  returnVal
  }

  if(objid.paths[0].length === 2 && objid.paths[0].at(0) === nearVert){
    newDfo = Math.abs(nearVert[2] - (pointAPointB.distance/1609.344))
    objid.insertPoint(0,1, [x, y, Number(newDfo.toFixed(3))])
    let returnVal = slide ? newDfo : [newDfo, objid]
    return  returnVal
  }
  else{
    let endx = objid.paths[0].at(index+1) ? objid.paths[0].at(index+1)[0] : objid.paths[0].at(-1)[0]
    let endy = objid.paths[0].at(index+1) ? objid.paths[0].at(index+1)[1] : objid.paths[0].at(-1)[1]
    let startx = objid.paths[0].at(index-1) ? objid.paths[0].at(index-1)[0] : objid.paths[0].at(0)[0]
    let starty = objid.paths[0].at(index-1) ? objid.paths[0].at(index-1)[1] : objid.paths[0].at(0)[1]

    let pointMinusPolyline = {
      type: 'polyline',
      paths:[
        [nearVert[0], nearVert[1]],
        [startx, starty]
      ],
      spatialReference: {
        wkid: 3857
      }
    } 
  
    let pointPlusPolyline = {
      type: 'polyline',
      paths:[
        [nearVert[0], nearVert[1]],
        [endx,endy]
      ],
      spatialReference: {
        wkid: 3857
      }
    }

    let polylineGraphicPlus = new Graphic({
      geometry: pointPlusPolyline,
    })

    let polylineGraphicMinus = new Graphic({
      geometry: pointMinusPolyline,
    })

    isPlus = geometryEngine.intersects(polylineGraphicPlus.geometry, nearestCoord.coordinate)
    isMinus = geometryEngine.intersects(polylineGraphicMinus.geometry, nearestCoord.coordinate)
  }
  
  if(isMinus === true && isPlus === false){
    newDfo = Math.abs(nearVert[2] - (pointAPointB.distance/1609.344))
    mnbv = index
  }
  else if (isMinus === false && isPlus === true){
    newDfo = Math.abs(nearVert[2] + (pointAPointB.distance/1609.344))
    mnbv = index+1
  }

  if(!newDfo) return;
  
  if(slide === false){
    objid.insertPoint(0,mnbv, [x, y, Number(newDfo.toFixed(3))])
    store.commit('setRoadGeom', objid)
    return [newDfo, objid];
  }
  return newDfo;
}

//Removes graphics points on click
export function removeAsstPoints(){
  rdbdAssetPt.graphics.removeAll();
  rdbdAssetLine.removeAll();
  return;
}
//TODO -- extract getCoordsRange from this function and replace in _edits.js
export function applyMToAsset(assetArray, type){
  let length = []
  for(let x=0; x < gLayer.graphics.items.length; x++){
    if(gLayer.graphics.items[x].attributes.objectid === assetArray[0].OBJECTID){
      length.push(gLayer.graphics.items[x])
    }
  }

  rdbdAssetLine.removeAll();

  if(type!=='click'){
    rdbdAssetPt.removeAll();
    rdbdAssetLine.removeAll();
    getCoordsRange(assetArray)
  }
  return assetArray
}

export function sketchCompete(){
  sketch.complete()
}

export async function getSelectedDFO(oid){
  let clickedPt = new Promise(function(res){
    sketchPoint.create("point",{mode: "click"})
    sketchPoint.on("create",function(event){
      sketchPoint.cancel();
      res(event)
    })
  })
  let returnClickedPt= await clickedPt
  if(!returnClickedPt.graphic){
    sketchPoint.cancel();
    return;
  }
  
  let newDfo = getNewDfoDist(oid, returnClickedPt.graphic.geometry.x, returnClickedPt.graphic.geometry.y, false)
  
  return [newDfo[0], returnClickedPt.graphic.geometry.x, returnClickedPt.graphic.geometry.y]
}

function assetCoverageCheck(x){
  let beginEndArr = []

  x.forEach(function(y){
    beginEndArr.push([y.ASSET_LN_BEGIN_DFO_MS, y.ASSET_LN_END_DFO_MS])
  })

  store.commit('setAssetCoverage', beginEndArr)
}

export function initLoadAssetGraphic(asset){
  try{
    let assetType = {
      surface: () =>{ return JSON.parse(graphicFilter[0].attributes.roadbedSurface)},
      design: ()=>{ return JSON.parse(graphicFilter[0].attributes.roadbedDesign)},
      numLane: ()=>{ return JSON.parse(graphicFilter[0].attributes.numLane)}
    }
    
    let objID = store.getters.getObjectid
    let graphicFilter = gLayer.graphics.items.filter(x => x.attributes.objectid === objID)
    let graphicAsset = assetType[asset]()
    store.commit('setRoadGeom', graphicFilter[0].geometry.clone())
    if(graphicAsset === null){
      removeAsstPoints();
      return;
    }

    
    assetCoverageCheck(graphicAsset)
    if(graphicAsset){
      if(graphicAsset.OBJECTID !== objID){
        graphicAsset.forEach(x => x.OBJECTID = objID)
        let newGraphic = [];
        for(let i=0; i < graphicAsset.length; i++){
          newGraphic.push({
            SRFC_TYPE: graphicAsset[i].SRFC_TYPE_ID,
            ASSET_LN_BEGIN: graphicAsset[i].ASSET_LN_BEGIN_DFO_MS,
            ASSET_LN_END: graphicAsset[i].ASSET_LN_END_DFO_MS,
            OBJECTID: graphicAsset[i].OBJECTID
          })
        }
        applyMToAsset(newGraphic) //TODO -- replace this with getCoordsRange
      }
      else{
        applyMToAsset(graphicAsset) //TODO -- replace this with getCoordsRange
      }
    }
    else{
      console.warn('initLoadAssetGraphic didnt run!')
    }
  }
  catch{
    //
  }
}

function updateGraphicsLayer(oid, length){
  for(let i=0; i < gLayer.graphics.items.length; i++){
    let assetArr = ['roadbedDesign', 'roadbedSurface', 'numLane']
    if(gLayer.graphics.items[i].attributes.objectid === oid){
      for(let x=0; x < assetArr.length; x++){

        let asset = JSON.parse(gLayer.graphics.items[i].attributes[assetArr[x]])
        if(!asset) return;
        asset.at(-1).ASSET_LN_END_DFO_MS = Number(length.toFixed(3))
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


//convert geometry to miles
export function geomToMiles(geometry, isNum, precision){
  if(isNum){
    return Number(geometryEngine.geodesicLength(geometry, "miles").toFixed(precision))
  }
  else{
    return geometryEngine.geodesicLength(geometry, "miles")
  }
}

//send graphic to CRUD js file to add/update Edits layer
export function saveToEditsLayer(){
  let editGraphic = gLayer.graphics.items.find(x => x.attributes.objectid === store.getters.getObjectid)
  initGraphicCheck(editGraphic, false)
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
//
export async function cancelEditStepper(){
  let returnData = await queryEditsLayer()
  let filterEdits = returnData.features.filter(x => x.attributes.OBJECTID === store.getters.getObjectid)
  if(filterEdits.length){
    let returnRoad = filterEdits[0].attributes.EDIT_TYPE_ID === 1 ? filterEdits[0] : await queryFeat(filterEdits[0])
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
//editing geometry check
export function geomCheck(polyline){
  //check for less than a specific length
  let isLength = geometryEngine.geodesicLength(polyline, 'miles')
  if(isLength < 0.007){
    store.commit('setGeomCheck', 1) //road is less than .007 length
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
}

//downlaod road log csv
export async function downloadRdLog(){

  const featQuery = new Query();
  featQuery.where = `CNTY_TYPE_NM = '${store.getters.getCntyName}'`
  featQuery.outFields = [ "*" ]

  let countyQuery = await featLayer.queryFeatures(featQuery)
 
  await bulkAssetReturn(countyQuery)
}

async function bulkAssetReturn(countyQuery){
  //get length
  //base 5000, splice every 5000
  let incre = 5000
  let iStart = 0 //initialStart
  let eStart = 5000 //endStart
  let srfcAsset = []
  let dsgnAsset = []
  let laneAsset = []

  let ids = []
  let useInfo = []
  countyQuery.features.forEach((x) => {
    ids.push(x.attributes.RDBD_GMTRY_LN_ID)
    useInfo.push({
      roadId: x.attributes.RDBD_GMTRY_LN_ID,
      roadN: x.attributes.ST_DEFN_NM,
      routeId: x.attributes.RTE_DEFN_LN_NM,
      len: x.attributes.LENGTH,
      cntyN: x.attributes.CNTY_TYPE_NM,
      cntyNbr: x.attributes.CNTY_TYPE_NBR
    })
  }) 

  while(iStart < ids.length){
    let arr = ids.slice(iStart, eStart)

    const assetQuery = new Query() 
    assetQuery.where = `RDBD_GMTRY_LN_ID in (${arr})`
    assetQuery.outFields = [ "*" ]

    const roadSrfc = await rdbdSrfcAsst.queryFeatures(assetQuery)
    const roadDsgn = await rdbdDsgnAsst.queryFeatures(assetQuery)
    const roadLane = await rdbdLaneAsst.queryFeatures(assetQuery)

    
    roadSrfc.features.forEach((x)=>{
      let rdSrfc = criConstants.surface.find(({num}) => num === x.attributes.SRFC_TYPE_ID)
      let srfcObj = {
        rdbdId: x.attributes.RDBD_GMTRY_LN_ID,
        srfcType: rdSrfc.name,
        begin: x.attributes.ASSET_LN_BEGIN_DFO_MS,
        end: x.attributes.ASSET_LN_END_DFO_MS
      }
      srfcAsset.push(srfcObj)
    })

    roadDsgn.features.forEach((x)=>{
      let dsgnObj = {
        rdbdId: x.attributes.RDBD_GMTRY_LN_ID,
        srfcType: x.attributes.RDWAY_DSGN_TYPE_DSCR,
        begin: x.attributes.ASSET_LN_BEGIN_DFO_MS,
        end: x.attributes.ASSET_LN_END_DFO_MS
      }
      dsgnAsset.push(dsgnObj)
    })

    roadLane.features.forEach((x)=>{
      let laneObj = {
        rdbdId: x.attributes.RDBD_GMTRY_LN_ID,
        srfcType: x.attributes.NBR_THRU_LANE_CNT,
        begin: x.attributes.ASSET_LN_BEGIN_DFO_MS,
        end: x.attributes.ASSET_LN_END_DFO_MS
      }
      laneAsset.push(laneObj)
    })

    iStart += incre
    eStart += incre
  }
  await surfaceAsset(srfcAsset, dsgnAsset, laneAsset, useInfo) 
}

async function surfaceAsset(roadSrfc, roadDsgn, roadLane, cntyQ){
  let dataHolder = []

  let surfacePromise = new Promise(()=>{
    for(let x=0; x < cntyQ.length; x++){
      let srfcAst = roadSrfc.filter(y=>y.rdbdId === cntyQ[x].roadId)
      let dsgnAst = roadDsgn.filter(y=>y.rdbdId === cntyQ[x].roadId)
      let laneAst = roadLane.filter(y=>y.rdbdId === cntyQ[x].roadId)

      srfcAst.sort((a,b)=>(a.begin > b.begin) ? 1: -1)
      dsgnAst.sort((a,b)=>(a.begin > b.begin) ? 1: -1)
      laneAst.sort((a,b)=>(a.begin > b.begin) ? 1: -1)

      srfcAst.forEach((z,i)=>{
        srfcAst.splice(i, 1, `${z.srfcType}: From ${Number(z.begin.toFixed(3))} To ${Number(z.end.toFixed(3))}`)
      })
      dsgnAst.forEach((z,i)=>{
        dsgnAst.splice(i, 1, `${z.srfcType}: From ${Number(z.begin.toFixed(3))} To ${Number(z.end.toFixed(3))}`)
      })
      laneAst.forEach((z,i)=>{
        laneAst.splice(i, 1, `${z.srfcType}: From ${Number(z.begin.toFixed(3))} To ${Number(z.end.toFixed(3))}`)
      })
      dataHolder.push({
        "Road Name" : cntyQ[x].roadN, 
        "Route ID" : cntyQ[x].routeId,
        "Length" : cntyQ[x].len,
        "Road Surface": srfcAst.join(' then '),
        "Number of Lanes": laneAst.join(' then '),
        "Road Design": dsgnAst.join(' then '),
        "County Name": cntyQ[x].cntyN, 
        "County Number": cntyQ[x].cntyNbr, 
        "District Number": store.getters.getDistrict
      })
    }
  })

  let createCsv = `${Object.keys(dataHolder[0]).toString()}\n`
  dataHolder.forEach((value)=>{
    let newRow = Object.values(value)
    createCsv += newRow.join(',')
    createCsv += "\n"
  })

  buildCSV(createCsv)
  return await surfacePromise
}

// async function surfaceAsset(roadSrfc, roadDsgn, roadLane, cntyQ){
//     console.log("Start:", new Date())
//     let totalLen = cntyQ.length
//     console.log(totalLen)
//     let dataHolder = []
//     for(let x=0; x < cntyQ.length; x++){
//       let assetPromise = new Promise((res)=>{
//         setTimeout(()=>{
//           let srfcAst = roadSrfc.filter(y=>y.rdbdId === cntyQ[x].roadId)
//           let dsgnAst = roadDsgn.filter(y=>y.rdbdId === cntyQ[x].roadId)
//           let laneAst = roadLane.filter(y=>y.rdbdId === cntyQ[x].roadId)

//           srfcAst.sort((a,b)=>(a.begin > b.begin) ? 1: -1)
//           dsgnAst.sort((a,b)=>(a.begin > b.begin) ? 1: -1)
//           laneAst.sort((a,b)=>(a.begin > b.begin) ? 1: -1)

//           srfcAst.forEach((z,i)=>{
//             srfcAst.splice(i, 1, `${z.srfcType}: From ${Number(z.begin.toFixed(3))} To ${Number(z.end.toFixed(3))}`)
//           })
//           dsgnAst.forEach((z,i)=>{
//             dsgnAst.splice(i, 1, `${z.srfcType}: From ${Number(z.begin.toFixed(3))} To ${Number(z.end.toFixed(3))}`)
//           })
//           laneAst.forEach((z,i)=>{
//             laneAst.splice(i, 1, `${z.srfcType}: From ${Number(z.begin.toFixed(3))} To ${Number(z.end.toFixed(3))}`)
//           })
//           dataHolder.push({
//             "Road Name" : cntyQ[x].roadN, 
//             "Route ID" : cntyQ[x].routeId,
//             "Length" : cntyQ[x].len,
//             "Road Surface": srfcAst.join(' then '),
//             "Number of Lanes": laneAst.join(' then '),
//             "Road Design": dsgnAst.join(' then '),
//             "County Name": cntyQ[x].cntyN, 
//             "County Number": cntyQ[x].cntyNbr, 
//             "District Number": store.getters.getDistrict
//           })
//           res(dataHolder)
//         },0)
//       })
//       let returnPromise = await assetPromise
//       //console.log(returnPromise)
//       if(returnPromise.length === totalLen){
//         let createCsv = `${Object.keys(dataHolder[0]).toString()}\n`
//         dataHolder.forEach((value)=>{
//           let newRow = Object.values(value)
//           createCsv += newRow.join(',')
//           createCsv += "\n"
//         })

//       await buildCSV(createCsv)
//       console.log("End:", new Date())

//       }
//     }
//     console.log('complete')
// }

async function buildCSV(csvString){
  let csvPromise = new Promise((res)=>{
    let createElement = document.createElement('a')
    createElement.href = `data:text/csv;charset=utf-8,${encodeURI(csvString)}`;
    createElement.download = `${store.getters.getCntyName}_Road_Log.csv`
    createElement.click()
    store.commit('setIsDownload', true)
    res('complete')
    
  })
  return await csvPromise
}

export function retrieveFile(event){
    let name = event.target.value.toLowerCase().split('.')
    let fileName = name[0].replace('c:\\fakepath\\', '')
    createFeatures(fileName)
}

async function createFeatures(file){
  let fileParams = {
    name: file,
    targetSR: view.spatialReference,
    maxRecordCount: 1000,
    enforceInputFileSizeLimit: true,
    enforceOutputJsonSizeLimit: true,
    generalize: true,
    maxAllowableOffset: 10,
    reducePrecision: true,
    numberOfDigitsAfterDecimal: 0
  }

  let content = {
    filetype: "shapefile",
    publishParameters: JSON.stringify(fileParams),
    f: "json"
  }

  const convShpToGraphic = esriRequest("https://www.arcgis.com/sharing/rest/content/features/generate",{
    query: content,
    body: document.getElementById('output'),
    responseType: "json",
    method: "post"
  })

  convShpToGraphic
    .then((res)=>{
      processUpload(res)
    })
    .catch((fail)=>{
      uploadFail(fail.message)
    })
}

function uploadFail(message){
  document.getElementById('progress').style.display = 'none'
  document.getElementById('text').style.display = "block"
  document.getElementById('output').style.border = '2px solid red'
  document.getElementById('text').innerText = `Error! ${message}`
  document.getElementById('text').style.color = 'red'
}

function uploadPass(message){
  document.getElementById('progress').style.display = 'none'
  document.getElementById('text').style.display = "block"
  document.getElementById('output').style.border = '2px solid green'
  document.getElementById('text').innerText = `Succesfully uploaded your shapefile! ${message}`
  document.getElementById('text').style.color = 'green'
}

async function processUpload(upload){
  //populate store with array with upload attribute values. 
  const txdotSchema = ['EDIT_TYPE', 'GID', 'Id', 'ST_DEFN']
  let uploadSchemaCheck = await uploadChecks(upload.data.featureCollection.layers[0], txdotSchema)
  uploadSchemaCheck.valueFail === true ? uploadFail(uploadSchemaCheck.message) : uploadPass('File Passed.')
  return;

  // let attName = upload.data.featureCollection.layers[0].layerDefinition.fields
  // let completeAttName = []
  // attName.forEach((x) => completeAttName.push(x.name))
  // store.commit('setUploadFields', completeAttName)
}

//check uplaod for geometry issues
async function uploadGeometryCheck(featSet){
  let geometryPromise = new Promise((res)=>{
    if(featSet.layerDefinition.geometryType !== 'esriGeometryPolyline'){
      res({valueFail: true, message:'Other Geometries other than polylines are in your file.\nRevise and re-submit.'})
      return;
    }
    res({'valueFail': false})
  })

  return await geometryPromise
}

//check values are filled in and have correct values
async function uploadValueCheck(feat){
  let valueCheckPromise = new Promise((res)=>{
    let editTypeMessage = "An incorrect edit type value has been found.\nPlease make sure values are either Add, Modify or Delete. Re-submit"
    let lengthMessage = "Empty fields have been detected.\nPlease revise and re-submit"

    for(let i=0; i < feat.featureSet.features.length; i++){
      let item = Object.entries(feat.featureSet.features[i].attributes)
      let isCheckLength = item.filter((x)=>x[1].toString().replace(/\s/g, "").length === 0)
      isCheckLength.length ? res({valueFail: true, message: lengthMessage}) : ''
      item.filter((x)=>{
        if(x[0] === 'EDIT_TYPE'){
          let removeWhiteSpace = x[1].toString().replace(/\s/g, "")
          removeWhiteSpace === "MODIFY" || removeWhiteSpace === "ADD" || removeWhiteSpace === "DELETE" ? null : res({valueFail: true, message: editTypeMessage})
          return;
        }
      })
    }
    let geometryReturn = uploadGeometryCheck(feat)
    res(geometryReturn)
  }) 

  return await valueCheckPromise
}

//check schema for uplaod Packet
async function uploadChecks(schemaFields, txdotSchema){
  let schemaPromise = new Promise((res)=>{
    let completeAttName = []
    let pass = 0
    let fail = 0
    
    schemaFields.layerDefinition.fields.forEach((x) => completeAttName.push(x.name))
    for(let i=0; i < txdotSchema.length; i++){
      let testField = completeAttName.includes(txdotSchema[i])
      testField === true ? pass++ : fail ++
    }
    if(fail > 0){
      res({valueFail: true, message: "Schema Failed. Check Shapefile matches TxDOT Schema"})
      return;
    }
    else{
      let returnValue = uploadValueCheck(schemaFields)
      res(returnValue)
    }
  })
  return await schemaPromise
}

