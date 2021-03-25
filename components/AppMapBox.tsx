import React, {useContext, useEffect, useState} from 'react';
import {StyleSheet, View} from 'react-native';
import MapboxGL from '@react-native-mapbox-gl/maps';
import Geolocation from '@react-native-community/geolocation';

import Colors from '../constants/Colors';
import Configs from '../constants/Configs';
import {PermissionContext} from '../providers/PermissionContext';

MapboxGL.setAccessToken(Configs.MAPBOX_ACCESS_TOKEN);
const mapboxBaseUrl = 'https://api.mapbox.com/geocoding/v5/mapbox.places/';

interface Props {
  locations: string[];
  children?: any;
}

const AppMapBox: React.FC<Props> = ({locations, children}) => {
  //#region Use State Variables
  const {getPermissions} = useContext(PermissionContext);
  const [userLocation, setUserLocation] = useState<any>();
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
    <>
      <View style={styles.container}>
        <View style={styles.mapContainer}>
          <MapboxGL.MapView
            style={styles.map}
            styleURL={MapboxGL.StyleURL.Street}>
            <MapboxGL.UserLocation androidRenderMode='gps' visible={true} />
            {children}
            <MapboxGL.Camera zoomLevel={9} centerCoordinate={userLocation} />
          </MapboxGL.MapView>
        </View>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    borderColor: Colors.SMT_Secondary_1,
    marginBottom: 10,
    borderRadius: 3,
    backgroundColor: Colors.SMT_Secondary_1_Light_1,
    borderWidth: 2,
    height: 300,
    justifyContent: 'center',
  },
  mapContainer: {
    height: '100%',
    width: '100%',
  },
  map: {
    flex: 1,
  },
});

export default AppMapBox;
