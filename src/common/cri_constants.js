import Graphic from "@arcgis/core/Graphic";

export const criConstants = {
  
    portalUrl: "https://services.arcgis.com/KTcxiTD9dsQw4r7Z/arcgis/rest/services/CRI_SurfType_Geom_view/FeatureServer/0",
    refernceLayer: "https://services.arcgis.com/KTcxiTD9dsQw4r7Z/ArcGIS/rest/services/CRI_Ref_Layers_view/FeatureServer/0", //"https://testportal.txdot.gov/sstestarcgis/rest/services/Hosted/CRI_Ref_Layers/FeatureServer/0",
    editsLayer: "https://services.arcgis.com/KTcxiTD9dsQw4r7Z/arcgis/rest/services/CRI_Edits_view/FeatureServer/0", //"https://testportal.txdot.gov/sstestarcgis/rest/services/Hosted/CRI_Edits/FeatureServer/0",
    assetLyrRdbSrf: "https://services.arcgis.com/KTcxiTD9dsQw4r7Z/ArcGIS/rest/services/CRI_Ref_Layers_view/FeatureServer/1",//"https://testportal.txdot.gov/sstestarcgis/rest/services/Hosted/CRI_Ref_Layers/FeatureServer/1",
    assetLyrRdbDsgn: "https://services.arcgis.com/KTcxiTD9dsQw4r7Z/ArcGIS/rest/services/CRI_Ref_Layers_view/FeatureServer/2",//"https://testportal.txdot.gov/sstestarcgis/rest/services/Hosted/CRI_Ref_Layers/FeatureServer/2",
    assetLyrRdbName: "https://services.arcgis.com/KTcxiTD9dsQw4r7Z/ArcGIS/rest/services/CRI_Ref_Layers_view/FeatureServer/3",//"https://testportal.txdot.gov/sstestarcgis/rest/services/Hosted/CRI_Ref_Layers/FeatureServer/3",
    assetLyrRdbLane: "https://services.arcgis.com/KTcxiTD9dsQw4r7Z/ArcGIS/rest/services/CRI_Ref_Layers_view/FeatureServer/4",//"https://testportal.txdot.gov/sstestarcgis/rest/services/Hosted/CRI_Ref_Layers/FeatureServer/4",
    txCounties: "https://services.arcgis.com/KTcxiTD9dsQw4r7Z/arcgis/rest/services/Texas_County_Boundaries/FeatureServer/0",
    geomTypeRd: "polyline",
    geomTypeCounty: "polygon",
    basemap: "topo-vector",
    zoomLevel: 9,
    roadSurfaceMouseType: "cursor:crosshair",

    fmeurl: 'http://api.fmeserver.com/js/v3/FMEServer.js',
    webhookUrl: "https://gis-batch-dev.txdot.gov/fmejobsubmitter/TPP/TPP_DEV_DUSA2Email.fmw?params=",
    headerName: "Authorization",
    headerValue: "fmetoken token=0f9f9976018726f7a4397a8e98294edc615a5512",
    
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