// import methods and functions into file
import {sketchPoint, view, gLayer, search, clientSideGeoJson, sketch, rdbdAssetPt, rdbdAssetLine } from './map' 
import { criConstants } from '../../common/cri_constants';
import { highLightFeat, queryFeatureTables, queryFeat,setDataToStore} from './helper'; //setDataToStore
import { store } from '../../store'
import * as geometryEngine from "@arcgis/core/geometry/geometryEngine";
import Graphic from "@arcgis/core/Graphic";
import * as webMercatorUtils from "@arcgis/core/geometry/support/webMercatorUtils"
import * as geodesicUtils from "@arcgis/core/geometry/support/geodesicUtils";



//set data for popup display
export async function popUpData(res){
    search.clear()
    let info = queryFeat(res)
    store.commit('setActiveLoader',true)
    info.then(async (x)=>{
      await queryFeatureTables(x, true)
      highLightFeat('click')
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
        let option = {include: [clientSideGeoJson, gLayer]}
        console.log(sketch.state)
        // if (sketch.state === "active") {
        //   console.log('return?')
        //   return;
        // }
        view.when(()=>{
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
                                [response.results[0].graphic.attributes['editNm'], 
                                timestamp[1], 
                                response.results[0].graphic.attributes['createNm'], 
                                timestamp[0]]
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
                                [response.results[0].graphic.attributes['editNm'], 
                                timestamp[1], 
                                response.results[0].graphic.attributes['createNm'], 
                                timestamp[0]])
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

//adding new Asset vertex to pre-existing geometry line. An Anchor vertex  
export function addAssetBreakPts(y, type){
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

export function initLoadAssetGraphic(asset){
    try{
      let assetType = {
        surface: ()=>{ return JSON.parse(graphicFilter[0].attributes.roadbedSurface)},
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
      console.warn("oh noooo...")
    }
}

//Getting new M-Value for new asset Point
export function getNewDfoDist(objectid, x, y, slide){
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

// local functions (not exported)
function assetCoverageCheck(x){
  let beginEndArr = []

  x.forEach(function(y){
    beginEndArr.push([y.ASSET_LN_BEGIN_DFO_MS, y.ASSET_LN_END_DFO_MS])
  })

  store.commit('setAssetCoverage', beginEndArr)
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

//convert epoch time to Human readable. Date from AGOL is in Epoch.
export function epochToHumanTime(editTime, createTime){
    let createTimestamp;
    let editTimestamp;
    if(createTime){
      const createHour = Number(new Date(createTime).getHours());
      const createMins = new Date(createTime).getMinutes();
      createTimestamp = [new Date(createTime).toLocaleDateString(), createHour, createMins]
    }
  
    if(editTime){
      const editHour = Number(new Date(editTime).getHours());
      const editMins = new Date(editTime).getMinutes();
      editTimestamp = [new Date(editTime).toLocaleDateString(), editHour, editMins]
    }
    return [createTimestamp, editTimestamp]
}
//`${new Date(editTime).toLocaleDateString()} ${editHour}:${String(editMins).padStart(2, '0')}`