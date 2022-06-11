import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex);

export const store = new Vuex.Store({
    state:{
        objectid: 0,
        roadbedName:'',
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
        modifyRd: null,
        executeDfoPts: '',
        roadInfoUpdate:[],
        roadGeometry: [],
        assetCoverage: null,
        cntyEndingMiles: 0,
        stepNumber: 1,
        denyFeatClick: null

    },
    getters:{
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
        getStepNumber(state){
            return state.stepNumber
        },
        getCntyEndingMiles(state){
            return state.cntyEndingMiles
        },
        getRoadGeom(state){
            return state.roadGeometry
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
        getNewTotalLength(){

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
    mutations:{
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
        setStepNumber(state, step){
            state.stepNumber = step
        },
        setCntyEndingMiles(state, cntyMiles){
            state.cntyEndingMiles = cntyMiles
        },
        setRoadGeom(state, geom){
            state.roadGeometry = geom
        },
        setAssetCoverage(state, assetDfos){
            const currentLength = state.roadGeometry.paths[0].at(-1)[2] - state.roadGeometry.paths[0].at(0)[2]
            
            console.log(assetDfos, Number(currentLength.toFixed(3)))   
            if(Number(currentLength.toFixed(3)) === assetDfos){
                state.assetCoverage = true
            }
            else{
                state.assetCoverage = false
            }
            //state.assetCoverage = assetDfos
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
            if(newLen[1] === "Add"){
                state.deltaDistance += newLen[0]
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
                if (state.oldLength > newLen[0]){
                    let subMiles = -Math.abs(delta)
                    mileage = subMiles
                }
                if(state.oldLength === newLen[0]){
                    mileage = 0
                }
                state.deltaDistance += mileage
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
        setCntyNmbr(state, cntyNmbr){
            state.cntyNmbr = cntyNmbr
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