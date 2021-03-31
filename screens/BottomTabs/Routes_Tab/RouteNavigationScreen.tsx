import React, {useContext, useEffect, useState} from 'react';
import {
  StyleSheet,
  View,
  ScrollView,
  TouchableOpacity,
  Text,
} from 'react-native';

import Colors from '../../../constants/Colors';
import Configs from '../../../constants/Configs';
import {Order} from '../../../types/service';
import {DriverRouteState, Route} from '../../../types/routes';
import AppTitle from '../../../components/Layout/AppTitle';
import AppNavDetailGrp from '../../../components/Layout/AppNavDetailGrp';
import AppMapBox from '../../../components/AppMapBox';
import AppContext from '../../../providers/AppContext';
import {isSuccessStatusCode} from '../../../utils/Helpers';
import {ToastContext} from '../../../providers/ToastProvider';
import AppButton from '../../../components/Layout/AppButton';
import DriverNavigationMap from '../../../components/map/DriverNavigationMap';
import useAsyncStorage from '../../../hooks/useAsyncStorage';
import { useNavigation } from '@react-navigation/native';
import useMapbox from '../../../hooks/useMapbox';
import MapboxGL from '@react-native-mapbox-gl/maps';

interface Props {
  route: any;
}

const RouteNavigationScreen: React.FC<Props> = ({route}) => {
  const model: Route = route.params.model;

  //#region Use State Variables
  const navigation = useNavigation();
  const {getCoordinates} = useMapbox();
  const {grpId, token, displayName} = useContext(AppContext);
  const {show} = useContext(ToastContext);
  const {getDriverRouteStateAsync, setDriverRouteStateAsync, clearDriverRouteStateAsync} = useAsyncStorage();

  // State
  const [routeState, setRouteState] = useState<DriverRouteState>();
  const [ordersList, setOrdersList] = useState<Order[]>([]);

  // Toggles
  const [stopsToggle, setStopsToggle] = useState(true);
  //#endregion

  useEffect(() => {
    getStops();
    getCachedState();
  }, []);

  useEffect(() => {
    if (routeState?.routeStage === 'Started') {
      getStops();
    }
  }, [routeState]);

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
      .then((json) => {
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

  const getLocations = () : string[] => {
    let locations: string[] = [];

    locations.push(model.start_location);
    ordersList.forEach(x => locations.push(x.location));

    return locations;
  };

  const getDirections = () : string[] => {
    let locations: string[] = [];
  
    if (routeState && ordersList.length > 0) {
      if (routeState?.stopsState.currentStop === '1') {

        locations.push(model.start_location);
        locations.push(ordersList[0].location);
      } else {
        locations.push(ordersList[parseInt(routeState?.stopsState.currentStop) - 2].location);
        locations.push(ordersList[parseInt(routeState?.stopsState.currentStop) - 1].location);
      }
    }
      
    return locations;
  };

  const renderMapState = () => {
    let addresses = [];
    if (routeState?.routeStage === 'Started') {
      addresses = getLocations();
      return (
        <AppMapBox>
          <DriverNavigationMap route={model} locations={addresses} />
        </AppMapBox>
      );
    } else if (routeState?.routeStage === 'Navigating') {
      addresses = getDirections()

      if (addresses.length > 0) {
        return (
          <AppMapBox zoomLevel={15}>
            <DriverNavigationMap
              route={model}
              locations={addresses}
              directions
            />
          </AppMapBox>
        );
      }
    }
  };

  const handleGoOnPress = (stop: Order, stopNumber: number) => {
    // Update Cache
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
    // Update Cache
    let newState: DriverRouteState = {
      routeStage: 'Navigating',
      stopsState: {
        currentId: stop._id,
        currentStop: stopNumber.toString(),
        currentStatus: 'Completed'
      }
    }

    if (newState.stopsState.currentId === 'lastStop') {
      newState.routeStage = 'Started';
      setDriverRouteStateAsync(newState).then(value => value ? setRouteState(newState) : null);
    } else {
      fetch(`${Configs.TCMC_URI}/api/orders`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'x-access-token': token,
        },
        body: JSON.stringify({
          _id: stop._id,
          order_status: 'completed',
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

  return (
    <View>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.contentContainer}>
        <AppNavDetailGrp route={model} />

        <View style={{paddingHorizontal: 10}}>
          {renderMapState()}
        </View>

        <TouchableOpacity style={{marginBottom: 5}} onPress={() => setStopsToggle(!stopsToggle)}>
          <AppTitle title='Route Stops' />
        </TouchableOpacity>
        {renderCompleteButton()}
        {!stopsToggle ? null : (
          <View style={{paddingHorizontal: 10}}>
            {renderListState()}
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
});

export default RouteNavigationScreen;
