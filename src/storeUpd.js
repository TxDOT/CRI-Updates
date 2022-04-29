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
    },
    getters:{
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
            console.log(state)
            return state.roadbedSurface
        },

        getNumLane(state){
            return state.numLane
        }
    },
    mutations:{
        setUpdateDfo(state, updateDfo){
            state.updateDfo = updateDfo
        },
        setObjectid(state, objectid){
            state.objectid = objectid
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
            console.log(state.roadbedSurface , newRoadbedSurface)
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