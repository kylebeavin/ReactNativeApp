import {useNavigation} from '@react-navigation/native';
import React, {useEffect, useRef, useState, useContext} from 'react';
import {StyleSheet, View, Text, ScrollView} from 'react-native';
import AppButton from '../../../components/Layout/AppButton';
import AppNavBtnGrp from '../../../components/Layout/AppNavBtnGrp';
import AppTitle from '../../../components/Layout/AppTitle';
import MapboxGL from '@react-native-mapbox-gl/maps';

import {PermissionContext} from '../../../providers/PermissionContext'
import Geolocation from '@react-native-community/geolocation';
import RoutesDisplay from '../../../components/map/mapRouteDisplay';
//const mapStyle = 'mapbox://styles/mapbox/streets-v11'
MapboxGL.setAccessToken(
  'pk.eyJ1Ijoic3VyaTIwMTkiLCJhIjoiY2tqc3V4NDE1MGN4ajJ1bDU2ajBmcjdzMSJ9.2sZgl13QF0Ge2vI_frDhTg',
);





const RoutesMapScreen = () => {
  const {getPermissions} = useContext(PermissionContext)
  const [userLocation, setUserLocation] = useState<any>()

 

  // const [permissions, setPermissions] = useState({
  //   isFetchingAndroidPermission: IS_ANDROID,
  //   isAndroidPermissionGranted: false,
  // });
  

  useEffect(() => {
    const getUserLocation = async()=>{
        await getPermissions()
        Geolocation.getCurrentPosition(info => {
          console.log(info)
          const {latitude, longitude} = info.coords
          setUserLocation([longitude, latitude])
        });
    }
     
     getUserLocation()
  }, []);
  


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
            
          <MapboxGL.Camera zoomLevel={8} centerCoordinate={userLocation} />
          {/* <MapboxGL.LineLayer id='routeLine'/> */}
         
          {/* {renderRoute()}
          {renderArrows()}
          {renderRoutePoints()} */}
        <RoutesDisplay/>
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
