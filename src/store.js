import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex);

export const store = new Vuex.Store({
    state:{
        objectid: 0,
        judgeObjectId: 0,
        roadbedName: null,
        roadbedDesign: null,
        roadbedSurface: null,
        numLane: null,
        cntyName:'',
        cntyNmbr: 0,
        cntyMiles:0,
        district: 0,
        count:0,
        updateDfo:0,
        oldLength: 0,
        newTotalLength: 0,
        deltaDistance: 0,
        username: '',
        userEmail: '',
        stepperClose: null,
        addRd:null,
        editExisting: null,
        deleteRd: null,
        deleteRdSecond:null,
        deleteGraphClick: null,
        delSketch: null,
        modifyRd: false,
        infoRd: false,
        executeDfoPts: '',
        roadInfoUpdate:[],
        roadGeometry: [],
        featureGeometry: [],
        assetCoverage: [true,null],
        cntyEndingMiles: 0,
        stepNumber: 1,
        denyFeatClick: null,
        activeLoader: null,
        dfoReturn: 0,
        isDfoReturn: false,
        isFinalCheck: false,
        isLoggedOut: false,
        isLoggedIn: false,
        isUndoDisable: true,
        isRedoDisable: true,
        isClearEditBtn: false,
        isClearMapTools: false,
        isClearAboutHelpTools: false,
        isAbout: false,
        isStepCancel: false,
        isInitAdd: false,
        comment:'',
        geomCheck: '',
        isDragDrop: false,
        isDownload: false,
        editInfo: '',
        uploadFields: [],
        serverResp: false, //update
        isCertified: false,//update
        isMapAttr: true,
        isJudgeLtter: false,
        judgeName: '',
        judgeEmail:'',
        isFmeProcess: false,
        totalReloadPer:0,
        cntyCentroid: [0,0],
        isDocumentUploaded: null
    },
    getters:{
        getIsDocumentUploaded(state){
            return state.isDocumentUploaded
        },
        getCntyCentroid(state){
            return state.cntyCentroid
        },
        getTotalReloadPer(state){
            return state.totalReloadPer
        },
        getJudgeObjectId(state){
            return state.judgeObjectId
        },
        getIsFmeProcess(state){
            return state.isFmeProcess
        },
        getIsJudgeLtter(state){
            return state.isJudgeLtter
        },
        getJudgeName(state){
            return state.judgeName
        },//update
        getJudgeEmail(state){
            return state.judgeEmail
        },//update
        getIsMapAttr(state){
            return state.isMapAttr
        },//update
        getCertifiedrCheck(state){
            return state.isCertified
        },//update
        getServerCheck(state){
            return state.serverResp
        },//update
        getUploadFields(state){
            return state.uploadFields
        },
        getEditInfo(state){
            return state.editInfo
        },
        getIsDownload(state){
            return state.isDownload
        },
        getIsDragDrop(state){
            return state.isDragDrop
        },
        getDistrict(state){
            return state.district
        },
        getGeomCheck(state){
            return state.geomCheck
        },
        getIsInitAdd(state){
            return state.isInitAdd
        },
        getIsStepCancel(state){
            return state.isStepCancel
        },
        getComment(state){
            return state.comment
        },
        getIsAbout(state){
            return state.isAbout
        },
        getIsClearEditBtn(state){
            return state.isClearEditBtn
        },
        getIsClearMapTools(state){
            return state.isClearMapTools
        },
        getIsAboutHelpTools(state){
            return state.isClearAboutHelpTools
        },
        getIsUndoDisable(state){
            return state.isUndoDisable
        },
        getIsLoggedOut(state){
            return state.isLoggedOut
        },
        getIsLoggedIn(state){
            return state.isLoggedIn
        },
        getIsFinalCheck(state){
            return state.isFinalCheck
        },
        getIsDfoReturn(state){
            return state.isDfoReturn
        },
        getDfoReturn(state){
            return state.dfoReturn
        },
        getDelSketch(state){
            return state.delSketch
        },
        getdeleteGraphClick(state){
            return state.deleteGraphClick;
        },
        getActiveLoader(state){
            return state.activeLoader
        },
        getdenyFeatClick(state){
            return state.denyFeatClick
        },
        getDeleteRdSecond(state){
            return state.deleteRdSecond
        },
        getDeleteRd(state){
            return state.deleteRd
        },
        getModifyRd(state){
            return state.modifyRd
        },
        getInfoRd(state){
            return state.infoRd
        },
        getStepNumber(state){
            return state.stepNumber
        },
        getCntyEndingMiles(state){
            return state.cntyEndingMiles
        },
        getRoadGeom(state){
            return state.roadGeometry
        },
        getFeatureGeom(state){
            return state.featureGeometry
        },
        getAssetCoverage(state){
            return state.assetCoverage
        },
        getroadInfoUpdate(state){
            return state.roadInfoUpdate
        },
        getExecuteDfoPts(state){
            return state.executeDfoPts
        },
        getEditExisting(state){
            return state.editExisting
        },
        getAddRd(state){
            return state.addRd
        },
        getStepperClose(state){
            return state.stepperClose
        },
        getUserName(state){
            return state.username
        },
        getUserEmail(state){
            return state.userEmail
        },
        getOldLength(state){
            return state.oldLength
        },
        getDeltaDistance(state){
            return state.deltaDistance
        },
        getUpdateDfo(state){
            return state.updateDfo
        },
        getObjectid(state){
            return state.objectid
        },
        getCount(state){
            return state.count
        },
        getCntyNmbr(state){
            return state.cntyNmbr
        },
        getCntyMiles(state){
            return state.cntyMiles
        },
        getCntyName(state){
            return state.cntyName
        },
        getRoadbedName(state){
            return state.roadbedName
        },
        getRoadbedDesign(state){
            return state.roadbedDesign
        } ,
        getRoadbedSurface(state){
            return state.roadbedSurface
        },
        getNumLane(state){
            return state.numLane
        }
    },
    mutations:
    {
        setIsDocumentUploaded(state, bool){
            state.isDocumentUploaded = bool
        },
        setCntyCentroid(state, cntyCent){
            state.cntyCentroid = cntyCent
        },
        setTotalReloadPer(state, per){
            state.totalReloadPer = per
        },
        setJudgeObjectId(state, jdgeObjectId){
            state.judgeObjectId = jdgeObjectId
        },
        setIsFmeProcess(state, boolFME){
            console.log(boolFME)
            state.isFmeProcess = boolFME
            console.log(`this is is ${state.isFmeProcess}`)
        },
        setJudgeName(state, jdgeName){
            state.judgeName = jdgeName
        },//update
        setJudgeEmail(state, jdgeEmail){
            state.judgeEmail = jdgeEmail
        },//update
        setIsJudgeLetter(state, judgeLetter){
            state.isJudgeLtter= judgeLetter
        },//update
        setIsMapAttr(state, mapAttr){
            state.isMapAttr = mapAttr
        },//update 
        setCertifiedCheck(state, certify){
            state.isCertified = certify
        },//update
        setServerCheck(state, srverRes){
            state.serverResp = srverRes
        },//update
        setUploadFields(state, fieldNames){
            state.uploadFields = fieldNames
        },
        setEditInfo(state, edit){
            state.editInfo = edit
        },
        setIsDownload(state, dwnload){
            state.isDownload = dwnload
        },
        setIsDragDrop(state, dragDrop){
            state.isDragDrop = dragDrop
        },
        setDistrict(state, district){
            state.district = district
        },
       setGeomCheck(state, check){
            state.geomCheck = check
        },
        setIsInitAdd(state, boolInit){
            state.isInitAdd = boolInit
        },
        setIsStepCancel(state, boolCancel){
            state.isStepCancel = boolCancel
        },
        setComment(state, usrComment){
            state.comment = usrComment
        },
        setIsAbout(state, boolAbout){
            state.isAbout = boolAbout
        },
        setIsClearEditBtn(state, boolClearBtn){
            if(boolClearBtn){
                state.isClearEditBtn = boolClearBtn
                state.isClearMapTools = false
                state.isClearAboutHelpTools = false
                return;
            }
            state.isClearEditBtn = boolClearBtn
            return;
        },
        setIsClearMapTools(state, boolClearMapToolBtn){
            if(boolClearMapToolBtn){
                state.isClearMapTools = boolClearMapToolBtn
                state.isClearEditBtn = false
                state.isClearAboutHelpTools = false
                return;
            }
            state.isClearMapTools = boolClearMapToolBtn
            return;
        },
        setIsAboutHelpTools(state, boolClearResourceBtn){
            if(boolClearResourceBtn){
                state.isClearAboutHelpTools = boolClearResourceBtn
                state.isClearEditBtn = false
                state.isClearMapTools = false
                return;
            }
            state.isClearAboutHelpTools = boolClearResourceBtn
            return;
        },
        setIsUndoDisable(state, boolIsUndo){
            state.isUndoDisable = boolIsUndo
        },
        setIsRedoDisable(state, boolIsRedo){
            state.isRedoDisable = boolIsRedo
        },
        setIsLoggedOut(state, boolLoggedOut){
            state.isLoggedOut = boolLoggedOut
        },
        setIsLoggedIn(state, boolLoggedIn){
            state.isLoggedIn = boolLoggedIn
        },
        setIsFinalCheck(state,finalCheckBool){
            state.isFinalCheck = finalCheckBool
        },
        setIsDfoReturn(state, boolDfoReturn){
            state.isDfoReturn = boolDfoReturn
        },
        setDfoReturn(state, returnDFO){
            state.dfoReturn = returnDFO
        },
        setDelSketch(state, sketch){
            state.delSketch = sketch
        },
        setdeleteGraphClick(state, delClick){
            state.deleteGraphClick = delClick
        },
        setActiveLoader(state, loadStatus){
            state.activeLoader = loadStatus
        },
        setdenyFeatClick(state, deny){
            state.denyFeatClick = deny
        },
        setDeleteRdSecond(state, secondBool){
            state.deleteRdSecond = secondBool
        },
        setDeleteRd(state, delBool){
            state.deleteRd = delBool
        },
        setModifyRd(state, modifyBool){
            state.modifyRd = modifyBool
        },
        setInfoRd(state, infoBool){
            state.infoRd = infoBool
        },
        setStepNumber(state, step){
            state.stepNumber = step
        },
        setCntyEndingMiles(state, cntyMiles){
            state.cntyEndingMiles = cntyMiles
        },
        setRoadGeom(state, geom){
            state.roadGeometry = geom
        },
        setFeatureGeom(state, geom){
            state.featureGeometry = geom
        },
        setAssetCoverage(state, assetDfos){
            let sumArr = []

            assetDfos.forEach(function(x){
                if(assetDfos.length > 1){
                    sumArr.push(x[0]+x[1])
                    return;
                }
                sumArr.push(x[0], x[1])
                return;
            })
            let initValue = 0
            let diff = sumArr.reduce((prevValue, currentValue) => 
                currentValue - prevValue, initValue
            )
            const currentLength = state.roadGeometry.paths[0].at(-1)[2] - state.roadGeometry.paths[0].at(0)[2]
            if(Number(currentLength.toFixed(3)) === Number(diff.toFixed(3))){
                state.assetCoverage = [true, null]
                return;
            }
            else{
                try{
                    if(assetDfos.length > 1){
                        for(let i =0; i < assetDfos.length; i++){
                            if(assetDfos[i+1][1] === undefined){
                                return;
                            }
                            else if((assetDfos[i][1] > assetDfos[i+1][0])){
                                state.assetCoverage = [false, 'overlap', assetDfos[i][1], assetDfos[i+1][0]]
                                return state.assetCoverage;
                            }
                            else if((assetDfos[i][1] < assetDfos[i+1][0])){
                                state.assetCoverage = [false, 'gap', assetDfos[i][1], assetDfos[i+1][0]]
                                return state.assetCoverage
                            }
                            else{
                                state.assetCoverage = [false, 'short', assetDfos[0][1], Number(currentLength.toFixed(3))]
                                return state.assetCoverage
                            }
                        }
                        return;
                    }
                    else if(((assetDfos[0][1] - assetDfos[0][1]) < Number(currentLength.toFixed(3)) || (assetDfos[0][1] - assetDfos[0][1]) > Number(currentLength.toFixed(3)))){
                        state.assetCoverage = [false, 'short', assetDfos[0][1], Number(currentLength.toFixed(3))]
                        return;
                    }
                }
                catch{
                    console.log('no more assets to review')
                }

                
            }
        },
        setRoadInfoUpdate(state, roadInfo){
            state.roadInfoUpdate = roadInfo
        },
        setExecuteDfoPts(state, point){
            state.executeDfoPts = point
        },
        setEditExisting(state, edit){
            state.editExisting = edit
        },
        setAddRd(state, add){
            state.addRd = add
        },
        setStepperClose(state, steppClose){
            if(steppClose === true){
                document.getElementById('stepper').style.width = '500px'
            }
            state.stepperClose = steppClose
        },
        setUserName(state, userName){
            state.username = userName
        },
        setUserEmail(state, usrEmail){
            state.userEmail = usrEmail
        },
        setDeltaDis(state, newLen){
            if(newLen[1] === 'Reset'){
                console.log(state.deltaDistance)
                state.deltaDistance -= state.deltaDistance
                console.log(state.deltaDistance)
                return;
            }
            if(newLen[1] === "Add"){
                console.log(state.deltaDistance, newLen[0])
                state.deltaDistance += newLen[0]
                return;
            }
            else if(newLen[1] === "Delete"){
                state.deltaDistance -= newLen[0]
                return;
            }
            else if(newLen[1] === "Edit"){
                state.deltaDistance -= newLen[0]
                return;
            }
            else{
                if(state.oldLength === 0){
                    return;
                }
                let delta = newLen[0] - state.oldLength
                let mileage;
                if(state.oldLength < newLen[0]){
                    let addMiles = Math.abs(delta)
                    mileage = addMiles
                }
                if(state.oldLength > newLen[0]){
                    let subMiles = -Math.abs(delta)
                    mileage = subMiles
                }
                if(state.oldLength === newLen[0]){
                    mileage = 0
                }
                state.deltaDistance += mileage
                return;
            }
        },
        setOldLength(state, oldLen){
            state.oldLength = oldLen
        },
        setNewTotalLength(state, newLen){
            state.newTotalLength = newLen
        },
        setUpdateDfo(state, updateDfo){
            state.updateDfo = updateDfo
        },
        setObjectid(state, objid){
            state.objectid = objid
        },
        setCount(state, count){
            state.count = count
        },
        setCntyNmbr(state, ctyNmbr){
            state.cntyNmbr = ctyNmbr
        },
        setCntyMiles(state, cntyMiles){
            state.cntyMiles = cntyMiles
        },
        setCntyName(state, cntyName){
            state.cntyName = cntyName
        },
        setRoadbedName(state, roadbedName){
            state.roadbedName = roadbedName
        },
        setRoadbedDesign(state, roadbedDesign){
            state.roadbedDesign = roadbedDesign
        } ,
        setRoadbedSurface(state, newRoadbedSurface){
            state.roadbedSurface = newRoadbedSurface
        },
        setNumLane(state, numLane){
            state.numLane = numLane
        }
    },
})