import {view, sketch, gLayer, basemapToggle} from '../Map/map.js';
import {store} from '../../store'
import {addRoadbed, stopEditing} from '../Map/edit.js'

//jump to google
export function jumpToGoogle() {
    let viewCenter = view.get('center');
    let lat = viewCenter.latitude;
    let long = viewCenter.longitude;
    let zoom = Math.round(Math.log(591657550.500000 /(view.scale/2))/Math.log(2))-1;
    window.open("https://www.google.com/maps/@"+lat+","+long+","+zoom+"z");
}
//undo sketch
export function undoSketch(){
    let graphic = gLayer.graphics.items.filter(x=> x.attributes.objectid === store.getters.getObjectid)
    sketch.undo(graphic, 'polyline')
    checkEditsHistory()
}
//redo sketch
export function redoSketch(){
    let graphic = gLayer.graphics.items.filter(x=> x.attributes.objectid === store.getters.getObjectid)
    sketch.redo(graphic, 'polyline')
    checkEditsHistory()
}
//checks history to determine if redo/undo should be disabled.
function checkEditsHistory(){
    if(sketch['_operationHandle'].history.redo.length && sketch['_operationHandle'].history.undo.length){
        store.commit('setIsRedoDisable', false)
        store.commit('setIsUndoDisable', false)
    }
    else if(sketch['_operationHandle'].history.undo.length && !sketch['_operationHandle'].history.redo.length){
        store.commit('setIsUndoDisable', false)
        store.commit('setIsRedoDisable', true)
    }
    else if(sketch['_operationHandle'].history.redo.length && !sketch['_operationHandle'].history.undo.length){
        store.commit('setIsUndoDisable', true)
        store.commit('setIsRedoDisable', false)
    }
}

export function basemapDisplayOnEditType(){
    console.log(view.scale)
    if(view.scale > 9382){

        store.commit('setIsOverlay', true)
        //turn on overlay
        return true
    }
    if(basemapToggle.viewModel.activeBasemap.baseLayers.items[0].type !== "wmts"){
        console.log(view.zoom, view.scale)
        basemapToggle.toggle()
        return
    }
    return 
}

export function basemapDisplayOnZoom(){
    const watchScale = view.watch("scale", (aScale)=>{
        const delimeter = 9382
        if((aScale < delimeter) && basemapToggle.viewModel.activeBasemap.baseLayers.items[0].type !== "wmts"){
            const isAdd = store.getters.getAddRd
            if(isAdd){
                store.commit('setIsOverlay', false)
                addRoadbed()
                    .then(() =>{
                        store.commit("setAddRd", false)
                        store.commit("setStepperClose", true)
                    })
            }
            try{
                basemapToggle.toggle()
            }
            catch(err){
                console.log(err)
            }
            return
        }
        if((aScale > delimeter) && basemapToggle.viewModel.activeBasemap.baseLayers.items[0].type !== "vector-tile"){
            const isAdd = store.getters.getAddRd
            if(isAdd){
                stopEditing()
            }
            try{
                basemapToggle.toggle()
            }
            catch(err){
                console.log(err)
            }
            return
        }
    })
    return watchScale
}


