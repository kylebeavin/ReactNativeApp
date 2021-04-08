import React, {useContext, useEffect, useState} from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import Configs from '../../../constants/Configs';
import AppButton from '../../../components/Layout/AppButton';
import Colors from '../../../constants/Colors';
import AppTitle from '../../../components/Layout/AppTitle';
import AppNavBtnGrp from '../../../components/Layout/AppNavBtnGrp';
import {Order} from '../../../types/service';
import {useNavigation} from '@react-navigation/native';
import {getDateStringsFromDate} from '../../../utils/Helpers';
import AppContext from '../../../providers/AppContext';
import { ToastContext } from '../../../providers/ToastProvider';
import MapboxGL from '@react-native-mapbox-gl/maps';
import { PermissionContext } from '../../../providers/PermissionContext';
import Geolocation from '@react-native-community/geolocation';
import useDates from '../../../hooks/useDates';
import AppNavGroup from '../../../components/Layout/AppNavGroup';

interface Props {
  navigation: any;
}

const ServicesScreen: React.FC<Props> = () => {
  //#region
  const {grpId, token} = useContext(AppContext);
  const {show} = useContext(ToastContext);
  const {getPermissions} = useContext(PermissionContext);
  const [userLocation, setUserLocation] = useState<any>();
  const navigation = useNavigation();
  const [orders, setOrders] = useState<Order[]>([]);
  const {getSelectedDateRange} = useDates();
  //#endregion

  useEffect(() => {
    getUserLocation();
    getOrders();
  }, []);

  const getUserLocation = async () => {
    await getPermissions();
    Geolocation.getCurrentPosition((info) => setUserLocation([info.coords.longitude, info.coords.latitude]));
  };

  const getOrders = async () => {
    let {gte, lt} = getSelectedDateRange();
    await fetch(`${Configs.TCMC_URI}/api/ordersBy`, {
      headers: {'Content-Type': 'application/json', 'x-access-token': token},
      method: 'POST',
      body: JSON.stringify({group_id: grpId, service_date: {$gte: gte, $lt: lt}}),
    })
      .then((res) => res.json())
      .then((json) => {
        if (json.data) {
          setOrders(json.data);
        }
      })
      .catch((err) => show({message: err.message}));
  };

  return (
    <View style={styles.screen}>
      <AppTitle title="Service" />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.contentContainer}>
          <View style={{paddingHorizontal: 10}}>
            <AppNavGroup
              add={{title: 'Order', modal: 'CreateOrderModal'}}
              list="OrdersScreen"
              schedule="OrdersCalendarScreen"
              map="OrdersMapScreen"
              focused="Map"
            />
          </View>

        <View style={{paddingHorizontal: 10}}>
          <View
            style={{
              borderColor: Colors.SMT_Secondary_1_Light_1,
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

        <View style={{marginBottom: 10}}>
          <AppTitle title={`Orders: ${new Date().toLocaleDateString()}`} />
        </View>

        <View style={{paddingHorizontal: 10}}>
          {orders.map((u: Order, i: number) => {
            return (
              <TouchableOpacity
                style={styles.card}
                key={i}
                onPress={() =>
                  navigation.navigate('OrderDetailsScreen', {model: u})
                }>
                <View style={{flexDirection: 'row', flex: 1}}>
                  <View>
                    <Text style={styles.titleText}>
                      {u.account_id.account_name}
                    </Text>
                    <Text>Demo: {u.is_demo ? 'Yes' : 'No'}</Text>
                  </View>
                  <View style={{flex: 1}}>
                    <Text
                      style={{
                        color: Colors.SMT_Primary_1,
                        textAlign: 'right',
                      }}>
                      {getDateStringsFromDate(u.service_date).date}
                    </Text>
                    <Text
                      style={{
                        fontWeight: 'bold',
                        color: Colors.SMT_Secondary_2_Light_1,
                        textAlign: 'right',
                      }}>
                      {getDateStringsFromDate(u.service_date).time}
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
  mapContainer: {
    height: '100%',
    width: '100%',
  },
  map: {
    flex: 1,
  },
  card: {
    backgroundColor: Colors.SMT_Tertiary_1,
    marginBottom: 3,
    borderWidth: 1,
    borderColor: Colors.SMT_Secondary_1_Light_1,
    borderRadius: 3,
    paddingVertical: 3,
    paddingHorizontal: 5,
  },
  // column1: {},
  // container: {
  //   flexDirection: 'row',
  //   justifyContent: 'space-evenly',
  //   marginBottom: 20,
  // },
  contentContainer: {
    // This is the scrollable part
  },
  // column2: {
  //   flex: 1,
  //   alignItems: 'flex-end',
  // },
  // picker: {
  //   flex: 1,
  //   paddingLeft: 15,
  //   borderColor: Colors.SMT_Secondary_1_Light_1,
  //   borderWidth: 2,
  //   borderRadius: 3,
  //   height: 36,
  //   overflow: 'hidden',
  // },
  screen: {
    marginBottom: 36,
  },
  scrollView: {
    height: '100%',
    width: '100%',
  },
  // status: {},
  // statusValid: {
  //   color: Colors.Success,
  // },
  // statusInvalid: {
  //   color: Colors.Info,
  // },
  titleText: {
    fontWeight: 'bold',
    color: 'black'
  },
});

export default ServicesScreen;
