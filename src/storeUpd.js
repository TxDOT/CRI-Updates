import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex);

export const store = new Vuex.Store({
    state:{
        objectid: 0,
        roadbedName: null,
        roadbedDesign: null,
        roadbedSurface: null,
        numLane: null,
        //addRoad: false,
        cntyName:'',
        cntyNmbr: 0,
        cntyMiles:0,
        count:0,
        updateDfo:0,
        oldLength: 0,
        newTotalLength: 0,
        deltaDistance: 0,
        username: '',
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
        isUndoDisable: true,
        isRedoDisable: true,
        isClearEditBtn: false,
        isClearMapTools: false,
        isClearAboutHelpTools: false,
        isAbout: false
    },
    getters:{
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
        //  addRoad(state){
        //     return state.addRoad
        //  },
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
            console.log(geom)
            state.featureGeometry = geom
        },
        setAssetCoverage(state, assetDfos){
            console.log(assetDfos)
            let sumArr = []
            assetDfos.forEach(function(x){
                sumArr.push(x[0]+x[1])
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
                            }
                            else if((assetDfos[i][1] < assetDfos[i+1][0])){
                                state.assetCoverage = [false, 'gap', assetDfos[i][1], assetDfos[i+1][0]]
                            }
                            else{
                                state.assetCoverage = [false, 'short', assetDfos[0][1], Number(currentLength.toFixed(3))]
                            }
                        }
                        return;
                    }
                    // else if(assetDfos[0][1] === Number(currentLength.toFixed(3))){
                    //     console.log(assetDfos[0][1] === Number(currentLength.toFixed(3)))
                    //     state.assetCoverage = [false, 'long', assetDfos[0][1], Number(currentLength.toFixed(3))]
                    //     return;
                    // }
                    else if((assetDfos[0][1] < Number(currentLength.toFixed(3)))){
                        state.assetCoverage = [false, 'short', assetDfos[0][1], Number(currentLength.toFixed(3))]
                        return;
                    }
                }
                catch{
                    console.log('no more assets to review')
                }

                
            }
            // state.assetCoverage = assetDfos
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
        setDeltaDis(state, newLen){
            console.log(newLen, state.deltaDistance)
            if(newLen[1] === "Add"){
                console.log(newLen, state.deltaDistance)
                state.deltaDistance += newLen[0]
                console.log(state.deltaDistance)
                return;
            }
            else if(newLen[1] === "Delete"){
                console.log(state.deltaDistance)
                state.deltaDistance -= newLen[0]
                console.log(state.deltaDistance)
                return;
            }
            else if(newLen[1] === "Edit"){
                state.deltaDistance -= newLen[0]
                return;
            }
            else{
                console.log('is this starting??', state.oldLength, newLen[0])

                if(state.oldLength === 0){
                    return;
                }
                let delta = newLen[0] - state.oldLength
                let mileage;
                if(state.oldLength < newLen[0]){
                    let addMiles = Math.abs(delta)
                    mileage = addMiles
                }
                if (state.oldLength > newLen[0]){
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
            console.log(ctyNmbr)
            state.cntyNmbr = ctyNmbr
        },
        setCntyMiles(state, cntyMiles){
            state.cntyMiles = cntyMiles
        },
        setCntyName(state, cntyName){
            state.cntyName = cntyName
        },
        // setAddRoad(state, addRoad){
        //     state.addRoad = addRoad
        // },
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