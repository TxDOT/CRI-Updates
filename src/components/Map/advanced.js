// import methods and functions into file
import { clientSideGeoJson} from './map'
import {createEpoch} from '../Map/helper'
import { criConstants } from '../../common/cri_constants';
import {store} from '../../store'
import Query from "@arcgis/core/rest/support/Query";
import { addFeat } from './crud';
import { reloadEdits } from './login';

//downlaod road log csv
export async function downloadRdLog(){
    const featQuery = new Query();
    featQuery.where = `CNTY_TYPE_NM = '${store.getters.getCntyName}'`
    featQuery.outFields = [ "*" ]
  
    let countyQuery = await clientSideGeoJson.queryFeatures(featQuery)
   
    await bulkAssetReturn(countyQuery)
}

// split up query into chunks for processing
async function bulkAssetReturn(countyQuery){
    //get length
    //base 5000, splice every 5000
    let incre = 1000
    let iStart = 0 //initialStart
    let eStart = 1000 //endStart

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
        assetQuery.num = 20000
        assetQuery.orderByFields = ["RDBD_GMTRY_LN_ID"]
        assetQuery.outFields = [ "*" ]
        //console.log(assetQuery)
        //console.log(roadSrfc)
        //console.log(roadSrfc.features.find(x => x.attributes.RDBD_GMTRY_LN_ID === 52681))
        // roadSrfc.features.forEach((x)=>{
        //     let rdSrfc = criConstants.surface.find(({num}) => num === x.attributes.SRFC_TYPE_ID)
            
        //     let srfcObj = {
        //         rdbdId: x.attributes.RDBD_GMTRY_LN_ID,
        //         srfcType: rdSrfc.name,
        //         begin: x.attributes.ASSET_LN_BEGIN_DFO_MS,
        //         end: x.attributes.ASSET_LN_END_DFO_MS
        //     }
        //     srfcAsset.push(srfcObj)
        //     })

        // roadDsgn.features.forEach((x)=>{
        //     let dsgnObj = {
        //         rdbdId: x.attributes.RDBD_GMTRY_LN_ID,
        //         srfcType: x.attributes.RDWAY_DSGN_TYPE_DSCR,
        //         begin: x.attributes.ASSET_LN_BEGIN_DFO_MS,
        //         end: x.attributes.ASSET_LN_END_DFO_MS
        //     }
        //     dsgnAsset.push(dsgnObj)
        // })

        // roadLane.features.forEach((x)=>{
        //     let laneObj = {
        //         rdbdId: x.attributes.RDBD_GMTRY_LN_ID,
        //         srfcType: x.attributes.NBR_THRU_LANE_CNT,
        //         begin: x.attributes.ASSET_LN_BEGIN_DFO_MS,
        //         end: x.attributes.ASSET_LN_END_DFO_MS
        //     }
        //     laneAsset.push(laneObj)
        // })

        iStart += incre
        eStart += incre
    }
    
    await surfaceAsset(useInfo)
}

// create fields for CSV file
async function surfaceAsset(cntyQ){
    let dataHolder = []
    //here
    let surfacePromise = new Promise(()=>{
        for(let x=0; x < cntyQ.length; x++){
            dataHolder.push({
                "Road Name" : cntyQ[x].roadN, 
                "Route ID" : cntyQ[x].routeId,
                "Length" : cntyQ[x].len,
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
    return fileName
    // createFeatures(fileName)
}

// create feature collection from shapfile via generate method of REST API

// async function createFeatures(file){
//     let fileParams = {
//         name: file,
//         targetSR: view.spatialReference,
//         maxRecordCount: 4000,
//         enforceInputFileSizeLimit: true,
//         enforceOutputJsonSizeLimit: true,
//         generalize: false,
//         maxAllowableOffset: 10,
//         reducePrecision: false,
//         numberOfDigitsAfterDecimal: 5
//     }

//     let content = {
//         filetype: "shapefile",
//         publishParameters: JSON.stringify(fileParams),
//         f: "json"
//     }

//     const convShpToGraphic = esriRequest("https://www.arcgis.com/sharing/rest/content/features/generate",{
//         query: content,
//         body: document.getElementById('output'),
//         responseType: "json",
//         method: "post"
//     })
//     convShpToGraphic
//         .then((res)=>{
//             console.log(res)
//             processUpload(res)
//         })
//         .catch((fail)=>{
//             uploadFail([fail])
//         })
// }

// failure message
export function uploadFail(message){
    document.getElementById('progress').style.display = 'none'
    document.getElementById('text').style.display = "block"
    document.getElementById('output').style.border = '2px solid red'
    document.getElementById('output').style.width = '27rem'
    document.getElementById('text').innerText = `Error! You have validation errors:`
    
    let bulletList = document.createElement('ul')
    document.getElementById('text').appendChild(bulletList)
    message.forEach((x) => {
        let li = document.createElement('li')
        li.appendChild(document.createTextNode(x.message))
        li.style.textAlign= 'left'
        bulletList.appendChild(li)
    })
    document.getElementById('text').style.bottom = '3rem'
    document.getElementById('text').style.color = 'red'
    document.getElementById('text').style.left = '.5rem'
}

// successful upload message
export async function uploadPass(message, upldData){
    document.getElementById('progress').style.display = 'none'
    document.getElementById('text').style.display = "block"
    document.getElementById('output').style.border = '2px solid green'
    document.getElementById('output').style.width = '27rem'
    document.getElementById('text').innerText = `Succesfully uploaded your shapefile! ${message}`
    document.getElementById('text').style.color = 'green'
    store.commit('setIsDragDrop', false)//update
    store.commit('setServerCheck', true) //update
    let taskid = await upldToAdvceFeatLyr(upldData)
    serverResponse(taskid)//update
}

// initial QA/QC check for file upload
export async function processUpload(upload){
    //populate store with array with upload attribute values.
    let uploadSchemaCheck = await uploadChecks(upload.data.featureCollection.layers[0], criConstants.txdotSchema)
    store.commit('setIsMapAttr', true)
    //submitListAttr(upload.data.featureCollection.layers[0])
    let uploadSchemaCheckResp = uploadSchemaCheck.filter(item => item.valueFail === true)
    uploadSchemaCheckResp.length > 0 ? uploadFail(uploadSchemaCheckResp) : uploadPass('File Passed.',upload.data.featureCollection.layers[0].featureSet.features)
    return;
}

//check uplaod for geometry issues
async function uploadGeometryCheck(featSet, validali){
    let valiArr = validali
    let geometryPromise = new Promise((res)=>{
        if(featSet.layerDefinition.geometryType !== 'esriGeometryPolyline'){
            valiArr.push({valueFail: true, message:'Other Geometries other than polylines are in your file.\nRevise and re-submit.'})
            res(valiArr)
            return;
        }
        valiArr.push({'valueFail': false})
        res(valiArr)
    })
    return await geometryPromise
}

// make sure required fields are present and have values
async function uploadValueCheck(feat, validali){
    let validArr = validali
    let valueCheckPromise = new Promise((res)=>{
        let editTypeMessage = "An incorrect edit type value has been found.\nPlease make sure values are either Add, Edit or Delete. Re-submit"
        let lengthMessage = "Empty or Null fields have been detected.\nReview required fields [EDIT_TYPE, bh ROAD_TYPE, ROAD_NM] have a value and re-submit"
        let isCheckLength = [];
        let editTypeMsg = [];
        for(let i=0; i < feat.featureSet.features.length; i++){
            let item = Object.entries(feat.featureSet.features[i].attributes)
            let ah = item.filter((x)=> {
                if(criConstants.txdotRequired.includes(x[0])){
                    let rdbInfo = x[0] === 'ROAD_NM' ? x[1].toString().replace(/\s/g, "").length === 0 : x[1] === 0
                    return rdbInfo === true
                }
            })
            ah.length ? isCheckLength.push(ah) : null

            item.filter((x)=>{
                if(x[0] === 'EDIT_TYPE'){
                    let removeWhiteSpace = x[1]
                    removeWhiteSpace === 5 || removeWhiteSpace === 1 || removeWhiteSpace === 4 ? null : editTypeMsg.push({valueFail: true, message: editTypeMessage})
                    return;
                }
            })
            
        }
        isCheckLength.length ? validArr.push({valueFail: true, message: lengthMessage}) : ''
        editTypeMsg.length ? validArr.push({valueFail: true, message: editTypeMessage}) : ''
        res(validArr)
        let geometryReturn = uploadGeometryCheck(feat, validali)
        res(geometryReturn)
    }) 
    return await valueCheckPromise
}

//check schema for uplaod Packet
async function uploadChecks(schemaFields, txdotSchema){
    let schemaPromise = new Promise((res)=>{
        let validali = []
        let completeAttName = []
        let pass = 0
        let fail = 0
        schemaFields.layerDefinition.fields.forEach((x) => completeAttName.push(x.name))
        for(let i=0; i < txdotSchema.length; i++){
            let testField = completeAttName.includes(txdotSchema[i])
            testField === true ? pass++ : fail++
        }
        if(fail > 0){
            validali.push({valueFail: true, message: "Schema Failed. Check Shapefile matches TxDOT Schema"})
        }
        // else{
        let returnValue = uploadValueCheck(schemaFields, validali)
        res(returnValue)
        // }
    })
    return await schemaPromise
}

function serverResponse(submitid){
    store.commit('setIsFmeProcess', [true, ""])
    // --Current -- let dataReturn = await fetch(`https://gis-batch-dnd.txdot.gov/fmejobsubmitter/TPP-MB/CRI_QAQC_dev.fmw?SUBMIT_ID=${submitid}&EMAIL=${store.getters.getUserEmail}&USERNAME=${store.getters.getUserName}&opt_showresult=false&opt_servicemode=sync`, {headers:{'Authorization':'fmetoken token=ef92b878734df046a715c1e39d46cb40f1f321fd', 'Content-Type': 'text/plain', 'Access-Control-Allow-Private-Network': true}})
    //https://gis-batch-dev.txdot.gov/fmejobsubmitter/TPP/CRI_QAQC_dev_CORS.fmw?SUBMIT_ID=${submitid}&USERNAME=${store.getters.getUserName}&EMAIL=${store.getters.getUserEmail}&opt_showresult=false&opt_servicemode=sync
    let dataReturn = fetch(`https://testportal.txdot.gov/fmejobsubmitter/TPP/TPP_DEV_CRI_QAQC_AssetsRemove.fmw?SUBMIT_ID=${submitid}&USERNAME=${store.getters.getUserName}&EMAIL=${store.getters.getUserEmail}&opt_showresult=false&opt_servicemode=sync`, {headers:{'Authorization':'fmetoken token=8a1e669e82e32009a2fa81e757261b1dee1aa597', 'Content-Type': 'text/plain'}})
    dataReturn
        .then(() =>{
            store.commit('setIsFmeProcess', [false, "success"])
            reloadEdits()
        })
        .catch(() =>{
            store.commit('setIsFmeProcess', [false, "timeout"])
            console.log('error')
            return
            
        })
    
    // document.getElementById('fmeResp').innerText = `${text}`//update

    //store.commit('setServerCheck', false)
    // setTimeout(()=>{
    //     reloadEdits()
    //     store.commit('setServerCheck', false)
    // },5000)
}//update

//upload attributes to advanced layer
async function upldToAdvceFeatLyr(upldFile){
    let epoch = createEpoch()
    let itemSubmitId = `${store.getters.getCntyNmbr}-${epoch}`

    for(let fi=0; fi < upldFile.length; fi++){
        upldFile[fi].attributes.SUBMIT_ID = itemSubmitId
        upldFile[fi].geometry.type = "polyline"
        await addFeat(upldFile[fi], true)
    }
    return itemSubmitId
}

////////delete/////////////
export function getTime(){
    let currentDate = new Date();
    let ampm = currentDate.getHours() >= 12 ? 'pm' : 'am'
    let hours = ampm === 'am' ? currentDate.getHours() : currentDate.getHours()-12
    let time = `${hours}:${currentDate.getMinutes()}:${currentDate.getSeconds()} ${ampm}`;

    let year = currentDate.getFullYear().toString()
    let month = (currentDate.getMonth()+1).toString()
    let day = currentDate.getDate().toString()
    let timestamp = `${month}/${day}/${year}`

    return [time, timestamp]
}