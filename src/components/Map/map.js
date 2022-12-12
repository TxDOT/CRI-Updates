import { criConstants } from '../../common/cri_constants';
import MapView from '@arcgis/core/views/MapView';
import Map from '@arcgis/core/Map';
import SketchViewModel from "@arcgis/core/widgets/Sketch/SketchViewModel";
import GraphicsLayer from "@arcgis/core/layers/GraphicsLayer";
import FeatureLayer from "@arcgis/core/layers/FeatureLayer";
import * as watchUtils from "@arcgis/core/core/watchUtils";
import VectorTileLayer from "@arcgis/core/layers/VectorTileLayer";
import WMTSLayer from "@arcgis/core/layers/WMTSLayer";
import Basemap from "@arcgis/core/Basemap";
import BasemapToggle from "@arcgis/core/widgets/BasemapToggle";
import Viewpoint from "@arcgis/core/Viewpoint";
import Home from "@arcgis/core/widgets/Home";
import Zoom from "@arcgis/core/widgets/Zoom";
import ScaleBar from "@arcgis/core/widgets/ScaleBar";
import CoordinateVM from "@arcgis/core/widgets/CoordinateConversion/CoordinateConversionViewModel";
import Search from "@arcgis/core/widgets/Search";
import Expand from "@arcgis/core/widgets/Expand";
export const gLayer = new GraphicsLayer();
export const delgLayer = new GraphicsLayer();
export const rdbdAssetPt = new GraphicsLayer();
export const rdbdAssetLine = new GraphicsLayer();

const txdotVectorTiles = new VectorTileLayer({
    url: "https://tiles.arcgis.com/tiles/KTcxiTD9dsQw4r7Z/arcgis/rest/services/TxDOT_Vector_Tile_Basemap/VectorTileServer",
    id: "txdot"
});

// ADD GOOGLE IMAGERY WMTS LAYER
const imagery = new WMTSLayer({
    url: "https://txgi.tnris.org/login/path/right-address-virus-dilemma/wmts",
    serviceMode: "KVP",
    id: "imagery"
});
//add vector tile basemap
const vTBasemap = new Basemap({
    baseLayers: txdotVectorTiles
});
//add imagery as basemap
const imgBasemap = new Basemap({
    baseLayers: imagery
});
//map constructor 
export const map = new Map({
    basemap: vTBasemap,
    layers: [rdbdAssetLine,rdbdAssetPt,gLayer]
});
//mapview constructor
export const view = new MapView({
    container: 'viewDiv',
    map: map,
    zoom: 2,
    highlightOptions: {
        color: "orange"
    },
    constraints: {
        rotationEnabled: false,
        snapToZoom: false

      }
});

// ESRI UI WIDGETS
export const basemapToggle = new BasemapToggle({
    view: view,
    nextBasemap: imgBasemap
});
//expand legend button
export const expandLegend = new Expand({
    view: view,
    expandIconClass: "esri-icon-legend"
})

export const viewPoint = new Viewpoint();
//home button
export const home = new Home({
    view: view,
});
//zoom buttons
const zoom = new Zoom({
    view: view
});
//scalebar widget
const scaleBar = new ScaleBar({
    view: view,
    id: 'scalebar'
});
//coordinate widget
export const ccWidget = new CoordinateVM({
    view: view
});
// SEARCH WIDGET
export const search = new Search({
    // UNCOMMENT TO CONSTRUCT SEARCH IN NAVBAR
    // container: "searchWidgetDiv",
    view: view,
    allPlaceholder: "County Road Name...",
    includeDefaultSources: false,
    sources: []
});



// PUSH SOURCES TO SEARCH WIDGET
search.sources.push({
    layer: new FeatureLayer({
        url: criConstants.refernceLayer,
    }),
    searchFields: ["SRCH_SHORT", "SRCH_LONG"],
    displayField: "SRCH_SHORT",
    exactMatch: false,
    autoSelect: true,
    outFields: ["*"],
    name: "County Road",
    placeholder: "Ex: Smith Road",
    maxResults: 12,
    maxSuggestions: 12,
    suggestionsEnabled: true,
    minCharacters: 0,
    popupEnabled: false,
    popupOpenOnSelect: false,
    resultSymbol: {
        type: "simple-line",
        color: "cyan",
        width: "6px",
    }
});
// ADD AND POSITION WIDGETS IN THE MAPVIEW
view.ui.remove("attribution");
view.ui.empty("top-left");
view.ui.add([
  {
    component: home,
    position: "top-right",
    index: 3
  }, 
  {
    component: zoom,
    position: "top-right",
    index: 2
  },
  {
    component: expandLegend,
    position: "top-right",
    index: 4
  },
  {
    component: basemapToggle,
    position: "top-right"
  },
  {
    component: scaleBar,
    position: "manual"
  },
  {
    component: search,
    position: "top-right",
    index: 0
  },
]);

//referenceLayer feature Layer
export const featLayer = new FeatureLayer({
    url: criConstants.refernceLayer,
    opacity: 1,
    editingEnabled: true,
    returnM: true,
    returnZ: true,
    hasM: true,
    visible: true,
    renderer:{
        type: "simple",
        symbol:{
            type: "simple-line",
            color:[0,127,255]
        }
    }
  });
//all other roadbeds that need to be snappable. i.e Highways
export const snapLayer = new FeatureLayer({
    url: criConstants.snapLayer,
    definitionExpression: "RTE_PRFX NOT IN ('CR')",
    visible: false
});
//roadSurface Feature layer
export const rdbdSrfcAsst = new FeatureLayer({
    url: criConstants.assetLyrRdbSrf
})
//roadDesign Feature Layer
export const rdbdDsgnAsst = new FeatureLayer({
    url: criConstants.assetLyrRdbDsgn
})
//roadLane Feature Layer
export const rdbdLaneAsst = new FeatureLayer({
    url: criConstants.assetLyrRdbLane
})
//edits Layer Feature Layer
export const editsLayer = new FeatureLayer({
    url: criConstants.editsLayer,
})
export const advanceLayer = new FeatureLayer({
    url: criConstants.advanceUploadLayer
})
//county polyhon feature Layer
export const txCounties = new FeatureLayer({
    url: criConstants.txCounties,
    //definitionExpression: "CNTY_NM= 'Travis'"
    //effect: "blur(8px) brightness(1.2) grayscale(0.8)"
})
//county information feature layer
export const countyOfficialInfo = new FeatureLayer({
    url: 'https://services.arcgis.com/KTcxiTD9dsQw4r7Z/ArcGIS/rest/services/CRI_CNTY_INFO/FeatureServer/0'
})
//sketch model used when modifying a new road.
export const sketch = new SketchViewModel({
    view: view,
    layer: gLayer,
    updateOnGraphicClick: true,
    defaultCreateOptions:{
        mode:"click",
        hasZ: false
    },
    defaultUpdateOptions:{
        tool:"reshape",
        toggleToolOnClick: false,
        enableRotation: false,
        enableScaling: false,
        multipleSelectionEnabled: false,
        reshapeOptions:{
            shapeOperation:"none"
        }
    },
    snappingOptions:{
        enabled: true,
        featureSources:[{ layer: gLayer, enabled: true, featureEnabled: true}, { layer: featLayer, enabled: true, featureEnabled: true }, { layer: snapLayer, enabled: true, featureEnabled: true }],
        selfEnabled: false
    }
});
//set color of line when sketch state is active. i.e Orange
sketch.polylineSymbol.color = {
    r: 204,
    g: 102,
    b: 0,
    a: 1
}
//sketch model for asset ending points
export const sketchPoint = new SketchViewModel({
    view: view,
    layer: delgLayer,
    defaultCreateOptions:{
        mode:"click"
    },
    snappingOptions: {
        enabled: true,
        featureSources: [{ layer: gLayer, enabled: true, featureEnabled: true },{ layer: rdbdAssetPt, enabled: true, featureEnabled: true }]
    }
});

//watching the view until the state is set to Ready. Then stepper is set to close and add in featLayer and countyPolygons.
watchUtils.whenOnce(view,"ready").then(()=>{
    document.getElementById('stepper').style.width = '0px'
    map.addMany([featLayer,txCounties])
});

//prevent users from double clicking
view.on('double-click', (event)=>{
    event.stopPropagation();
});

view.ui.remove("zoom")  

// view.watch('viewpoint', (curr)=>{
//     if(curr.scale > 326328){
//         sketch.on('update'||'create', (event)=>{
//             event.stopPropagation()
//         })
//         return;
//     } 
//     console.log(curr.scale)
// })
/**
 * Assigns the container element to the View
 * @param container
*/
//
export const initialize = (container) => {
    view.container = container;
    watchUtils.whenOnce(view,"ready")
        .then(() => {
            console.log('Map and View are ready');
        })
        .catch(error => {
            console.warn('An error in creating the map occurred:', error);
        });
};
