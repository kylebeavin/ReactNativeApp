import {useNavigation} from '@react-navigation/native';
import React, {useContext, useEffect, useState} from 'react';
import {StyleSheet, View, Text, TouchableOpacity} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';

import Colors from '../../constants/Colors';
import Configs from '../../constants/Configs';
import Layout from '../../constants/Layout';
import AppContext from '../../providers/AppContext';
import {ToastContext} from '../../providers/ToastProvider';
import {DriverRouteState, Route} from '../../types/routes';
import {getDateStringsFromDate, isSuccessStatusCode} from '../../utils/Helpers';
import AppButton from '../Layout/AppButton';
import AppEmptyCard from '../Layout/AppEmptyCard';
import AppTitle from '../Layout/AppTitle';
import useAsyncStorage from '../../hooks/useAsyncStorage';

const DriverDashboard = () => {
  //#region Use State Variables
  const navigation = useNavigation();
  const {id, grpId, token} = useContext(AppContext);
  const {show} = useContext(ToastContext);
  const {getDriverRouteStateAsync, setDriverRouteStateAsync, clearDriverRouteStateAsync} = useAsyncStorage();
  const [status, setStatus] = useState('Unassigned');
  const [myRoute, setMyRoute] = useState<Route>();
  const [routes, setRoutes] = useState<Route[]>([]);

  // Pop ups
  const [showSelectRoutePopup, setShowSelectRoutePopup] = useState(false);
  //#endregion
    
    useFocusEffect(
      React.useCallback(() => {
        checkForAssignedRoute();
      }, [])
    );

    useEffect(() => {
      if (myRoute) {
        getRouteStage();
      }
    }, [myRoute]);

  const checkForAssignedRoute = async () => {
    await fetch(`${Configs.TCMC_URI}/api/routesBy`, {
      method: 'POST',
      headers: {'Content-Type': 'application/json', 'x-access-token': token},
      body: JSON.stringify({
        group_id: grpId,
        route_stage: {$ne: 'Completed'},
        driver_id: id,
      }),
    })
      .then((res) => res.json())
      .then((json) => {
        if (isSuccessStatusCode(json.status)) {
          if (json.data.length > 1) {
            // If we are assigned more than one route show popup
            setRoutes(json.data);
            setShowSelectRoutePopup(true);
          } else if (json.data.length == 1) {
            setMyRoute(json.data[0]);
          } else {
            setMyRoute(undefined);
            setStatus('Unassigned');
          }
        } else {
          show({message: json.message});
        }
      })
      .catch((err) => show({message: err.message}));
  };

  const getStatusColor = (): string => {
    if (status === 'Unassigned' || status === 'Empty')
      return Colors.SMT_Primary_1_Light_1;
    if (status === 'Built' || status === 'Routed')
      return Colors.SMT_Secondary_1;
    if (status === 'Assigned' || status === 'Inspected')
      return Colors.SMT_Secondary_2_Light_1;
    if (status === 'Finalized') return Colors.SMT_Secondary_2;
    if (status === 'Completed') return 'limegreen';
    return Colors.SMT_Secondary_1;
  };

  const getRouteStage = () => {
    let stage = 'Empty';

    if (myRoute!.service_stop.length > 0) stage = 'Built';
    if (myRoute!.time > new Date()) stage = 'Routed';
    if (myRoute!.driver_id != null && myRoute!.driver_id != '' && myRoute!.truck_id != null && myRoute!.truck_id != '') stage = 'Assigned';
    if (myRoute!.inspection_id != null && myRoute!.inspection_id != '') stage = 'Inspected'; 
    if (myRoute!.route_stage === 'Finalized') stage = 'Finalized';
    if (myRoute!.route_stage === 'Completed') stage = 'Completed';

    setStatus(stage);
  };

  const renderActionButton = () => {
    if (myRoute?.truck_id === null || myRoute?.truck_id === '') return <AppButton title='Assign Your Truck' onPress={() => navigation.navigate('Modal', {modal: 'AssignTruckModal', item: myRoute})} />;
    if (status === 'Assigned') return <AppButton title='Start Pre-Trip Inspection' onPress={() => navigation.navigate('Modal' ,{modal: 'CreatePreTripInspectionModal', item: myRoute})} />;
    if (status === 'Inspected') return <AppButton title='Start Route' onPress={handleStartOnPress} />;
    if (status === 'Finalized') {
      return (
        <View style={{flexDirection: 'row'}}>
          <AppButton
            title='Go To Route'
            onPress={() =>
              navigation.navigate('Dashboard', {
                screen: 'RouteNavigationScreen',
                params: {model: myRoute},
              })
            }
          />
          <AppButton title='End Route' onPress={handleEndOnPress} />
        </View>
      );
    }
    return null;
  };

  const handleStartOnPress = () => {
    fetch(`${Configs.TCMC_URI}/api/routes`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'x-access-token': token,
      },
      body: JSON.stringify({
        _id: myRoute?._id,
        route_stage: 'Finalized',
      }),
    })
      .then((res) => res.json())
      .then((json) => {
        if (isSuccessStatusCode(json.status)) {
          let routeState: DriverRouteState = {
            routeStage: 'Started',
            stopsState: {
              currentId: '',
              currentStop: '',
              currentStatus: ''
            }
          }
          setDriverRouteStateAsync(routeState).then((value) => {
            if (value) {
              navigation.navigate('Dashboard', {
                screen: 'RouteNavigationScreen',
                params: {model: myRoute},
              });
            }
          });
        } else {
          show({message: json.message});
        }
      })
      .catch((err) => show({message: err.message}));
  };

  const handleEndOnPress = () => {
    fetch(`${Configs.TCMC_URI}/api/routes`, {
      method: 'PUT',
      headers: {'Content-Type': 'application/json', 'x-access-token': token},
      body: JSON.stringify({_id: myRoute?._id, route_stage: 'Completed'}),
    })
      .then((res) => res.json())
      .then((json) => {
        if (isSuccessStatusCode(json.status)) {
          clearDriverRouteStateAsync().then(value => {
            if (value) {
              setMyRoute(undefined);
              setStatus('Unassigned');
              show({message: 'You completed the route.'});
            }
          });
        } else {
          show({message: json.message});
        }
      })
      .catch((err) => show({message: err.message}));
  };

  return (
    <View style={{minHeight: Layout.window.height}}>
      <View style={styles.container}>
        {/* Summary Card */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Route Summary</Text>

          {/* Card Content */}
          {status === 'Unassigned' ? (
            <View style={{paddingHorizontal: 20}}>
              <View style={{paddingVertical: 20}}>
                <Text
                  style={{
                    fontWeight: 'bold',
                    fontSize: 28,
                    textAlign: 'center',
                    color: Colors.SMT_Secondary_1_Light_1,
                  }}>
                  No Route Assigned
                </Text>
                <Text
                  style={{
                    paddingVertical: 20,
                    fontWeight: 'bold',
                    fontSize: 18,
                    textAlign: 'center',
                    color: Colors.SMT_Secondary_1_Light_1,
                  }}>
                  Assign today's route to view route summary.
                </Text>
              </View>
              <AppButton
                title="Assign Today's Route"
                onPress={() =>
                  navigation.navigate('Modal', {
                    modal: 'AssignDriverModal',
                    item: id,
                  })
                }
              />
            </View>
          ) : (
            <View style={styles.cardContent}>
              <View style={styles.cardContentItem}>
                <Text style={{color: 'black', textAlign: 'center'}}>
                  Stops Scheduled
                </Text>
                <Text style={{color: 'black'}}>
                  {myRoute?.service_stop.length}
                </Text>
              </View>
              <View style={styles.cardContentItem}>
                <Text style={{textAlign: 'center'}}>Route Miles</Text>
                <Text>00</Text>
              </View>
              <View style={styles.cardContentItem}>
                <Text style={{textAlign: 'center'}}>Estimated Travel Time</Text>
                <Text>00:00</Text>
              </View>
              <View style={styles.cardContentItem}>
                <Text style={{textAlign: 'center'}}>Total Smashes</Text>
                <Text>00</Text>
              </View>

              {renderActionButton()}
            </View>
          )}
        </View>
      </View>

      <AppTitle title='Route Details' />
      <View style={styles.container}>
        {/* Route Details */}
        <View style={styles.statusContainer}>
          {/* Route Status */}
          <View style={styles.statusHeader}>
            <Text style={styles.statusHeaderText}>
              {myRoute?.route_id}:{' '}
              <Text
                style={[styles.statusHeaderValue, {color: getStatusColor()}]}>
                {status}
              </Text>
            </Text>
          </View>

          {/* Route Content */}
          <View style={styles.statusContent}>
            <View style={styles.statusContentItem}>
              <Text>
                Truck:{' '}
                {!myRoute?.truck_id ? 'No Truck Assigned' : myRoute.truck_id}
              </Text>
            </View>
            <View style={styles.statusContentItem}>
              <Text>
                Inspection:{' '}
                {!myRoute?.inspection_id
                  ? 'Not Yet Inspected'
                  : myRoute.truck_id}
              </Text>
            </View>
          </View>

          <View>
            <View style={styles.stopListHeader}>
              <Text style={{fontWeight: 'bold', fontSize: 18}}>Stop List</Text>
              <Text style={{fontWeight: 'bold', fontSize: 18}}>
                Total: {!myRoute ? '00' : myRoute?.service_stop.length}
              </Text>
            </View>
            <View>
              {!myRoute ? (
                <AppEmptyCard entity='Routes' modal='AssignDriverModal' />
              ) : (
                myRoute?.service_stop.map((u) => {
                  return (
                    <TouchableOpacity
                      style={styles.modalCard}
                      key={u}
                      onPress={() => null}>
                      <View style={{flexDirection: 'row'}}>
                        <View style={{flex: 1}}>
                          <Text style={styles.titleText}>{u}</Text>
                          <Text>Address</Text>
                        </View>
                        <View style={{flex: 1}}>
                          <Text
                            style={{
                              color: Colors.SMT_Primary_1,
                              textAlign: 'right',
                            }}>
                            Window
                          </Text>
                          <Text
                            style={{
                              fontWeight: 'bold',
                              color: Colors.SMT_Secondary_2_Light_1,
                              textAlign: 'right',
                            }}>
                            Service
                          </Text>
                        </View>
                      </View>
                    </TouchableOpacity>
                  );
                })
              )}
            </View>
          </View>
        </View>
      </View>

      {showSelectRoutePopup ? (
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
            <AppTitle title='Select Route' />
            <View style={styles.container}>
              {routes.map((u: Route) => {
                return (
                  <TouchableOpacity
                    style={styles.modalCard}
                    key={u._id}
                    onPress={() => {
                      setMyRoute(u);
                      setStatus(u.route_stage);
                      setShowSelectRoutePopup(!showSelectRoutePopup);
                    }}>
                    <View style={{flexDirection: 'row'}}>
                      <View style={{flex: 1}}>
                        <Text style={styles.titleText}>{u.route_id}</Text>
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
          </View>
        </View>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  //====== Base Styles==============
  container: {
    paddingHorizontal: 10,
    paddingVertical: 10,
  },
  //====== Base Styles==============

  //====== Card Styles==============
  card: {
    padding: 10,
    borderRadius: 3,
    borderWidth: 2,
    borderColor: Colors.SMT_Secondary_1_Light_1,
  },
  cardContent: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  cardContentItem: {
    padding: 10,
    width: '50%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardTitle: {
    marginBottom: 10,
    fontSize: 20,
    fontWeight: 'bold',
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
  //====== Card Styles ==============
  //====== Route Detail Styles =====
  statusContainer: {
    marginBottom: 10,
    paddingHorizontal: 10,
  },
  statusContent: {
    marginBottom: 10,
  },
  statusContentItem: {
    //justifyContent: 'center',
    //alignItems: 'center',
  },
  statusContentItemIcon: {
    fontSize: 80,
  },
  statusHeader: {
    paddingVertical: 10,
  },
  statusHeaderText: {
    textAlign: 'center',
    fontSize: 20,
  },
  statusHeaderValue: {
    color: Colors.SMT_Secondary_2_Light_2,
    fontWeight: 'bold',
  },
  stopListHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  //====== Status Rating Styles =====

  //====== Modal =====//
  popup: {
    width: '100%',
    position: 'absolute',
    maxHeight: Layout.window.height / 1.5,
    marginBottom: 20,
    borderRadius: 4,
    borderColor: Colors.SMT_Secondary_1_Light_1,
    borderWidth: 1,
    backgroundColor: Colors.SMT_Tertiary_1,
  },
  titleText: {
    fontWeight: 'bold',
  },
  modalCard: {
    backgroundColor: Colors.SMT_Tertiary_1,
    marginBottom: 3,
    borderWidth: 1,
    borderColor: Colors.SMT_Secondary_1_Light_1,
    borderRadius: 3,
    paddingVertical: 3,
    paddingHorizontal: 5,
  },
  //====== Modal =====//
});

export default DriverDashboard;
