import Graphic from "@arcgis/core/Graphic";

export const criConstants = {
  
    portalUrl: "https://testportal.txdot.gov/sstestarcgis/rest/services/Hosted/cri_dev/FeatureServer/0",
    refernceLayer: "https://testportal.txdot.gov/sstestarcgis/rest/services/Hosted/CRI_Ref_Layers/FeatureServer/0",
    editsLayer: "https://testportal.txdot.gov/sstestarcgis/rest/services/Hosted/CRI_Edits/FeatureServer/0",
    assetLyrRdbSrf: "https://testportal.txdot.gov/sstestarcgis/rest/services/Hosted/CRI_Ref_Layers/FeatureServer/1",
    assetLyrRdbDsgn: "https://testportal.txdot.gov/sstestarcgis/rest/services/Hosted/CRI_Ref_Layers/FeatureServer/2",
    assetLyrRdbName: "https://testportal.txdot.gov/sstestarcgis/rest/services/Hosted/CRI_Ref_Layers/FeatureServer/3",
    assetLyrRdbLane: "https://testportal.txdot.gov/sstestarcgis/rest/services/Hosted/CRI_Ref_Layers/FeatureServer/4",
    txCounties: "https://services.arcgis.com/KTcxiTD9dsQw4r7Z/arcgis/rest/services/Texas_County_Boundaries/FeatureServer/0",
    geomTypeRd: "polyline",
    geomTypeCounty: "polygon",
    basemap: "topo-vector",
    zoomLevel: 9,
    roadSurfaceMouseType: "cursor:crosshair",

    fmeurl: 'http://api.fmeserver.com/js/v3/FMEServer.js',
    design: [{num:'1', name:'One Way'}, {num:'2',name:'Two Way'}, {num:'3',name:'Boulevard'}],
    surface: [{num:10, name:'Paved'}, {num:11, name:'Brick'},{num:12, name:'Dirt/Natural'},{num:13, name:'Gravel'},{num:2, name:'Concrete'}],
    testRoadInfo: [{type:"Paved",bdfo:'0', edfo:'12'},{type:"Brick",bdfo:'12', edfo:'24'}],

    startPoint: new Graphic({
        geometry: {
          type: "point",
          longitude: 0,
          latitude: 0
        },
        symbol:{
          type: "simple-marker",
          color: "#8DB600",
        }
    }),
    endPoint: new Graphic({
        geometry: {
          type: "point",
          longitude: 0,
          latitude: 0
        },
        symbol:{
          type: "simple-marker",
          color: "#E32636",
        }
    })
}