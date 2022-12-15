import { editsLayer, advanceLayer } from './map';
import {store} from '../../store'
import Graphic from "@arcgis/core/Graphic";
import { criConstants } from '../../common/cri_constants';

//import editsLayer from map
//grab all items in the editsLayer that is in county; editsLayer has the definition expression
export async function queryEditsLayer(){
    editsLayer.definitionExpression = `CNTY_TYPE_NBR = ${Number(store.getters.getCntyNmbr)}`
    let currentItemsSubmitted = editsLayer.queryFeatures()
    return currentItemsSubmitted
}

//setup function that receives edited graphic and checks to see if currently has been edited
//if not already in editsLayer then it will be added; else it will be updated
export function initGraphicCheck(editId, isRemove){
    console.log(editId)
    let returnQuery = queryEditsLayer();
    //create and map to new graphic available assets about road
    let lineObj = new Graphic({
        attributes:
        {
            OBJECTID: store.getters.getObjectid,
            OBJECTID_1: null,
            EDIT_ID: null,
            TASK_ID: null,
            EDIT_TYPE_ID: criConstants.editType[`${editId.attributes.editType}`.toLowerCase()][2],
            EDIT_STATUS_ID: null,
            GID: editId.attributes.gid,
            RDWAY_STAT_TYPE_ID: null,
            RTE_DEFN_LN_NM: null,
            RTE_ID: null,	
            RTE_DEF_TYPE_ID:null,	
            RTE_PRFX_TYPE_ID: 1,	
            RDBD_TYPE_ID: 5,	
            RTE_NBR: null,	
            RTE_SFX_TYPE_ID: null,	
            CRDNL_DRCT_TYPE_ID:null,	
            CNTY_TYPE_NBR: store.getters.getCntyNmbr,	
            RTE_DEFN_LN_BEGIN_DFO_MS: editId.geometry.paths[0][0][2],	
            RTE_DEFN_LN_END_DFO_MS: editId.geometry.paths[0].at(-1)[2],	
            RTE_DEFN_LN_MS:null,	
            ASSET_ST_DEFN_NM: editId.attributes.roadbedName,	
            ASSET_SRFC_TYPE_DSCR: editId.attributes.roadbedSurface,	
            ASSET_NBR_THRU_LANE_CNT: editId.attributes.numLane,	
            ASSET_RDWAY_DSGN_TYPE_DSCR: editId.attributes.roadbedDesign,	
            RTE_DEFN_LN_CREATE_USER_NM: editId.attributes.createNm,	
            RTE_DEFN_LN_CREATE_DT: editId.attributes.createDt,
            RTE_DEFN_LN_EDIT_USER_NM: null,	
            RTE_DEFN_LN_EDIT_DT: null,
            PREV_TASK_ID: null,	
            EDIT_NOTES: editId.attributes.comment
        },
        geometry: editId.geometry
    })
    //checks to determine if road has been touched or not
    returnQuery.then((result)=>{
        let isExist = result.features.filter((x) => x.attributes.OBJECTID === editId.attributes.objectid)
        if(isExist.length){
            //update
            const date = new Date();
            lineObj.attributes.RTE_DEFN_LN_EDIT_DT = date
            lineObj.attributes.RTE_DEFN_LN_EDIT_USER_NM = store.getters.getUserName
            lineObj.attributes.OBJECTID_1 = isExist[0].attributes.OBJECTID_1
            isRemove ? deleteFeat(lineObj) : updateFeat(lineObj)
        }
        else{
            //add
            isRemove ? null : addFeat(lineObj, false)
            
        }
    })
}

//for adding to edits Layer
export async function addFeat(editId, isAdvance){
    let layer = isAdvance === false ? editsLayer : advanceLayer
    let returnResp = layer.applyEdits({
        addFeatures: [editId]
    })

    let resp = await returnResp
    console.log(resp)
    return resp
    // .then(result => result)
    // .catch(err => console.log(err))
    //check to see if object objectid exists in featureClass
}

//for updating item in edits Layer
function updateFeat(editId){
    editsLayer.applyEdits({
        updateFeatures: [editId]
    })
    .then(result=>result)
    .catch(err => console.log(err))
}

//remove existing items from editsLayer
function deleteFeat(editId){
    editsLayer.applyEdits({
        deleteFeatures: [editId]
    })
    .then(result=>result)
    .catch(err => console.log(err))

}
