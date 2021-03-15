import React, {useContext, useEffect, useState} from 'react';
import {View} from 'react-native';
import MapboxGL from '@react-native-mapbox-gl/maps';
import Icon from 'react-native-vector-icons/FontAwesome';

import AppContext from '../../providers/AppContext';
import Configs from '../../constants/Configs';
import { ToastContext } from '../../providers/ToastProvider';
import { Route } from '../../types/routes';

//#region Local Vars
const mapboxToken = Configs.MAPBOX_ACCESS_TOKEN;
const mapboxBaseUrl = 'https://api.mapbox.com/geocoding/v5/mapbox.places/';
const layerStyles = {
  route: {
    lineColor: 'blue',
    lineWidth: 3,
    lineOpacity: 0.84,
  },
  arrows: {
    iconImage: require('../../assets/images/arrow2.png'),
    iconAllowOverlap: true,
    symbolPlacement: 'line',
  },
};
const pinColors = {
  startPoint: '#FF0000',
  servicePoints: '#FFA500',
  completedPoint: '#008000',
};
//#endregion

interface Props {
  route: Route
}

const RoutesDisplay: React.FC<Props> = ({route}) => {
  //#region Use State Variables
  const {grpId, token} = useContext(AppContext);
  const {show} = useContext(ToastContext);
  const [coordinates, setCoordinates] = useState<any>([]);
  const [routeData, setRouteData] = useState<any>(null);
  //#endregion

  useEffect(() => {
    if (route) {
      getRouteLocationsFromApi();
    }

  }, [route]);

  const getRouteLocationsFromApi = async () => {
    let response = await fetch(`${Configs.TCMC_URI}/api/routesBy`, {
      method: 'POST',
      headers: {'Content-Type': 'application/json', 'x-access-token': token},
      body: JSON.stringify({group_id: grpId, _id: route._id}),
    });
    const data = await response.json();

    const coordsStore: any = [];
    if (data) {
      let {start_location, service_stop} = data.data[0];
      let addresses = [start_location, ...service_stop];

      let formattedAddressStrings = addresses.map((address) => {
        return address.split(' ').join('%20');
      });

      let requests = formattedAddressStrings.map((address) =>
        fetch(`${mapboxBaseUrl}${address}.json?access_token=${mapboxToken}`),
      );
      Promise.all(requests)
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

          setCoordinates(coordsStore);
          return new Promise((resolve) => {
            resolve(coordsStore);
          });
        })
        .then((data) => {
          getOptimizedRoute(data);
        })
        .catch((err) => show({message: err.message}));
    }
  };

  const constructMapQueryUrl = (coordsStore: any) => {
    if (coordsStore.length > 0) {
      let CoordsStringArray = coordsStore.map((coords: any) =>
        coords.join(','),
      );
      let coordsString = CoordsStringArray.join(';');
      let mapQueryUrl = `https://api.mapbox.com/optimized-trips/v1/mapbox/driving/${coordsString}?geometries=geojson&access_token=${mapboxToken}`;
      return mapQueryUrl;
    }
    return '';
  };

  const getOptimizedRoute = async (coordinates: any) => {
    if (coordinates.length > 0) {
      await fetch(constructMapQueryUrl(coordinates))
        .then((res) => res.json())
        .then((data) => setRouteData({...data.trips[0].geometry}))
        .catch((err) => show({message: err.message}));
    }
  };

  const renderRoutePoints = () => {
    if (coordinates.length === 0) {
      return null;
    }

    return coordinates.map((point: any, index: number) => {
      let iconColor = '';
      if (index === 0) {
        iconColor = pinColors.startPoint;
      } else {
        iconColor = pinColors.servicePoints;
      }
      return (
        <MapboxGL.PointAnnotation
          id={index.toString()}
          key={index.toString()}
          coordinate={point}>
          <Icon name="map-marker" size={30} color={iconColor} />
        </MapboxGL.PointAnnotation>
      );
    });
  };

  const renderRoute = () => {
    if (!routeData) {
      return null;
    }
    return (
      <MapboxGL.ShapeSource id="routeSource" shape={routeData}>
        <MapboxGL.LineLayer id="routeFill" style={layerStyles.route} />
      </MapboxGL.ShapeSource>
    );
  };

  const renderArrows = () => {
    if (!routeData) {
      return null;
    }

    return (
      <MapboxGL.ShapeSource id="routeSource" shape={routeData}>
        <MapboxGL.SymbolLayer
          id="arrows"
          style={layerStyles.arrows}
          minZoomLevel={1}
          aboveLayerID="routeFill"
        />
      </MapboxGL.ShapeSource>
    );
  };

  return (
    <View>
      {renderRoutePoints()}
      {renderRoute()}
      {renderArrows()}
    </View>
  );
};

export default RoutesDisplay;
