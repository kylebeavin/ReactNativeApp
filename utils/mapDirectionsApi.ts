import MapboxDirectionsFactory from '@mapbox/mapbox-sdk/services/directions';



const clientOptions = {accessToken:   'pk.eyJ1Ijoic3VyaTIwMTkiLCJhIjoiY2tqc3V4NDE1MGN4ajJ1bDU2ajBmcjdzMSJ9.2sZgl13QF0Ge2vI_frDhTg'};
const directionsClient = MapboxDirectionsFactory(clientOptions);

export {directionsClient};