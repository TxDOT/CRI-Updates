export const criConstants = {
  
    portalUrl: "https://services.arcgis.com/KTcxiTD9dsQw4r7Z/arcgis/rest/services/CRI_SurfType_Geom_view/FeatureServer/0",
    refernceLayer: 'https://services.arcgis.com/KTcxiTD9dsQw4r7Z/ArcGIS/rest/services/CRI_REF_LAYERS/FeatureServer/0',
    editsLayer: 'https://services.arcgis.com/KTcxiTD9dsQw4r7Z/arcgis/rest/services/CRI_EDITS_2023/FeatureServer/0',
    assetLyrRdbSrf: 'https://services.arcgis.com/KTcxiTD9dsQw4r7Z/ArcGIS/rest/services/CRI_REF_LAYERS/FeatureServer/3',
    assetLyrRdbDsgn: 'https://services.arcgis.com/KTcxiTD9dsQw4r7Z/ArcGIS/rest/services/CRI_REF_LAYERS/FeatureServer/2',
    snapLayer: 'https://services.arcgis.com/KTcxiTD9dsQw4r7Z/ArcGIS/rest/services/Route_County/FeatureServer/1',
    assetLyrRdbLane: 'https://services.arcgis.com/KTcxiTD9dsQw4r7Z/ArcGIS/rest/services/CRI_REF_LAYERS/FeatureServer/1',
    txCounties: "https://services.arcgis.com/KTcxiTD9dsQw4r7Z/arcgis/rest/services/Texas_County_Boundaries/FeatureServer/0",
    geomTypeRd: "polyline",
    geomTypeCounty: "polygon",
    basemap: "topo-vector",
    zoomLevel: 2,
    roadSurfaceMouseType: "cursor:crosshair",
    postAddFeat: 'https://services.arcgis.com/KTcxiTD9dsQw4r7Z/ArcGIS/rest/services/CRI_EDITS_dev/FeatureServer/0/addFeatures?f=json',
    postUpdateFeat:'https://services.arcgis.com/KTcxiTD9dsQw4r7Z/ArcGIS/rest/services/CRI_EDITS_dev/FeatureServer/0/updateFeatures?f=json',
    postDeleteFeat:'https://services.arcgis.com/KTcxiTD9dsQw4r7Z/ArcGIS/rest/services/CRI_EDITS_dev/FeatureServer/0/addFeatures?f=json',
    fmeurl: 'http://api.fmeserver.com/js/v3/FMEServer.js',
    // webhookUrl: "https://gis-batch-dev.txdot.gov/fmejobsubmitter/TPP/TPP_DEV_DUSA2Email.fmw?params=",
    webhookUrl: "https://testportal.txdot.gov/fmejobsubmitter/TPP/TPP_DEV_DUSA2Email.fmw?params=",
    headerName: "Authorization",
    headerValue: "fmetoken token=0f9f9976018726f7a4397a8e98294edc615a5512",
    
    design: [{num:'1', name:'One Way'}, {num:'2',name:'Two Way'}, {num:'3',name:'Boulevard'}],
    surface: [{num:1, name:'Concrete'},{num:2, name:'Concrete'},{num:3, name:'Concrete'},{num:4, name:'Paved'},{num:5, name:'Paved'},{num:6, name:'Paved'},{num:7, name:'Paved'},{num:8, name:'Paved'},{num:9, name:'Paved'},{num:10, name:'Paved'}, {num:11, name:'Brick'},{num:12, name:'Dirt/Natural'},{num:13, name:'Gravel'},{num:14, name:'Paved'}],
    testRoadInfo: [{type:"Paved",bdfo:'0', edfo:'12'},{type:"Brick",bdfo:'12', edfo:'24'}],
    suffixPrefix: {'EAST': 'E', 'NORTH':'N', 'NORTHEAST':'NE','NORTHWEST': 'NW','NOT APPLICABLE':'N/A','SOUTH':'S','SOUTHEAST':'SE','SOUTHWEST':'SW','WEST':'W'},

    colorTable: {
      'Paved': "#FF6700",
      'Brick': "#FE012E",
      'Dirt/Natural': "#0098FF",
      'Gravel': "#E700FF",
      'Concrete': "#47BF40",
      'One Way': "#FFBF00",
      'Two-way': "#00FFBF",
      'Boulevard': "#BF00FF",
      '1': "#FF00C6",
      '2': "#FFB900",
      '3': "#00FF39",
      "4": "#0046FF",
      '5': "#2FACD0",
      '6': "#D0532F"
    },
    
    editType:{
      'add':['#27D83E', 'ADD', 1],
      'edit': ['#F8A307', 'EDIT', 5],
      'delete': ['#E32636', 'DELETE', 4]
    },

  //   featLayerColorVector:{ 
  //       type: "simple",
  //       symbol:{
  //           type: "simple-line",
  //           color:[255, 16, 240]
  //       }
  //   },
    
  //   featLayerColorImagery:{ 
  //     type: "simple",
  //     symbol:{
  //         type: "simple-line",
  //         color:[255, 16, 240]
  //     }
  // }
}