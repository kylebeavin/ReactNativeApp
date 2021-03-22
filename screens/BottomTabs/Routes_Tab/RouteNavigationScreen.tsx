import Geolocation from '@react-native-community/geolocation';
import MapboxGL from '@react-native-mapbox-gl/maps';
import {useNavigation} from '@react-navigation/native';
import React, {useContext, useEffect, useState} from 'react';
import {
  StyleSheet,
  View,
  ScrollView,
  TouchableOpacity,
  Text,
} from 'react-native';

import {PermissionContext} from '../../../providers/PermissionContext';
import AppButton from '../../../components/Layout/AppButton';
import AppEditBtn from '../../../components/Layout/AppEditBtn';
import AppNavBtnGrp from '../../../components/Layout/AppNavBtnGrp';
import AppTitle from '../../../components/Layout/AppTitle';
import Colors from '../../../constants/Colors';
import Configs from '../../../constants/Configs';
import {Route} from '../../../types/routes';
import AppNavDetailGrp from '../../../components/Layout/AppNavDetailGrp';

MapboxGL.setAccessToken(Configs.MAPBOX_ACCESS_TOKEN);

interface Props {
  route: any;
}

const RouteNavigationScreen: React.FC<Props> = ({route}) => {
  const model: Route = route.params.model;

  //#region Use State Variables
  const navigation = useNavigation();
  const [userLocation, setUserLocation] = useState<any>();
  const {getPermissions} = useContext(PermissionContext);


  // Toggles
  const [stopsToggle, setStopsToggle] = useState(false);
  //#endregion

  useEffect(() => {
    getUserLocation();
  }, []);

  const getUserLocation = async () => {
    await getPermissions();
    Geolocation.getCurrentPosition((info) => {
      const {latitude, longitude} = info.coords;
      setUserLocation([longitude, latitude]);
    });
  };

  return (
    <View>
      <AppTitle title='Route Detail' />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.contentContainer}>

        <AppNavDetailGrp route={model}/>

        <View style={{paddingHorizontal: 10}}>
          {/* Map Card */}
          <View
            style={{
              borderColor: Colors.SMT_Secondary_1,
              marginBottom: 10,
              borderRadius: 3,
              backgroundColor: Colors.SMT_Secondary_1_Light_1,
              borderWidth: 2,
              height: 300,
              justifyContent: 'center',
            }}>
            <View style={styles.mapContainer}>
              <MapboxGL.MapView
                style={styles.map}
                styleURL={MapboxGL.StyleURL.Street}>
                <MapboxGL.UserLocation androidRenderMode="gps" visible={true} />

                <MapboxGL.Camera
                  zoomLevel={8}
                  centerCoordinate={userLocation}
                />

              </MapboxGL.MapView>
            </View>
          </View>
        </View>

        <TouchableOpacity onPress={() => setStopsToggle(!stopsToggle)}>
          <AppTitle title='Route Stops' />
        </TouchableOpacity>
        {!stopsToggle ? null : (
          <View style={{paddingLeft: 10}}>
            <Text>Hello stops!</Text>
          </View>
        )}
      </ScrollView>
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
  },
  mapContainer: {
    height: '100%',
    width: '100%',
  },
  map: {
    flex: 1,
  },
});

export default RouteNavigationScreen;

