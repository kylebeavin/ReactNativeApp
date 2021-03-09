import React, {useEffect, useRef, useState, useContext} from 'react';
import {StyleSheet, View, Text, ScrollView} from 'react-native';
import MapboxGL from '@react-native-mapbox-gl/maps';
import {
  lineString as makeLineString,
  point,
  featureCollection,
  feature,
} from '@turf/helpers';
import arrowIcon from '../../assets/images/arrow2.png';

const mapboxToken =
  'pk.eyJ1Ijoic3VyaTIwMjEiLCJhIjoiY2tsd2l4bmxsMGpiYTJxbzB0NDQ5OW02MyJ9.ZLKmHBS2koQxLD754TEujA';
const routesUrl = 'https://smt-backend-dev.herokuapp.com/api/routesBy';
const token =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYwMTA2ZDAxNzIzMWNiMDNhMWFiMmFiNCIsImlhdCI6MTYxNTMxMTMxMiwiZXhwIjoxNjE1MzYxNzEyfQ.rmsKjbDPXrgXYB6AZFd1o2XpQday-TGuNUA67KycM9M';
const mapboxBaseUrl = 'https://api.mapbox.com/geocoding/v5/mapbox.places/';
const layerStyles = {
  route: {
    lineColor: 'blue',

    lineWidth: 3,
    lineOpacity: 0.84,
  },

  arrows: {
    iconImage: arrowIcon,
    iconAllowOverlap: true,
    symbolPlacement: 'line',
  },
};

const RoutesDisplay = () => {
  const [coordinates, setCoordinates] = useState<any>([]);
  const [routeData, setRouteData] = useState<any>(null)
  useEffect(() => {
    const getRouteLocationsFromApi = async () => {
      let response = await fetch(routesUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-access-token': token,
        },
        body: JSON.stringify({driver: '6011c4f4f556150022792a54'}),
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
        //const getAllPromises = Promise.all(fetchUrls)
        console.log(requests);
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
            return new Promise(resolve =>{
                resolve(coordsStore)
            })
          })
          .then(data=>{
              getOptimizedRoute(data)
          })
          .catch((err) => {
            console.log(err);
          });
      }
    };
    getRouteLocationsFromApi();
  }, []);
  const constructMapQueryUrl = (coordsStore:any)=>{
      if(coordsStore.length>0){
    let CoordsStringArray = coordsStore.map((coords:any)=>coords.join(','))
    let coordsString = CoordsStringArray.join(';')
    let mapQueryUrl = `https://api.mapbox.com/optimized-trips/v1/mapbox/driving/${coordsString}?geometries=geojson&access_token=${mapboxToken}`
    return mapQueryUrl
    }
    return ""
  }

   const getOptimizedRoute = (coordinates:any)=>{
       if(coordinates.length>0){
           let url = constructMapQueryUrl(coordinates)
           fetch(url)
          .then (routeResponse => routeResponse.json())
          .then(routeData => {
            console.log("i got data")
            let myData =  routeData.trips[0].geometry
            setRouteData({...myData})

            
          })
       }
   }

  const renderRoutePoints = () => {
    if (coordinates.length === 0) {
      
      return null;
    }

    return coordinates.map((point: any) => {
    
      return (
        <MapboxGL.PointAnnotation
          id={String(Math.random() * 10000)}
          key={Math.random() * 10000}
          coordinate={point}
        />
      );
    });
  };
  const renderRoute = () =>{
    if (!routeData) {
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
  const renderArrows = ()=>{
    if (!routeData) {
      return null;
    }
    
        return (
          <MapboxGL.ShapeSource id="routeSource" shape={routeData}>
            <MapboxGL.SymbolLayer id='arrows' style={layerStyles.arrows} minZoomLevel={1} aboveLayerID="routeFill"/>
          </MapboxGL.ShapeSource>
        );
      }

  return (
    // <Text>Hello</Text>
    <View>
        {renderRoutePoints()}
        {renderRoute()}
        {renderArrows()}
    </View>
  );
};

export default RoutesDisplay;
