import {useNavigation} from '@react-navigation/native';
import React, {useEffect, useState, useContext} from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import AppTitle from '../../../components/layout/AppTitle';
import MapboxGL from '@react-native-mapbox-gl/maps';

import {PermissionContext} from '../../../providers/PermissionContext';
import Geolocation from '@react-native-community/geolocation';
import RoutesDisplay from '../../../components/map/mapRouteDisplay';
import {getDateStringsFromDate, isSuccessStatusCode} from '../../../utils/Helpers';
import Configs from '../../../constants/Configs';
import AppContext from '../../../providers/AppContext';
import {ToastContext} from '../../../providers/ToastProvider';
import {Route} from '../../../types/routes';
import Colors from '../../../constants/Colors';
import AppNavGroup from '../../../components/layout/AppNavGroup';
import AppMapbox from '../../../components/map/AppMapbox';
import AppMapboxLines from '../../../components/map/AppMapboxLines';
import AppMapboxPoint from '../../../components/map/AppMapboxPoint';
import { MapboxPoint } from '../../../types/mapbox';
import useMapbox from '../../../hooks/useMapbox';

MapboxGL.setAccessToken(Configs.MAPBOX_ACCESS_TOKEN);

const RoutesMapScreen = () => {
  //#region Use State Variables
  const navigation = useNavigation();
  const {grpId, token} = useContext(AppContext);
  const {show} = useContext(ToastContext);
  const {formatAddresses, formatCoordinates} = useMapbox();
  const {getPermissions} = useContext(PermissionContext);
  const [coordinates, setCoordinates] = useState<MapboxPoint[]>([]);
  const [routeLine, setRouteLine] = useState<any>();
  const [routesList, setRoutesList] = useState<Route[]>([]);
  const [selected, setSelected] = useState<Route>();
  //#endregion

  useEffect(() => {
    getRoutes();
  }, []);

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

  const getCoordinates = async (addresses: string[]): Promise<MapboxPoint[]> => {
    // Use geocoding endpoint to convert addresses to coordinates.
    let addressList = formatAddresses(addresses);
    const coordsStore: any = [];

    let promises = addressList.map(async (u) => await fetch(`https://api.mapbox.com/geocoding/v5/mapbox.places/${u}.json?access_token=${Configs.MAPBOX_ACCESS_TOKEN}`));

    await Promise.all(promises)
      .then((responses) => {
        return Promise.all(
          responses.map(function (response) {
            return response.json();
          }),
        );
      })
      .then((data) => {
        data.forEach((curData) => {
          coordsStore.push(curData.features[0].center);
        });
        setCoordinates(data.map(u => u.features[0].center));
        
        return new Promise((resolve) => {
          resolve(coordsStore);
        });
      })
      .catch((err) => err);

    return coordsStore;
  };

  const getOptimizedRoute = async (coordinates: MapboxPoint[]): Promise<any> => {
    // Use the optimized-trips endpoint for planning the stops order ahead of time.
    // Todo: For a more complete implementation return the entire response object.
    let test = await fetch(`https://api.mapbox.com/optimized-trips/v1/mapbox/driving/${formatCoordinates(coordinates)}?geometries=geojson&access_token=${Configs.MAPBOX_ACCESS_TOKEN}`)
      .then((res) => res.json())
      .then((json) => {
        if (json.code === 'Ok') {
          setRouteLine(json);
          return new Promise(resolve => resolve(json.trips[0].geometry));
        }
      })
      .catch(err => show({message: err.message}));

    return test;
  };

  const handleRoutePress = async (id: string) => {
    const route = routesList.filter(u => u._id === id)
    let addresses: string[] = [];

    setCoordinates([]);
    setRouteLine(null);

    let response = await fetch(`${Configs.TCMC_URI}/api/ordersBy`, {
      method: 'POST',
      headers: {'Content-Type': 'application/json', 'x-access-token': token},
      body: JSON.stringify({_id: {$in: route[0].service_stop}})
    })
      .then(res => res.json())
      .then(json => {
        if (isSuccessStatusCode(json.status)){
          return json.data;
        } else {
          show({message: json.message});
        }
      })
      .catch(err => show({message: err.message}));

      response.map((u: any) => addresses.push(u.location));
      let coords = await getCoordinates(addresses);
      getOptimizedRoute(coords);

    setSelected(route[0]);
  };

  return (
    <View style={styles.screen}>
      <AppTitle title="Routes" />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.contentContainer}>
        <View style={{paddingHorizontal: 10}}>
          <AppNavGroup
            add={{
              title: 'Route',
              modal: 'ModalPopup',
              modals: [
                'CreateTruckModal',
                'CreateRouteModal',
                'CreatePreTripInspectionModal',
              ],
            }}
            list="RoutesScreen"
            schedule="RoutesCalendarScreen"
            map="RoutesMapScreen"
            focused="Map"
          />
        </View>

        <View style={{paddingHorizontal: 10}}>
          <AppMapbox>
            {coordinates.map((u, i) => {
              return (
                <AppMapboxPoint
                  key={`${u[0]}${i}${u[1]}`}
                  id={`${u[0]}${i}${u[1]}`}
                  point={u}
                />
              );
            })}

            {routeLine ? (
              <AppMapboxLines geometry={routeLine.trips[0].geometry} />
            ) : null}
          </AppMapbox>
        </View>

        <View style={{marginBottom: 10}}>
          <AppTitle title="Route Events" />
        </View>

        <View style={{paddingHorizontal: 10, paddingBottom: 40}}>
          {routesList.map((u) => {
            return (
              <TouchableOpacity
                style={
                  selected?._id === u._id
                    ? [
                        styles.card,
                        {
                          borderWidth: 2,
                          borderColor: Colors.SMT_Secondary_2_Light_2,
                        },
                      ]
                    : styles.card
                }
                key={u._id}
                onPress={() => handleRoutePress(u._id)}>
                <View style={{flexDirection: 'row'}}>
                  <View style={{flex: 1}}>
                    <Text numberOfLines={1} style={styles.titleText}>
                      {u.route_id}
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
