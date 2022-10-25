import {view, sketch, gLayer} from '../Map/map';
import {store} from '../../store'

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


