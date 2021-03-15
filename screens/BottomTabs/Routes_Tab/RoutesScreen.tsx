import {useNavigation} from '@react-navigation/native';
import React, {useContext, useState} from 'react';
import {
  ScrollView,
  StyleSheet,
  View,
  TouchableOpacity,
  Text,
} from 'react-native';
import AppAddNew from '../../../components/Layout/AppAddNew';
import AppButton from '../../../components/Layout/AppButton';
import AppNavBtnGrp from '../../../components/Layout/AppNavBtnGrp';
import AppRouteStageIndicator from '../../../components/Layout/AppRouteStageIndicator';
import AppTitle from '../../../components/Layout/AppTitle';
import Colors from '../../../constants/Colors';
import Configs from '../../../constants/Configs';
import AppContext from '../../../providers/AppContext';
import {ToastContext} from '../../../providers/ToastProvider';
import {SMT_User} from '../../../types';
import {Truck, Route, PreTripInspection} from '../../../types/routes';
import {getDateStringsFromDate, isSuccessStatusCode} from '../../../utils/Helpers';

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
  };

  const getRoutes = async () => {
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
  };

  const getUsers = async () => {
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
  };

  const getInspections = async () => {
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
  };

  const getUnassignedRoutes = async () => {
    await fetch(`${Configs.TCMC_URI}/api/routesBy`, {
      method: 'POST',
      body: JSON.stringify({group_id: grpId, driver: {$in:[null,'']}, truck_id: {$in:[null,'']}}),
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
  };

  const getAssignedRoutes = async () => {
    await fetch(`${Configs.TCMC_URI}/api/routesBy`, {
      method: 'POST',
      body: JSON.stringify({group_id: grpId, route_stage: {$ne: 'Completed'}, driver: {$nin:[null,'']}, truck_id: {$nin:[null,'']}}),
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
  };

  return (
    <View>
      <AppTitle title="Routes" />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.contentContainer}>
        <View style={{paddingHorizontal: 10}}>
          <AppNavBtnGrp>
            <AppButton
              title="ROUTES"
              onPress={() => navigation.navigate('RoutesScreen')}
              outlined={false}
            />
            <AppButton
              title="CALENDAR"
              onPress={() => navigation.navigate('RoutesCalendarScreen')}
              outlined={true}
            />
            <View style={{marginRight: -10}}>
              <AppButton
                title="MAP"
                onPress={() => navigation.navigate('RoutesMapScreen')}
                outlined={true}
              />
            </View>
          </AppNavBtnGrp>
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
            <AppAddNew title="TRUCK" modal="CreateTruckModal" />
            {trucks.map((u: Truck) => {
              return (
                <TouchableOpacity
                  style={styles.card}
                  key={u._id}
                  onPress={() => navigation.navigate("TruckDetailsScreen", {model: u})}>
                  <View style={{flexDirection: 'row'}}>
                    <View style={{flex: 1}}>
                      <Text numberOfLines={1} style={styles.titleText}>{u.name}</Text>
                      <Text>{u.service_status}</Text>
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
                        {u.year}
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
            <AppAddNew title="ROUTE" modal="CreateRouteModal" />
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
                      <Text numberOfLines={1} style={{fontWeight: 'bold'}}>#{u._id}</Text>
                      <Text style={{color: Colors.SMT_Primary_1}}>{getDateStringsFromDate(u.time).date}</Text>
                    </View>
                    <AppRouteStageIndicator route={u} />
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>
        )}

        <TouchableOpacity
          onPress={() => {
            getUsers();
            setUserToggle(!userToggle);
          }}>
          <AppTitle title="Users" />
        </TouchableOpacity>
        {!userToggle ? null : (
          <View style={styles.subList}>
            <AppAddNew title="USER" modal="CreateUserModal" />
            {users.map((u: SMT_User) => {
              return (
                <TouchableOpacity
                  style={styles.card}
                  key={u._id}
                  onPress={() => navigation.navigate("UserDetailsScreen", {model: u})}>
                  <View style={{flexDirection: 'row'}}>
                    <View style={{flex: 1}}>
                      <Text numberOfLines={1} style={styles.titleText}>
                        {u.first_name} {u.last_name}
                      </Text>
                      <Text numberOfLines={1}>{u.email}</Text>
                    </View>
                    <View style={{flex: 1}}>
                      <Text
                        style={{
                          color: Colors.SMT_Primary_1,
                          textAlign: 'right',
                        }}>
                        Active: {u.is_active ? 'Yes' : 'No'}
                      </Text>
                      <Text
                        style={{
                          fontWeight: 'bold',
                          color: Colors.SMT_Secondary_2_Light_1,
                          textAlign: 'right',
                        }}>
                        {u.role}
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
            getInspections();
            setInspectionsToggle(!inspectionsToggle);
          }}>
          <AppTitle title="Inspections" />
        </TouchableOpacity>
        {!inspectionsToggle ? null : (
          <View style={styles.subList}>
            <AppAddNew
              title="INSPECTION"
              modal="CreatePreTripInspectionModal"
            />
            {inspections.map((u, i) => {
              return (
                <TouchableOpacity
                  style={styles.card}
                  key={u._id}
                  onPress={() => navigation.navigate('PreTripInspectionDetailsScreen', {model: u})}>
                  <View style={{flexDirection: 'row'}}>
                    <View style={{flex: 1}}>
                      <Text numberOfLines={1} style={styles.titleText}>
                        {u._id}
                      </Text>
                      <Text>Pre-Trip</Text>
                    </View>
                    <View style={{flex: 1}}>
                      <Text numberOfLines={1}
                        style={{
                          color: Colors.SMT_Primary_1,
                          textAlign: 'right',
                        }}>
                        {u.truck_id}
                      </Text>
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
                  onPress={() => navigation.navigate("Modal", {modal: "AssignRouteModal", item: u})}>
                  <View style={{flexDirection: 'row'}}>
                    <View style={{flex: 1}}>
                      <Text numberOfLines={1} style={styles.titleText}>
                        {u._id}
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
                      <View style={{flexDirection: 'row', alignSelf: 'flex-end'}}>
                        <Text>Stops: </Text>
                        <Text
                          style={{
                            fontWeight: 'bold',
                            color: u.service_stop.length > 0 ? Colors.SMT_Secondary_2_Light_1 : Colors.SMT_Primary_1,
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

        <TouchableOpacity onPress={() => {
            getAssignedRoutes();
            setAssignedToggle(!assignedToggle)
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
                    navigation.navigate("Modal", {modal: "AssignRouteModal", item: u})
                  }>
                  <View style={{flexDirection: 'row'}}>
                    <View style={{flex: 1}}>
                      <Text numberOfLines={1} style={styles.titleText}>
                        {u._id}
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
                      <View style={{flexDirection: 'row', alignSelf: 'flex-end'}}>
                        <Text>Stops: </Text>
                        <Text
                          style={{
                            fontWeight: 'bold',
                            color: u.service_stop.length > 0 ? Colors.SMT_Secondary_2_Light_1 : Colors.SMT_Primary_1,
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
