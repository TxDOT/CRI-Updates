import { criConstants } from '../../common/cri_constants';

import MapView from '@arcgis/core/views/MapView';
import Map from '@arcgis/core/Map';
import Sketch from "@arcgis/core/widgets/Sketch";
import SketchViewModel from "@arcgis/core/widgets/Sketch/SketchViewModel";
import GraphicsLayer from "@arcgis/core/layers/GraphicsLayer";
//import Graphic from "@arcgis/core/Graphic";
import FeatureLayer from "@arcgis/core/layers/FeatureLayer";
import * as watchUtils from "@arcgis/core/core/watchUtils";
// import * as geometryEngine from "@arcgis/core/geometry/geometryEngine";
//import SnappingOptions from "@arcgis/core/views/interactive/snapping/SnappingOptions";

export const gLayer = new GraphicsLayer();
export const delgLayer = new GraphicsLayer();
export const rdbdAssetPt = new GraphicsLayer();
export const rdbdAssetLine = new GraphicsLayer();

export const map = new Map({
    basemap: criConstants.basemap,
    layers: [rdbdAssetLine,rdbdAssetPt,gLayer]
});

export const view = new MapView({
    container: 'viewDiv',
    map: map,
    zoom: 9,
    highlightOptions: {
        color: "orange"
    },
    constraints: {
        rotationEnabled: false,
        snapToZoom: false

      }
});

export const featLayer = new FeatureLayer({
    url: criConstants.refernceLayer,
    opacity: 0,
    editingEnabled: true,
    geometryTypeRd: criConstants.geomType,
    //definitionExpression: "CNTY_NM= 'Travis'",
    returnM: true,
    returnZ: true,
    hasM: true,
    visible: false,
    renderer:{
        type: "simple",
        symbol:{
            type: "simple-line",
            color:[0,127,255]
        }
    }
  });

const paved = {
    type: "simple-line",
    color: "#FFBF00",
    width: "1.5px",
    style: "solid"
};
const brick = {
    type: "simple-line",
    color: "#FF9966",
    width: "1px",
    style: "solid"
};
const dirtNatural = {
    type: "simple-line",
    color: "#7B3F00",
    width: "1px",
    style: "solid"
};
const gravel = {
    type: "simple-line",
    color: "#89CFF0",
    width: "1.5px",
    style: "solid"
};
const concrete = {
    type: "simple-line",
    color: "#FFA700",
    width: "1px",
    style: "solid"
};

const rdbdTypeRendere = {
    type: "unique-value",
    field: "surface",
    uniqueValueInfos:[
        {
            value: 10,
            symbol: paved,
            label: "Paved"
        },
        {
            value: 11,
            symbol: brick,
            label: "Brick"
        },
        {
            value: 12,
            symbol: dirtNatural,
            label: "Dirt/Natural"
        },
        {
            value: 13,
            symbol: gravel,
            label: "Gravel"
        },
        {
            value: 2,
            symbol: concrete,
            label: "Concrete"
        },

    ]
}

export const rdbdSrfcGeom = new FeatureLayer({
    url: criConstants.portalUrl,
    renderer: rdbdTypeRendere
}) 
export const rdbdSrfcAsst = new FeatureLayer({
    url: criConstants.assetLyrRdbSrf
})
export const rdbdDsgnAsst = new FeatureLayer({
    url: criConstants.assetLyrRdbDsgn
})
export const rdbdNameAsst = new FeatureLayer({
    url: criConstants.assetLyrRdbName
})
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

export const sketch = new Sketch({
    view: view,
    layer: [gLayer],
    viewModel: new SketchViewModel({
        view: view,
        layer: gLayer,
        polylineSymbol: {
          type: "simple-line",
          color: [127, 255, 212	],
          width: 2,
          style: "dash"
        }
    }),
});

export const sketchPoint = new Sketch({
    view: view,
    viewModel: new SketchViewModel({
        layer: delgLayer,
        view: view
    }),
    snappingOptions: {
        enabled: true,
        featureSources: [{ layer: gLayer, enabled: true, featureEnabled: true }],
        distance: 20
    }
   
});

  //add portal service to map
watchUtils.whenOnce(view,"ready").then(
    map.addMany([rdbdSrfcGeom,featLayer,txCounties])
);
function stopEvtPropagation(event) {
    event.stopPropagation();
}
//TODO - disable graphics from drag, resize, flip, keyboard shortcuts
view.on('double-click', stopEvtPropagation)
view.ui.remove("zoom")  


/**
 * Assigns the container element to the View
 * @param container
*/
export const initialize = (container) => {
    view.container = container;
    view.when()
        .then(() => {

            console.log('Map and View are ready');
        })
        .catch(error => {
            console.warn('An error in creating the map occurred:', error);
        });
};
