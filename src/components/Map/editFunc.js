//import const from map.js
import {search, sketch, sketchPoint, view, featLayer, gLayer, countyOfficialInfo, txCounties, viewPoint, home, rdbdSrfcAsst, rdbdDsgnAsst, rdbdLaneAsst, rdbdAssetPt, rdbdAssetLine} from '../Map/map' //importing from ESRI API via map.js
import {cntyNbrNm} from '../../common/txCnt' //importing county name/nbr table via txCnt.js
import { criConstants } from '../../common/cri_constants';
import {initGraphicCheck, queryEditsLayer} from '../Map/crud'
//import esri js classes via ESM
import * as geometryEngine from "@arcgis/core/geometry/geometryEngine";
import Graphic from "@arcgis/core/Graphic";
import Query from "@arcgis/core/rest/support/Query";
import * as webMercatorUtils from "@arcgis/core/geometry/support/webMercatorUtils"
import * as geodesicUtils from "@arcgis/core/geometry/support/geodesicUtils";
//import TextSymbol from "@arcgis/core/symbols/TextSymbol";
import {store} from '../../store'
import router from '../../router';


//querys the Refernce Layer table return geometry/attributes
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
  //let length = parseFloat(geometryEngine.geodesicLength(tblqry.features[0].geometry, "miles")).toFixed(3)
  //let featIndex = tblqry.features[0].geometry.paths[0].length-1
  const query = new Query();
  query.where = `RDBD_GMTRY_LN_ID = ${tblqry.features[0].attributes.RDBD_GMTRY_LN_ID}`
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

  for(let srf in rdbdSrfcAtt.features){
    let surface = criConstants.surface
    for(let i in surface){
      if(surface[i]['num'] === rdbdSrfcAtt.features[srf].attributes.SRFC_TYPE_ID){
        rdbdSrfcAtt.features[srf].attributes.SRFC_TYPE_ID = surface[i]['name']
      }
    }
    rdbdSrfArry.push(rdbdSrfcAtt.features[srf].attributes)
  }
  
  for(let z=0; z < rdbdDsgnAtt.features.length; z++){
    rdbdDsgnArry.push({
      SRFC_TYPE_ID: rdbdDsgnAtt.features[z].attributes.RDWAY_DSGN_TYPE_DSCR,
      ASSET_LN_BEGIN_DFO_MS: Number(rdbdDsgnAtt.features[z].attributes.ASSET_LN_BEGIN_DFO_MS.toFixed(3)),
      ASSET_LN_END_DFO_MS: Number(rdbdDsgnAtt.features[z].attributes.ASSET_LN_END_DFO_MS.toFixed(3)),
      OBJECTID: null
    })
  }

  for(let a=0; a < rdbdLaneAtt.features.length; a++){
    rdbdNumLnArry.push({
      SRFC_TYPE_ID:  rdbdLaneAtt.features[a].attributes.NBR_THRU_LANE_CNT.toString(),
      ASSET_LN_BEGIN_DFO_MS:  Number(rdbdLaneAtt.features[a].attributes.ASSET_LN_BEGIN_DFO_MS.toFixed(3)),
      ASSET_LN_END_DFO_MS:  Number(rdbdLaneAtt.features[a].attributes.ASSET_LN_END_DFO_MS.toFixed(3)),
      OBJECTID: null
    })
  }

  rdbdSrfArry.sort((a,b)=>(a.ASSET_LN_BEGIN_DFO_MS > b.ASSET_LN_BEGIN_DFO_MS)? 1:-1)
  rdbdDsgnArry.sort((a,b)=>(a.ASSET_LN_BEGIN_DFO_MS > b.ASSET_LN_BEGIN_DFO_MS)? 1:-1)
  rdbdNumLnArry.sort((a,b)=>(a.ASSET_LN_BEGIN_DFO_MS > b.ASSET_LN_BEGIN_DFO_MS)? 1:-1)

  //push values to setters and getters are in vue components
  for(let i=0; i < rdbdSrfArry.length; i++){
    rdbdSrfArry[i].ASSET_LN_BEGIN_DFO_MS = Number(rdbdSrfArry[i].ASSET_LN_BEGIN_DFO_MS.toFixed(3))
    rdbdSrfArry[i].ASSET_LN_END_DFO_MS = Number(rdbdSrfArry[i].ASSET_LN_END_DFO_MS.toFixed(3))
    delete rdbdSrfArry.objectid
  }
  
  let roadNameObj = {streetName:tblqry.features[0].attributes.ST_DEFN_NM, 
                     prefix: tblqry.features[0].attributes.ST_PRFX_TYPE_DSCR ? tblqry.features[0].attributes.ST_PRFX_TYPE_DSCR.toUpperCase() : null, 
                     suffix: tblqry.features[0].attributes.ST_SFX_TYPE_DSCR ? tblqry.features[0].attributes.ST_SFX_TYPE_DSCR.toUpperCase() : null,
                     streetType: tblqry.features[0].attributes.ST_TYPE_DSCR,
                    }

  setDataToStore(JSON.stringify(rdbdSrfArry), JSON.stringify(rdbdDsgnArry), JSON.stringify([roadNameObj]), JSON.stringify(rdbdNumLnArry), tblqry.features[0].attributes.OBJECTID)
  
}
//Sets Road Data in the data store. 
function setDataToStore(surface, design, name, lane, objectid, comment){
  store.commit('setRoadbedSurface', surface) //push surface type values to getSurface setter
  store.commit('setRoadbedDesign', design) 
  store.commit('setRoadbedName', name)
  store.commit('setNumLane', lane)
  store.commit('setObjectid', objectid)
  store.commit('setComment', comment)
}
//get county name and road totals. Filters county for map zoom and definition query
export async function countyInfo(){
  let countyInfoPromise =  new Promise(function(res){
    let queryUrl = window.location.href
    let regExUrl = /\/(?:.(?!\/))+$/
    console.log(queryUrl.match(regExUrl)[0].split('/'))
    //let crInfo = queryUrl.split('http://localhost:8080/')[1]
    let crInfo = queryUrl.match(regExUrl)[0].split('/')[1]
    if(crInfo === 'login#'){return router.push('/load')}
    for (let j=0; j < cntyNbrNm.length; j++){
      if(cntyNbrNm[j][crInfo]){
        let whereStatement = `County_NBR = '${crInfo}'`
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
        search.sources._items[0].layer.definitionExpression = `CNTY_TYPE_NBR = ${store.state.cntyNmbr}`
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
        store.commit('setDfoReturn', seglengthMiles)
      }

      if(event.state === "complete"){
        store.commit('setIsDfoReturn', false)
      //creating the length of road in miles for user
        lengthMiles = geometryEngine.geodesicLength(event.graphic.geometry, "miles")
        res([lengthMiles, event.graphic.geometry, 'add']);
        sketchCompete();
      }
    });
  })
  let returnAddNewRoad = await addNewRoad
  sketch.layer.graphics.items.at(-1).geometry.hasM = true
  //add reApply M Measures function
  sketch.layer.graphics.items.at(-1).attributes = {
    editType: criConstants.editType[`${returnAddNewRoad[2]}`][1],
    gid: 9999,
    objectid: Number(new Date().getTime().toFixed(7)),
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
    createDt: new Date().getTime(),
    createNm: store.getters.getUserName,
    isCreatedAssets: false,
  }
  sketch.layer.graphics.items.at(-1).symbol = {
    type: "simple-line",
    color: criConstants.editType[`${returnAddNewRoad[2]}`][0],
    width: 2,
    style: "dash"
  }
  showVerticies(sketch.layer.graphics.items.at(-1))
  reapplyM(gLayer.graphics.items.at(-1))
  store.commit('setOldLength',Number(returnAddNewRoad[0].toFixed(3)))
  store.commit('setDeltaDis',[Number(returnAddNewRoad[0].toFixed(5)), 'Add'])
  store.commit('setRoadGeom', gLayer.graphics.items.at(-1).geometry.clone())
  store.commit('setModifyRd', false)

  setDataToStore(sketch.layer.graphics.items.at(-1).attributes.roadbedSurface,
                 sketch.layer.graphics.items.at(-1).attributes.roadbedDesign,
                 sketch.layer.graphics.items.at(-1).attributes.roadbedName,
                 sketch.layer.graphics.items.at(-1).attributes.numLane,
                 sketch.layer.graphics.items.at(-1).attributes.objectid,
                 '')
  
  return returnAddNewRoad[0]
}

//Modifying Existing Road and gathering existing road attributes based on clickType variable
//clickType = immediate-click; returns attributes
//clickType = double-click; creates graphic for editing
export async function modifyRoadbed(clickType, editType){
  let promise = new Promise(function(res, rej){
    view.on(clickType,(event) => {
      console.log(clickType,editType)
      if(store.getters.getEditExisting === false && store.getters.getDeleteRd === false){
        store.commit('setEditExisting', null)
        store.commit('setDeleteRd', null)
        rej('cancel')
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
  console.log(feature)
  store.commit('setRoadGeom', feature.features[0].geometry.clone())
  await queryFeatureTables(feature)
  // if(clickType === "click" && editType === "info"){
  //   hightlightFeat('click')
  //   console.log("Info mode...")
  //   //commit feature to store
  //   store.commit('setFeatureGeom', feature)
  //   store.commit('setInfoRd', true)
  //   // // document.getElementById('stepper').style.width = '500px'
  //   // defineGraphic(null, "click", "info")
  //   return
  // }
  defineGraphic(feature,clickType, editType)
  return feature//geometryEngine.geodesicLength(feature.features[0].geometry, "miles")
}
//turn on/off imagery at zoom level 9; NeedsReview
// export function zoomExtents(){
//   //maybe introduce watcher
//   view.on('mouse-wheel',() => {
//     //console.log(view.zoom)
//     view.zoom < 9 ?  featLayer.visible = false : featLayer.visible = true;
//     view.zoom < 9 ? map.basemap = criConstants.basemap : map.basemap = 'satellite';
//     view.zoom > 9 ? map.basemap = 'satellite' : criConstants.basemap;
//   })
// }
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
    let oldLength = graphics.features ? Number(geometryEngine.geodesicLength(graphics.features[0].geometry, "miles").toFixed(3)) :  Number(geometryEngine.geodesicLength(graphics.geometry, "miles").toFixed(3))
    document.body.style.cursor = 'context-menu'
    let graphicPromise = new Promise(function(res){
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
          gid: graphics.features ? graphics.features[0].attributes.GID : graphics.attributes.GID,
          objectid: graphics.features ? graphics.features[0].attributes.OBJECTID : graphics.attributes.OBJECTID,
          roadbedName: graphics.features ? store.getters.getRoadbedName : graphics.attributes.ASSET_ST_DEFN_NM,
          roadbedDesign: graphics.features ? store.getters.getRoadbedDesign : graphics.attributes.ASSET_RDWAY_DSGN_TYPE_DSCR,
          roadbedSurface: graphics.features ? store.getters.getRoadbedSurface : graphics.attributes.ASSET_SRFC_TYPE_DSCR,
          numLane: graphics.features ? store.getters.getNumLane : graphics.attributes.ASSET_NBR_THRU_LANE_CNT,
          originalLength: oldLength,
          isCreatedAssets: true,
          createDt: new Date().getTime(),
          createNm: store.getters.getUserName, //replace with user login info. TODO,
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
      // showVerticies(newGraphic)
      //sketch.update([newGraphic], {tool:'reshape'})
      res(gLayer)
    })

    let returnGraphicPromise = await graphicPromise
    //roadInfo.getObjectId = graphics.features[0].attributes.OBJECTID
    hideEditedRoads(returnGraphicPromise)
    
  //let objectidList = [];
  
  
  // for(let id in gLayer.graphics.items){
  //   if(gLayer.graphics.items[id].attributes !== null){
  //     objectidList.push(gLayer.graphics.items[id].attributes.objectid)
  //   }
  // }
  // featLayer.definitionExpression = `OBJECTID not in (${objectidList}) and CNTY_NM = '${store.getters.cntyName}'`
  //   if(gLayer.graphics.items[id].attributes !== null){
  //     objectidList.push(gLayer.graphics.items[id].attributes.objectid)
  //   }
  //   //Hides Reference Layer so it cant create multiple graphics. OBJECTID gets applied to objectidList array
  //   featLayer.definitionExpression = `OBJECTID not in (${objectidList}) and CNTY_NM = '${roadInfo.getcntyName}'` //add to go first, a new functoin
    //rdbdSrfcGeom.definitionExpression = `gid not in (${objectidList}) and cnty_nm = '${roadInfo.getcntyName}'` TODO - Hide rdbdSrfcGeom (split asset feature service)
    
  }
}

//hides feature roadbeds when converted to graphic

async function hideEditedRoads(graphicL, update){
  let objectidList = [];
  //let objectidEdits = [];

  //let roadsEdited = await reloadEdits()
  //console.log(roadsEdited)
  if(update === true){
    if(objectidList.length){
      objectidList.length = 0
    }
    gLayer.graphics.items.forEach((x) => {
      if(x.attributes.objectid === store.getters.getObjectid){
        //
      }
      else{
        objectidList.push(x.attributes.objectid)
      }
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
  // for(let id in roadsEdited.features){
  //   if(roadsEdited.features[id].attributes !== null){
  //     let objectid = roadsEdited.features[id].attributes.objectid || roadsEdited.features[id].attributes.OBJECTID
  //     objectidList.push(objectid)
  //     objectidEdits.push(objectid)
  //   }
  // }
 // editsLayer.definitionExpression = `OBJECTID not in (${objectidEdits}) and CNTY_TYPE_NBR = '${store.getters.getCntyNmbr}'`
  featLayer.definitionExpression = `OBJECTID not in (${objectidList}) and CNTY_TYPE_NM = '${store.getters.getCntyName}'`
}
//updateLength() gets new length of selected graphic and sends new length to store
export function updateLength(){
  try{
    setUpGraphic();
    sketch.on('update', (event)=>{
      if(event.state === 'active' && event.toolEventInfo.type === 'reshape-stop'){
        sketch['_operationHandle'].history.redo.length ?  store.commit('setIsRedoDisable', false) : store.commit('setIsRedoDisable', true)
        sketch['_operationHandle'].history.undo.length ?  store.commit('setIsUndoDisable', false) : store.commit('setIsUndoDisable', true)
      }
  
      if(event.state === 'complete'){
        let newLengths = Number(geometryEngine.geodesicLength(event.graphics[0].geometry, "miles").toFixed(3))//.toFixed(5)
        if(event.graphics[0].attributes.editType === 'ADD' && store.getters.getOldLength === 0){
         //store.commit('setDeltaDis',[newLengths, 'Add'])
        }
        else{
          if(sketch['_operationHandle'] === null){
            store.commit('setIsRedoDisable', true)
            store.commit('setIsUndoDisable', true) 

          }
          store.commit('setDeltaDis',[newLengths, 'Modify'])
          store.commit('setRoadGeom', event.graphics[0].geometry.clone())
          reapplyM(event.graphics[0])
          updateGraphicsLayer(event.graphics[0].attributes.objectid, newLengths)
        }

        // let returnRdSurf = JSON.parse(event.graphics[0].attributes.roadbedSurface)
        // returnRdSurf.forEach(x => x.OBJECTID = event.graphics[0].attributes.objectid)
        // returnRdSurf.at(-1).ASSET_LN_END_DFO_MS = Number(newLengths.toFixed(3))
        // store.commit('setRoadbedSurface', JSON.stringify(returnRdSurf))
        //let getGraphic = gLayer.graphics.items.filter(x => x.objectid = event.graphics[0].attributes.objectid)
        //getGraphic[0].attributes.roadbedSurface = JSON.stringify(returnRdSurf)
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
      // sketch._internalGraphicsLayer._promiseProps._resolver.promise.then((x)=>{
      //   console.log(x.graphics)
      //   console.log(x.graphics._observable._observers[0].properties.items[0].symbol.color = {r:0,g:255,b:111, a:1})
      // })
      if((response.results.length && store.getters.getStepperClose === true && store.getters.getStepNumber > 1) || (response.results.length && (store.getters.getEditExisting === true || store.getters.getDeleteRd === true))){
        return;
      }
      response.results.forEach((result)=>{
        if((result.graphic.attributes.editType === 'ADD' || result.graphic.attributes.editType === 'EDIT') && store.getters.getInfoRd === false){
          if(result.graphic.layer === sketch.layer && result.graphic.attributes){
            console.log(sketch)
            sketch.update([result.graphic], {tool:"reshape"});
            let oldLength = Number(geometryEngine.geodesicLength(result.graphic.geometry, "miles").toFixed(3))
            console.log(oldLength)
            store.commit('setRoadGeom', result.graphic.geometry)
            store.commit('setOldLength',oldLength)
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
  console.log(x)
  sketch.update([x], {tool:'reshape'})
}
//Delete a road from inside the stepper
export function delRoad(){
  let graphicDel = gLayer.graphics.items.filter((x)=>{
    return x.attributes.objectid === store.getters.getObjectid
  })
  graphicDel[0].attributes.editType = 'DELETE'
  let length = Number(geometryEngine.geodesicLength(graphicDel[0].geometry, "miles").toFixed(5))
  store.commit('setDeltaDis',[length, 'Delete'])
  let symbol = graphicDel[0].symbol.clone()
  symbol.color = criConstants.editType['delete'][0]
  graphicDel[0].symbol = symbol
}
//Delete a sketch i.e the graphic
export function removeGraphic(){
  stopEditing();
  let graphicR = gLayer.graphics.items.filter(x=> x.attributes.objectid === store.getters.getObjectid)
  initGraphicCheck(graphicR[0], true)
  gLayer.remove(graphicR[0])
  let delHighlight = view.allLayerViews.items.filter(x => x.layer.type === 'feature' && x._highlightIds)
  delHighlight[0]._highlightIds.delete(store.getters.getObjectid)
  hideEditedRoads(null,true)
  let length = Number(geometryEngine.geodesicLength(graphicR[0].geometry, "miles").toFixed(5))
  if(graphicR[0].attributes.editType === 'ADD'){
    console.log('add being deleted')
    store.commit('setDeltaDis',[length, 'Delete'])
  }
  else if(graphicR[0].attributes.editType === 'DELETE'){
    store.commit('setDeltaDis',[length, 'Add'])
  }
  else if(graphicR[0].attributes.editType === 'EDIT'){
    let diffAdded = Math.abs(graphicR[0].attributes.originalLength - length)
    store.commit('setDeltaDis',[diffAdded, 'Edit'])
  }
}
//set data for popup display
export async function popUpData(res){
  console.log('popup')
  let info = queryFeat(res)
  store.commit('setActiveLoader',true)
  info.then(async (x)=>{
    console.log(x)
    await queryFeatureTables(x)
    hightlightFeat('click')
    store.commit('setStepperClose', true)
    store.commit('setActiveLoader',false)
    store.commit('setFeatureGeom', x)
    store.commit('setRoadGeom', x.features[0].geometry.clone())
    store.commit('setInfoRd', true)
  })
  return;
}
//populates stepper form when graphic is clicked.
export async function getGraphic(){
  let getGraphPromise = new Promise(function(resp){
    view.on("click", function(event){
      console.log('click')
      let option = {include: [featLayer,gLayer]}
      if (sketch.state === "active") {
        console.log('active')
        return;
      }
      view.when(function(){
        //get response from graphics and set getters in store.js
        view.hitTest(event,option)
          .then(async function(response){
            if((response.results.length && (store.getters.getEditExisting === true || store.getters.getDeleteRd === true))){
              return;
            }
            else if(response.results.length && store.getters.getdeleteGraphClick === true){
              return;
            }
            else if((response.results.length && store.getters.getStepperClose === true && store.getters.getStepNumber > 1 && store.getters.getInfoRd === false) || (response.results.length && store.getters.getInfoRd === true && response.results[0].graphic.attributes['editType'] && store.getters.getStepperClose === true)){
              store.commit('setdenyFeatClick', true)
              return;
            }
            else if(response.results.length){
              if(!response.results[0].graphic.attributes['editType']){
                popUpData(response)
                return;
              }
              if(response.results[0].graphic.attributes['editType'] === 'ADD' || response.results[0].graphic.attributes['editType'] === 'EDIT'){
                response.results[0].graphic.attributes['editType'] === 'ADD' ? store.commit('setModifyRd', false) : store.commit('setModifyRd', true)
                store.commit('setStepperClose', true)
                store.commit('setInfoRd', false)
                setDataToStore(response.results[0].graphic.attributes['roadbedSurface'],
                              response.results[0].graphic.attributes['roadbedDesign'],
                              response.results[0].graphic.attributes['roadbedName'],
                              response.results[0].graphic.attributes['numLane'],
                              response.results[0].graphic.attributes['objectid'],
                              response.results[0].graphic.attributes['comment'])
                resp(response.results[0].graphic)
              }
              else if(response.results[0].graphic.attributes['editType'] === 'DELETE'){
                setDataToStore(response.results[0].graphic.attributes['roadbedSurface'],
                              response.results[0].graphic.attributes['roadbedDesign'],
                              response.results[0].graphic.attributes['roadbedName'],
                              response.results[0].graphic.attributes['numLane'],
                              response.results[0].graphic.attributes['objectid'],
                              response.results[0].graphic.attributes['comment'])
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
    console.log('end of the line')
  }
  if(gl){
    for(let j=0; j < applyM.length; j++){
      gl.geometry.setPoint(0,j,[arr.geometry.paths[0][j][0],arr.geometry.paths[0][j][1],applyM[j]])
    }
    //roadInfo.getSurface.at(-1).ASSET_LN_END_DFO_MS = Number(gl.geometry.paths[0].at(-1)[2].toFixed(3))
  }

  store.commit('setRoadGeom',gl.geometry.clone())
  return;
} //TODO
//push asset/geometry to edits feature layer
// export function saveInfo(id){
//   //get graphic layer and match by objectid
//   const graphic = gLayer.graphics.items
//   let geomPath;
//   let createdate;
//   let createName;
//   let gid;
//   for(let x in graphic){
//     if(graphic[x].attributes.OBJECTID === id.objectid){
//       geomPath = graphic[x].geometry
//       createdate = graphic[x].attributes.createDt
//       createName = graphic[x].attributes.createNm
//       gid = graphic[x].attributes.gid
//     }
//   }
//   //create new graphic and push new asset to edits feature layer
//   const editGraphic = new Graphic({
//     geometry: geomPath,
//     attributes: {
//       objectid: id.objectid,
//       gid: gid,
//       begin_dfo: 1, //TODO
//       end_dfo: 1, //TODO
//       seg_len:4, //TODO
//       county: store.getters.getcntyNmbr,
//       edit_type:'update',
//       create_nm: createName,
//       create_dt: createdate,
//       edit_nm: id.editNm,
//       edit_dt: id.editDt,
//       submit: 0,
//       cnty_nbr: store.getters.getcntyNmbr,
//       srfc_type_id:id.rdbdSurfe,
//       st_defn_nm: id.rdbdName,
//       rdway_dsgn_type_dscr: id.rdbdDes,
//       nbr_thru_lane_cnt: id.numLanes,
//     }
//   });
  
//   editsLayer.applyEdits({
//     addFeatures: [editGraphic]
//     //updateFeatures - TODO
//     //deleteFeatures - TODO
//   });
// }
//*************************************************************************************************/
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
    
    //let addGeom = gLayer.graphics.items.filter(gl => gl.attributes.objectid === y[0].OBJECTID)
    //console.log(addGeom[0].geometry.paths = store.getters.roadGeometry)
    // if(densUpdate.at(-1)[2] !== Number(y[d].ASSET_LN_END)){
    //   let delIndex = densUpdate.findIndex(x=> x[2] === Number(y[d].ASSET_LN_END))
    //   console.log(densUpdate.splice(delIndex,1))
    // }

  }
  return;
}
//adding new Asset vertex to pre-existing geometry line. An Anchor vertex  
export function addAssetBreakPts(y, type)
{

  //need to loop through points and add to line
  let a = rdbdAssetPt.graphics.items.filter(al => al.attributes.objectid === y[0].OBJECTID)
  //let g = gLayer.graphics.items.filter(gl => gl.attributes.objectid === y[0].OBJECTID)
  //store.commit('setRoadbedSurface', JSON.stringify(y))
  //g[0].attributes.roadbedSurface = store.getters.getRoadbedSurface


  let updatedGeom;
  if(type !== 'click'){
    // let m = applyMToAsset(a)
    // console.log(m)
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
    // if(check !== false){
      
      //get graphic layer geometry; matching on objectid 
      // for(let id in gLayer.graphics.items){
      //   if(gLayer.graphics.items[id].attributes.objectid === y[0].OBJECTID){
      //     dens = gLayer.graphics.items[id].geometry
      //   } 
      // }
      
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
        //let geom = densUpdate.slice(mArr.findIndex(endstart)-1,mArr.findIndex(endstart)+1)
        //convert to points to graphic and plot on route

        const radius = (Math.abs(geom[0][2] - y[d].ASSET_LN_END)) * 1609.344
        const pointA =  new Graphic({
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
    alert('Error has occurred')
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
//Edit the assest brake point on route via pencil icon in stepper
export async function updateAsset(y){
  //variable y is asset break object. Created in Stepper
  console.log("this point is being updated",y)
  let rdbdobj = [];
  if(rdbdobj.length){rdbdobj.length = 0}
  //gathering asset points and zooming to location. 
  for(let i in rdbdAssetPt.graphics.items){
    if((rdbdAssetPt.graphics.items[i].attributes.objectid === y[0].objectid) && (rdbdAssetPt.graphics.items[i].attributes.assetTyp === y[0].SRFC_TYPE_ID) && Number(rdbdAssetPt.graphics.items[i].attributes.eDfo) === y[0].ASSET_LN_END_DFO_MS){
      view.goTo({center: rdbdAssetPt.graphics.items[i].geometry, zoom: 20})
      rdbdAssetPt.graphics.items[i].attributes.edit = null
      rdbdobj = rdbdAssetPt.graphics.items[i]
    }
  }
  let returnAssetPt = await getSelectedDFO(rdbdobj.attributes.objectid);
  
  //start Sketch for placement of new asset break point
  // let assetPtPromise = new Promise(function(res){
  //   sketchPoint.create("point",{mode: "click"})
  //   sketchPoint.on("create",function(event){
  //     sketchPoint.cancel();
  //     res(event)
  //   })
  // })
  // //returns new point x,y
  // let returnAssetPt = await assetPtPromise

  //gets new DFO Distance (m-value) of new asset break point
  //let newDfo = getNewDfoDist(rdbdobj.attributes.objectid, returnAssetPt.graphic.geometry.x, returnAssetPt.graphic.geometry.y)
  let assetType = y[0].SRFC_TYPE_ID

  const assetSymb = {
    type: "simple-marker",
    color: criConstants.colorTable[`${assetType}`]
  } 
  //sets new asset point Graphic and converts point to Lat/Long
  const convertPt = new Graphic({
    geometry: {
      type: "point", 
      longitude: returnAssetPt[0].graphic.geometry.x,
      latitude: returnAssetPt[1].graphic.geometry.y,
      m: Number(parseFloat(returnAssetPt[0]).toFixed(3))
    },
  })

  let a = webMercatorUtils.webMercatorToGeographic(convertPt.geometry)
  let newAssetPt = new Graphic({
    geometry: {
      type: "point",
      hasM: true,
      longitude: a.x,
      latitude: a.y,
      spatialReference: {
        wkid: 3857
      }
    },
    attributes: {
      objectid: y[0].OBJECTID,
      assetTyp: assetType,
      bDfo: y[0].ASSET_LN_BEGIN_DFO_MS,
      eDfo: Number(parseFloat(returnAssetPt[0]).toFixed(3)),
      edit: true,
    },
    symbol: assetSymb
  });

  //removes old graphic and add new asset point
  rdbdAssetPt.graphics.remove(rdbdobj)
  rdbdAssetPt.graphics.add(newAssetPt)

  store.commit('setUpdateDfo',newAssetPt.attributes.eDfo)
  //returns all asset points related by objectid
  let currentAsst = rdbdAssetPt.graphics.items.filter(ca => ca.attributes.objectid === y[0].objectid)
  let assetArray=[]
  for(let x=0; x < currentAsst.length; x++){
    assetArray.push({
      SRFC_TYPE_ID: currentAsst[x].attributes.assetTyp,
      ASSET_LN_BEGIN_DFO_MS: Number(parseFloat(currentAsst[x].attributes.bDfo)),
      ASSET_LN_END_DFO_MS: Number(parseFloat(currentAsst[x].attributes.eDfo)),
      objectid: currentAsst[x].attributes.objectid,
      edit: currentAsst[x].attributes.edit
    })
  }
  //making sure there aren't any gaps/overlaps. Adjusting asset Break Dfos.
  let updateM = applyMToAsset(assetArray, "click")
  addAssetBreakPts(updateM, 'click')
  return updateM;
}
//******************************************************************************************************/
//Removes graphics points on click
export function removeAsstPoints(){
  rdbdAssetPt.graphics.removeAll();
  rdbdAssetLine.removeAll();
  return;
}

export function applyMToAsset(assetArray, type){
  let length = []
  for(let x=0; x < gLayer.graphics.items.length; x++){
    if(gLayer.graphics.items[x].attributes.objectid === assetArray[0].OBJECTID){
      length.push(gLayer.graphics.items[x])
    }
  }

  // length[0].attributes.roadbedSurface = assetArray
  // for(let z=0; z < length[0].attributes.roadbedSurface.length; z++){
  //   if(typeof(length[0].attributes.roadbedSurface[z].ASSET_LN_BEGIN_DFO_MS) === "string" || typeof(length[0].attributes.roadbedSurface[z].ASSET_LN_END_DFO_MS) === "string" ){
  //     assetArray[z].edit = true;
  //   }
  // }
  rdbdAssetLine.removeAll();
  // let assetInfo = [];
  // if(assetInfo.length){
  //   assetInfo.length = 0
  // }

  // for(let h=0; h < assetArray.length; h++){
  //   console.log(h)
  //   let add = {srfcType: assetArray[h].srfcType, AssetBeginDfo: parseFloat(assetArray[h].AssetBeginDfo), AssetEndDfo: parseFloat(assetArray[h].AssetEndDfo), objectid: assetArray[h].objectid}
  //   console.log(add.AssetBeginDfo, add.AssetEndDfo)
  //   assetInfo.push(add)
  //   console.log(assetInfo)
  // }
//make a new function for these
  // assetArray.sort((a,b) => a.ASSET_LN_BEGIN > b.ASSET_LN_END)
  // if(assetArray.at(-1).ASSET_LN_END !== Number(length[0].geometry.paths[0].at(-1)[2].toFixed(3))){
  //   assetArray.at(-1).ASSET_LN_END = Number(length[0].geometry.paths[0].at(-1)[2].toFixed(3))
  // }
  // for(let i=1; i<assetArray.length; i++){
  //   if(assetArray.at(-1).ASSET_LN_END !== Number(length[0].geometry.paths[0].at(-1)[2].toFixed(3))){

  //   }
  //   if(assetArray[i].edit){
  //     assetArray[i-1].ASSET_LN_END = Number(assetArray[i].ASSET_LN_BEGIN)
  //     if(assetArray[i+1]){
  //       assetArray[i+1].ASSET_LN_BEGIN = Number(assetArray[i].ASSET_LN_END)
  //     }
      
  //   }
  //   if(assetArray[i-1].edit){
  //     assetArray[i].ASSET_LN_BEGIN = Number(assetArray[i-1].ASSET_LN_END)
  //     if(assetArray[i+1]){
  //       assetArray[i+1].ASSET_LN_BEGIN = Number(assetArray[i].ASSET_LN_END)
  //     }
  //   }
  // }
  // if(assetArray.at(-1).ASSET_LN_END !== Number(length[0].geometry.paths[0].at(-1)[2].toFixed(3))){
  //   assetArray.at(-1).ASSET_LN_END = Number(length[0].geometry.paths[0].at(-1)[2].toFixed(3))
  // }

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
  
  // let pointB = new Graphic({
  //   geometry:{
  //     type: "point",
  //     longitude: returnClickedPt.graphic.geometry.x,
  //     latitude: returnClickedPt.graphic.geometry.y
  //   }
  // })
  // let isPointInterLine = geometryEngine.intersects(pointB.geometry, store.getters.getRoadGeom)
  // console.log(isPointInterLine)
  // let newDfo;
  // if(isPointInterLine === false){
  //   let nearestCoord = geometryEngine.nearestCoordinate(store.getters.getRoadGeom, pointB.geometry)
  //   newDfo = getNewDfoDist(oid, nearestCoord.coordinate.x, nearestCoord.coordinate.y, false)
  // }
  // else{
  //   newDfo = getNewDfoDist(oid, returnClickedPt.graphic.geometry.x, returnClickedPt.graphic.geometry.y, false)
  // }
  let newDfo = getNewDfoDist(oid, returnClickedPt.graphic.geometry.x, returnClickedPt.graphic.geometry.y, false)
  
  return [newDfo[0], returnClickedPt.graphic.geometry.x, returnClickedPt.graphic.geometry.y]
}

function assetCoverageCheck(x){

  let beginEndArr = []

  x.forEach(function(y){
    beginEndArr.push([y.ASSET_LN_BEGIN_DFO_MS, y.ASSET_LN_END_DFO_MS])
  })

  // let initValue = 0
  // let diff = beginEndArr.reduce((prevValue, currentValue) => 
  //   currentValue - prevValue, initValue
  // )

  store.commit('setAssetCoverage', beginEndArr)
  //this.setAssetCover = Number(diff.toFixed(3))
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
        applyMToAsset(newGraphic)
      }
      else{
        applyMToAsset(graphicAsset)
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

      createGraphics.features[i].attributes.EDIT_TYPE_ID = 'edit'
    }
    else if(createGraphics.features[i].attributes.EDIT_TYPE_ID === 4){
      createGraphics.features[i].attributes.EDIT_TYPE_ID = 'delete'
    }
    
    defineGraphic(createGraphics.features[i], 'click')
  }

  console.log(mileSetUp)
  store.commit('setDeltaDis',[mileSetUp, 'Add'])
  return currentEditRoads
  // currentEditRoads.then((roads)=>{
  //   hideEditedRoads(roads)
  // })
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
  console.log(editGraphic)

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
      console.log(objectidList)
      // need to adjust objectid to asset id
      featLayer.definitionExpression = objectidList.length ? `OBJECTID not in (${objectidList}) and CNTY_TYPE_NM = '${name}'`: `CNTY_TYPE_NM = '${name}'`
      console.log(nbr, name)
      txCounties.definitionExpression=`CNTY_NM='${name}'`
        
      const query = new Query();
      query.where = `CNTY_NM = '${name}'`
      query.outFields = [ "*" ]
      query.returnGeometry = true
      let countyQuery = txCounties.queryFeatures(query)
      let returnCountyObj = await countyQuery
      view.goTo({
        target: returnCountyObj.features[0].geometry
      })
  return;
} 
