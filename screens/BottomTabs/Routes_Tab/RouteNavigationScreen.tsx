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

interface Props {
  route: any;
}

const RouteNavigationScreen: React.FC<Props> = ({route}) => {
  const model: Route = route.params.model;

  //#region Use State Variables
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
    console.log(routeState)
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
            order_status: '',
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

  const getLocations = () : string[] => {
    let locations: string[] = [];

    locations.push(model.start_location);
    ordersList.forEach(x => locations.push(x.location));

    return locations;
  };

  const getDirections = () => {
    // This method is going to depend on the state of the driver's route & stop states.
  };

  const renderMapState = () => {
    // This method is going to depend on the state of the driver's route & stop states.
  };

  const handleGoOnPress = (stop: Order, stopNumber: number) => {
    console.log(stop)
    console.log(stopNumber)
    // Update Cache
    let newState: DriverRouteState = {
      routeStage: 'Navigating',
      stopsState: {
        currentId: stop._id,
        currentStop: stopNumber.toString(),
        currentStatus: 'Navigating'
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
          body: JSON.stringify({_id: stop._id, notes: `${displayName} is on his way.`})
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
    setDriverRouteStateAsync(newState).then(value => {
      if (value) {
        // Update DB
        if (routeState?.stopsState.currentId === 'lastStop') {
          newState.routeStage = 'Started';
          setRouteState(newState);
        } else {
        fetch(`${Configs.TCMC_URI}/api/orders`, {
          method: 'PUT',
          headers: {'Content-Type': 'application/json', 'x-access-token': token},
          body: JSON.stringify({_id: stop._id, order_status: 'completed'})
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
    } else if (routeState.routeStage === 'Navigating') {
        let navigationList : Order[] = [];

        // Calculate where we are in route.
        if (routeState.stopsState.currentStop === '1' && routeState.stopsState.currentStatus !== 'Completed') {
          // If we're on our first stop.
          let firstStop: Order = {
            _id: 'firstStop',
            order_id: 'Start-0',
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
            order_status: '',
            services: '',
            service_date: '',
            service_day: '',
            service_frequency: '',
            url: [],
            account_name: ''
          }
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

  return (
    <View>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.contentContainer}>
        <AppNavDetailGrp route={model} />

        <View style={{paddingHorizontal: 10}}>
          <AppMapBox locations={getLocations()}>
            <DriverNavigationMap route={model} locations={getLocations()} />
          </AppMapBox>
        </View>

        <TouchableOpacity style={{marginBottom: 5}} onPress={() => setStopsToggle(!stopsToggle)}>
          <AppTitle title='Route Stops' />
        </TouchableOpacity>
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
