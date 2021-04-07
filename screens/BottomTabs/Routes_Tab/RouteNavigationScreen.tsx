import React, {useContext, useEffect, useState} from 'react';
import {
  StyleSheet,
  View,
  ScrollView,
  TouchableOpacity,
  Text,
  Image,
  Platform,
} from 'react-native';

import Colors from '../../../constants/Colors';
import Configs from '../../../constants/Configs';
import {Order} from '../../../types/service';
import {DriverRouteState, Route} from '../../../types/routes';
import AppTitle from '../../../components/Layout/AppTitle';
import AppNavDetailGrp from '../../../components/Layout/AppNavDetailGrp';
import AppMapbox from '../../../components/map/AppMapbox';
import AppContext from '../../../providers/AppContext';
import {isSuccessStatusCode} from '../../../utils/Helpers';
import {ToastContext} from '../../../providers/ToastProvider';
import AppButton from '../../../components/Layout/AppButton';
import DriverNavigationMap from '../../../components/map/DriverNavigationMap';
import useAsyncStorage from '../../../hooks/useAsyncStorage';
import { useNavigation } from '@react-navigation/native';
import useMapbox from '../../../hooks/useMapbox';
import MapboxGL from '@react-native-mapbox-gl/maps';
import { MapboxGeometry, MapboxPoint } from '../../../types/mapbox';
import AppMapboxPoint from '../../../components/map/AppMapboxPoint';
import AppMapboxLines from '../../../components/map/AppMapboxLines';
import Geolocation from '@react-native-community/geolocation';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {PermissionContext} from '../../../providers/PermissionContext';
import Layout from '../../../constants/Layout';
import ModalButtons from '../../Modal/ModalButtons';
import AppTextInput from '../../../components/Layout/AppTextInput';
import AppCheckBox from '../../../components/Layout/AppCheckBox';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { isRequired } from '../../../utils/Validators';
import { CameraContext } from '../../../providers/CameraProvider';
import useForm from '../../../hooks/useForm';
import RNFetchBlob from 'rn-fetch-blob';
import CreatePreTripInspectionModal from '../../Modal/Creates/CreatePreTripInspectionModal';
import CreatePostTripInspectionModal from '../../Modal/Creates/CreatePostTripInspectionModal';


interface Props {
  route: any;
}

const RouteNavigationScreen: React.FC<Props> = ({route}) => {
  const model: Route = route.params.model;

  //#region Form Initializers
  const formValues = {
    containers_serviced: '',
    haul: true,
    needing_hauled: '',
    notes: '',
  };

  const formErrors = {
    containers_serviced: [],
    haul: [],
    needing_hauled: [],
    notes: [],
  };

  const formValidations = {
    containers_serviced: [isRequired],
    haul: [],
    notes: [],
  };
  //#endregion

  
  //#region Use State Variables
  const navigation = useNavigation();
  const {formatAddresses, formatCoordinates} = useMapbox();
  const {getPermissions} = useContext(PermissionContext);
  const {grpId, token, displayName} = useContext(AppContext);
  const {show} = useContext(ToastContext);
  const {getDriverRouteStateAsync, setDriverRouteStateAsync, clearDriverRouteStateAsync} = useAsyncStorage();
  
  //#region Popup Use State Variables
  const {camera, pictures, showCamera, clearPics} = useContext(CameraContext);
  const [location, setLocation] = useState('');
  const [containerImage, setContainerImage] = useState({base64: '', uri: ''});
  const [valid, setValid] = useState(true);
  const {handleChange, handleSubmit, values, errors, setValues, setErrors} = useForm(
    formValues,
    formErrors,
    formValidations,
    handleCompleteOrder,
  );
  //#endregion

  // State
  const [routeState, setRouteState] = useState<DriverRouteState>();
  const [ordersList, setOrdersList] = useState<Order[]>([]);
  const [coordinates, setCoordinates] = useState<MapboxPoint[]>([]);
  const [routeLine, setRouteLine] = useState<any>();
  const [directions, setDirections] = useState<any>();
  const [userLocation, setUserLocation] = useState<any>();

  // Toggles
  const [stopsToggle, setStopsToggle] = useState(true);
  const [showCompleteOrderPopup, setShowCompleteOrderPopup] = useState(false);
  const [showCompletePostTripPopup, setShowCompletePostTripPopup] = useState(false);
  //#endregion

    console.log('hi')
  useEffect(() => {
    getStops();
    getCachedState();
    
  }, []);

  useEffect(() => {
    if (routeState?.routeStage === 'Started') {
      getStops();
    }
  }, [routeState]);

  useEffect(() => {
    getUserLocation();
    
    if (routeState?.stopsState.currentStatus === 'Navigating') {
      if (coordinates.length > 0) {
        getDirections();
      }
    }
  }, [routeState, coordinates]);

  useEffect(() => {
    if (containerImage.uri !== '') setValid(true);
    Object.keys(pictures).map((key: string) => {
      if (key === 'Container') {
        setContainerImage({
          base64: pictures[key].base64,
          uri: pictures[key].uri,
        });
      }
    });

    return unmount;
  }, [camera, containerImage]);

  const unmount = () => {
    clearPics({});
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
        getOptimizedRoute(data.map(u=> u.features[0].center));
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

  const getDirections = async (): Promise<any> => {
    let coords: MapboxPoint[] = [];

    coords.push(userLocation);
    coords.push(coordinates[parseInt(routeState?.stopsState.currentStop) - 1]);
    
    await fetch(`https://api.mapbox.com/directions/v5/mapbox/driving/${formatCoordinates(coords)}?steps=true&geometries=geojson&access_token=${Configs.MAPBOX_ACCESS_TOKEN}`)
    .then(res => res.json())
    .then(json => {
      if (json.code === 'Ok') {

        setDirections(json);
      }
    })
  };

  const getUserLocation = async () => {
    await getPermissions();
    Geolocation.getCurrentPosition((info) => {
      const {latitude, longitude} = info.coords;
      setUserLocation([longitude, latitude]);
    });
  };

  const getCachedState = async () => {
    await getDriverRouteStateAsync().then(value => !value ? null : setRouteState(value));
  }

  const getStops = async () => {
    await fetch(`${Configs.TCMC_URI}/api/ordersBy`, {
      method: 'POST',
      headers: {'Content-Type': 'application/json', 'x-access-token': token},
      body: JSON.stringify({group_id: grpId, _id: {$in: model.service_stop}}),
    })
      .then((res) => res.json())
      .then(async(json) => {
        if (isSuccessStatusCode(json.status)) {
          let list = json.data;
          let lastStop: Order = {
            _id: 'lastStop',
            order_id: 'Start Location',
            account_id: '',
            agreement_id: '',
            containers_serviced: 0,
            completed_geo_location: '',
            completed_time: new Date(),
            container_qty: 0,
            demand_rate: '',
            group_id: '',
            haul_status: false,
            is_active: false,
            is_demo: false,
            is_recurring: false,
            monthly_rate: '',
            location: model.start_location,
            notes: [],
            order_status: getLastStopStatus(),
            services: '',
            service_date: '',
            service_day: '',
            service_frequency: '',
            url: [],
            account_name: ''
          }
          list.push(lastStop);
          await getCoordinates(list.map((u:Order) => u.location))
          setOrdersList(list);
        } else {
          show({message: json.message});
        }
      })
      .catch((err) => show({message: err.message}));
  };

  const getLastStopStatus = (): string => {
    if (routeState?.stopsState.currentId === 'lastStop' && routeState?.stopsState.currentStatus === 'Smashing') return 'started';
    if (routeState?.stopsState.currentId === 'lastStop' && routeState?.stopsState.currentStatus === 'Completed') return 'completed';
    return 'not started';
  };

  const getLocations = () : MapboxPoint[] => {
    let locations: MapboxPoint[] = [];
    
    if (routeState && ordersList.length > 0) {
      locations.push(userLocation);
      
      locations.push(coordinates[parseInt(routeState?.stopsState.currentStop) - 1]);
    }

    return locations;
  };

  const handleGoOnPress = (stop: Order, stopNumber: number) => {
    let newState: DriverRouteState = {
      routeStage: 'Navigating',
      stopsState: {
        currentId: stop._id,
        currentStop: stopNumber.toString(),
        currentStatus: 'Navigating'
      }
    }

    if (newState.stopsState.currentId === 'lastStop') {
      setDriverRouteStateAsync(newState).then(value => {
        setRouteState(newState);
      });
    } else {
      fetch(`${Configs.TCMC_URI}/api/orders`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'x-access-token': token,
        },
        body: JSON.stringify({
          _id: stop._id,
          notes: `${displayName} is on their way.`,
        }),
      })
        .then((res) => res.json())
        .then((json) => {
          if (isSuccessStatusCode(json.status)) {
            setDriverRouteStateAsync(newState).then(value => value ? setRouteState(newState) : null);
          } else {
            show({message: json.message});
          }
        })
        .catch((err) => show({message: err.message}));
    }
  };

  const handleArriveOnPress = (stop: Order, stopNumber: number) => {
    // Update Cache
    let newState: DriverRouteState = {
      routeStage: 'Navigating',
      stopsState: {
        currentId: stop._id,
        currentStop: stopNumber.toString(),
        currentStatus: 'Smashing'
      }
    }
    setDriverRouteStateAsync(newState).then(value => {
      if (value) {
        // Update DB
        if (routeState?.stopsState.currentId === 'lastStop') {
          setRouteState(newState);
        } else {
          fetch(`${Configs.TCMC_URI}/api/orders`, {
            method: 'PUT',
            headers: {'Content-Type': 'application/json', 'x-access-token': token},
            body: JSON.stringify({_id: stop._id, order_status: 'started'})
          })
          .then((res) => res.json())
          .then((json) => {
            if (isSuccessStatusCode(json.status)) {
              setRouteState(newState);
            } else {
              show({message: json.message});
            }
          })
          .catch((err) => show({message: err.message}));
        }
      }
    })
  };

  const handleCompleteOnPress = (stop: Order, stopNumber: number) => {
    if (routeState?.stopsState.currentId === 'lastStop') {
      setShowCompletePostTripPopup(true);
    } else {
      setShowCompleteOrderPopup(true);
    }

  };

  const handleCompleteRoute = () => {
    fetch(`${Configs.TCMC_URI}/api/routes`, {
      method: 'PUT',
      headers: {'Content-Type': 'application/json', 'x-access-token': token},
      body: JSON.stringify({_id: model._id, route_stage: 'Completed'}),
    })
      .then((res) => res.json())
      .then((json) => {
        if (isSuccessStatusCode(json.status)) {
          clearDriverRouteStateAsync().then(value => {
            if (value) {
              navigation.navigate('DashboardScreen');
              show({message: 'You completed the route.'});
            }
          });
        } else {
          show({message: json.message});
        }
      })
      .catch((err) => show({message: err.message}));
  };

  const renderMapState = () => {
    if (routeLine !== undefined) {
      if (routeState?.routeStage === 'Started') {
        return (
          <AppMapbox>
            {coordinates.map((u) => {
              return (
                <AppMapboxPoint
                  key={`${u[0]}${u[1]}`}
                  id={`${u[0]}${u[1]}`}
                  point={u}
                />
              );
            })}
            <AppMapboxLines
              geometry={routeLine.trips[0].geometry}
            />
          </AppMapbox>
        );
      } else if (routeState?.routeStage === 'Navigating') {
        let locations = getLocations();
        if (routeLine !== undefined) {
          if (locations.length > 0) {
            return (
              <AppMapbox zoomLevel={15}>
                {locations.map((u) => {
                  if (u) {
                    return (
                      <AppMapboxPoint
                      key={`${u[0]}${u[1]}`}
                      id={`${u[0]}${u[1]}`}
                      point={u}
                      />
                      );
                    }
                })}
                {directions ? (
                  <AppMapboxLines
                    geometry={{
                      type: 'LineString',
                      coordinates: directions.routes[0].geometry.coordinates,
                    }}
                  />
                ) : null}
              </AppMapbox>
            );
          }
        }
      }
    }
  };

  const renderDirections = () => {
    if (routeState && ordersList.length > 0) {
      if (routeState.stopsState.currentStatus === 'Navigating') {
        return (
          <View style={{backgroundColor: Colors.SMT_Secondary_2_Light_1, padding: 5, flexDirection: 'row', justifyContent: 'space-between'}}>
            <View style={{flex: 1}}>
              <MaterialCommunityIcons name="close-circle-outline" size={24} color={Colors.SMT_Tertiary_1} />
            </View>
            <View style={{flex: 1}}>
            <Text style={{color: Colors.SMT_Tertiary_1}}>{directions.routes[0].legs[0].steps[0].maneuver.instruction}</Text>
            </View>

            <View style={{flex: 1}}>
              <Text style={{color: Colors.SMT_Tertiary_1, textAlign: 'right'}} >{directions.routes[0].legs[0].steps[0].duration}</Text>
              <Text style={{color: Colors.SMT_Tertiary_1, textAlign: 'right'}} >{directions.routes[0].legs[0].steps[0].distance}</Text>
            </View>
          </View>
        );
      }
  }
  };

  const renderListState = () => {
    if (!routeState || routeState.routeStage === 'Started') {
      return ordersList.map((u) => {
        return (
          <View key={u._id}>
            <AppTitle
              title={`Stop ${ordersList.findIndex(
                (order) => order._id === u._id,
              ) + 1}`}
            />
            <TouchableOpacity style={[styles.card, u.order_status === 'completed' && {backgroundColor: 'honeydew'}]} onPress={() => null}>
              <View style={{flexDirection: 'row'}}>
                <View style={{flex: 1}}>
                  <Text style={styles.titleText}>{u.order_id}</Text>
                  <Text>{u.order_status}</Text>
                  <Text>{u.location}</Text>
                </View>
                <View style={{flex: 1}}>
                  <View style={{alignSelf: 'flex-end'}}>
                  <AppButton title='Go' onPress={() => handleGoOnPress(u, ordersList.findIndex(order => order._id === u._id) + 1)} icon={{type: 'MaterialIcons', name: 'navigation'}} outlined  />
                  </View>
                </View>
              </View>
            </TouchableOpacity>
          </View>
        );
      });
    } else if (ordersList.length > 0 && routeState.routeStage === 'Navigating') {
        let navigationList : Order[] = [];

        // Calculate where we are in route.
        if (routeState.stopsState.currentStop === '1' && routeState.stopsState.currentStatus !== 'Completed') {
          // If we're on our first stop.
          navigationList.push(ordersList[0]);
          navigationList.push(ordersList[1]);
        } else {
          if (routeState.stopsState.currentStatus === 'Completed') {
            let nextStop = parseInt(routeState.stopsState.currentStop) + 1;
            let stopNumber = 0;

            ordersList.forEach((u,i) => {
              stopNumber = stopNumber + 1;
              if (nextStop === stopNumber || nextStop + 1 === stopNumber) {
                navigationList.push(u);
              }
            });
          } else {
            let stopNumber = 0;
            ordersList.forEach((u, i) => {
              stopNumber = stopNumber + 1;
              if (parseInt(routeState.stopsState.currentStop) === stopNumber || (parseInt(routeState.stopsState.currentStop) + 1) === stopNumber) { 
                navigationList.push(u);
              }
            });
          }
        }
        
        return navigationList.map((u,i) => {
          return (
            <View key={u._id}>
            <AppTitle title={i == 0 ? `Navigating To Stop ${ordersList.findIndex(order => order._id === u._id) + 1}` : `Next Stop ${ordersList.findIndex(order => order._id === u._id) + 1}`} />
            <TouchableOpacity
              style={styles.card}
              onPress={() => null}>
              <View style={{flexDirection: 'row'}}>
                <View style={{flex: 1}}>
                  <Text style={styles.titleText}>{u.order_id}: {u.account_id.account_name}</Text>
                  <Text>{u.order_status}</Text>
                  <Text>{u.location}</Text>
                </View>
                <View style={{flex: 1}}>
                  <View style={{alignSelf: 'flex-end'}}>
                  {i == 0 && routeState.stopsState.currentStatus === '' || i == 0 && routeState.stopsState.currentStatus === 'Completed' ? <AppButton title='Go' onPress={() => handleGoOnPress(u, ordersList.findIndex(order => order._id === u._id) + 1)} icon={{type: 'MaterialIcons', name: 'navigation'}} outlined />: null}
                    {i == 0 && routeState.stopsState.currentStatus === 'Navigating' ? <AppButton title='Arrive' onPress={() => handleArriveOnPress(u, ordersList.findIndex(order => order._id === u._id) + 1)} icon={{type: 'MaterialIcons', name: 'navigation'}} outlined />: null}
                    {i == 0 && routeState.stopsState.currentStatus === 'Smashing' ? <AppButton title='Complete' onPress={() => handleCompleteOnPress(u, ordersList.findIndex(order => order._id === u._id) + 1)} icon={{type: 'MaterialIcons', name: 'navigation'}} outlined />: null}
                  </View>
                </View>
              </View>
            </TouchableOpacity>
            </View>
          );
        });
    }
  };

  const renderCompleteButton = () => {
    let isComplete = true;
    ordersList.forEach(u => u.order_status === 'not started' || u.order_status === 'started' ? isComplete = false : null)

    if (isComplete) {
      return (
        <View style={{paddingHorizontal: 10}} >
        <AppButton title='Complete Route' onPress={handleCompleteRoute} />
      </View>
    )
  }
  };

  async function completeOrder(): Promise<boolean> {
    let success = false;
    if (containerImage.uri === '') {
      setValid(false);
      return success;
    }

    let requestBody = {
      _id: routeState?.stopsState.currentId,
      order_status: 'completed',
      containers_serviced: values.containers_serviced,
      haul: values.haul,
      container_qty: !values.haul ? 0 : values.needing_hauled,
      completed_geo_location: location,
      completed_time: new Date(),
    };
    
    await RNFetchBlob.fetch(
      'POST',
      `${Configs.TCMC_URI}/api/orderPics`,
      {'x-access-token': token},
      [
        { name: 'order_completed.jpeg', filename: 'order_completed.jpeg', data: RNFetchBlob.wrap(Platform.OS === 'android'? containerImage.uri: containerImage.uri.replace('file://', ''))},
        { name: 'body' , data: JSON.stringify(requestBody)}
      ],
    )
      .then((res) => res.json())
      .then((json) => {
        if (isSuccessStatusCode(json.status)) {
          success = true;
          setValues(formValues);
          setContainerImage({base64: '', uri: ''});
        } else {
          show({message: json.message});
        }
      })
      .catch((err) => show({message: err.message}));
    
      return success;
  }

  async function handleCompleteOrder() {
    const success = await completeOrder();
    if (success) {
      // Update Cache
      let newState: DriverRouteState = {
        routeStage: 'Navigating',
        stopsState: {
          currentId: routeState ? routeState?.stopsState.currentId : '',
          currentStop: routeState ? routeState?.stopsState.currentStop: '',
          currentStatus: 'Completed',
        },
      };

      if (newState.stopsState.currentId === 'lastStop') {
        newState.routeStage = 'Started';
        setShowCompleteOrderPopup(false);
        setDriverRouteStateAsync(newState).then((value) =>
          value ? setRouteState(newState) : null,
        );
      } else {
        fetch(`${Configs.TCMC_URI}/api/orders`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'x-access-token': token,
          },
          body: JSON.stringify({
            _id: routeState?.stopsState.currentId,
            order_status: 'completed',
          }),
        })
          .then((res) => res.json())
          .then((json) => {
            if (isSuccessStatusCode(json.status)) {
              setDriverRouteStateAsync(newState).then((value) => {
                setShowCompleteOrderPopup(false);
                value ? setRouteState(newState) : null;
              });
            } else {
              show({message: json.message});
            }
          })
          .catch((err) => show({message: err.message}));
      }
    }
  };

  const handleCompletePostTrip = () => {
    if (routeState) {
      let newState: DriverRouteState = {
        routeStage: 'Started',
        stopsState: {
          currentId: routeState?.stopsState.currentId,
          currentStop: routeState.stopsState.currentStop.toString(),
          currentStatus: 'Completed'
        }
      }
      setDriverRouteStateAsync(newState).then(value => value ? setRouteState(newState) : null);
    }
  };

  return (
    <View>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.contentContainer}>
        <AppNavDetailGrp route={model} />

        <View style={{paddingHorizontal: 10}}>{renderMapState()}</View>

        <View style={{paddingHorizontal: 10}}>
          {directions ? renderDirections() : null}
        </View>

        <TouchableOpacity
          style={{marginBottom: 5}}
          onPress={() => setStopsToggle(!stopsToggle)}>
          <AppTitle title="Route Stops" />
        </TouchableOpacity>
        {renderCompleteButton()}
        {!stopsToggle ? null : (
          <View style={{paddingHorizontal: 10}}>{renderListState()}</View>
        )}
      </ScrollView>

      {showCompleteOrderPopup ? (
        <View
          style={[
            StyleSheet.absoluteFill,
            {padding: 20, justifyContent: 'center', alignItems: 'center'},
          ]}>
          <View
            style={[
              StyleSheet.absoluteFill,
              {backgroundColor: 'black', opacity: 0.5},
            ]}></View>
          <View style={styles.popup}>
            {/* <View style={styles.container}> */}
            <View>
              <ScrollView style={styles.form}>
                <View>
                  <View style={{marginBottom: 10}}>
                    <AppTitle title="Complete Order" />
                  </View>

                  {/* Containers Serviced */}
                  <View style={{paddingHorizontal: 10}}>
                    <AppTextInput
                      label="Containers Serviced"
                      name="containers_serviced"
                      value={values.containers_serviced}
                      onChange={(val) =>
                        handleChange('containers_serviced', val)
                      }
                      validations={[isRequired]}
                      errors={errors.containers_serviced}
                      setErrors={setErrors}
                      keyboardType="number-pad"
                    />
                  </View>

                  <View style={styles.formGroup}>
                    <AppButton
                      title="Container"
                      onPress={() => showCamera({key: 'Container'})}
                      icon={{type: 'MaterialIcons', name: 'camera-alt'}}
                    />
                    <View>
                      <Image
                        source={
                          containerImage.uri === ''
                            ? require('../../../assets/images/thumbnail_placeholder.jpg')
                            : {uri: containerImage.uri}
                        }
                        style={styles.thumbnail}
                      />
                      {containerImage.uri === '' ? null : (
                        <TouchableOpacity
                          style={{position: 'absolute', top: 0, right: 0}}
                          onPress={() => {
                            unmount();
                            setContainerImage({base64: '', uri: ''});
                            setValid(false);
                          }}>
                          <MaterialIcons
                            style={{opacity: 0.5}}
                            name="cancel"
                            size={50}
                            color={Colors.SMT_Tertiary_1}
                          />
                        </TouchableOpacity>
                      )}
                    </View>
                  </View>
                  {valid ? null : (
                    <View>
                      <Text
                        style={{
                          textAlign: 'center',
                          color: Colors.SMT_Primary_1,
                        }}>
                        You must provide an image of container after smashing!
                      </Text>
                    </View>
                  )}
                </View>

                <View style={styles.formGroup}>
                  {/* Haul */}
                  <View style={{paddingHorizontal: 10}}>
                    <AppCheckBox
                      label="Haul"
                      name="haul"
                      value={values.haul}
                      onChange={(name, val) => handleChange(name, val)}
                      validations={[]}
                      errors={errors.haul}
                      setErrors={setErrors}
                    />
                  </View>

                  {!values.haul ? null : (
                    <View style={{paddingHorizontal: 10}}>
                      {/* Need Hauled */}
                      <AppTextInput
                        label="Needing Hauled"
                        name="needing_hauled"
                        value={values.needing_hauled}
                        onChange={(val) => handleChange('needing_hauled', val)}
                        validations={[]}
                        errors={errors.needing_hauled}
                        setErrors={setErrors}
                        keyboardType="number-pad"
                      />
                    </View>
                  )}
                </View>

                {/* Notes */}
                <View style={{paddingHorizontal: 10}}>
                  <AppTextInput
                    label="Notes"
                    name="notes"
                    value={values.notes}
                    onChange={(val) => handleChange('notes', val)}
                    validations={[]}
                    errors={errors.notes}
                    setErrors={setErrors}
                  />
                </View>
              </ScrollView>
              <ModalButtons navigation={navigation} save={handleSubmit} />
            </View>
            {/* </View> */}
          </View>
        </View>
      ) : null}

      {showCompletePostTripPopup ? (
        <View
          style={[
            StyleSheet.absoluteFill,
            {padding: 20, justifyContent: 'center', alignItems: 'center'},
          ]}>
          <View
            style={[
              StyleSheet.absoluteFill,
              {backgroundColor: 'black', opacity: 0.5},
            ]}></View>
          <View style={styles.popup}>
              <CreatePostTripInspectionModal route={model} onComplete={handleCompletePostTrip} />
          </View>
        </View>
      ) : null}
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
  titleText: {
    fontWeight: 'bold',
  },
  card: {
    backgroundColor: Colors.SMT_Tertiary_1,
    marginBottom: 3,
    borderWidth: 1,
    borderColor: Colors.SMT_Secondary_1_Light_1,
    borderRadius: 3,
    borderTopLeftRadius: 0,
    borderTopRightRadius: 0,
    paddingVertical: 3,
    paddingHorizontal: 5,
  },

  //=== Popup ===//
  container: {
    paddingHorizontal: 10,
    paddingVertical: 10,
  },
  popup: {
    width: '100%',
    // position: 'absolute',
    // maxHeight: Layout.window.height / 1.5,
    // marginBottom: 20,
    // borderRadius: 4,
    // borderColor: Colors.SMT_Secondary_1_Light_1,
    // borderWidth: 1,
    // backgroundColor: Colors.SMT_Tertiary_1,
  },
  modalCard: {
    // backgroundColor: Colors.SMT_Tertiary_1,
    // marginBottom: 3,
    // borderWidth: 1,
    // borderColor: Colors.SMT_Secondary_1_Light_1,
    // borderRadius: 3,
    // paddingVertical: 3,
    // paddingHorizontal: 5,
  },
  form: {
    maxHeight: Layout.window.height / 1.5,
    marginBottom: 20,
    borderRadius: 4,
    backgroundColor: Colors.SMT_Tertiary_1,
  },
  formGroup: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
    marginBottom: 10,
  },
  thumbnail: {
    height: 200,
    width: 200,
    borderRadius: 4,
  },
  fieldContainer: {
    marginBottom: 10,
  },
});

export default RouteNavigationScreen;
