import { criConstants } from '../../common/cri_constants';
//import {hightlightFeat} from '../Map/editFunc
import MapView from '@arcgis/core/views/MapView';
import Map from '@arcgis/core/Map';
// import Sketch from "@arcgis/core/widgets/Sketch";
import SketchViewModel from "@arcgis/core/widgets/Sketch/SketchViewModel";
import GraphicsLayer from "@arcgis/core/layers/GraphicsLayer";
//import Graphic from "@arcgis/core/Graphic";
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
//import CoordinateConversion from "@arcgis/core/widgets/CoordinateConversion";
import Search from "@arcgis/core/widgets/Search";
//import {store} from '../../storeUpd'
// import * as geometryEngine from "@arcgis/core/geometry/geometryEngine";
//import SnappingOptions from "@arcgis/core/views/interactive/snapping/SnappingOptions";
export const gLayer = new GraphicsLayer();
export const delgLayer = new GraphicsLayer();
export const rdbdAssetPt = new GraphicsLayer();
export const rdbdAssetLine = new GraphicsLayer();
export const testGraphic = new GraphicsLayer();

const txdotVectorTiles = new VectorTileLayer({
    url: "https://tiles.arcgis.com/tiles/KTcxiTD9dsQw4r7Z/arcgis/rest/services/TxDOT_Vector_Tile_Basemap/VectorTileServer",
    id: "txdot"
});

// ADD GOOGLE IMAGERY WMTS LAYER
const imagery = new WMTSLayer({
    url: "https://txgi.tnris.org/login/path/corner-express-popcorn-compact/wmts",
    serviceMode: "KVP",
    id: "imagery"
});

const vTBasemap = new Basemap({
    baseLayers: txdotVectorTiles
});

const imgBasemap = new Basemap({
    baseLayers: imagery
});

export const map = new Map({
    basemap: vTBasemap,
    layers: [rdbdAssetLine,rdbdAssetPt,gLayer, testGraphic]
});

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

export const viewPoint = new Viewpoint();

export const home = new Home({
    view: view,
});

const zoom = new Zoom({
    view: view
});

const scaleBar = new ScaleBar({
    view: view
});

// const ccWidget = new CoordinateConversion({
//     view: view
// });

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
        url: "https://services.arcgis.com/KTcxiTD9dsQw4r7Z/arcgis/rest/services/CRI_REF_LAYERS_dev/FeatureServer/0",
        //definitionExpression: "CNTY_NBR = 11"//need to set dynamically using vuex store
    }),
    searchFields: ["ST_DEFN_NM"],
    displayField: "ST_DEFN_NM",
    exactMatch: false,
    autoSelect: true,
    outFields: ["*"],
    name: "County Road",
    placeholder: "Ex: Smith Road",//need to set dynamically using vuex store
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
    component: basemapToggle,
    position: "top-right"
  },
  {
    component: scaleBar,
    position: "bottom-right"
  },
//   {
//     component: ccWidget,
//     position: "bottom-left"   
//   },
  {
    component: search,
    position: "top-right",
    index: 0
  },
]);

export const featLayer = new FeatureLayer({
    url: criConstants.refernceLayer,
    opacity: 1,
    editingEnabled: true,
    //geometryTypeRd: criConstants.geomType,
    //definitionExpression: "CNTY_NM= 'Travis'",
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

// const paved = {
//     type: "simple-line",
//     color: "#FFBF00",
//     width: "1.5px",
//     style: "solid"
// };
// const brick = {
//     type: "simple-line",
//     color: "#FF9966",
//     width: "1px",
//     style: "solid"
// };
// const dirtNatural = {
//     type: "simple-line",
//     color: "#7B3F00",
//     width: "1px",
//     style: "solid"
// };
// const gravel = {
//     type: "simple-line",
//     color: "#89CFF0",
//     width: "1.5px",
//     style: "solid"
// };
// const concrete = {
//     type: "simple-line",
//     color: "#FFA700",
//     width: "1px",
//     style: "solid"
// };

// const rdbdTypeRendere = {
//     type: "unique-value",
//     field: "SURFACE",
//     uniqueValueInfos:[
//         {
//             value: 10,
//             symbol: paved,
//             label: "Paved"
//         },
//         {
//             value: 11,
//             symbol: brick,
//             label: "Brick"
//         },
//         {
//             value: 12,
//             symbol: dirtNatural,
//             label: "Dirt/Natural"
//         },
//         {
//             value: 13,
//             symbol: gravel,
//             label: "Gravel"
//         },
//         {
//             value: 2,
//             symbol: concrete,
//             label: "Concrete"
//         },

//     ]
// }

// export const rdbdSrfcGeom = new FeatureLayer({
//     url: criConstants.portalUrl,
//     renderer: rdbdTypeRendere
// }) 
export const rdbdSrfcAsst = new FeatureLayer({
    url: criConstants.assetLyrRdbSrf
})
export const rdbdDsgnAsst = new FeatureLayer({
    url: criConstants.assetLyrRdbDsgn
})
// export const rdbdNameAsst = new FeatureLayer({
//     url: criConstants.assetLyrRdbName
// })
export const rdbdLaneAsst = new FeatureLayer({
    url: criConstants.assetLyrRdbLane
})
export const editsLayer = new FeatureLayer({
    url: criConstants.editsLayer
})
export const txCounties = new FeatureLayer({
    url: criConstants.txCounties,
    //definitionExpression: "CNTY_NM= 'Travis'"
    //effect: "blur(8px) brightness(1.2) grayscale(0.8)"
})

export const countyOfficialInfo = new FeatureLayer({
    url: 'https://services.arcgis.com/KTcxiTD9dsQw4r7Z/arcgis/rest/services/CRI_County_Info_Test/FeatureServer/0'
})

// export const sketch = new Sketch({
//     view: view,
//     layer: [gLayer],
//     viewModel: new SketchViewModel({
//         view: view,
//         layer: gLayer,
//     }),

// });

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
        featureSources:[{ layer: gLayer, enabled: true, featureEnabled: true}, { layer: featLayer, enabled: true, featureEnabled: true }],
        selfEnabled: false
    }
});


// export const newSketch = new Sketch({
//     view: view,
//     layer: [addRdbd],
//     viewModel: new SketchViewModel({
//         view: view,
//         layer: addRdbd,
//         polylineSymbol: {
//           type: "simple-line",
//           color: [127, 255, 212	],
//           width: 2,
//           style: "dash"
//         },
//     }),
// });
// newSketch.id = "newSketch"
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
// export const sketchPoint = new Sketch({
//     view: view,
//     viewModel: new SketchViewModel({
//         layer: delgLayer,
//         view: view
//     }),
//     snappingOptions: {
//         enabled: true,
//         featureSources: [{ layer: gLayer, enabled: true, featureEnabled: true }],
//         distance: 20
//     }
   
//});

// view.when(() => { 
//     console.log('one')
//     sketch.on(['update'], getNewLength)
// });
  //add portal service to map
watchUtils.whenOnce(view,"ready").then(()=>{
    document.getElementById('stepper').style.width = '0px'
    map.addMany([featLayer,txCounties])
});

// function pauseHoverPropagation(){
//     setTimeout(1000)
// }
//TODO - disable graphics from drag, resize, flip, keyboard shortcuts
view.on('double-click', (event)=>{
    event.stopPropagation();
});

// view.on('resize', (event)=>{
//     event.stopPropagation();
// })
// view.on('drag', (event)=>{
//     event.stopPropagation();
// })
//view.on("pointer-move", pauseHoverPropagation)
view.ui.remove("zoom")  


/**
 * Assigns the container element to the View
 * @param container
*/
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
