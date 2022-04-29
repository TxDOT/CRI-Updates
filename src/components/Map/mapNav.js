import {view} from '../Map/map';


export function jumpToGoogle() {
    console.log("I'm gonna jump to google now");
    let viewCenter = view.get('center');
    let lat = viewCenter.latitude;
    let lon = viewCenter.longitude;
    let zoom = view.zoom;
    window.open("https://www.google.com/maps/@"+lat+","+lon+","+zoom+"z");
}