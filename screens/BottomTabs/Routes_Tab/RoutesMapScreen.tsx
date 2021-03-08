import {useNavigation} from '@react-navigation/native';
import React, {useEffect, useRef, useState, useContext} from 'react';
import {StyleSheet, View, Text, ScrollView} from 'react-native';
import AppButton from '../../../components/Layout/AppButton';
import AppNavBtnGrp from '../../../components/Layout/AppNavBtnGrp';
import AppTitle from '../../../components/Layout/AppTitle';
import MapboxGL from '@react-native-mapbox-gl/maps';
import {IS_ANDROID} from '../../../providers/PermissionContext';
import {lineString as makeLineString, point, featureCollection,feature} from '@turf/helpers';
import arrowIcon from '../../../assets/images/arrow2.png';
import {PermissionContext} from '../../../providers/PermissionContext'
import uuid from 'react-native-uuid';
//const mapStyle = 'mapbox://styles/mapbox/streets-v11'
MapboxGL.setAccessToken(
  'pk.eyJ1Ijoic3VyaTIwMTkiLCJhIjoiY2tqc3V4NDE1MGN4ajJ1bDU2ajBmcjdzMSJ9.2sZgl13QF0Ge2vI_frDhTg',
);
const truckLocation = [-83.093, 42.376];
const warehouseLocation = [-83.083, 42.363];

const layerStyles = {
  origin: {
    circleRadius: 5,
    circleColor: 'white',
  },
  destination: {
    circleRadius: 5,
    circleColor: 'white',
  },
  route: {
    lineColor: 'blue',
    
    lineWidth: 3,
    lineOpacity: 0.84,
  },
  progress: {
    lineColor: '#314ccd',
    lineWidth: 3,
  },
  arrows:{
    iconImage: arrowIcon,
    iconAllowOverlap: true,
   symbolPlacement:'line'
  }
};
const mapQueryUrl = "https://api.mapbox.com/optimized-trips/v1/mapbox/driving/-83.093,42.376;-83.083,42.363?geometries=geojson&access_token=pk.eyJ1Ijoic3VyaTIwMjEiLCJhIjoiY2tsd2l4bmxsMGpiYTJxbzB0NDQ5OW02MyJ9.ZLKmHBS2koQxLD754TEujA"

const RoutesMapScreen = () => {
  const {getPermissions,getRouteAddresses} = useContext(PermissionContext)
  

 

  // const [permissions, setPermissions] = useState({
  //   isFetchingAndroidPermission: IS_ANDROID,
  //   isAndroidPermissionGranted: false,
  // });
  //const [coordinates, setCoordinates] = useState([-73.99155, 40.73581]);
  const [coordinates, setCoordinates ] = useState([[-86.14662,39.959054],[-86.153842,39.961983],[-86.136427,39.960594]])
  const [routeData, setRouteData] = useState<any>({})

  useEffect(() => {
    // const getPermissions = async () => {
    //   if (IS_ANDROID) {
    //     const isGranted = await MapboxGL.requestAndroidLocationPermissions();
    //     setPermissions({
    //       isAndroidPermissionGranted: isGranted,
    //       isFetchingAndroidPermission: false,
    //     });
    //   }
    // };
  // MapboxGL.locationManager.start();
    // fetch(mapQueryUrl)
    // .then(res=>res.json())
    // .then(data => {
    //   console.log('I am here',data.trips[0].geometry)
    //  setRouteData(data.trips[0].geometry)
    // }
    // )
    // .catch(err=>console.log(err))
    const getData = async ()=>{
      try{
      let data = await getRouteAddresses()
      setRouteData(data)
      }
      catch(err){
        console.log(err,'onerror')
      }
    }
    getPermissions();
    getData()
    
    // getGeoJson()
  }, []);
  
    const renderRoutePoints = ()=>{
      if (!coordinates) {
        console.log('i am here in points')
        return null;
      }
     
      return (
        coordinates.map((point:any)=>{
        console.log('here, here',point)
        return  <MapboxGL.PointAnnotation id={String(Math.random()*10000)} key={Math.random()*10000} coordinate={point}/>
      })
      )
    }
    const renderRoute = () =>{
      if (!routeData) {
        return null;
      }
      return (
        <MapboxGL.ShapeSource id="routeSource" shape={routeData.routeTrips}>
          <MapboxGL.LineLayer
            id="routeFill"
            style={layerStyles.route}
          />
        </MapboxGL.ShapeSource>
      );
    }
    const renderArrows = ()=>{
      if (!routeData) {
        return null;
      }
      
          return (
            <MapboxGL.ShapeSource id="routeSource" shape={routeData.routeTrips}>
              <MapboxGL.SymbolLayer id='arrows' style={layerStyles.arrows} minZoomLevel={1} aboveLayerID="routeFill"/>
            </MapboxGL.ShapeSource>
          );
        }
  

  console.log('route data', routeData)
  return (
    <View>
      <AppTitle title="Routes" help search />

      {/* <AppNavBtnGrp>
             <AppButton
               title="Routes"
               onPress={() => navigation.navigate("RoutesScreen")}
               outlined={true}
             />
             <AppButton
               title="Calendar"
               onPress={() => navigation.navigate("RoutesCalendarScreen")}
               outlined={true}
             />
             <View style={{marginRight: -10}}>
             <AppButton
               title="Map"
               onPress={() => navigation.navigate("RoutesMapScreen")}
               outlined={false}
             />
             </View>
       </AppNavBtnGrp> */}
       
      <View style={styles.container}>
        <MapboxGL.MapView style={styles.map} styleURL={MapboxGL.StyleURL.Street}>
          <MapboxGL.UserLocation androidRenderMode="gps" visible={true}/>
            
          <MapboxGL.Camera zoomLevel={8} centerCoordinate={truckLocation} />
          {/* <MapboxGL.LineLayer id='routeLine'/> */}
          <MapboxGL.PointAnnotation id='truckLocation' coordinate={truckLocation}/>
          <MapboxGL.PointAnnotation id='warehouseLocation' coordinate={warehouseLocation}/>
          {renderRoute()}
          {renderArrows()}
          {renderRoutePoints()}
        </MapboxGL.MapView>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  contentContainer: {
    // This is the scrollable part
  },
  scrollView: {
    height: '100%',
    width: '100%',
    paddingHorizontal: 10,
  },
  container: {
    height: '100%',
    width: '100%',
  },
  map: {
    flex: 1,
  },
});

export default RoutesMapScreen;
