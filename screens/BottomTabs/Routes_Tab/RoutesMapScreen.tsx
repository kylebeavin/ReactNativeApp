import {useNavigation} from '@react-navigation/native';
import React, {useEffect, useState, useContext} from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import AppButton from '../../../components/Layout/AppButton';
import AppNavBtnGrp from '../../../components/Layout/AppNavBtnGrp';
import AppTitle from '../../../components/Layout/AppTitle';
import MapboxGL from '@react-native-mapbox-gl/maps';

import {PermissionContext} from '../../../providers/PermissionContext';
import Geolocation from '@react-native-community/geolocation';
import RoutesDisplay from '../../../components/map/mapRouteDisplay';
import {getDateStringsFromDate} from '../../../utils/Helpers';
import Configs from '../../../constants/Configs';
import AppContext from '../../../providers/AppContext';
import {ToastContext} from '../../../providers/ToastProvider';
import {Route} from '../../../types/routes';
import Colors from '../../../constants/Colors';

MapboxGL.setAccessToken(Configs.MAPBOX_ACCESS_TOKEN);

const RoutesMapScreen = () => {
  //#region Use State Variables
  const navigation = useNavigation();
  const {grpId, token} = useContext(AppContext);
  const {show} = useContext(ToastContext);
  const {getPermissions} = useContext(PermissionContext);
  const [userLocation, setUserLocation] = useState<any>();
  const [routesList, setRoutesList] = useState<Route[]>([]);
  const [selected, setSelected] = useState<Route>();
  //#endregion

  useEffect(() => {
    getUserLocation();
    getRoutes();
  }, []);

  const getUserLocation = async () => {
    await getPermissions();
    Geolocation.getCurrentPosition((info) => {
      const {latitude, longitude} = info.coords;
      setUserLocation([longitude, latitude]);
    });
  };

  const getRoutes = async () => {
    await fetch(`${Configs.TCMC_URI}/api/routesBy`, {
      method: 'POST',
      headers: {'Content-Type': 'application/json', 'x-access-token': token},
      body: JSON.stringify({group_id: grpId}),
    })
      .then((res) => res.json())
      .then((json) => setRoutesList(json.data))
      .catch((err) => show({message: err.message}));
  };

  const handleRoutePress = (id: string) => {
    const route = routesList.filter(u => u._id === id)
    setSelected(route[0]);
  };

  return (
    <View style={styles.screen}>
      <AppTitle title="Routes" />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.contentContainer}>
        <View style={{paddingHorizontal: 10}}>
          <AppNavBtnGrp>
            <AppButton
              title="ROUTES"
              onPress={() => navigation.navigate('RoutesScreen')}
              outlined={true}
            />
            <AppButton
              title="CALENDAR"
              onPress={() => navigation.navigate('RoutesCalendarScreen')}
              outlined={true}
            />
            <View style={{marginRight: -10}}>
              <AppButton
                title="MAP"
                onPress={() => navigation.navigate('MapScreen')}
                outlined={false}
              />
            </View>
          </AppNavBtnGrp>

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

                <RoutesDisplay route={selected!}/>
              </MapboxGL.MapView>
            </View>
          </View>
        </View>

        <View style={{marginBottom: 10}}>
          <AppTitle title='Route Events' />
        </View>

        <View style={{paddingHorizontal: 10, paddingBottom: 40}}>
          {routesList.map((u) => {
            return (
              <TouchableOpacity
                style={selected?._id === u._id ? [styles.card, {borderWidth: 2,borderColor: Colors.SMT_Secondary_2_Light_2}] : styles.card}
                key={u._id}
                onPress={() => handleRoutePress(u._id)}>
                <View style={{flexDirection: 'row'}}>
                  <View style={{flex: 1}}>
                    <Text numberOfLines={1} style={styles.titleText}>
                      {u._id}
                    </Text>
                    <Text>{u.route_stage}</Text>
                  </View>
                  <View style={{flex: 1}}>
                    <Text
                      style={{
                        color: Colors.SMT_Primary_1,
                        textAlign: 'right',
                      }}>
                      {getDateStringsFromDate(u.time).date}
                    </Text>
                    <Text
                      style={{
                        fontWeight: 'bold',
                        color: Colors.SMT_Secondary_2_Light_1,
                        textAlign: 'right',
                      }}>
                      {getDateStringsFromDate(u.time).time}
                    </Text>
                  </View>
                </View>
              </TouchableOpacity>
            );
          })}
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
    screen: {
    marginBottom: 36,
  },
  contentContainer: {
    // This is the scrollable part
  },
  mapContainer: {
    height: '100%',
    width: '100%',
  },
  map: {
    flex: 1,
  },
  calendarContainer: {
    marginBottom: 10,
    marginTop: -10,
    paddingHorizontal: 10,
  },
  container: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    marginBottom: 20,
  },
  column2: {
    flex: 1,
    alignItems: 'flex-end',
  },
  picker: {
    flex: 1,
    paddingLeft: 15,
    borderColor: Colors.SMT_Secondary_1_Light_1,
    borderWidth: 2,
    borderRadius: 3,
    height: 36,
    overflow: 'hidden',
  },
  scrollView: {
    height: '100%',
    width: '100%',
  },
  content: {
    marginBottom: 10,
  },
  //=== Card ===//
  card: {
    backgroundColor: Colors.SMT_Tertiary_1,
    marginBottom: 3,
    borderWidth: 1,
    borderColor: Colors.SMT_Secondary_1_Light_1,
    borderRadius: 3,
    paddingVertical: 3,
    paddingHorizontal: 5,
  },
  title: {
    marginBottom: 10,
  },
  titleText: {
    fontWeight: 'bold',
  },
});

export default RoutesMapScreen;
