// import methods and functions into file
import { view, featLayer, rdbdSrfcAsst, rdbdDsgnAsst, rdbdLaneAsst } from './map'
import {createEpoch} from '../Map/helper'
import { criConstants } from '../../common/cri_constants';
import {store} from '../../store'
import Query from "@arcgis/core/rest/support/Query";
import esriRequest from "@arcgis/core/request";
import { addFeat } from './crud';

//downlaod road log csv
export async function downloadRdLog(){
    const featQuery = new Query();
    featQuery.where = `CNTY_TYPE_NM = '${store.getters.getCntyName}'`
    featQuery.outFields = [ "*" ]
  
    let countyQuery = await featLayer.queryFeatures(featQuery)
   
    await bulkAssetReturn(countyQuery)
}

// split up query into chunks for processing
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

// create fields for CSV file
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

// make the CSV file  
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

// handles upload of shapefile
export function retrieveFile(event){
    let name = event.target.value.toLowerCase().split('.')
    let fileName = name[0].replace('c:\\fakepath\\', '')
    createFeatures(fileName)
}

// create feature collection from shapfile via generate method of REST API
async function createFeatures(file){
    let fileParams = {
        name: file,
        targetSR: view.spatialReference,
        maxRecordCount: 4000,
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

// failure message
function uploadFail(message){
    document.getElementById('progress').style.display = 'none'
    document.getElementById('text').style.display = "block"
    document.getElementById('output').style.border = '2px solid red'
    document.getElementById('output').style.width = '27rem'
    document.getElementById('text').innerText = `Error! ${message}`
    document.getElementById('text').style.color = 'red'
}

// successful upload message
async function uploadPass(message, upldData){
    document.getElementById('progress').style.display = 'none'
    document.getElementById('text').style.display = "block"
    document.getElementById('output').style.border = '2px solid green'
    document.getElementById('output').style.width = '27rem'
    document.getElementById('text').innerText = `Succesfully uploaded your shapefile! ${message}`
    document.getElementById('text').style.color = 'green'
    store.commit('setIsDragDrop', false)//update
    store.commit('setServerCheck', true) //update
    console.log(`start time: ${getTime()}`)
    let taskid = await upldToAdvceFeatLyr(upldData)
    console.log(`end time: ${getTime()}`)
    serverResponse(taskid)//update
}

// initial QA/QC check for file upload
async function processUpload(upload){
    //populate store with array with upload attribute values. 
    let uploadSchemaCheck = await uploadChecks(upload.data.featureCollection.layers[0], criConstants.txdotSchema)
    store.commit('setIsMapAttr', true)
    //submitListAttr(upload.data.featureCollection.layers[0])
    uploadSchemaCheck.valueFail === true ? uploadFail(uploadSchemaCheck.message) : uploadPass('File Passed.',upload.data.featureCollection.layers[0].featureSet.features)

    return;
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

// make sure required fields are present and have values
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
            testField === true ? pass++ : fail++
        }
        if(fail > 0){
            res({valueFail: true, message: "Schema Failed. Check Shapefile matches TxDOT Schema"})
            return  ;
        }
        else{
            let returnValue = uploadValueCheck(schemaFields)
            res(returnValue)
        }
    })
    return await schemaPromise
}

async function serverResponse(taskid){
    console.log(`start FME time: ${getTime()}`)
    console.log(taskid)
    //let dataReturn = await fetch('https://gis-batch-dev.txdot.gov/fmedatastreaming/TPP/returnTestFile.fmw?', {headers:{'Authorization':'fmetoken token=7f4d809080c9161e0d5ea5708d5522a3fdd01119'},'Content-Type': 'text/plain'})
    //let dataReturn = await fetch('https://testportal.txdot.gov/fmejobsubmitter/TPP/returnTestFile.fmw?opt_showresult=false&opt_servicemode=sync', {headers:{'Authorization':'fmetoken token=b6aa89bdbe05b1ffaca36dc6562ae0770c71b9ab'},'Content-Type': 'text/plain'})
    let dataReturn = await fetch(`https://gis-batch-dev.txdot.gov/fmejobsubmitter/TPP/CRI_QAQC_dev.fmw?TASK_ID=${taskid}&opt_showresult=false&opt_servicemode=sync`, {headers:{'Authorization':'fmetoken token=58408fe1dba4b0b469faa9fa3ae0759426f8ad17'},'Content-Type': 'text/plain'})
    let text = await dataReturn.text()
    //console.log(text)
    document.getElementById('fmeResp').innerText = `FME Server says...${text}`//update
    console.log(`end FME time: ${getTime()}`)
    setTimeout(()=>{
      store.commit('setServerCheck', false)
    },5000)
}//update

//upload attributes to advanced layer
async function upldToAdvceFeatLyr(upldFile){
    let epoch = createEpoch()
    let itemTaskId = `${store.getters.getCntyNmbr}-${epoch}`

    for(let fi=0; fi < upldFile.length; fi++){
        upldFile[fi].attributes.TASK_ID = itemTaskId
        upldFile[fi].geometry.type = "polyline"
        await addFeat(upldFile[fi], true)
    }
    return itemTaskId
}

////////delete/////////////
function getTime(){
    let currentDate = new Date();
    let time = currentDate.getHours() + ":" + currentDate.getMinutes() + ":" + currentDate.getSeconds();
    return time
}