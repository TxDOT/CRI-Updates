import FeatureLayer from "@arcgis/core/layers/FeatureLayer";
import { criConstants } from "../common/cri_constants";

export const criUrlRead = new FeatureLayer({
    url: criConstants.criUrl
})



async function getUrls(){
    let urls = await criUrlRead.queryFeatures()
    let urlObj = urls.features
    return {
        REF_LAYER_URL: urlObj.find(x => x.attributes.NAME === "REF_LAYER").attributes.URL,
        EDIT_LAYER_URL: urlObj.find(x => x.attributes.NAME === "EDIT_LAYER").attributes.URL,
        RDBD_SRFC_URL: urlObj.find(x => x.attributes.NAME === "RDBD_SRFC").attributes.URL,
        RDBD_DESGN_URL: urlObj.find(x => x.attributes.NAME === "RDBD_DESGN").attributes.URL,
        SNAP_LAYER_URL: urlObj.find(x => x.attributes.NAME === "SNAP_LAYER").attributes.URL,
        RDBD_LANE_URL: urlObj.find(x => x.attributes.NAME === "RDBD_LANE").attributes.URL,
        ADVC_UPLD_URL: urlObj.find(x => x.attributes.NAME === "ADVC_UPLD").attributes.URL,
        TX_CNTY_URL: urlObj.find(x => x.attributes.NAME === "TX_CNTY").attributes.URL,
        JDGE_INFO_URL: urlObj.find(x => x.attributes.NAME === "JDGE_INFO").attributes.URL,
        DEL_DOC_URL: urlObj.find(x => x.attributes.NAME === "DEL_DOC").attributes.URL
    }
}

export let appURL = getUrls()

