//=========================================
// Pulled these types from Mapbox Docs ====
// to learn more about each property ======
// go here https://docs.mapbox.com/api/navigation/directions/#route-object
//=========================================

export type MapboxRoute = {
    duration: number;
    distance: number;
    weight_name: string;
    weight: number;
    geometry: MapboxGeometry;
    legs: MapboxRouteLeg[];
    voiceLocale: string;
};

export type MapboxGeometry  = {
    type: string;
    coordinates: MapboxPoint[];
};

export type MapboxRouteLeg = {
    distance: number;
    duration: number;
    steps: MapboxRouteStep[];
    summary: string;
    admins: [];
    incidents: [];
    annotation: MapboxAnnotations; 

};

export type MapboxRouteStep = {
    distance: number;
    driving_side: string;
    duration: number;
    geometry: MapboxGeometry[];
    intersections: [];
    maneuver: MapboxManeuver;
    mode: string;
    namve: string;
    weight: number;
};

export type MapboxManeuver = {
    bearing_after: number;
    bearing_before: number;
    instruction: string;
    location: MapboxPoint;
    type: string;
};

export type MapboxPoint = [
    number,
    number
];

export type MapboxAnnotations = {
    distance: number[];
    duration: number[];
    speed: number[];
    congestion: string[];
    maxspeed: MapboxMaxspeed[];
};

export type MapboxMaxspeed = {
    speed: number;
    unit: string;
};