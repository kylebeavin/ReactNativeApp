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
import AppList from '../../../components/Layout/AppList';
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
  const [drivers, setDrivers] = useState<SMT_User[]>([]);
  const [inspections, setInspections] = useState<PreTripInspection[]>([]);
  const [unassigned, setUnassigned] = useState<Route[]>([]);
  const [assigned, setAssigned] = useState<Route[]>([]);

  // Toggles
  const [truckToggle, setTruckToggle] = useState(false);
  const [routeToggle, setRouteToggle] = useState(false);
  const [driverToggle, setDriverToggle] = useState(false);
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

  const getDrivers = async () => {
    await fetch(`${Configs.TCMC_URI}/api/usersBy`, {
      method: 'POST',
      body: JSON.stringify({group_id: grpId}),
      headers: {'Content-Type': 'application/json', 'x-access-token': token},
    })
      .then((res) => res.json())
      .then((data) => {
        if (isSuccessStatusCode(data.status)) {
          setDrivers(data.data);
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
      body: JSON.stringify({group_id: grpId, route_stage: 'unassigned'}),
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
      body: JSON.stringify({group_id: grpId, route_stage: 'assigned'}),
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
              title="Routes"
              onPress={() => navigation.navigate('RoutesScreen')}
              outlined={false}
            />
            <AppButton
              title="Calendar"
              onPress={() => navigation.navigate('RoutesCalendarScreen')}
              outlined={true}
            />
            <View style={{marginRight: -10}}>
              <AppButton
                title="Map"
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
            {trucks.map((u, i) => {
              return (
                <View style={styles.card} key={u._id}>
                  <Text>
                    Truck: {u.name}, Status: {u.service_status}
                  </Text>
                  <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                    }}>
                    <AppButton
                      outlined
                      title="Details"
                      onPress={() => navigation.navigate("TruckDetailsScreen", {model: u})}
                    />
                    <View
                      style={{
                        flexDirection: 'row',
                      }}>
                      <AppButton
                        title="Inspections"
                        onPress={() => null}
                      />
                      <AppButton
                        title="Service"
                        onPress={() => null}
                        backgroundColor={Colors.SMT_Secondary_2_Light_1}
                      />
                    </View>
                  </View>
                </View>
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
                      <AppRouteStageIndicator route={u} />
                    </View>
                    <View style={{flex: 1}}>
                      <Text numberOfLines={1} style={{fontWeight: 'bold'}}>#{u._id}</Text>
                      <Text style={{color: Colors.SMT_Primary_1, textAlign: 'right'}}>{getDateStringsFromDate(u.time).date}</Text>
                    </View>
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>
        )}

        <TouchableOpacity
          onPress={() => {
            getDrivers();
            setDriverToggle(!driverToggle);
          }}>
          <AppTitle title="Users" />
        </TouchableOpacity>
        {!driverToggle ? null : (
          <View style={styles.subList}>
            <AppAddNew title="USER" modal="CreateUserModal" />
            {drivers.map((u, i) => {
              return (
                <View style={styles.card} key={u._id}>
                  <Text>
                    Name: {u.first_name}, Group: {u.group_id}
                  </Text>
                  <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                    }}>
                    <AppButton
                      outlined
                      title="Details"
                      onPress={() => navigation.navigate("UserDetailsScreen", {model: u})}
                    />
                    <View
                      style={{
                        flexDirection: 'row',
                      }}>
                      <AppButton
                        title="Logs"
                        onPress={() => null}
                      />
                      <AppButton
                        title="Contact"
                        onPress={() => null}
                        backgroundColor={Colors.SMT_Secondary_2_Light_1}
                      />
                    </View>
                  </View>
                </View>
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
                <View style={styles.card} key={u._id}>
                  <Text>
                    Name: {u._id}, Group: {u.group_id}
                  </Text>
                  <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                    }}>
                    <AppButton
                      outlined
                      title="Driver Profile"
                      onPress={() => null}
                    />
                    <View
                      style={{
                        flexDirection: 'row',
                      }}>
                      <AppButton
                        title="Logs"
                        onPress={() => null}
                      />
                      <AppButton
                        title="Contact"
                        onPress={() => null}
                        backgroundColor={Colors.SMT_Secondary_2_Light_1}
                      />
                    </View>
                  </View>
                </View>
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
                <View style={styles.card} key={u._id}>
                  <Text>Route #: {u._id}</Text>
                  <Text style={{marginBottom: 5}}>Date: {getDateStringsFromDate(u.time).date}</Text>
                  <Text style={{marginBottom: 5}}>Notes: {u.notes}</Text>
                  <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                    }}>
                    <AppButton
                      outlined
                      title="Details"
                      onPress={() => navigation.navigate("RouteDetailsScreen", {model: u})}
                    />
                    <View
                      style={{
                        flexDirection: 'row',
                      }}>
                      <AppButton
                        title="Assign"
                        onPress={() => navigation.navigate("Modal", {modal: "AssignRouteModal", item: u})}
                      />
                    </View>
                  </View>
                </View>
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
                <View style={styles.card} key={u._id}>
                  <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
                    <View style={{flex: 1, marginRight: 10}}>
                      <Text numberOfLines={1} style={{fontWeight: 'bold'}}>#{u._id}</Text>
                      <Text numberOfLines={1} style={{color: 'black'}}>Driver: {u.driver}</Text>
                      <Text numberOfLines={1} style={{color: 'black'}}>Truck #{u.truck_id}</Text>
                      <Text numberOfLines={1} style={{marginBottom: 5, color: "black"}}>Notes: {u.notes}</Text>
                    </View>
                    <View style={{flex: 1}}>
                      <Text
                        style={{color: Colors.SMT_Primary_1, textAlign: 'right'}}>
                        {getDateStringsFromDate(u.time).date}
                      </Text>
                      <Text style={{fontWeight: 'bold', textAlign: 'right'}}>Stops: 00</Text>
                    </View>
                  </View>

                  <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                    }}>
                    <AppButton
                      outlined
                      title="Details"
                      onPress={() =>
                        navigation.navigate('RouteDetailsScreen', {model: u})
                      }
                    />
                    <View
                      style={{
                        flexDirection: 'row',
                      }}>
                      <AppButton
                        title="Reassign"
                        onPress={() =>
                          navigation.navigate('Modal', {
                            modal: 'AssignRouteModal',
                            item: u,
                          })
                        }
                      />
                    </View>
                  </View>
                </View>
              );
            })}
          </View>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.SMT_Tertiary_1,
    borderRadius: 3,
    borderColor: Colors.SMT_Secondary_1,
    borderWidth: 2,
    marginBottom: 5,
    padding: 5,
  },
  contentContainer: {
    // This is the scrollable part
  },
  scrollView: {
    height: '100%',
    width: '100%',
  },
  subList: {
    padding: 15,
    backgroundColor: Colors.SMT_Secondary_2_Light_2,
  },
});

export default RoutesScreen;
