export const criConstants = {
    //portalUrl: "https://services.arcgis.com/KTcxiTD9dsQw4r7Z/arcgis/rest/services/CRI_SurfType_Geom_view/FeatureServer/0",
    criUtils: "https://services.arcgis.com/KTcxiTD9dsQw4r7Z/arcgis/rest/services/CRI_Utils/FeatureServer/0",
    criUrl: "https://services.arcgis.com/KTcxiTD9dsQw4r7Z/arcgis/rest/services/CRI_URL/FeatureServer/0",
    refernceLayer: 'https://services.arcgis.com/KTcxiTD9dsQw4r7Z/ArcGIS/rest/services/CRI_REF_LAYERS/FeatureServer/0', 
    editsLayer: 'https://services.arcgis.com/KTcxiTD9dsQw4r7Z/arcgis/rest/services/CRI_EDITS_dev/FeatureServer/0',
    assetLyrRdbSrf: 'https://services.arcgis.com/KTcxiTD9dsQw4r7Z/ArcGIS/rest/services/CRI_REF_LAYERS/FeatureServer/2',
    assetLyrRdbDsgn: 'https://services.arcgis.com/KTcxiTD9dsQw4r7Z/ArcGIS/rest/services/CRI_REF_LAYERS/FeatureServer/3',
    snapLayer: 'https://services.arcgis.com/KTcxiTD9dsQw4r7Z/ArcGIS/rest/services/Route_County/FeatureServer/0',
    assetLyrRdbLane: 'https://services.arcgis.com/KTcxiTD9dsQw4r7Z/ArcGIS/rest/services/CRI_REF_LAYERS/FeatureServer/1',
    advanceUploadLayer: "https://services.arcgis.com/KTcxiTD9dsQw4r7Z/ArcGIS/rest/services/CRI_QAQC_dev/FeatureServer/0",
    txCounties: "https://services.arcgis.com/KTcxiTD9dsQw4r7Z/arcgis/rest/services/Texas_County_Boundaries/FeatureServer/0",
    judgeInfoTable: "https://services.arcgis.com/KTcxiTD9dsQw4r7Z/ArcGIS/rest/services/CNTY_INFO_dev/FeatureServer/0", //"https://services.arcgis.com/KTcxiTD9dsQw4r7Z/arcgis/rest/services/CNTY_INFO_dev/FeatureServer"
    deleteDocumentFL: "https://services.arcgis.com/KTcxiTD9dsQw4r7Z/arcgis/rest/services/CRI_DELETE_DOCUMENTATION_DEV/FeatureServer/0", //"https://services.arcgis.com/KTcxiTD9dsQw4r7Z/arcgis/rest/services/CRI_DELETE_DOCUMENTATION_DEV/FeatureServer"
    
    design: [{num:'1', name:'One Way'}, {num:'2',name:'Two Way'}, {num:'3',name:'Boulevard'}],
    surface: [{num:1, name:'Concrete'},{num:2, name:'Concrete'},{num:3, name:'Concrete'},{num:4, name:'Paved'},{num:5, name:'Paved'},{num:6, name:'Paved'},{num:7, name:'Paved'},{num:8, name:'Paved'},{num:9, name:'Paved'},{num:10, name:'Paved'}, {num:11, name:'Brick'},{num:12, name:'Dirt/Natural'},{num:13, name:'Gravel'},{num:14, name:'Paved'}],
    suffixPrefix: {'EAST': 'E', 'NORTH':'N', 'NORTHEAST':'NE','NORTHWEST': 'NW','NOT APPLICABLE':'N/A','SOUTH':'S','SOUTHEAST':'SE','SOUTHWEST':'SW','WEST':'W'},
    suffixPrefixNum:[{1: 'NORTH', 2: 'NORTHEAST', 3: 'EAST', 4: 'SOUTHEAST', 5: 'SOUTH', 6: 'SOUTHWEST', 7: 'WEST', 8: 'NORTHWEST', 9 : 'NOT APPLICABLE'}],
    
    rdNameType: [{1 : 'ALLEY'},{2 : 'ANEX'},{3 : 'ARCADE'},{4 : 'AVENUE'},{5 : 'BAYOU'},{6 : 'BEACH'},{7 : 'BEND'},{8 : 'BLUFF'},{9 : 'BLUFFS'},{10 : 'BOTTOM'},
    {11 : 'BOULEVARD'},{12 : 'BRANCH'},{13 : 'BRIDGE'},{14 : 'BROOK'},{15 : 'BROOKS'},{16 : 'BURG'},{17 : 'BURGS'},{18 : 'BYPAS'},{19 : 'CAMP'},{20 : 'CANYON'},
    {21 : 'CAPE'},{22 : 'CAUSEWAY'},{23 : 'CENTER'},{24 : 'CENTERS'},{25 : 'CIRCLE'},{26 : 'CIRCLES'},{27 : 'CLIFF'},{28 : 'CLIFFS'},{29 : 'CLUB'},{30 : 'COMMON'},
    {31 : 'COMMONS'},{32 : 'CORNER'},{33 : 'CORNERS'},{34 : 'COURSE'},{35 : 'COURT'},{36 : 'COURTS'},{37 : 'COVE'},{38 : 'COVES'},{39 : 'CREEK'},{40 : 'CRESCENT'},
    {41 : 'CREST'},{42 : 'CROSSING'},{43 : 'CROSSROAD'},{44 : 'CROSSROADS'},{45 : 'CURVE'},{46 : 'DALE'},{47 : 'DAM'},{48 : 'DIVIDE'},{49 : 'DRIVE'},{50 : 'DRIVES'},
    {51 : 'ESTATE'},{52 : 'ESTATES'},{53 : 'EXPRESSWAY'},{54 : 'EXTENSION'},{55 : 'EXTENSIONS'},{56 : 'FALL'},{57 : 'FALLS'},{58 : 'FERRY'},{59 : 'FIELD'},{60 : 'FIELDS'},
    {61 : 'FLAT'},{62 : 'FLATS'},{63 : 'FORD'},{64 : 'FORDS'},{65 : 'FOREST'},{66 : 'FORGE'},{67 : 'FORGES'},{68 : 'FORK'},{69 : 'FORKS'},{70 : 'FORT'},{71 : 'FREEWAY'},
    {72 : 'GARDEN'},{73 : 'GARDENS'},{74 : 'GATEWAY'},{75 : 'GLEN'},{76 : 'GLENS'},{77 : 'GREEN'},{78 : 'GREENS'},{79 : 'GROVE'},{80 : 'GROVES'},{81 : 'HARBOR'},
    {82 : 'HARBORS'},{83 : 'HAVEN'},{84 : 'HEIGHTS'},{85 : 'HIGHWAY'},{86 : 'HILL'},{87 : 'HILLS'},{88 : 'HOLLOW'},{89 : 'INLET'},{90 : 'ISLAND'},{91 : 'ISLANDS'},
    {92 : 'ISLE'},{93 : 'JUNCTION'},{94 : 'JUNCTIONS'},{95 : 'KEY'},{96 : 'KEYS'},{97 : 'KNOLL'},{98 : 'KNOLLS'},{99 : 'LAKE'},{100 : 'LAKES'},{101 : 'LAND'},
    {102 : 'LANDING'},{103 : 'LANE'},{104 : 'LIGHT'},{105 : 'LIGHTS'},{106 : 'LOAF'},{107 : 'LOCK'},{108 : 'LOCKS'},{109 : 'LODGE'},{110 : 'LOOP'},{111 : 'MALL'},
    {112 : 'MANOR'},{113 : 'MANORS'},{114 : 'MEADOW'},{115 : 'MEADOWS'},{116 : 'MEWS'},{117 : 'MILL'},{118 : 'MILLS'},{119 : 'MISSION'},{120 : 'MOTORWAY'},{121 : 'MOUNT'},
    {122 : 'MOUNTAIN'},{123 : 'MOUNTAINS'},{124 : 'NECK'},{125 : 'ORCHARD'},{126 : 'OVAL'},{127 : 'OVERPASS'},{128 : 'PARKS'},{129 : 'PARKWAYS'},{130 : 'PASS'},
    {131 : 'PASSAGE'},{132 : 'PATH'},{133 : 'PIKE'},{134 : 'PINE'},{135 : 'PINES'},{136 : 'PLACE'},{137 : 'PLAIN'},{138 : 'PLAINS'},{139 : 'PLAZA'},{140 : 'POINT'},
    {141 : 'POINTS'},{142 : 'PORT'},{143 : 'PORTS'},{144 : 'PRAIRIE'},{145 : 'RADIAL'},{146 : 'RAMP'},{147 : 'RANCH'},{148 : 'RAPID'},{149 : 'RAPIDS'},{150 : 'REST'},
    {151 : 'RIDGE'},{152 : 'RIDGES'},{153 : 'RIVER'},{154 : 'ROAD'},{155 : 'ROADS'},{156 : 'ROUTE'},{157 : 'ROW'},{158 : 'RUE'},{159 : 'RUN'},{160 : 'SHOAL'},
    {161 : 'SHOALS'},{162 : 'SHORE'},{163 : 'SHORES'},{164 : 'SKYWAY'},{165 : 'SPRING'},{166 : 'SPRINGS'},{167 : 'SPURS'},{168 : 'SQUARE'},{169 : 'SQUARES'},
    {170 : 'STATION'},{171 : 'STRAVENUE'},{172 : 'STREAM'},{173 : 'STREET'},{174 : 'STREETS'},{175 : 'SUMMIT'},{176 : 'TERRACE'},{177 : 'THROUGHWAY'},{178 : 'TRACE'},
    {179 : 'TRACK'},{180 : 'TRAFFICWAY'},{181 : 'TRAIL'},{182 : 'TRAILER'},{183 : 'TUNNEL'},{184 : 'TURNPIKE'},{185 : 'UNDERPASS'},{186 : 'UNION'},{187 : 'UNIONS'},
    {188 : 'VALLEY'},{189 : 'VALLEYS'},{190 : 'VIADUCT'},{191 : 'VIEW'},{192 : 'VIEWS'},{193 : 'VILLAGE'},{194 : 'VILLAGES'},{195 : 'VILLE'},{196 : 'VISTA'},{197 : 'WALKS'},
    {198 : 'WALL'},{199 : 'WAY'},{200 : 'WAYS'},{201 : 'WELL'},{202 : 'WELLS'},{203 : 'OTHER'},{204 : 'NOT APPLICABLE'},{0 : 'NOT APPLICABLE'}],
    
    colorTable: {
      'Paved': "#FF6700",
      'Brick': "#FE012E",
      'Dirt/Natural': "#0098FF",
      'Gravel': "#E700FF",
      'Concrete': "#47BF40",
      'One Way': "#FFBF00",
      'Two Way': "#00FFBF",
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

    txdotSchema: ['EDIT_TYPE', 'ROAD_PRFX', 'ROAD_SFX', 'ROAD_TYPE', 'ROAD_NM', 'SURFACE', 'LANE', 'DESIGN'],
    txdotRequired: ['EDIT_TYPE','SURFACE', 'LANE', 'DESIGN', 'ROAD_TYPE', 'ROAD_NM']
  }

