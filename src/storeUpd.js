import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex);

export const store = new Vuex.Store({
    state:{
        objectid: 0,
        roadbedName:'',
        roadbedDesign:'',
        roadbedSurface: null,
        numLane:0,
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
        addRd:false,
        editExisting: null,
        executeDfoPts: ''
    },
    getters:{
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
        cntyName(state){
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
        roadbedSurface(state){
            return state.roadbedSurface
        },
        getNumLane(state){
            return state.numLane
        }
    },
    mutations:{
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
                console.log(newLen[0], state.oldLength)
                let delta = newLen[0] - state.oldLength
                let mileage;
                if(state.oldLength < newLen[0]){
                    let addMiles = Math.abs(delta)
                    mileage = addMiles
                }
                if (state.oldLength > newLen[0]){
                    let subMiles = -Math.abs(delta)
                    console.log(subMiles)
                    mileage = subMiles
                }
                if(state.oldLength === newLen[0]){
                    mileage = 0
                }
                console.log(mileage)
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
    actions:{
        roadbedSurfaceAction(context, newDfo){
            let newArr = []
            for(let d in newDfo){
                newArr.push({ASSET_LN_BEGIN_DFO_MS: newDfo[d].AssetBeginDfo, ASSET_LN_END_DFO_MS: newDfo[d].AssetEndDfo, objectid: newDfo[d].objectid, SRFC_TYPE_ID: newDfo[d].srfcType})
            }
            
            context.commit('setRoadbedSurface', newArr)
        }   
    }
})