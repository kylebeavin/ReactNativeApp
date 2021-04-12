import {useNavigation} from '@react-navigation/native';
import React, {useContext, useEffect, useState} from 'react';
import {
  ScrollView,
  StyleSheet,
  View,
  TouchableOpacity,
  Text,
} from 'react-native';
import AppAddNew from '../../../components/layout/AppAddNew';
import AppNavGroup from '../../../components/layout/AppNavGroup';
import AppRouteStageIndicator from '../../../components/layout/AppRouteStageIndicator';
import AppTitle from '../../../components/layout/AppTitle';
import Colors from '../../../constants/Colors';
import Configs from '../../../constants/Configs';
import AppContext from '../../../providers/AppContext';
import {ToastContext} from '../../../providers/ToastProvider';
import {SMT_User} from '../../../types';
import {Truck, Route, PreTripInspection} from '../../../types/routes';
import {
  getDateStringsFromDate,
  isSuccessStatusCode,
} from '../../../utils/Helpers';

const RoutesScreen = () => {
  //#region Use State Variables
  const navigation = useNavigation();
  const {grpId, token} = useContext(AppContext);
  const {show} = useContext(ToastContext);

  // State
  const [trucks, setTrucks] = useState<Truck[]>([]);
  const [routes, setRoutes] = useState<Route[]>([]);
  const [users, setUsers] = useState<SMT_User[]>([]);
  const [inspections, setInspections] = useState<PreTripInspection[]>([]);
  const [unassigned, setUnassigned] = useState<Route[]>([]);
  const [assigned, setAssigned] = useState<Route[]>([]);

  // Toggles
  const [truckToggle, setTruckToggle] = useState(false);
  const [routeToggle, setRouteToggle] = useState(false);
  const [userToggle, setUserToggle] = useState(false);
  const [inspectionsToggle, setInspectionsToggle] = useState(false);
  const [unassignedToggle, setUnassignedToggle] = useState(false);
  const [assignedToggle, setAssignedToggle] = useState(false);
  //#endregion

  const getTrucks = async () => {
    if (!truckToggle) {
      await fetch(`${Configs.TCMC_URI}/api/truckBy`, {
        method: 'POST',
        body: JSON.stringify({group_id: grpId}),
        headers: {'Content-Type': 'application/json', 'x-access-token': token},
      })
        .then((res) => res.json())
        .then((data) => {
          if (isSuccessStatusCode(data.status)) {
            setTrucks(data.data);
          } else {
            show({message: data.message});
          }
        })
        .catch((err) => show({message: err.message}));
    }
  };

  const getRoutes = async () => {
    if (!routeToggle) {
      await fetch(`${Configs.TCMC_URI}/api/routesBy`, {
        method: 'POST',
        body: JSON.stringify({group_id: grpId}),
        headers: {'Content-Type': 'application/json', 'x-access-token': token},
      })
        .then((res) => res.json())
        .then((data) => {
          if (isSuccessStatusCode(data.status)) {
            setRoutes(data.data);
          } else {
            show({message: data.message});
          }
        })
        .catch((err) => show({message: err.message}));
    }
  };

  const getUsers = async () => {
    if (!userToggle) {
      await fetch(`${Configs.TCMC_URI}/api/usersBy`, {
        method: 'POST',
        body: JSON.stringify({group_id: grpId}),
        headers: {'Content-Type': 'application/json', 'x-access-token': token},
      })
        .then((res) => res.json())
        .then((data) => {
          if (isSuccessStatusCode(data.status)) {
            setUsers(data.data);
          } else {
            show({message: data.message});
          }
        })
        .catch((err) => show({message: err.message}));
    }
  };

  const getInspections = async () => {
    if (!inspectionsToggle) {
    await fetch(`${Configs.TCMC_URI}/api/pre-tripBy`, {
      method: 'POST',
      body: JSON.stringify({group_id: grpId}),
      headers: {'Content-Type': 'application/json', 'x-access-token': token},
    })
      .then((res) => res.json())
      .then((data) => {
        if (isSuccessStatusCode(data.status)) {
          setInspections(data.data);
        } else {
          show({message: data.message});
        }
      })
      .catch((err) => show({message: err.message}));
    }
  };

  const getUnassignedRoutes = async () => {
    if (!unassignedToggle) {
    await fetch(`${Configs.TCMC_URI}/api/routesBy`, {
      method: 'POST',
      body: JSON.stringify({
        group_id: grpId,
        driver: {$in: [null, '']},
        truck_id: {$in: [null, '']},
      }),
      headers: {'Content-Type': 'application/json', 'x-access-token': token},
    })
      .then((res) => res.json())
      .then((data) => {
        if (isSuccessStatusCode(data.status)) {
          setUnassigned(data.data);
        } else {
          show({message: data.message});
        }
      })
      .catch((err) => show({message: err.message}));
    }
  };

  const getAssignedRoutes = async () => {
    if (!assignedToggle) {
    await fetch(`${Configs.TCMC_URI}/api/routesBy`, {
      method: 'POST',
      body: JSON.stringify({
        group_id: grpId,
        route_stage: {$ne: 'Completed'},
        driver: {$nin: [null, '']},
        truck_id: {$nin: [null, '']},
      }),
      headers: {'Content-Type': 'application/json', 'x-access-token': token},
    })
      .then((res) => res.json())
      .then((data) => {
        if (isSuccessStatusCode(data.status)) {
          setAssigned(data.data);
        } else {
          show({message: data.message});
        }
      })
      .catch((err) => show({message: err.message}));
    }
  };

  return (
    <View>
      <AppTitle title="Routes" />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.contentContainer}>
        <View style={{paddingHorizontal: 10}}>
          <AppNavGroup
            add={{title: 'Route', modal: 'ModalPopup', modals: ['CreateTruckModal', 'CreateRouteModal', 'CreatePreTripInspectionModal']}}
            list="RoutesScreen"
            schedule="RoutesCalendarScreen"
            map="RoutesMapScreen"
            focused="List"
          />
        </View>

        <TouchableOpacity
          onPress={() => {
            getTrucks();
            setTruckToggle(!truckToggle);
          }}>
          <AppTitle title="Trucks" />
        </TouchableOpacity>
        {!truckToggle ? null : (
          <View style={styles.subList}>
            {trucks.map((u: Truck) => {
              return (
                <TouchableOpacity
                  style={styles.card}
                  key={u._id}
                  onPress={() =>
                    navigation.navigate('TruckDetailsScreen', {model: u})
                  }>
                  <View style={{flexDirection: 'row'}}>
                    <View style={{flex: 1}}>
                      <Text numberOfLines={1} style={styles.titleText}>
                        {u.name}
                      </Text>
                      <Text>Condition: {u.service_status}</Text>
                    </View>
                    <View style={{flex: 1}}>
                      <Text
                        style={{
                          color: Colors.SMT_Primary_1,
                          textAlign: 'right',
                        }}>
                        {u.vehicle_type}
                      </Text>
                      <Text
                        style={{
                          fontWeight: 'bold',
                          color: Colors.SMT_Secondary_2_Light_1,
                          textAlign: 'right',
                        }}>
                        {u.vehicle_make + ' ' + u.vehicle_model + ' ' + u.year}
                      </Text>
                    </View>
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>
        )}

        <TouchableOpacity
          onPress={() => {
            getRoutes();
            setRouteToggle(!routeToggle);
          }}>
          <AppTitle title="Routes" />
        </TouchableOpacity>
        {!routeToggle ? null : (
          <View style={styles.subList}>
            {routes.map((u, i) => {
              return (
                <TouchableOpacity
                  style={styles.card}
                  key={u._id}
                  onPress={() =>
                    navigation.navigate('RouteDetailsScreen', {model: u})
                  }>
                  <View style={{flexDirection: 'row'}}>
                    <View style={{flex: 1}}>
                      <Text numberOfLines={1} style={{fontWeight: 'bold'}}>
                        {u.route_id}
                      </Text>
                    </View>
                    <View >
                      <Text style={{color: Colors.SMT_Primary_1}}>
                        {getDateStringsFromDate(u.time).date}
                      </Text>
                      <Text style={{color: Colors.SMT_Secondary_2_Light_1}}>{u.route_stage}</Text>
                    </View>
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>
        )}

        <TouchableOpacity
          onPress={() => {
            getInspections();
            setInspectionsToggle(!inspectionsToggle);
          }}>
          <AppTitle title="Inspections" />
        </TouchableOpacity>
        {!inspectionsToggle ? null : (
          <View style={styles.subList}>
            {inspections.map((u, i) => {
              return (
                <TouchableOpacity
                  style={styles.card}
                  key={u._id}
                  onPress={() =>
                    navigation.navigate('PreTripInspectionDetailsScreen', {
                      model: u,
                    })
                  }>
                  <View style={{flexDirection: 'row'}}>
                    <View style={{flex: 1}}>
                      <Text>{u.inspection_id}</Text>
                      <Text>PreTrip</Text>
                    </View>
                    <View style={{flex: 1}}>
                      <Text
                        style={{
                          fontWeight: 'bold',
                          color: Colors.SMT_Secondary_2_Light_1,
                          textAlign: 'right',
                        }}>
                        {u.type}
                      </Text>
                    </View>
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>
        )}

        <TouchableOpacity
          onPress={() => {
            getUnassignedRoutes();
            setUnassignedToggle(!unassignedToggle);
          }}>
          <AppTitle title="Unassigned" />
        </TouchableOpacity>
        {!unassignedToggle ? null : (
          <View style={styles.subList}>
            {unassigned.map((u, i) => {
              return (
                <TouchableOpacity
                  style={styles.card}
                  key={u._id}
                  onPress={() =>
                    navigation.navigate('Modal', {
                      modal: 'AssignRouteModal',
                      item: u,
                    })
                  }>
                  <View style={{flexDirection: 'row'}}>
                    <View style={{flex: 1}}>
                      <Text numberOfLines={1} style={styles.titleText}>
                        {u.route_id}
                      </Text>
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
                      <View
                        style={{flexDirection: 'row', alignSelf: 'flex-end'}}>
                        <Text>Stops: </Text>
                        <Text
                          style={{
                            fontWeight: 'bold',
                            color:
                              u.service_stop.length > 0
                                ? Colors.SMT_Secondary_2_Light_1
                                : Colors.SMT_Primary_1,
                            textAlign: 'right',
                          }}>
                          {u.service_stop.length}
                        </Text>
                      </View>
                    </View>
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>
        )}

        <TouchableOpacity
          onPress={() => {
            getAssignedRoutes();
            setAssignedToggle(!assignedToggle);
          }}>
          <AppTitle title="Assigned" />
        </TouchableOpacity>
        {!assignedToggle ? null : (
          <View style={styles.subList}>
            {assigned.map((u, i) => {
              return (
                <TouchableOpacity
                  style={styles.card}
                  key={u._id}
                  onPress={() =>
                    navigation.navigate('Modal', {
                      modal: 'AssignRouteModal',
                      item: u,
                    })
                  }>
                  <View style={{flexDirection: 'row'}}>
                    <View style={{flex: 1}}>
                      <Text numberOfLines={1} style={styles.titleText}>
                        {u.route_id}
                      </Text>
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
                      <View
                        style={{flexDirection: 'row', alignSelf: 'flex-end'}}>
                        <Text>Stops: </Text>
                        <Text
                          style={{
                            fontWeight: 'bold',
                            color:
                              u.service_stop.length > 0
                                ? Colors.SMT_Secondary_2_Light_1
                                : Colors.SMT_Primary_1,
                            textAlign: 'right',
                          }}>
                          {u.service_stop.length}
                        </Text>
                      </View>
                    </View>
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  contentContainer: {
    // This is the scrollable part
    paddingBottom: 50,
  },
  scrollView: {
    height: '100%',
    width: '100%',
  },
  //=== Card ===//
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
  //=== List ===//
  subList: {
    padding: 10,
  },
});

export default RoutesScreen;
