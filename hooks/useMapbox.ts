import React, {useContext} from 'react';
import Configs from '../constants/Configs';
import {ToastContext} from '../providers/ToastProvider';
import {MapboxGeometry, MapboxPoint, MapboxRoute} from '../types/mapbox';

const useMapbox = () => {
  const mapboxUri: string = 'https://api.mapbox.com';

  const getCoordinates = async (addresses: string[]): Promise<MapboxPoint[]> => {
    // Use geocoding endpoint to convert addresses to coordinates.
    let addressList = formatAddresses(addresses);
    const coordsStore: any = [];

    let promises = addressList.map(async (u) => await fetch(`${mapboxUri}/geocoding/v5/mapbox.places/${u}.json?access_token=${Configs.MAPBOX_ACCESS_TOKEN}`));

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

        return new Promise((resolve) => {
          resolve(coordsStore);
        });
      })
      .catch((err) => err);

    return coordsStore;
  };

  const getOptimizedRoute = async (coordinates: MapboxPoint[]): Promise<MapboxGeometry> => {
    // Use the optimized-trips endpoint for planning the stops order ahead of time.
    // Todo: For a more complete implementation return the entire response object.
    let route: MapboxGeometry;

    await fetch(`${mapboxUri}/optimized-trips/v1/mapbox/driving/${formatCoordinates(coordinates)}?geometries=geojson&access_token${Configs.MAPBOX_ACCESS_TOKEN}`)
      .then((res) => res.json())
      .then((json) => {
        if (json.code === 'Ok') {
          return (route = json.trips[0].geometry);
        }
      });

    return (route = {type: 'fail', coordinates: []});
  };

  const getDirections = async (coordinates: MapboxPoint[]) : Promise<MapboxRoute> => {
    // Use the directions endpoint to get turn by turn instructions & traffic.
    let route: MapboxRoute = {
      duration: 0,
      distance: 0,
      weight_name: '',
      weight: 0,
      geometry: {
        type: '',
        coordinates: [],
      },
      legs: [],
      voiceLocale: ''
    }

    await fetch(`${mapboxUri}/directions/v5/mapbox/driving/${formatCoordinates(coordinates)}?steps=true&geometries=geojson&access_token=${Configs.MAPBOX_ACCESS_TOKEN}`)
            .then(res => res.json())
            .then(json => {
              if (json.code === 'Ok') {
                return route = json.routes[0];
              }
            })

    return route;
  };

  const formatAddresses = (addresses: string[]): string[] => {
    // Returns a string array of formatted addresses to be looped over and used in a query string.
    let formattedAddresses: string[] = [];

    if (addresses) {
      addresses.forEach((u) => {
        let formattedString = u.split(' ').join('%20');
        let queryString = formattedString.replace(/,/g, '');
        formattedAddresses.push(queryString);
      });
    }

    return formattedAddresses;
  };

  const formatCoordinates = (coordinates: MapboxPoint[]): string => {
    // Returns coordinates formatted to be used in a query string.
    let coordsString: string;

    let coordsStringArr: string[] = coordinates.map((coord: MapboxPoint) =>
      coord.join(','),
    );
    coordsString = coordsStringArr.join(';');

    return coordsString;
  };

  return {
    getCoordinates,
    getOptimizedRoute,
    getDirections
  };
};

export default useMapbox;
