//import const from map.js
import {sketch, sketchPoint, view, featLayer, gLayer, countyOfficialInfo, map, rdbdSrfcAsst, rdbdDsgnAsst, rdbdNameAsst, rdbdLaneAsst, editsLayer, rdbdAssetPt, rdbdAssetLine} from '../Map/map' //importing from ESRI API via map.js
import {cntyNbrNm} from '../../common/txCnt' //importing county name/nbr table via txCnt.js
import {roadInfo} from '../../store' //importing Getters/Setters via store.js
import { criConstants } from '../../common/cri_constants';
//import esri js classes via ESM
import * as geometryEngine from "@arcgis/core/geometry/geometryEngine";
import Graphic from "@arcgis/core/Graphic";
import Query from "@arcgis/core/rest/support/Query";
import OAuthInfo from "@arcgis/core/identity/OAuthInfo";
import esriId from "@arcgis/core/identity/IdentityManager";
import * as webMercatorUtils from "@arcgis/core/geometry/support/webMercatorUtils"
import * as geodesicUtils from "@arcgis/core/geometry/support/geodesicUtils";

//add login info
export function login(){
  let auth = new OAuthInfo({
    appId:"Chsd9GwkzlckpRBr",
    expiration: 10080,
    popup: false,
    portalUrl: "https://txdot.maps.arcgis.com",
  })
  console.log(esriId.findfindOAuthInfo(auth.portalUrl))
  esriId.registerOAuthInfos([auth]);
  const id = esriId.getCredential(auth.portalUrl + "/sharing");
  console.log(id)
}
//querys the Refernce Layer table return geometry/attributes
function queryFeat(qry){
  let queryFeat = featLayer.queryFeatures({
    objectIds: [qry.results[0].graphic.attributes.objectid],
    outFields: ["*"],
    returnGeometry: true,
    returnM: true
  })
  return queryFeat
}
//Querying asset (nonGeom) tables and pushing values to store
async function queryFeatureTables(tblqry){
  //let length = parseFloat(geometryEngine.geodesicLength(tblqry.features[0].geometry, "miles")).toFixed(3)
  let featIndex = tblqry.features[0].geometry.paths[0].length-1
  
  const query = new Query();
  query.where = `RDBD_GMTRY_LN_ID = ${tblqry.features[0].attributes.gid}`
  query.outFields = [ "*" ]
  const rdbdSrfc = rdbdSrfcAsst.queryFeatures(query)
  const rdbdDsgn = rdbdDsgnAsst.queryFeatures(query)
  const rdbdName = rdbdNameAsst.queryFeatures(query)
  const rdbdLane = rdbdLaneAsst.queryFeatures(query)
  const rdbdSrfcAtt = await rdbdSrfc
  const rdbdDsgnAtt = await rdbdDsgn
  const rdbdNameAtt = await rdbdName
  const rdbdLaneAtt = await rdbdLane
  console.log(rdbdSrfcAtt)
  // parse and match coded values (cri_constants.js) and push to empty array
  let rdbdSrfArry = [];
  if(rdbdSrfArry.length){
    rdbdSrfArry.length = 0
  }
  for(let srf in rdbdSrfcAtt.features){
    let surface = criConstants.surface
    for(let i in surface){
      if(surface[i]['num'] === rdbdSrfcAtt.features[srf].attributes.srfc_type_id){
        rdbdSrfcAtt.features[srf].attributes.srfc_type_id = surface[i]['name']
      }
    }
    rdbdSrfArry.push(rdbdSrfcAtt.features[srf].attributes)
  }
  //sort surface type array by ascending values based on beginDFO
  rdbdSrfArry.sort((a,b)=>(a.asset_ln_begin_dfo_ms > b.asset_ln_begin_dfo_ms)? 1:-1)
  //console.log(tblqry.features[0].geometry.paths[0][tblqry.features[0].geometry.paths[0].length-1][2].toFixed(3))
  //rdbdSrfArry[rdbdSrfArry.length - 1].asset_ln_end_dfo_ms = parseFloat(tblqry.features[0].geometry.paths[0][tblqry.features[0].geometry.paths[0].length-1][2].toFixed(3))
  console.log(tblqry.features[0].geometry.paths[0][featIndex][2] = rdbdSrfArry[rdbdSrfArry.length - 1].asset_ln_end_dfo_ms)
  console.log(tblqry.features[0].geometry.paths[0])
  //push values to setters and getters are in vue components 
  roadInfo.getSurface = rdbdSrfArry //push surface type values to getSurface setter
  roadInfo.getDesign = rdbdDsgnAtt.features[0].attributes.rdway_dsgn_type_dscr
  roadInfo.getName = rdbdNameAtt.features[0].attributes.st_defn_nm
  roadInfo.getLane = rdbdLaneAtt.features[0].attributes.nbr_thru_lane_cnt
}
//get county name and road totals. Filters county for map zoom and definition query
export async function countyInfo(){
  let countyInfoPromise =  new Promise(function(res){
    let queryUrl = window.location.href
    let crInfo = queryUrl.split('https://dprosack.github.io/CRI-Update/')[1]
    //console.log(crInfo.toString())
    for (let j=0; j < cntyNbrNm.length; j++){
      console.log(cntyNbrNm[j][crInfo])
      if(cntyNbrNm[j][crInfo]){
        let whereStatement = `County_NBR = '${crInfo}'`
        roadInfo.getcntyNmbr = crInfo
        roadInfo.getcntyName = cntyNbrNm[j][crInfo]
        console.log(whereStatement)
        const query = new Query();
        query.where = whereStatement
        query.outFields = [ "*" ]
        let newQuery = countyOfficialInfo.queryFeatures(query)
        res({response:true, nbr:parseInt(crInfo), query:newQuery})
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
    return await new Promise(function(res){
        sketch.create("polyline",{mode:"click", hasZ: false})
        sketch.on('create', (event) => {
            let lengthMiles;
            if(event.state === "complete"){
                //creating the length of road in miles for user
                lengthMiles = geometryEngine.geodesicLength(event.graphic.geometry, "miles")
                console.log("This is the current line length: ", parseFloat(lengthMiles.toFixed(3)));
                res(lengthMiles);
            }
        });
    }) 
}
//Modifying Existing Road and gathering existing road attributes based on clickType variable
//clickType = immediate-click; returns attributes
//clickType = double-click; creates graphic for editing
export async function modifyRoadbed(clickType){
  let promise = new Promise(function(res){
    view.on(clickType, (event) => {
      let opts = { include: featLayer }
      view.hitTest(event, opts).then(function(response){
        for(let i=0; i < response.results.length; i++){
          if(response.results[i].graphic.geometry !== null && response.results[i].graphic.sourceLayer !== null){
            let test = queryFeat(response)
            test.then(result=>res(result))
          }
        }
      })
    })
  })

  let feature = await promise;
  console.log(feature)
  //rdbdSrfc.then(result => console.log(result))
  await queryFeatureTables(feature)
  defineGraphic(feature,clickType)
  if(clickType === "immediate-click"){
    roadInfo.getObjectId = feature.features[0].attributes.objectid
    return 1 //provide increments for stepper
  }
  return feature//geometryEngine.geodesicLength(feature.features[0].geometry, "miles")
}
//turn on/off imagery at zoom level 9; NeedsReview
export function zoomExtents(){
  //maybe introduce watcher
  view.on('mouse-wheel',() => {
    //console.log(view.zoom)
    view.zoom < 9 ?  featLayer.visible = false : featLayer.visible = true;
    view.zoom < 9 ? map.basemap = criConstants.basemap : map.basemap = 'satellite';
    view.zoom > 9 ? map.basemap = 'satellite' : criConstants.basemap;
  })
}
//highlightes reference layer geometry when mouse moves over
export function hightlightFeat(){
  view.on('pointer-move', (event) => {
    const opts = {include: featLayer}
    view.hitTest(event, opts).then(function(response){
      if (response.results.length) {
        let editFeature = response.results[0].graphic;
        view.whenLayerView(editFeature.layer).then(function(layerView){
          let highlight = layerView.highlight(editFeature);
          view.on('pointer-move', (event) => {
            view.hitTest(event, opts).then(function(response){
              if(response.results.length === 0){
                highlight.remove()
              }
            })
          })
        })
      }
    })
  })
}
//creating roadbed graphic and setting attributes to graphics layer (gLayer)
//called in modifyRoadbed function
function defineGraphic(graphics, clickType){
  if (clickType === "double-click"){
    let newGraphic = new Graphic({
    geometry: {
      type: "polyline",
      paths: graphics.features[0].geometry.paths[0],
      hasM: true,
      spatialReference: {
        wkid: 3857
      }
    },

    attributes: {
      gid: graphics.features[0].attributes.gid,
      objectid: graphics.features[0].attributes.objectid,
      roadbedName: roadInfo.getName,
      roadbedDesign: roadInfo.getDesign,
      roadbedSurface: roadInfo.getSurface,
      numLane: roadInfo.getLane,
      createDt: new Date().getTime(),
      createNm: "DPROSACK" //replace with user login info. TODO
    },
              
    symbol: {
      type: "simple-line",
      color: [0, 0, 255],
      width: 2,
      style: "dash"
    }
  })
  let objectidList = [];
  gLayer.graphics.add(newGraphic);
  console.log(gLayer.graphics)
  roadInfo.getObjectId = graphics.features[0].attributes.objectid
  for(let id in gLayer.graphics.items)
    if(gLayer.graphics.items[id].attributes !== null){
      objectidList.push(gLayer.graphics.items[id].attributes.objectid)
    }
    console.log(objectidList)
    //Hides Reference Layer so it cant create multiple graphics. OBJECTID gets applied to objectidList array
    featLayer.definitionExpression = `objectid not in (${objectidList}) and cnty_nm = '${roadInfo.getcntyName}'`
    //rdbdSrfcGeom.definitionExpression = `gid not in (${objectidList}) and cnty_nm = '${roadInfo.getcntyName}'` TODO - Hide rdbdSrfcGeom (split asset feature service)
  }
}
//Updates Length Measurements when vertex on Graphics layer moves for readout
export async function updateLength(){
  let oldLength;
  view.on("click", function (event) {
    let opts = {include: gLayer}
    if (sketch.state === "active") {
      return;
    }
    //get old Length from existing line geometry
    view.hitTest(event,opts)
      .then(function (response) {
        let results = response.results;
        results.forEach(function (result) {
          //needsReview -> dont remember why I did this - djp
          if(result.graphic.layer === sketch.layer && result.graphic.attributes)
          {
            sketch.update([result.graphic], { tool: "reshape" });
          }
          if(result.graphic.layer === sketch.layer && !result.graphic.attributes)
          {
            sketch.update([result.graphic], { tool: "reshape" });
          }
        });
        oldLength = geometryEngine.geodesicLength(response.results[0].graphic.geometry, "miles")
      })
      .catch(err => err)
    });
  //get new length from modified graphic
  let updatePromise = new Promise(function(res){
    view.when(function(){
      sketch.on('update', (event)=>{
        let newLength;
        //check sketch is done. Get delta between old and new length. Return delta value
        if(!event.toolEventInfo && event.state === 'complete'){
          newLength = geometryEngine.geodesicLength(event.graphics[0].geometry, "miles")
          sketch.complete();
        }
        const deltaLength = newLength - oldLength
        if(oldLength < newLength){
          //console.log('add')
          let addMiles = Math.abs(deltaLength)
          res(addMiles)
        }
        if (oldLength > newLength){
          //console.log('sub')
          let subMiles = -Math.abs(deltaLength)
          res(subMiles)
        }
      })
    })
  })
  updatePromise.catch(err => alert(err))
  let mileage = await updatePromise;
  //Return value for readout
  return mileage
}
//Stop Editing by calling the sketch cancel() method.
export function stopEditing(){
  sketch.cancel()
}
//populates stepper form when graphic is clicked.
export async function getGraphic(){
  let getGraphPromise = new Promise(function(resp){
      view.on("immediate-click", function(event){
        let option = {include: gLayer}
        if (sketch.state === "active") {
          return;
        }
          view.when(function(){
            //get response from graphics and set getters in store.js
            view.hitTest(event,option)
            .then(function(response){
              if(response.results.length){
                roadInfo.getObjectId = response.results[0].graphic.attributes !== null ? response.results[0].graphic.attributes['objectid'] : null
                roadInfo.getName = response.results[0].graphic.attributes !== null ? response.results[0].graphic.attributes['roadbedName'] : null
                roadInfo.roadbedSurface = response.results[0].graphic.attributes !== null ? response.results[0].graphic.attributes['roadbedSurface'] : null
                roadInfo.getDesign = response.results[0].graphic.attributes !== null ? response.results[0].graphic.attributes['roadbedDesign'] : null
                roadInfo.getSurface = response.results[0].graphic.attributes !== null ? response.results[0].graphic.attributes['roadbedSurface'] : null
                roadInfo.getLane = response.results[0].graphic.attributes !== null ? response.results[0].graphic.attributes['numLane'] : 0
                resp(1)
              }
            })
          })
      });
  });
 let returnGetGraph = await getGraphPromise;
 return returnGetGraph
}
//setting M-Vaules on geometry changes
//function reapplyM(arr){
//   let testArr = []
//   while(arr.length){
//     let split1 = arr.splice(0,2)
//     testArr.push(split1)
//   }
//   console.log(testArr)
//   for (let i=0; i < testArr.length; i++){
//     console.log(testArr[i])
//     //x2-x1
//     let xDiff = Math.pow(Math.abs(testArr[i][1][0] - testArr[i][0][0]), 2)
//     // console.log(xDiff)
//     //y2-y1
//     let yDiff = Math.pow(Math.abs(testArr[i][1][1] - testArr[i][0][1]), 2)
//     // console.log(yDiff)
//     const m = Math.sqrt(xDiff + yDiff) * 0.0006213712
//     console.log(m)
//     testArr[i][1].slice(3,0,m)
//   }
//   return testArr
//} //TODO
//push asset/geometry to edits feature layer
export function saveInfo(id){
  //get graphic layer and match by objectid 
  console.log(id)
  const graphic = gLayer.graphics.items
  console.log(graphic)
  let geomPath;
  let createdate;
  let createName;
  let gid;
  for(let x in graphic){
    console.log(graphic[x].attributes)
    if(graphic[x].attributes.objectid === id.objectid){
      geomPath = graphic[x].geometry
      createdate = graphic[x].attributes.createDt
      createName = graphic[x].attributes.createNm
      gid = graphic[x].attributes.gid
    }
  }
  console.log(JSON.stringify(id.rdbdSurf))
  //create new graphic and push new asset to edits feature layer
  const editGraphic = new Graphic({
    geometry: geomPath,
    attributes: {
      objectid: id.objectid,
      gid: gid,
      begin_dfo: 1, //TODO
      end_dfo: 1, //TODO
      seg_len:4, //TODO
      county: roadInfo.getcntyNmbr,
      edit_type:'update',
      create_nm: createName,
      create_dt: createdate,
      edit_nm: id.editNm,
      edit_dt: id.editDt,
      submit: 0,
      cnty_nbr: roadInfo.getcntyNmbr,
      srfc_type_id:id.rdbdSurfe,
      st_defn_nm: id.rdbdName,
      rdway_dsgn_type_dscr: id.rdbdDes,
      nbr_thru_lane_cnt: id.numLanes,
    }
  });
  
  editsLayer.applyEdits({
    addFeatures: [editGraphic]
    //updateFeatures - TODO
    //deleteFeatures - TODO
  });
}
//*************************************************************************************************/
//Drawing the new Asset Graphics on the route
function createAssetGraph(pathArr,y){
  console.log(y)
  console.log(pathArr)
  let assetGeom = rdbdAssetLine.graphics.items
  console.log(assetGeom)
  for(let a=0; a<assetGeom.length; a++){
    if(assetGeom[a].attributes.objectid === y[0].objectid){
      console.log(assetGeom[a].attributes.objectid)
      rdbdAssetLine.graphics.remove(assetGeom[a])
    }
  }
 
  let densUpdate = pathArr.paths[0]
  
  let mArr = [];
  console.log(mArr)
  if(mArr.length){
    mArr.length = 0
  }


  for(let i = 0; i < densUpdate.length; i++){
    //console.log(x[i][2])
    mArr.push(parseFloat(densUpdate[i][2]).toFixed(3)) //mval
  }

  
  for(let d in y){
    console.log(y[d].srfcType)
    if(y[d].srfcType === 'Paved'){
      console.log(y[d].objectid)
      let getstart = (element) => element >= y[d].AssetBeginDfo;
      let endstart = (element) => element >= y[d].AssetEndDfo;
      console.log(mArr.findIndex(getstart))
      console.log(mArr.findIndex(endstart))
      let geom = densUpdate.slice(mArr.findIndex(getstart), mArr.findIndex(endstart)+1)
      console.log(geom)
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
          objectid: y[d].objectid,
        },
                  
        symbol: {
          type: "simple-line",
          color: '#8DB600',
          width: 5,
          style: "solid"
        }
      })
      rdbdAssetLine.graphics.add(pavement);
    }
    else if(y[d].srfcType === 'Gravel'){
      let getstart = (element) => element >= y[d].AssetBeginDfo;
      let endstart = (element) => element >= y[d].AssetEndDfo;
      console.log(mArr.findIndex(getstart))
      console.log(mArr.findIndex(endstart))
      let geom = densUpdate.slice(mArr.findIndex(getstart), mArr.findIndex(endstart)+1)
      console.log(geom)
      let gravel = new Graphic({
        geometry: {
          type: "polyline",
          paths: geom,
          hasM: true,
          spatialReference: {
            wkid: 3857
          }
        },
    
        attributes: {
          objectid: y[d].objectid,
        },
                  
        symbol: {
          type: "simple-line",
          color: '#4B5320',
          width: 5,
          style: "solid"
        }
      })
      rdbdAssetLine.graphics.add(gravel);
    }
    else if(y[d].srfcType === 'Dirt/Natural'){
      let getstart = (element) => element >= y[d].AssetBeginDfo;
      let endstart = (element) => element >= y[d].AssetEndDfo;
      console.log(mArr.findIndex(getstart))
      console.log(mArr.findIndex(endstart))
      let geom = densUpdate.slice(mArr.findIndex(getstart), mArr.findIndex(endstart)+1)
      console.log(geom)
      let dirtNatural = new Graphic({
        geometry: {
          type: "polyline",
          paths: geom,
          hasM: true,
          spatialReference: {
            wkid: 3857
          }
        },
    
        attributes: {
          objectid: y[d].objectid,
        },
                  
        symbol: {
          type: "simple-line",
          color: '#FFD12A',
          width: 10,
          style: "solid"
        }
      })
      rdbdAssetLine.graphics.add(dirtNatural);
    }
    else if(y[d].srfcType === 'Concrete'){
      let getstart = (element) => element >= y[d].AssetBeginDfo;
      let endstart = (element) => element >= y[d].AssetEndDfo;
      console.log(mArr.findIndex(getstart))
      console.log(mArr.findIndex(endstart))
      let geom = densUpdate.slice(mArr.findIndex(getstart), mArr.findIndex(endstart)+1)
      console.log(geom)
      let concrete = new Graphic({
        geometry: {
          type: "polyline",
          paths: geom,
          hasM: true,
          spatialReference: {
            wkid: 3857
          }
        },
    
        attributes: {
          objectid: y[d].objectid,
        },
                  
        symbol: {
          type: "simple-line",
          color: '#000000',
          width: 10,
          style: "solid"
        }
      })
      rdbdAssetLine.graphics.add(concrete);
    }
    else if(y[d].srfcType === 'Brick'){
      let getstart = (element) => element >= y[d].AssetBeginDfo;
      let endstart = (element) => element >= y[d].AssetEndDfo;
      console.log(mArr.findIndex(getstart))
      console.log(mArr.findIndex(endstart))
      let geom = densUpdate.slice(mArr.findIndex(getstart), mArr.findIndex(endstart)+1)
      console.log(geom)
      let brick = new Graphic({
        geometry: {
          type: "polyline",
          paths: geom,
          hasM: true,
          spatialReference: {
            wkid: 3857
          }
        },
    
        attributes: {
          objectid: y[d].objectid,
        },
                  
        symbol: {
          type: "simple-line",
          color: '#CC0000',
          width: 10,
          style: "solid"
        }
      })
      rdbdAssetLine.graphics.add(brick);
    }
  }
  return;
}
//adding new Asset vertex to pre-existing geometry line. An Anchor vertex  
export function addAssetBreakPts(y)
{
  //need to loop through points and add to line
  console.log(y)
  console.log(rdbdAssetPt)

  let a = rdbdAssetPt.graphics.items.filter(al => al.attributes.objectid === y[0].objectid)
  let g = gLayer.graphics.items.filter(gl => gl.attributes.objectid === y[0].objectid)
  console.log(a)
  for(let x=0; x<a.length; x++){
    if(a[x].attributes.edit !== true){
      console.log(a[x])
      let geomx = a[x].geometry.x
      let geomy = a[x].geometry.y
      console.log(getNewDfoDist(a[x].attributes.objectid, geomx, geomy))
    }
  }

  console.log(g)
  createAssetGraph(g[0].geometry,y)
  return;
}
//gets asset break points and plots on the route
export function getCoordsRange(y){
   console.log(rdbdAssetPt)
    let dens;
  // if(check !== false){
    console.log(gLayer)
    //get graphic layer geometry; matching on objectid 
    for(let id in gLayer.graphics.items){
      if(gLayer.graphics.items[id].attributes.objectid === y[0].objectid){
        console.log(gLayer.graphics.items[id])
        dens = gLayer.graphics.items[id].geometry
      } 
    }
    //get geometry x,y,m
    let densUpdate = dens.paths[0];
  
    let mArr = [];
    if(mArr.length){
      mArr.length = 0
    }
    //populates mArr with m-values
    for(let i = 0; i < densUpdate.length; i++){
      //console.log(x[i][2])
      mArr.push(densUpdate[i][2]) //mval
    }
    //gets the closest M-values to the assetBegin/assetEnd DFO. Provided by the stepper
    for(let d in y){
      console.log(y[d].srfcType)
      let getstart = (element) => element >= y[d].AssetBeginDfo;
      let endstart = (element) => element >= y[d].AssetEndDfo;
      console.log(mArr.findIndex(getstart))
      console.log(mArr.findIndex(endstart)-1)
      console.log(mArr.findIndex(endstart))
      //extract closest index for begin/end dfo values
      let geom = densUpdate.slice(mArr.findIndex(endstart)-1,mArr.findIndex(endstart)+1)
      //convert to points to graphic and plot on route
      console.log(geom)
      const radius = (Math.abs(geom[0][2] - y[d].AssetEndDfo)) * 1609.344
      console.log(radius)
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
      const newDFO = geodesicUtils.pointFromDistance(a, radius,findAzmith.azimuth)
      console.log(newDFO.x, newDFO.y, y[d].srfcType)
      const geoToMerca = webMercatorUtils.geographicToWebMercator(newDFO)

      let assetType = y[d].srfcType
      let pointColor;
      switch(assetType){
        case "Paved":
          pointColor = "#5D8AA8"		
        break;
        case "Brick":
          pointColor = "#E32636"
        break;
        case "Dirt/Natural":
          pointColor = "#98777B"
        break;
        case "Gravel":
          pointColor = "#848482"
        break;
        case "Concrete":
          pointColor = "#000000"
      } 

      const assetSym = {
        type: "simple-marker",
        color: pointColor
      }
      console.log(geoToMerca)
      let assetPoint = new Graphic({
        geometry: {
          type: "point",
          hasM: true,
          longitude: newDFO.x,
          latitude: newDFO.y,
          spatialReference: {
            wkid: 3857
          }
        },
        attributes: {
          objectid: y[d].objectid,
          assetTyp: assetType,
          bDfo: y[d].AssetBeginDfo,
          eDfo: y[d].AssetEndDfo
        },
        symbol: assetSym
      })
    
      rdbdAssetPt.graphics.add(assetPoint)
      console.log(rdbdAssetPt)
    }
  return;
}
//Getting new M-Value for new asset Point
function getNewDfoDist(objectid, x, y){

  let objid ={};
  if(objid.length){
    objid=0
  }
  
  let pointA = new Graphic({
    geometry:{
      type: "point",
      longitude: x,
      latitude: y
    }
  })

  let webMercaPointA = webMercatorUtils.webMercatorToGeographic(pointA.geometry)
    for(let id in gLayer.graphics.items){
      if(gLayer.graphics.items[id].attributes.objectid === objectid){
        objid = gLayer.graphics.items[id].geometry
      }
    }
  console.log(objid.paths[0].length)
  let index = geometryEngine.nearestVertex(objid, pointA.geometry).vertexIndex
  let nearVert = objid.paths[0].at(index)
  console.log(index)
  if(objid.paths[0].length-1 === index){
    console.log("End of the line")
    return;
  }
  let path = objid.paths[0].slice(index, index+2)

  let direction = path[0][0] > path[1][0]
  console.log(direction) 
  let x2 = nearVert[0]
  let y2 = nearVert[1]

  let pointB = new Graphic({
    geometry:{
      type: "point",
      longitude: x2,
      latitude: y2
    }
  })

  //determine point is left or right of another point; (+) to the right. (-) to the left
  let dir = x - x2
 
  let dir2;
  if(dir === 0 ){
    dir2 = y - y2
  }

  let webMercaPointB = webMercatorUtils.webMercatorToGeographic(pointB.geometry)
  const pointAPointB = geodesicUtils.geodesicDistance(webMercaPointA, webMercaPointB)
  console.log(pointAPointB)

  console.log(path[0][2])
  console.log(path[1][2])
  if(dir < 0 && !direction){
    console.log('1',Math.abs(path[0][2] - (pointAPointB.distance/1609.344)))

  }
  else if (dir > 0 && !direction){
    console.log('2',Math.abs(path[0][2] + (pointAPointB.distance/1609.344)))
  }
  else if (dir < 0 && direction){
    console.log('2',Math.abs(path[0][2] + (pointAPointB.distance/1609.344)))
  }
  else if (dir > 0 && direction){
    console.log('2',Math.abs(path[0][2] - (pointAPointB.distance/1609.344)))
  }
  //let newDfo;
  console.log(path[0][2])
  let newDfo;

  if(dir < 0 && !direction){
    newDfo = Math.abs(path[0][2] - (pointAPointB.distance/1609.344))
  }
  else if (dir > 0 && !direction){
    newDfo = Math.abs(path[0][2] + (pointAPointB.distance/1609.344))
  }
  else if (dir < 0 && direction){
    newDfo = Math.abs(path[0][2] + (pointAPointB.distance/1609.344))
  }
  else if (dir > 0 && direction){
    newDfo = Math.abs(path[0][2] - (pointAPointB.distance/1609.344))
  }
  
  if(dir === 0 && dir2 < 0){
    newDfo = Math.abs(path[0][2] - (pointAPointB.distance/1609.344))
  }
  else if(dir === 0 && dir2 > 0){
    newDfo = Math.abs(path[0][2] + (pointAPointB.distance/1609.344))
  }
  if(Number(nearVert[2].toFixed(3)) === Number(newDfo.toFixed(3))){
    console.log('Points Match')
    return;
  }
  objid.insertPoint(0,index, [x, y, newDfo])

  console.log(newDfo)
  return newDfo
  ///path[0][2] may be in correct, may need to be path[1][2]
}
//Edit the assest brake point on route via pencil icon in stepper
export async function updateAsset(y){
  //variable y is asset break object. Created in Stepper
  console.log("this point is being updated",y)
  let rdbdobj = [];
  if(rdbdobj.length){rdbdobj.length = 0}
  //gathering asset points and zooming to location. 
  for(let i in rdbdAssetPt.graphics.items){
    if((rdbdAssetPt.graphics.items[i].attributes.objectid === y[0].objectid) && (rdbdAssetPt.graphics.items[i].attributes.assetTyp === y[0].srfcType) && rdbdAssetPt.graphics.items[i].attributes.eDfo === y[0].AssetEndDfo){
      view.goTo({center: rdbdAssetPt.graphics.items[i].geometry, zoom: 20})
      console.log(rdbdAssetPt.graphics.items[i])
      rdbdobj = rdbdAssetPt.graphics.items[i]
    }
  }
  console.log(rdbdobj)
  //start Sketch for placement of new asset break point
  let assetPtPromise = new Promise(function(res){
    sketchPoint.create("point",{mode: "click"})
    sketchPoint.on("create",function(event){
      sketchPoint.cancel();
      res(event)
    })
  })
  //returns new point x,y
  let returnAssetPt = await assetPtPromise
  console.log(returnAssetPt)
  console.log(rdbdobj)
  //gets new DFO Distance (m-value) of new asset break point
  let newDfo = getNewDfoDist(rdbdobj.attributes.objectid, returnAssetPt.graphic.geometry.x, returnAssetPt.graphic.geometry.y)
  console.log(newDfo)
  console.log(returnAssetPt)
  let assetType = y[0].srfcType
  let pointColors;
  //setting point symbol on surface type
  switch(assetType){
    case "Paved":
      pointColors = "#5D8AA8"		
    break;
    case "Brick":
      pointColors = "#E32636"
    break;
    case "Dirt/Natural":
      pointColors = "#98777B"
    break;
    case "Gravel":
      pointColors = "#848482"
    break;
    case "Concrete":
      pointColors = "#000000"
    break;
  }

  const assetSymb = {
    type: "simple-marker",
    color: pointColors
  } 
  //sets new asset point Graphic and converts point to Lat/Long
  const convertPt = new Graphic({
    geometry: {
      type: "point", 
      longitude: returnAssetPt.graphic.geometry.x,
      latitude: returnAssetPt.graphic.geometry.y,
      m: Number(parseFloat(newDfo).toFixed(3))
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
      objectid: y[0].objectid,
      assetTyp: assetType,
      bDfo: y[0].AssetBeginDfo,
      eDfo: Number(parseFloat(newDfo).toFixed(3)),
      edit: true,
    },
    symbol: assetSymb
  });

  console.log(rdbdobj)
  console.log(rdbdobj.attributes.objectid)
  //removes old graphic and add new asset point
  rdbdAssetPt.graphics.remove(rdbdobj)
  rdbdAssetPt.graphics.add(newAssetPt)
  console.log(rdbdAssetPt)
  let assetInfo = [];
  if(assetInfo.length){
    assetInfo.length = 0
  }
  //returns all asset points related by objectid
  let currentAsst = rdbdAssetPt.graphics.items.filter(ca => ca.attributes.objectid === y[0].objectid)
  console.log(currentAsst)
  //making sure there aren't any gaps/overlaps. Adjusting asset Break Dfos.
  for(let h=0; h < currentAsst.length; h++){
    let add = {srfcType: currentAsst[h].attributes.assetTyp, AssetBeginDfo: currentAsst[h].attributes.bDfo, AssetEndDfo: parseFloat(currentAsst[h].attributes.eDfo), objectid: currentAsst[h].attributes.objectid, edit: currentAsst[h].attributes.edit}
    assetInfo.push(add)
  }
  let oddAsst = [];
  let evenAsst = [];
  if(oddAsst.length && evenAsst.length){
    oddAsst.length = 0
    evenAsst.length = 0
  }

  assetInfo.sort((a,b) => a.AssetBeginDfo > b.AssetBeginDfo)
  for(let i=1; i<assetInfo.length; i+=2){
    oddAsst.push(assetInfo[i-1])
    evenAsst.push(assetInfo[i])
  }
        
  for(let t=0; t < oddAsst.length; t++){
    let eDFO = oddAsst[t].AssetEndDfo
    let bDFO = evenAsst[t].AssetBeginDfo

    if(eDFO === bDFO){
      console.log('DFO Match')
    }
    else if (evenAsst[t].edit === true){
      oddAsst[t].AssetEndDfo = eDFO
    }
    else if(oddAsst[t].edit === true){
      evenAsst[t].AssetBeginDfo = eDFO
    }
  }
  if(assetInfo.length){
    assetInfo.length = 0
    for(let oa=0; oa<oddAsst.length; oa++){
      assetInfo.push(oddAsst[oa])
      assetInfo.push(evenAsst[oa])
    }
  }
  console.log(assetInfo)
  addAssetBreakPts(assetInfo)
  return;
}
//******************************************************************************************************/
//Removes graphics points on click
export function removeAsstPoints(){
  rdbdAssetPt.graphics.removeAll();
  console.log(rdbdAssetPt)
  return;
}
// function mDisplay(){

// }

// export async function getFeature(){
//   let getGraphPromise = new Promise(function(resp){
//       view.on("immediate-click", function(event){
//         let option = {include: featLayer}
      
//           view.when(function(){
//             view.hitTest(event,option)
//             .then(function(response){
//               if(response.results.length){
//                 let queryFeat = featLayer.queryFeatures({
//                   objectIds: [response.results[0].graphic.attributes.objectid],
//                   outFields: ["*"],
//                   returnGeometry: true,
//                   returnM: true
//                 })
//                 queryFeat.then(result => resp(result))
//               }
//             })
//           })
//       });
//   });
//   //create one function for query tables
//  let returnGetGraph = await getGraphPromise;
//  const query = new Query();
//   query.where = `RDBD_GMTRY_LN_ID = ${returnGetGraph.features[0].attributes.gid}`
//   query.outFields = [ "*" ]
//   const rdbdSrfc = rdbdSrfcAsst.queryFeatures(query)
//   const rdbdDsgn = rdbdDsgnAsst.queryFeatures(query)
//   const rdbdName = rdbdNameAsst.queryFeatures(query)
//   const rdbdLane = rdbdLaneAsst.queryFeatures(query)
//   const rdbdSrfcAtt = await rdbdSrfc
//   const rdbdDsgnAtt = await rdbdDsgn
//   const rdbdNameAtt = await rdbdName
//   const rdbdLaneAtt = await rdbdLane
//   console.log(rdbdSrfcAtt)
//   let rdbdSrfArry = [];
//   if(rdbdSrfArry.length){
//     rdbdSrfArry.length = 0
//   }
//   for(let srf in rdbdSrfcAtt.features){
//     console.log(rdbdSrfcAtt.features[srf])
//     let surface = criConstants.surface
//     for(let i in surface){
//       if(surface[i]['num'] === rdbdSrfcAtt.features[srf].attributes.srfc_type_id){
//         rdbdSrfcAtt.features[srf].attributes.srfc_type_id = surface[i]['name']
//       }
//     }
//     console.log(rdbdSrfcAtt.features[srf].attributes)
//     rdbdSrfArry.push(rdbdSrfcAtt.features[srf].attributes)
//   }
//   console.log(rdbdSrfArry)
//   rdbdSrfArry.sort((a,b)=>(a.asset_ln_begin_dfo_ms > b.asset_ln_begin_dfo_ms)? 1:-1)
//   roadInfo.getSurface = rdbdSrfArry
//   roadInfo.getDesign = rdbdDsgnAtt.features[0].attributes.rdway_dsgn_type_dscr
//   roadInfo.getName = rdbdNameAtt.features[0].attributes.st_defn_nm
//   roadInfo.getLane = rdbdLaneAtt.features[0].attributes.nbr_thru_lane_cnt
//   console.log(rdbdSrfcAtt.features[0].attributes)
//  return 1
// }

// export async function HoverAtt(){
//   view.on('pointer-move', (event) => {
//     const opts = {include: featLayer}
//     view.hitTest(event, opts).then(function(response){
//       if (response.results.length) {
//         let editFeature = response.results[0].graphic;
//         view.whenLayerView(editFeature.layer).then(function(layerView){
//          console.log(layerView)
//         })
//       }
//     })
//   })
  // console.log(hoverFeature)
  // const query = new Query();
  // query.where = `RDBD_GMTRY_LN_ID = ${hoverFeature.features[0].attributes.gid}`
  // query.outFields = [ "*" ]
  // const rdbdSrfc = rdbdSrfcAsst.queryFeatures(query)
  // const rdbdDsgn = rdbdDsgnAsst.queryFeatures(query)
  // const rdbdName = rdbdNameAsst.queryFeatures(query)
  // const rdbdLane = rdbdLaneAsst.queryFeatures(query)
  // const rdbdSrfcAtt = await rdbdSrfc
  // const rdbdDsgnAtt = await rdbdDsgn
  // const rdbdNameAtt = await rdbdName
  // const rdbdLaneAtt = await rdbdLane
  // console.log(rdbdSrfcAtt)
  // let rdbdSrfArry = [];
  // if(rdbdSrfArry.length){
  //   rdbdSrfArry.length = 0
  // }
  // for(let srf in rdbdSrfcAtt.features){
  //   console.log(rdbdSrfcAtt.features[srf])
  //   let surface = criConstants.surface
  //   for(let i in surface){
  //     if(surface[i]['num'] === rdbdSrfcAtt.features[srf].attributes.srfc_type_id){
  //       rdbdSrfcAtt.features[srf].attributes.srfc_type_id = surface[i]['name']
  //     }
  //   }
  //   console.log(rdbdSrfcAtt.features[srf].attributes)
  //   rdbdSrfArry.push(rdbdSrfcAtt.features[srf].attributes)
  // }
  // console.log(rdbdSrfArry)
  // rdbdSrfArry.sort((a,b)=>(a.asset_ln_begin_dfo_ms > b.asset_ln_begin_dfo_ms)? 1:-1)
  // roadInfo.getSurface = rdbdSrfArry
  // roadInfo.getDesign = rdbdDsgnAtt.features[0].attributes.rdway_dsgn_type_dscr
  // roadInfo.getName = rdbdNameAtt.features[0].attributes.st_defn_nm
  // roadInfo.getLane = rdbdLaneAtt.features[0].attributes.nbr_thru_lane_cnt
  // console.log(rdbdSrfcAtt.features[0].attributes)
//   return 1
// }

// export async function deleteGeom(){
//   let delPromise = new Promise(function(res){
//     view.on("click", (event) => {
//       let opts = { include: featLayer }
//       view.hitTest(event, opts).then(function(response){
//         for(let i=0; i < response.results.length; i++){
//           if(response.results[i].graphic.geometry !== null && response.results[i].graphic.sourceLayer !== null){
//             let queryFeat = featLayer.queryFeatures({
//               objectIds: [response.results[0].graphic.attributes.objectid],
//               outFields: ["*"],
//               returnGeometry: true,
//               returnM: true
//             })
//             queryFeat.then(result => res(result))
//           }
//         }
//       })
//     })
//   })

//   let retdelPromise = await delPromise
//   console.log(retdelPromise)
//   let newDelGraphic = new Graphic({
//     geometry: {
//       type: "polyline",
//       paths: retdelPromise.features[0].geometry.paths[0],
//       hasM: true,
//       spatialReference: {
//         wkid: 3857
//       }
//     },

//     attributes: {
//       objectid: retdelPromise.features[0].attributes.objectid
//     },
              
//     symbol: {
//       type: "simple-line",
//       color: [0, 0, 255],
//       width: 2,
//       style: "dash"
//     }
//   })
//   let delobjectidList = [];
//   delgLayer.graphics.add(newDelGraphic);
//   for(let id in delgLayer.graphics.items)
//     if(delgLayer.graphics.items[id].attributes !== null){
//       delobjectidList.push(delgLayer.graphics.items[id].attributes.objectid)
//     }
//     featLayer.definitionExpression = `OBJECTID not in (${delobjectidList}) and cnty_nm = '${roadInfo.getcntyName}'`
//     console.log(delgLayer)
// }

// export async function getM(){
//   let mPromise = new Promise(function(res){
//   view.on('click', function(evt){
//     let opts = {include: gLayer}
//     view.hitTest(evt, opts).then(function(response){
//       console.log(response)
//     })
//   })
//   })

// }
