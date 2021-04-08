import React, {useContext, useEffect, useState} from 'react';
import {
  ScrollView,
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
} from 'react-native';
import MapboxGL from '@react-native-mapbox-gl/maps';
import Geolocation from '@react-native-community/geolocation';
import FontAwesome from 'react-native-vector-icons/FontAwesome';

import AppContext from '../../../providers/AppContext';
import {ToastContext} from '../../../providers/ToastProvider';
import {PermissionContext} from '../../../providers/PermissionContext';
import {Account} from '../../../types/crm';
import {getDateStringsFromDate} from '../../../utils/Helpers';
import Configs from '../../../constants/Configs';
import Colors from '../../../constants/Colors';
import AppButton from '../../../components/layout/AppButton';
import AppTitle from '../../../components/layout/AppTitle';
import AppNavBtnGrp from '../../../components/layout/AppNavBtnGrp';
import AppEmptyCard from '../../../components/layout/AppEmptyCard';
import AppNavGroup from '../../../components/layout/AppNavGroup';

MapboxGL.setAccessToken(Configs.MAPBOX_ACCESS_TOKEN);

interface Props {
  navigation: any;
}

const CrmMapScreen: React.FC<Props> = ({navigation}) => {
  //#region Use State Variables
  const {grpId, token} = useContext(AppContext);
  const {getPermissions} = useContext(PermissionContext);

  const [accounts, setAccounts] = useState<Account[]>([]);
  const {show} = useContext(ToastContext);
  const [isLoading, setIsLoading] = useState(true);
  const [userLocation, setUserLocation] = useState<any>();

  //#endregion

  useEffect(() => {
    getUserLocation();
    getAccounts();
  }, []);

  const getUserLocation = async () => {
    await getPermissions();
    Geolocation.getCurrentPosition((info) => {
      const {latitude, longitude} = info.coords;
      setUserLocation([longitude, latitude]);
    });
  };

  const getAccounts = async () => {
    await fetch(`${Configs.TCMC_URI}/api/accountsBy`, {
      headers: {'Content-Type': 'application/json', 'x-access-token': token},
      method: 'POST',
      body: JSON.stringify({group_id: grpId}),
    })
      .then((res) => res.json())
      .then((json) => {
        if (json.data) {
          setAccounts(json.data);
        }
      })
      .catch((err) => show({message: err.message}))
      .finally(() => setIsLoading(false));
  };

  const renderRoutePoints = () => {
    if (accounts.length === 0) return;
    return accounts.map((item: Account, index: number) => {
      if (item.geo_location === null || item.geo_location.length <= 1) return;
      return (
        <MapboxGL.PointAnnotation
          id={index.toString()}
          key={index.toString()}
          coordinate={[parseFloat(item.geo_location[0]), parseFloat(item.geo_location[1])]}
          >
          <FontAwesome name='map-marker' size={30} color={Colors.SMT_Primary_1} />
        </MapboxGL.PointAnnotation>
      );
    });
  };

  return (
    <View style={styles.screen}>
      <AppTitle title='CRM' />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.contentContainer}>
        <View style={{paddingHorizontal: 10}}>
          <AppNavGroup
            add={{title: 'Account', modal: 'CreateAccountModal'}}
            list='CrmScreen'
            schedule='CrmCalendarScreen'
            map='CrmMapScreen'
            focused='Map'
          />
        </View>

        <View style={{paddingHorizontal: 10}}>
          {/* Map Card */}
          {accounts.length === 0 ? null : (
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
                  <MapboxGL.UserLocation
                    androidRenderMode='gps'
                    visible={true}
                  />

                  <MapboxGL.Camera
                    zoomLevel={8}
                    centerCoordinate={userLocation}
                  />
                  {renderRoutePoints()}
                </MapboxGL.MapView>
              </View>
            </View>
          )}
        </View>

        <View style={{marginBottom: 10}}>
          <AppTitle title='Accounts' />
        </View>

        <View style={{paddingHorizontal: 10}}>
          {/* Locations List */}
          {accounts.length === 0 ? (
            <AppEmptyCard entity='accounts' modal='CreateLocationModal' />
          ) : (
            accounts.map((u, i) => {
              return (
                <TouchableOpacity
                  style={styles.card}
                  key={i}
                  onPress={() =>
                    navigation.navigate('AccountDetailsScreen', {model: u})
                  }>
                  <View style={{flexDirection: 'row'}}>
                    <View style={{flex: 1}}>
                      <Text style={styles.titleText}>{u.account_name}</Text>
                      <Text>{u.address_city}</Text>
                    </View>
                    <View style={{flex: 1}}>
                      <Text
                        style={{
                          color: Colors.SMT_Primary_1,
                          textAlign: 'right',
                        }}>
                        {getDateStringsFromDate(u.createdAt).date}
                      </Text>
                      <Text
                        style={{
                          fontWeight: 'bold',
                          color: Colors.SMT_Secondary_2_Light_1,
                          textAlign: 'right',
                        }}>
                        {getDateStringsFromDate(u.createdAt).time}
                      </Text>
                    </View>
                  </View>
                </TouchableOpacity>
              );
            })
          )}
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
  screen: {
    marginBottom: 36,
  },
  contentContainer: {
    // This is the scrollable part
  },
  scrollView: {
    height: '100%',
    width: '100%',
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
  title: {
    marginBottom: 10,
  },
  titleText: {
    fontWeight: 'bold',
  },
});

export default CrmMapScreen;
