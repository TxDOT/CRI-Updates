export const roadInfo = {
    objectid: 0,
    roadbedName:'',
    roadbedDesign:'',
    roadbedSurface: null,
    numLane:0,
    addRoad: false,
    cntyName:'',
    cntyNmbr: 0,
    cntyMiles:0,
    count:0,

    get getObjectId(){
       return this.objectid
    },
    get getCount(){
       return this.count
    },
    get getcntyNmbr(){
       return this.cntyNmbr
    },
    get getcntyMiles(){
      return this.cntyMiles
    },
    get getcntyName(){
       return this.cntyName
    },
    get getaddRoad(){
        return this.addRoad
    },
    get getName(){
       return this.roadbedName
    },
    get getDesign(){
       return this.roadbedDesign
    },
    get getSurface(){
       return this.roadbedSurface
    },
    get getLane(){
       return this.numLane
    },

   set getObjectId(id){
      this.objectid = id
   },
   set getCount(cnt){
      this.count = cnt
   },
   set getcntyNmbr(nbr){
      this.cntyNmbr = nbr
   },
   set getcntyMiles(mile){
      this.cntyMiles = mile
   },
   set getcntyName(cnty){
      this.cntyName = cnty
   }, 
   set getaddRoad(road){
        this.addRoad = road
    },
    set getName(name){
        this.roadbedName = name;
    },
    set getDesign(design){
       this.roadbedDesign = design
    },
    set getSurface(surface){
       this.roadbedSurface = surface
    },
    set getLane(lane){
       this.numLane = lane
    },
  }

  