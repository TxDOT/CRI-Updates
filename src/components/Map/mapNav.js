import {view, sketch, gLayer} from '../Map/map';
import {store} from '../../store'

export function jumpToGoogle() {
    console.log("I'm gonna jump to google now");
    let viewCenter = view.get('center');
    let lat = viewCenter.latitude;
    let lon = viewCenter.longitude;
    let zoom = view.zoom;
    window.open("https://www.google.com/maps/@"+lat+","+lon+","+zoom+"z");
}

export function undoSketch(){
    let graphic = gLayer.graphics.items.filter(x=> x.attributes.objectid === store.getters.getObjectid)
    sketch.undo(graphic, 'polyline')
    checkEditsHistory()
}

export function redoSketch(){
    let graphic = gLayer.graphics.items.filter(x=> x.attributes.objectid === store.getters.getObjectid)
    sketch.redo(graphic, 'polyline')
    checkEditsHistory()
}

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

