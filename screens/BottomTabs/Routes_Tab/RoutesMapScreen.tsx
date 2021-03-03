import {useNavigation} from '@react-navigation/native';
import React, {useEffect, useRef, useState} from 'react';
import {StyleSheet, View, Text, ScrollView} from 'react-native';
import AppButton from '../../../components/Layout/AppButton';
import AppNavBtnGrp from '../../../components/Layout/AppNavBtnGrp';
import AppTitle from '../../../components/Layout/AppTitle';
import MapboxGL from '@react-native-mapbox-gl/maps';
import {IS_ANDROID} from '../../../utils/platform';
import {directionsClient} from '../../../utils/mapDirectionsApi';
import {lineString as makeLineString, point, featureCollection,feature} from '@turf/helpers';
//const mapStyle = 'mapbox://styles/mapbox/streets-v11'
MapboxGL.setAccessToken(
  'pk.eyJ1Ijoic3VyaTIwMTkiLCJhIjoiY2tqc3V4NDE1MGN4ajJ1bDU2ajBmcjdzMSJ9.2sZgl13QF0Ge2vI_frDhTg',
);
const truckLocation = [-83.093, 42.376];
const warehouseLocation = [-83.083, 42.363];
const lastQueryTime = 0;
const lastAtRestaurant = 0;
const keepTrack = [];
const currentSchedule = [];
const currentRoute = null;
const pointHopper = {};
const pause = true;
const speedFactor = 50;
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
};
const mapQueryUrl = "https://api.mapbox.com/optimized-trips/v1/mapbox/driving/-83.093,42.376;-83.083,42.363?geometries=geojson&access_token=pk.eyJ1Ijoic3VyaTIwMTkiLCJhIjoiY2p2NWkydHZ0MGdtMDN5bzAwZTRmdW5qZCJ9.JkIb7AEYASdKtZXur-rDJQ"

const RoutesMapScreen = () => {
  const [permissions, setPermissions] = useState({
    isFetchingAndroidPermission: IS_ANDROID,
    isAndroidPermissionGranted: false,
  });
  const [coordinates, setCoordinates] = useState([-73.99155, 40.73581]);
  const [routeData, setRouteData] = useState()

  useEffect(() => {
    const getPermissions = async () => {
      if (IS_ANDROID) {
        const isGranted = await MapboxGL.requestAndroidLocationPermissions();
        setPermissions({
          isAndroidPermissionGranted: isGranted,
          isFetchingAndroidPermission: false,
        });
      }
    };
    fetch(mapQueryUrl)
    .then(res=>res.json())
    .then(data => {
      console.log(data.trips[0].geometry)
     setRouteData(data.trips[0].geometry)
    }
    )
    .catch(err=>console.log(err))
    getPermissions();
    // getGeoJson()
  }, []);

  const renderRoute = () =>{
    if (!routeData ) {
      return null;
    }

    return (
      <MapboxGL.ShapeSource id="routeSource" shape={routeData}>
        <MapboxGL.LineLayer
          id="routeFill"
          style={layerStyles.route}
        />
      </MapboxGL.ShapeSource>
    );
  }

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
        <MapboxGL.MapView style={styles.map}>
          <MapboxGL.UserLocation androidRenderMode="gps" visible={true}/>
            
          <MapboxGL.Camera zoomLevel={8} centerCoordinate={truckLocation} />
          {/* <MapboxGL.LineLayer id='routeLine'/> */}
          <MapboxGL.PointAnnotation id='truckLocation' coordinate={truckLocation}/>
          <MapboxGL.PointAnnotation id='warehouseLocation' coordinate={warehouseLocation}/>
          {renderRoute()}
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
