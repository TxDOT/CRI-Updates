(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-5084825c","chunk-2d22611c"],{2698:function(e,t,r){"use strict";function o(e){return e&&"getAtOrigin"in e&&"originOf"in e}r.d(t,"a",(function(){return o}))},"44bb":function(e,t,r){"use strict";r.r(t),r.d(t,"default",(function(){return re}));var o=r("a4ee"),i=r("4856"),a=r("2eab"),n=r("ce50"),s=r("7ffa"),l=r("e92d"),c=r("b2b2"),p=r("e694"),d=r("9d1d"),u=r("f4cc"),b=r("e041"),y=r("59b2"),h=r("cea0"),f=r("afcf"),j=r("d386"),O=r("09db"),m=r("a6a3"),v=r("f46e"),g=r("3d59"),w=r("b911"),S=r("0db5"),I=r("5a62"),x=r("96ae"),T=r("448d"),R=r("6a0e");r("b50f"),r("c120");let P=class extends R["a"]{constructor(e){super(e),this.field=null,this.type=null}clone(){return console.warn(".clone() is not implemented for "+this.declaredClass),null}};Object(o["a"])([Object(y["b"])({type:String,json:{write:{enabled:!0,isRequired:!0}}})],P.prototype,"field",void 0),Object(o["a"])([Object(y["b"])({readOnly:!0,nonNullable:!0,json:{read:!1}})],P.prototype,"type",void 0),P=Object(o["a"])([Object(j["a"])("esri.layers.pointCloudFilters.PointCloudFilter")],P);const C=P;var N;let V=N=class extends C{constructor(e){super(e),this.requiredClearBits=null,this.requiredSetBits=null,this.type="bitfield"}clone(){return new N({field:this.field,requiredClearBits:Object(s["a"])(this.requiredClearBits),requiredSetBits:Object(s["a"])(this.requiredSetBits)})}};Object(o["a"])([Object(y["b"])({type:[h["a"]],json:{write:{enabled:!0,overridePolicy(){return{enabled:!0,isRequired:!this.requiredSetBits}}}}})],V.prototype,"requiredClearBits",void 0),Object(o["a"])([Object(y["b"])({type:[h["a"]],json:{write:{enabled:!0,overridePolicy(){return{enabled:!0,isRequired:!this.requiredClearBits}}}}})],V.prototype,"requiredSetBits",void 0),Object(o["a"])([Object(T["a"])({pointCloudBitfieldFilter:"bitfield"})],V.prototype,"type",void 0),V=N=Object(o["a"])([Object(j["a"])("esri.layers.pointCloudFilters.PointCloudBitfieldFilter")],V);const F=V;var _;let q=_=class extends C{constructor(e){super(e),this.includedReturns=[],this.type="return"}clone(){return new _({field:this.field,includedReturns:Object(s["a"])(this.includedReturns)})}};Object(o["a"])([Object(y["b"])({type:[["firstOfMany","last","lastOfMany","single"]],json:{write:{enabled:!0,isRequired:!0}}})],q.prototype,"includedReturns",void 0),Object(o["a"])([Object(T["a"])({pointCloudReturnFilter:"return"})],q.prototype,"type",void 0),q=_=Object(o["a"])([Object(j["a"])("esri.layers.pointCloudFilters.PointCloudReturnFilter")],q);const K=q;var A;let z=A=class extends C{constructor(e){super(e),this.mode="exclude",this.type="value",this.values=[]}clone(){return new A({field:this.field,mode:this.mode,values:Object(s["a"])(this.values)})}};Object(o["a"])([Object(y["b"])({type:["exclude","include"],json:{write:{enabled:!0,isRequired:!0}}})],z.prototype,"mode",void 0),Object(o["a"])([Object(T["a"])({pointCloudValueFilter:"value"})],z.prototype,"type",void 0),Object(o["a"])([Object(y["b"])({type:[Number],json:{write:{enabled:!0,isRequired:!0}}})],z.prototype,"values",void 0),z=A=Object(o["a"])([Object(j["a"])("esri.layers.pointCloudFilters.PointCloudValueFilter")],z);const U=z,k={key:"type",base:C,typeMap:{value:U,bitfield:F,return:K}};var E,B=r("22f4"),L=r("a1f3"),M=r("2feb"),D=r("1637"),$=r("4e0d"),J=r("7731");let G=E=class extends J["a"]{constructor(e){super(e),this.type="point-cloud-rgb",this.field=null}clone(){return new E({...this.cloneProperties(),field:Object(s["a"])(this.field)})}};Object(o["a"])([Object(T["a"])({pointCloudRGBRenderer:"point-cloud-rgb"})],G.prototype,"type",void 0),Object(o["a"])([Object(y["b"])({type:String,json:{write:!0}})],G.prototype,"field",void 0),G=E=Object(o["a"])([Object(j["a"])("esri.renderers.PointCloudRGBRenderer")],G);const W=G;var Z=r("578b"),H=r("a1f7");const Q={key:"type",base:J["a"],typeMap:{"point-cloud-class-breaks":$["a"],"point-cloud-rgb":W,"point-cloud-stretch":Z["a"],"point-cloud-unique-value":H["a"]},errorContext:"renderer"};var X=r("f51b");const Y=l["a"].getLogger("esri.layers.PointCloudLayer"),ee=Object(M["a"])();let te=class extends(Object(x["a"])(Object(g["a"])(Object(w["a"])(Object(S["a"])(Object(I["a"])(Object(p["a"])(Object(v["a"])(m["a"])))))))){constructor(...e){super(...e),this.operationalLayerType="PointCloudLayer",this.popupEnabled=!0,this.popupTemplate=null,this.opacity=1,this.filters=[],this.fields=null,this.fieldsIndex=null,this.outFields=null,this.path=null,this.legendEnabled=!0,this.renderer=null,this.type="point-cloud"}normalizeCtorArgs(e,t){return"string"==typeof e?{url:e,...t}:e}get defaultPopupTemplate(){return this.attributeStorageInfo?this.createPopupTemplate():null}getFieldDomain(e){const t=this.fieldsIndex.get(e);return t&&t.domain?t.domain:null}readServiceFields(e,t,r){return Array.isArray(e)?e.map(e=>{const t=new L["a"];return"FieldTypeInteger"===e.type&&((e=Object(s["a"])(e)).type="esriFieldTypeInteger"),t.read(e,r),t}):Array.isArray(t.attributeStorageInfo)?t.attributeStorageInfo.map(e=>new L["a"]({name:e.name,type:"ELEVATION"===e.name?"double":"integer"})):null}set elevationInfo(e){this._set("elevationInfo",e),this._validateElevationInfo()}writeRenderer(e,t,r,o){Object(d["c"])("layerDefinition.drawingInfo.renderer",e.write({},o),t)}load(e){const t=Object(c["l"])(e)?e.signal:null,r=this.loadFromPortal({supportedTypes:["Scene Service"]},e).catch(u["t"]).then(()=>this._fetchService(t));return this.addResolvingPromise(r),Promise.resolve(this)}createPopupTemplate(e){const t=Object(X["a"])(this,e);return this.formatPopupTemplateReturnsField(t),this.formatPopupTemplateRGBField(t),t}formatPopupTemplateReturnsField(e){const t=this.fieldsIndex.get("RETURNS");if(!t)return;const r=e.fieldInfos.find(e=>e.fieldName===t.name);if(!r)return;const o=new D["a"]({name:"pcl-returns-decoded",title:t.alias||t.name,expression:`\n        var returnValue = $feature.${t.name};\n        return (returnValue % 16) + " / " + Floor(returnValue / 16);\n      `});e.expressionInfos=[...e.expressionInfos||[],o],r.fieldName="expression/pcl-returns-decoded"}formatPopupTemplateRGBField(e){const t=this.fieldsIndex.get("RGB");if(!t)return;const r=e.fieldInfos.find(e=>e.fieldName===t.name);if(!r)return;const o=new D["a"]({name:"pcl-rgb-decoded",title:t.alias||t.name,expression:`\n        var rgb = $feature.${t.name};\n        var red = Floor(rgb / 65536, 0);\n        var green = Floor((rgb - (red * 65536)) / 256,0);\n        var blue = rgb - (red * 65536) - (green * 256);\n\n        return "rgb(" + red + "," + green + "," + blue + ")";\n      `});e.expressionInfos=[...e.expressionInfos||[],o],r.fieldName="expression/pcl-rgb-decoded"}async queryCachedStatistics(e,t){if(await this.load(t),!this.attributeStorageInfo)throw new n["a"]("scenelayer:no-cached-statistics","Cached statistics are not available for this layer");const r=this.fieldsIndex.get(e);if(!r)throw new n["a"]("pointcloudlayer:field-unexisting",`Field '${e}' does not exist on the layer`);for(const o of this.attributeStorageInfo)if(o.name===r.name){const e=Object(b["z"])(this.parsedUrl.path,"./statistics/"+o.key);return Object(a["default"])(e,{query:{f:"json",token:this.apiKey},responseType:"json",signal:t?t.signal:null}).then(e=>e.data)}throw new n["a"]("pointcloudlayer:no-cached-statistics","Cached statistics for this attribute are not available")}async saveAs(e,t){return this._debouncedSaveOperations(1,{...t,getTypeKeywords:()=>this._getTypeKeywords(),portalItemLayerType:"point-cloud"},e)}async save(){const e={getTypeKeywords:()=>this._getTypeKeywords(),portalItemLayerType:"point-cloud"};return this._debouncedSaveOperations(0,e)}validateLayer(e){if(e.layerType&&"PointCloud"!==e.layerType)throw new n["a"]("pointcloudlayer:layer-type-not-supported","PointCloudLayer does not support this layer type",{layerType:e.layerType});if(isNaN(this.version.major)||isNaN(this.version.minor))throw new n["a"]("layer:service-version-not-supported","Service version is not supported.",{serviceVersion:this.version.versionString,supportedVersions:"1.x-2.x"});if(this.version.major>2)throw new n["a"]("layer:service-version-too-new","Service version is too new.",{serviceVersion:this.version.versionString,supportedVersions:"1.x-2.x"})}hasCachedStatistics(e){return null!=this.attributeStorageInfo&&this.attributeStorageInfo.some(t=>t.name===e)}_getTypeKeywords(){return["PointCloud"]}_validateElevationInfo(){const e=this.elevationInfo;e&&("absolute-height"!==e.mode&&Y.warn(".elevationInfo=","Point cloud layers only support absolute-height elevation mode"),e.featureExpressionInfo&&"0"!==e.featureExpressionInfo.expression&&Y.warn(".elevationInfo=","Point cloud layers do not support featureExpressionInfo"))}};Object(o["a"])([Object(y["b"])({type:["PointCloudLayer"]})],te.prototype,"operationalLayerType",void 0),Object(o["a"])([Object(y["b"])(B["j"])],te.prototype,"popupEnabled",void 0),Object(o["a"])([Object(y["b"])({type:i["a"],json:{name:"popupInfo",write:!0}})],te.prototype,"popupTemplate",void 0),Object(o["a"])([Object(y["b"])({readOnly:!0,json:{read:!1}})],te.prototype,"defaultPopupTemplate",null),Object(o["a"])([Object(y["b"])({readOnly:!0,json:{write:!1,read:!1,origins:{"web-document":{write:!1,read:!1}}}})],te.prototype,"opacity",void 0),Object(o["a"])([Object(y["b"])({type:["show","hide"]})],te.prototype,"listMode",void 0),Object(o["a"])([Object(y["b"])({types:[k],json:{origins:{service:{read:{source:"filters"}}},name:"layerDefinition.filters",write:!0}})],te.prototype,"filters",void 0),Object(o["a"])([Object(y["b"])({type:[L["a"]]})],te.prototype,"fields",void 0),Object(o["a"])([Object(y["b"])(ee.fieldsIndex)],te.prototype,"fieldsIndex",void 0),Object(o["a"])([Object(f["a"])("service","fields",["fields","attributeStorageInfo"])],te.prototype,"readServiceFields",null),Object(o["a"])([Object(y["b"])(ee.outFields)],te.prototype,"outFields",void 0),Object(o["a"])([Object(y["b"])({readOnly:!0})],te.prototype,"attributeStorageInfo",void 0),Object(o["a"])([Object(y["b"])(B["b"])],te.prototype,"elevationInfo",null),Object(o["a"])([Object(y["b"])({type:String,json:{origins:{"web-scene":{read:!0,write:!0},"portal-item":{read:!0,write:!0}},read:!1}})],te.prototype,"path",void 0),Object(o["a"])([Object(y["b"])(B["e"])],te.prototype,"legendEnabled",void 0),Object(o["a"])([Object(y["b"])({types:Q,json:{origins:{service:{read:{source:"drawingInfo.renderer"}}},name:"layerDefinition.drawingInfo.renderer",write:{target:{"layerDefinition.drawingInfo.renderer":{types:Q},"layerDefinition.drawingInfo.transparency":{type:Number}}}}})],te.prototype,"renderer",void 0),Object(o["a"])([Object(O["a"])("renderer")],te.prototype,"writeRenderer",null),Object(o["a"])([Object(y["b"])({json:{read:!1},readOnly:!0})],te.prototype,"type",void 0),te=Object(o["a"])([Object(j["a"])("esri.layers.PointCloudLayer")],te);const re=te},"4e0d":function(e,t,r){"use strict";r.d(t,"a",(function(){return O}));var o,i=r("a4ee"),a=r("7ffa"),n=r("59b2"),s=r("cea0"),l=r("448d"),c=r("d386"),p=r("7731"),d=r("d611"),u=r("9ef0"),b=r("6a0e");let y=o=class extends b["a"]{constructor(){super(...arguments),this.description=null,this.label=null,this.minValue=0,this.maxValue=0,this.color=null}clone(){return new o({description:this.description,label:this.label,minValue:this.minValue,maxValue:this.maxValue,color:Object(a["a"])(this.color)})}};Object(i["a"])([Object(n["b"])({type:String,json:{write:!0}})],y.prototype,"description",void 0),Object(i["a"])([Object(n["b"])({type:String,json:{write:!0}})],y.prototype,"label",void 0),Object(i["a"])([Object(n["b"])({type:Number,json:{read:{source:"classMinValue"},write:{target:"classMinValue"}}})],y.prototype,"minValue",void 0),Object(i["a"])([Object(n["b"])({type:Number,json:{read:{source:"classMaxValue"},write:{target:"classMaxValue"}}})],y.prototype,"maxValue",void 0),Object(i["a"])([Object(n["b"])({type:u["a"],json:{type:[s["a"]],write:!0}})],y.prototype,"color",void 0),y=o=Object(i["a"])([Object(c["a"])("esri.renderers.support.pointCloud.ColorClassBreakInfo")],y);const h=y;var f;let j=f=class extends p["a"]{constructor(e){super(e),this.type="point-cloud-class-breaks",this.field=null,this.legendOptions=null,this.fieldTransformType=null,this.colorClassBreakInfos=null}clone(){return new f({...this.cloneProperties(),field:this.field,fieldTransformType:this.fieldTransformType,colorClassBreakInfos:Object(a["a"])(this.colorClassBreakInfos),legendOptions:Object(a["a"])(this.legendOptions)})}};Object(i["a"])([Object(l["a"])({pointCloudClassBreaksRenderer:"point-cloud-class-breaks"})],j.prototype,"type",void 0),Object(i["a"])([Object(n["b"])({json:{write:!0},type:String})],j.prototype,"field",void 0),Object(i["a"])([Object(n["b"])({type:d["a"],json:{write:!0}})],j.prototype,"legendOptions",void 0),Object(i["a"])([Object(n["b"])({type:p["a"].fieldTransformTypeKebabDict.apiValues,json:{type:p["a"].fieldTransformTypeKebabDict.jsonValues,read:p["a"].fieldTransformTypeKebabDict.read,write:p["a"].fieldTransformTypeKebabDict.write}})],j.prototype,"fieldTransformType",void 0),Object(i["a"])([Object(n["b"])({type:[h],json:{write:!0}})],j.prototype,"colorClassBreakInfos",void 0),j=f=Object(i["a"])([Object(c["a"])("esri.renderers.PointCloudClassBreaksRenderer")],j);const O=j},"578b":function(e,t,r){"use strict";r.d(t,"a",(function(){return b}));var o,i=r("a4ee"),a=r("7ffa"),n=r("59b2"),s=(r("cea0"),r("448d")),l=r("d386"),c=r("7731"),p=r("d611"),d=r("3f60");let u=o=class extends c["a"]{constructor(e){super(e),this.type="point-cloud-stretch",this.field=null,this.legendOptions=null,this.fieldTransformType=null,this.stops=null}clone(){return new o({...this.cloneProperties(),field:Object(a["a"])(this.field),fieldTransformType:Object(a["a"])(this.fieldTransformType),stops:Object(a["a"])(this.stops),legendOptions:Object(a["a"])(this.legendOptions)})}};Object(i["a"])([Object(s["a"])({pointCloudStretchRenderer:"point-cloud-stretch"})],u.prototype,"type",void 0),Object(i["a"])([Object(n["b"])({json:{write:!0},type:String})],u.prototype,"field",void 0),Object(i["a"])([Object(n["b"])({type:p["a"],json:{write:!0}})],u.prototype,"legendOptions",void 0),Object(i["a"])([Object(n["b"])({type:c["a"].fieldTransformTypeKebabDict.apiValues,json:{type:c["a"].fieldTransformTypeKebabDict.jsonValues,read:c["a"].fieldTransformTypeKebabDict.read,write:c["a"].fieldTransformTypeKebabDict.write}})],u.prototype,"fieldTransformType",void 0),Object(i["a"])([Object(n["b"])({type:[d["a"]],json:{write:!0}})],u.prototype,"stops",void 0),u=o=Object(i["a"])([Object(l["a"])("esri.renderers.PointCloudStretchRenderer")],u);const b=u},"6e36":function(e,t,r){"use strict";r.d(t,"a",(function(){return n}));var o=r("2eab"),i=r("ce50"),a=r("b2b2");async function n(e,t,r,n,s,l){let c=null;if(Object(a["l"])(r)){const t=e+"/nodepages/",i=t+Math.floor(r.rootIndex/r.nodesPerPage);try{return{type:"page",rootPage:(await Object(o["default"])(i,{query:{f:"json",token:n},responseType:"json",signal:l})).data,rootIndex:r.rootIndex,pageSize:r.nodesPerPage,lodMetric:r.lodSelectionMetricType,urlPrefix:t}}catch(u){Object(a["l"])(s)&&s.warn("#fetchIndexInfo()","Failed to load root node page. Falling back to node documents.",i,u),c=u}}if(!t)return null;const p=e+"/nodes/",d=p+(t&&t.split("/").pop());try{return{type:"node",rootNode:(await Object(o["default"])(d,{query:{f:"json",token:n},responseType:"json",signal:l})).data,urlPrefix:p}}catch(u){throw new i["a"]("sceneservice:root-node-missing","Root node missing.",{pageError:c,nodeError:u,url:d})}}},7731:function(e,t,r){"use strict";r.d(t,"a",(function(){return x}));var o,i=r("a4ee"),a=r("fa8a"),n=r("6a0e"),s=r("7ffa"),l=r("59b2"),c=(r("cea0"),r("d386"));r("b50f"),r("c120");let p=o=class extends n["a"]{constructor(){super(...arguments),this.field=null,this.minValue=0,this.maxValue=255}clone(){return new o({field:this.field,minValue:this.minValue,maxValue:this.maxValue})}};Object(i["a"])([Object(l["b"])({type:String,json:{write:!0}})],p.prototype,"field",void 0),Object(i["a"])([Object(l["b"])({type:Number,nonNullable:!0,json:{write:!0}})],p.prototype,"minValue",void 0),Object(i["a"])([Object(l["b"])({type:Number,nonNullable:!0,json:{write:!0}})],p.prototype,"maxValue",void 0),p=o=Object(i["a"])([Object(c["a"])("esri.renderers.support.pointCloud.ColorModulation")],p);const d=p,u=new a["a"]({pointCloudFixedSizeAlgorithm:"fixed-size",pointCloudSplatAlgorithm:"splat"});let b=class extends n["a"]{};Object(i["a"])([Object(l["b"])({type:u.apiValues,readOnly:!0,nonNullable:!0,json:{type:u.jsonValues,read:!1,write:u.write}})],b.prototype,"type",void 0),b=Object(i["a"])([Object(c["a"])("esri.renderers.support.pointCloud.PointSizeAlgorithm")],b);const y=b;var h,f=r("448d");let j=h=class extends y{constructor(){super(...arguments),this.type="fixed-size",this.size=0,this.useRealWorldSymbolSizes=null}clone(){return new h({size:this.size,useRealWorldSymbolSizes:this.useRealWorldSymbolSizes})}};Object(i["a"])([Object(f["a"])({pointCloudFixedSizeAlgorithm:"fixed-size"})],j.prototype,"type",void 0),Object(i["a"])([Object(l["b"])({type:Number,nonNullable:!0,json:{write:!0}})],j.prototype,"size",void 0),Object(i["a"])([Object(l["b"])({type:Boolean,json:{write:!0}})],j.prototype,"useRealWorldSymbolSizes",void 0),j=h=Object(i["a"])([Object(c["a"])("esri.renderers.support.pointCloud.PointSizeFixedSizeAlgorithm")],j);const O=j;var m;let v=m=class extends y{constructor(){super(...arguments),this.type="splat",this.scaleFactor=1}clone(){return new m({scaleFactor:this.scaleFactor})}};Object(i["a"])([Object(f["a"])({pointCloudSplatAlgorithm:"splat"})],v.prototype,"type",void 0),Object(i["a"])([Object(l["b"])({type:Number,value:1,nonNullable:!0,json:{write:!0}})],v.prototype,"scaleFactor",void 0),v=m=Object(i["a"])([Object(c["a"])("esri.renderers.support.pointCloud.PointSizeSplatAlgorithm")],v);const g=v,w={key:"type",base:y,typeMap:{"fixed-size":O,splat:g}},S=Object(a["b"])()({pointCloudClassBreaksRenderer:"point-cloud-class-breaks",pointCloudRGBRenderer:"point-cloud-rgb",pointCloudStretchRenderer:"point-cloud-stretch",pointCloudUniqueValueRenderer:"point-cloud-unique-value"});let I=class extends n["a"]{constructor(e){super(e),this.type=void 0,this.pointSizeAlgorithm=null,this.colorModulation=null,this.pointsPerInch=10}clone(){return console.warn(".clone() is not implemented for "+this.declaredClass),null}cloneProperties(){return{pointSizeAlgorithm:Object(s["a"])(this.pointSizeAlgorithm),colorModulation:Object(s["a"])(this.colorModulation),pointsPerInch:Object(s["a"])(this.pointsPerInch)}}};Object(i["a"])([Object(l["b"])({type:S.apiValues,readOnly:!0,nonNullable:!0,json:{type:S.jsonValues,read:!1,write:S.write}})],I.prototype,"type",void 0),Object(i["a"])([Object(l["b"])({types:w,json:{write:!0}})],I.prototype,"pointSizeAlgorithm",void 0),Object(i["a"])([Object(l["b"])({type:d,json:{write:!0}})],I.prototype,"colorModulation",void 0),Object(i["a"])([Object(l["b"])({json:{write:!0},nonNullable:!0,type:Number})],I.prototype,"pointsPerInch",void 0),I=Object(i["a"])([Object(c["a"])("esri.renderers.PointCloudRenderer")],I),function(e){e.fieldTransformTypeKebabDict=new a["a"]({none:"none",lowFourBit:"low-four-bit",highFourBit:"high-four-bit",absoluteValue:"absolute-value",moduloTen:"modulo-ten"})}(I||(I={}));const x=I},"96ae":function(e,t,r){"use strict";r.d(t,"a",(function(){return V}));var o=r("a4ee"),i=r("2eab"),a=r("ce50"),n=(r("c120"),r("e92d")),s=r("b2b2"),l=r("f4cc"),c=r("e041"),p=r("59b2"),d=(r("b50f"),r("cea0"),r("afcf")),u=r("d386"),b=r("09db"),y=r("2698");function h(e){e&&e.writtenProperties&&e.writtenProperties.forEach(e=>{const t=e.target;e.newOrigin&&e.oldOrigin!==e.newOrigin&&Object(y["a"])(t)&&t.updateOrigin(e.propName,e.newOrigin)})}var f=r("3af1"),j=r("e64d"),O=r("5996"),m=r("54b4"),v=r("22f4"),g=r("6e36"),w=r("0224"),S=r("a7e1"),I=r("792b"),x=r("8eed"),T=r("e6a6");async function R(e,t,r){if(!t||!t.resources)return;const o=t.portalItem===e.portalItem?new Set(e.paths):new Set;e.paths.length=0,e.portalItem=t.portalItem;const i=new Set(t.resources.toKeep.map(e=>e.resource.path)),n=new Set,s=[];i.forEach(t=>{o.delete(t),e.paths.push(t)});for(const a of t.resources.toUpdate)if(o.delete(a.resource.path),i.has(a.resource.path)||n.has(a.resource.path)){const{resource:t,content:o,finish:i,error:n}=a,l=Object(T["getSiblingOfSameTypeI"])(t,Object(x["a"])());e.paths.push(l.path),s.push(P({resource:l,content:o,finish:i,error:n},r))}else e.paths.push(a.resource.path),s.push(C(a,r)),n.add(a.resource.path);for(const a of t.resources.toAdd)s.push(P(a,r)),e.paths.push(a.resource.path);if(o.forEach(e=>{const r=t.portalItem.resourceFromPath(e);s.push(r.portalItem.removeResource(r).catch(()=>{}))}),0===s.length)return;const c=await Object(l["i"])(s);Object(l["u"])(r);const p=c.filter(e=>"error"in e).map(e=>e.error);if(p.length>0)throw new a["a"]("save:resources","Failed to save one or more resources",{errors:p})}async function P(e,t){const r=await Object(I["c"])(e.resource.portalItem.addResource(e.resource,e.content,t));if(!0!==r.ok)throw e.error&&e.error(r.error),r.error;e.finish&&e.finish(e.resource)}async function C(e,t){const r=await Object(I["c"])(e.resource.update(e.content,t));if(!0!==r.ok)throw e.error(r.error),r.error;e.finish(e.resource)}const N=n["a"].getLogger("esri.layers.mixins.SceneService"),V=e=>{let t=class extends e{constructor(){super(...arguments),this.spatialReference=null,this.fullExtent=null,this.heightModelInfo=null,this.minScale=0,this.maxScale=0,this.version={major:Number.NaN,minor:Number.NaN,versionString:""},this.copyright=null,this.sublayerTitleMode="item-title",this.title=null,this.layerId=null,this.indexInfo=null,this._debouncedSaveOperations=Object(l["h"])(async(e,t,r)=>{switch(e){case 0:return this._save(t);case 1:return this._saveAs(r,t)}})}readSpatialReference(e,t){return this._readSpatialReference(t)}_readSpatialReference(e){if(null!=e.spatialReference)return O["a"].fromJSON(e.spatialReference);{const t=e.store,r=t.indexCRS||t.geographicCRS,o=r&&parseInt(r.substring(r.lastIndexOf("/")+1,r.length),10);return null!=o?new O["a"](o):null}}readFullExtent(e,t,r){if(null!=e&&"object"==typeof e){const o=null==e.spatialReference?{...e,spatialReference:this._readSpatialReference(t)}:e;return f["a"].fromJSON(o,r)}const o=t.store,i=this._readSpatialReference(t);return null==i||null==o||null==o.extent||!Array.isArray(o.extent)||o.extent.some(e=>e<F)?null:new f["a"]({xmin:o.extent[0],ymin:o.extent[1],xmax:o.extent[2],ymax:o.extent[3],spatialReference:i})}parseVersionString(e){const t={major:Number.NaN,minor:Number.NaN,versionString:e},r=e.split(".");return r.length>=2&&(t.major=parseInt(r[0],10),t.minor=parseInt(r[1],10)),t}readVersion(e,t){const r=t.store,o=null!=r.version?r.version.toString():"";return this.parseVersionString(o)}readTitlePortalItem(e){return"item-title"!==this.sublayerTitleMode?void 0:e}readTitleService(e,t){const r=this.portalItem&&this.portalItem.title;if("item-title"===this.sublayerTitleMode)return Object(m["i"])(this.url,t.name);let o=t.name;if(!o&&this.url){const e=Object(m["e"])(this.url);Object(s["l"])(e)&&(o=e.title)}return"item-title-and-service-name"===this.sublayerTitleMode&&r&&(o=r+" - "+o),Object(m["a"])(o)}set url(e){const t=Object(m["h"])({layer:this,url:e,nonStandardUrlAllowed:!1,logger:N});this._set("url",t.url),null!=t.layerId&&this._set("layerId",t.layerId)}writeUrl(e,t,r,o){Object(m["j"])(this,e,"layers",t,o)}get parsedUrl(){const e=this._get("url");if(!e)return null;const t=Object(c["K"])(e);return null!=this.layerId&&(t.path=`${t.path}/layers/${this.layerId}`),t}async _fetchIndexAndUpdateExtent(e,t){this.indexInfo=Object(g["a"])(this.parsedUrl.path,this.rootNode,e,this.apiKey,N,t),null==this.fullExtent||this.fullExtent.hasZ||this._updateExtent(await this.indexInfo)}_updateExtent(e){if("page"===(null==e?void 0:e.type)){var t,r;const o=e.rootIndex%e.pageSize,i=null==(t=e.rootPage)||null==(r=t.nodes)?void 0:r[o];if(null==i||null==i.obb||null==i.obb.center||null==i.obb.halfSize)throw new a["a"]("sceneservice:invalid-node-page","Invalid node page.");if(i.obb.center[0]<F||null==this.fullExtent||this.fullExtent.hasZ)return;const n=i.obb.halfSize,s=i.obb.center[2],l=Math.sqrt(n[0]*n[0]+n[1]*n[1]+n[2]*n[2]);this.fullExtent.zmin=s-l,this.fullExtent.zmax=s+l}else if("node"===(null==e?void 0:e.type)){var o;const t=null==(o=e.rootNode)?void 0:o.mbs;if(!Array.isArray(t)||4!==t.length||t[0]<F)return;const r=t[2],i=t[3];this.fullExtent.zmin=r-i,this.fullExtent.zmax=r+i}}async _fetchService(e){if(null==this.url)throw new a["a"]("sceneservice:url-not-set","Scene service can not be loaded without valid portal item or url");if(null==this.layerId&&/SceneServer\/*$/i.test(this.url)){const t=await this._fetchFirstLayerId(e);null!=t&&(this.layerId=t)}return this._fetchServiceLayer(e)}async _fetchFirstLayerId(e){const t=await Object(i["default"])(this.url,{query:{f:"json",token:this.apiKey},responseType:"json",signal:e});if(t.data&&Array.isArray(t.data.layers)&&t.data.layers.length>0)return t.data.layers[0].id}async _fetchServiceLayer(e){const t=await Object(i["default"])(this.parsedUrl.path,{query:{f:"json",token:this.apiKey},responseType:"json",signal:e});t.ssl&&(this.url=this.url.replace(/^http:/i,"https:"));let r=!1;if(t.data.layerType&&"Voxel"===t.data.layerType&&(r=!0),r)return this.read(t.data,{origin:"service",url:this.parsedUrl}),this._fetchVoxelServiceLayer();const o=t.data;this.read(o,{origin:"service",url:this.parsedUrl}),this.validateLayer(o)}async _fetchVoxelServiceLayer(e){const t=(await Object(i["default"])(this.parsedUrl.path+"/layer",{query:{f:"json",token:this.apiKey},responseType:"json",signal:e})).data;this.read(t,{origin:"service",url:this.parsedUrl}),this.validateLayer(t)}async _ensureLoadBeforeSave(){await this.load(),"beforeSave"in this&&"function"==typeof this.beforeSave&&await this.beforeSave()}validateLayer(e){}_updateTypeKeywords(e,t,r){e.typeKeywords||(e.typeKeywords=[]);const o=t.getTypeKeywords();for(const i of o)e.typeKeywords.push(i);e.typeKeywords&&(e.typeKeywords=e.typeKeywords.filter((e,t,r)=>r.indexOf(e)===t),1===r&&(e.typeKeywords=e.typeKeywords.filter(e=>"Hosted Service"!==e)))}async _saveAs(e,t){const r={...K,...t};let o=S["default"].from(e);o||(N.error("_saveAs(): requires a portal item parameter"),await Promise.reject(new a["a"]("sceneservice:portal-item-required","_saveAs() requires a portal item to save to"))),o.id&&(o=o.clone(),o.id=null);const i=o.portal||w["a"].getDefault();await this._ensureLoadBeforeSave(),o.type=q,o.portal=i;const n={origin:"portal-item",url:null,messages:[],portal:i,portalItem:o,writtenProperties:[],blockedRelativeUrls:[],resources:{toAdd:[],toUpdate:[],toKeep:[],pendingOperations:[]}},s={layers:[this.write({},n)]};return await Promise.all(n.resources.pendingOperations),await this._validateAgainstJSONSchema(s,n,r),o.url=this.url,o.title||(o.title=this.title),this._updateTypeKeywords(o,r,1),await i._signIn(),await i.user.addItem({item:o,folder:r&&r.folder,data:s}),await R(this.resourceReferences,n,null),this.portalItem=o,h(n),n.portalItem=o,o}async _save(e){const t={...K,...e};this.portalItem||(N.error("_save(): requires the .portalItem property to be set"),await Promise.reject(new a["a"]("sceneservice:portal-item-not-set","Portal item to save to has not been set on this SceneService"))),this.portalItem.type!==q&&(N.error("_save(): Non-matching portal item type. Got "+this.portalItem.type+", expected "+q),await Promise.reject(new a["a"]("sceneservice:portal-item-wrong-type",`Portal item needs to have type "${q}"`))),await this._ensureLoadBeforeSave();const r={origin:"portal-item",url:this.portalItem.itemUrl&&Object(c["K"])(this.portalItem.itemUrl),messages:[],portal:this.portalItem.portal||w["a"].getDefault(),portalItem:this.portalItem,writtenProperties:[],blockedRelativeUrls:[],resources:{toAdd:[],toUpdate:[],toKeep:[],pendingOperations:[]}},o={layers:[this.write({},r)]};return await Promise.all(r.resources.pendingOperations),await this._validateAgainstJSONSchema(o,r,t),this.portalItem.url=this.url,this.portalItem.title||(this.portalItem.title=this.title),this._updateTypeKeywords(this.portalItem,t,0),await this.portalItem.update({data:o}),await R(this.resourceReferences,r,null),h(r),this.portalItem}async _validateAgainstJSONSchema(e,t,o){let i=t.messages.filter(e=>"error"===e.type).map(e=>new a["a"](e.name,e.message,e.details));if(o&&o.validationOptions.ignoreUnsupported&&(i=i.filter(e=>"layer:unsupported"!==e.name&&"symbol:unsupported"!==e.name&&"symbol-layer:unsupported"!==e.name&&"property:unsupported"!==e.name&&"url:unsupported"!==e.name&&"scenemodification:unsupported"!==e.name)),o.validationOptions.enabled||_){const t=(await r.e("chunk-2d209409").then(r.bind(null,"a7eb"))).validate(e,o.portalItemLayerType);if(t.length>0){const e="Layer item did not validate:\n"+t.join("\n");if(N.error("_validateAgainstJSONSchema(): "+e),"throw"===o.validationOptions.failPolicy){const e=t.map(e=>new a["a"]("sceneservice:schema-validation",e)).concat(i);throw new a["a"]("sceneservice-validate:error","Failed to save layer item due to schema validation, see `details.errors`.",{combined:e})}}}if(i.length>0)throw new a["a"]("sceneservice:save","Failed to save SceneService due to unsupported or invalid content. See 'details.errors' for more detailed information",{errors:i})}};return Object(o["a"])([Object(p["b"])(v["c"])],t.prototype,"id",void 0),Object(o["a"])([Object(p["b"])({type:O["a"]})],t.prototype,"spatialReference",void 0),Object(o["a"])([Object(d["a"])("spatialReference",["spatialReference","store.indexCRS","store.geographicCRS"])],t.prototype,"readSpatialReference",null),Object(o["a"])([Object(p["b"])({type:f["a"]})],t.prototype,"fullExtent",void 0),Object(o["a"])([Object(d["a"])("fullExtent",["fullExtent","store.extent","spatialReference","store.indexCRS","store.geographicCRS"])],t.prototype,"readFullExtent",null),Object(o["a"])([Object(p["b"])({readOnly:!0,type:j["a"]})],t.prototype,"heightModelInfo",void 0),Object(o["a"])([Object(p["b"])({type:Number,json:{name:"layerDefinition.minScale",write:!0,origins:{service:{read:{source:"minScale"},write:!1}}}})],t.prototype,"minScale",void 0),Object(o["a"])([Object(p["b"])({type:Number,json:{name:"layerDefinition.maxScale",write:!0,origins:{service:{read:{source:"maxScale"},write:!1}}}})],t.prototype,"maxScale",void 0),Object(o["a"])([Object(p["b"])({readOnly:!0})],t.prototype,"version",void 0),Object(o["a"])([Object(d["a"])("version",["store.version"])],t.prototype,"readVersion",null),Object(o["a"])([Object(p["b"])({type:String,json:{read:{source:"copyrightText"}}})],t.prototype,"copyright",void 0),Object(o["a"])([Object(p["b"])({type:String,json:{read:!1}})],t.prototype,"sublayerTitleMode",void 0),Object(o["a"])([Object(p["b"])({type:String})],t.prototype,"title",void 0),Object(o["a"])([Object(d["a"])("portal-item","title")],t.prototype,"readTitlePortalItem",null),Object(o["a"])([Object(d["a"])("service","title",["name"])],t.prototype,"readTitleService",null),Object(o["a"])([Object(p["b"])({type:Number,json:{origins:{service:{read:{source:"id"}},"portal-item":{write:{target:"id",isRequired:!0,ignoreOrigin:!0},read:!1}}}})],t.prototype,"layerId",void 0),Object(o["a"])([Object(p["b"])(v["n"])],t.prototype,"url",null),Object(o["a"])([Object(b["a"])("url")],t.prototype,"writeUrl",null),Object(o["a"])([Object(p["b"])()],t.prototype,"parsedUrl",null),Object(o["a"])([Object(p["b"])({readOnly:!0})],t.prototype,"store",void 0),Object(o["a"])([Object(p["b"])({type:String,readOnly:!0,json:{read:{source:"store.rootNode"}}})],t.prototype,"rootNode",void 0),t=Object(o["a"])([Object(u["a"])("esri.layers.mixins.SceneService")],t),t},F=-1e38,_=!1,q="Scene Service",K={getTypeKeywords:()=>[],portalItemLayerType:"unknown",validationOptions:{enabled:!0,ignoreUnsupported:!1,failPolicy:"throw"}}},a1f7:function(e,t,r){"use strict";r.d(t,"a",(function(){return O}));var o,i=r("a4ee"),a=r("7ffa"),n=r("59b2"),s=r("cea0"),l=r("448d"),c=r("d386"),p=r("7731"),d=r("d611"),u=r("9ef0"),b=r("6a0e");let y=o=class extends b["a"]{constructor(){super(...arguments),this.description=null,this.label=null,this.values=null,this.color=null}clone(){return new o({description:this.description,label:this.label,values:Object(a["a"])(this.values),color:Object(a["a"])(this.color)})}};Object(i["a"])([Object(n["b"])({type:String,json:{write:!0}})],y.prototype,"description",void 0),Object(i["a"])([Object(n["b"])({type:String,json:{write:!0}})],y.prototype,"label",void 0),Object(i["a"])([Object(n["b"])({type:[String],json:{write:!0}})],y.prototype,"values",void 0),Object(i["a"])([Object(n["b"])({type:u["a"],json:{type:[s["a"]],write:!0}})],y.prototype,"color",void 0),y=o=Object(i["a"])([Object(c["a"])("esri.renderers.support.pointCloud.ColorUniqueValueInfo")],y);const h=y;var f;let j=f=class extends p["a"]{constructor(e){super(e),this.type="point-cloud-unique-value",this.field=null,this.fieldTransformType=null,this.colorUniqueValueInfos=null,this.legendOptions=null}clone(){return new f({...this.cloneProperties(),field:Object(a["a"])(this.field),fieldTransformType:Object(a["a"])(this.fieldTransformType),colorUniqueValueInfos:Object(a["a"])(this.colorUniqueValueInfos),legendOptions:Object(a["a"])(this.legendOptions)})}};Object(i["a"])([Object(l["a"])({pointCloudUniqueValueRenderer:"point-cloud-unique-value"})],j.prototype,"type",void 0),Object(i["a"])([Object(n["b"])({json:{write:!0},type:String})],j.prototype,"field",void 0),Object(i["a"])([Object(n["b"])({type:p["a"].fieldTransformTypeKebabDict.apiValues,json:{type:p["a"].fieldTransformTypeKebabDict.jsonValues,read:p["a"].fieldTransformTypeKebabDict.read,write:p["a"].fieldTransformTypeKebabDict.write}})],j.prototype,"fieldTransformType",void 0),Object(i["a"])([Object(n["b"])({type:[h],json:{write:!0}})],j.prototype,"colorUniqueValueInfos",void 0),Object(i["a"])([Object(n["b"])({type:d["a"],json:{write:!0}})],j.prototype,"legendOptions",void 0),j=f=Object(i["a"])([Object(c["a"])("esri.renderers.PointCloudUniqueValueRenderer")],j);const O=j},e6a6:function(e,t,r){"use strict";r.r(t),r.d(t,"addOrUpdateResource",(function(){return l})),r.d(t,"contentToBlob",(function(){return y})),r.d(t,"fetchResources",(function(){return s})),r.d(t,"getSiblingOfSameType",(function(){return h})),r.d(t,"getSiblingOfSameTypeI",(function(){return f})),r.d(t,"removeAllResources",(function(){return p})),r.d(t,"removeResource",(function(){return c})),r.d(t,"splitPrefixFileNameAndExtension",(function(){return u}));var o=r("2eab"),i=r("ce50"),a=r("b2b2"),n=r("e041");async function s(e,t={},r){await e.load(r);const o=Object(n["z"])(e.itemUrl,"resources"),{start:i=1,num:s=10,sortOrder:l="asc",sortField:c="created"}=t,p={query:{start:i,num:s,sortOrder:l,sortField:c,token:e.apiKey},signal:Object(a["j"])(r,"signal")},d=await e.portal._request(o,p);return{total:d.total,nextStart:d.nextStart,resources:d.resources.map(({created:t,size:r,resource:o})=>({created:new Date(t),size:r,resource:e.resourceFromPath(o)}))}}async function l(e,t,r,o){if(!e.hasPath())throw new i["a"](`portal-item-resource-${t}:invalid-path`,"Resource does not have a valid path");const s=e.portalItem;await s.load(o);const l=Object(n["z"])(s.userItemUrl,"add"===t?"addResources":"updateResources"),[c,p]=d(e.path),u=await y(r),b=new FormData;return c&&"."!==c&&b.append("resourcesPrefix",c),b.append("fileName",p),b.append("file",u,p),b.append("f","json"),Object(a["l"])(o)&&o.access&&b.append("access",o.access),await s.portal._request(l,{method:"post",body:b,signal:Object(a["j"])(o,"signal")}),e}async function c(e,t,r){if(!t.hasPath())throw new i["a"]("portal-item-resources-remove:invalid-path","Resource does not have a valid path");await e.load(r);const o=Object(n["z"])(e.userItemUrl,"removeResources");await e.portal._request(o,{method:"post",query:{resource:t.path},signal:Object(a["j"])(r,"signal")}),t.portalItem=null}async function p(e,t){await e.load(t);const r=Object(n["z"])(e.userItemUrl,"removeResources");return e.portal._request(r,{method:"post",query:{deleteAll:!0},signal:Object(a["j"])(t,"signal")})}function d(e){const t=e.lastIndexOf("/");return-1===t?[".",e]:[e.slice(0,t),e.slice(t+1)]}function u(e){const[t,r]=b(e),[o,i]=d(t);return[o,i,r]}function b(e){const t=Object(n["n"])(e);return Object(a["k"])(t)?[e,""]:[e.slice(0,e.length-t.length-1),"."+t]}async function y(e){return e instanceof Blob?e:(await Object(o["default"])(e.url,{responseType:"blob"})).data}function h(e,t){if(!e.hasPath())return null;const[r,,o]=u(e.path);return e.portalItem.resourceFromPath(Object(n["z"])(r,t+o))}function f(e,t){if(!e.hasPath())return null;const[r,,o]=u(e.path);return e.portalItem.resourceFromPath(Object(n["z"])(r,t+o))}}}]);
//# sourceMappingURL=chunk-5084825c.20ad2e7b.js.map