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
import AppTitle from '../../../components/Layout/AppTitle';
import Colors from '../../../constants/Colors';
import Configs from '../../../constants/Configs';
import AppContext from '../../../providers/AppContext';
import {ToastContext} from '../../../providers/ToastProvider';
import { SMT_User } from '../../../types';
import {Truck, Route} from '../../../types/routes';
import {isSuccessStatusCode} from '../../../utils/Helpers';

const RoutesScreen = () => {
  //#region Use State Variables
  const navigation = useNavigation();
  const {grpId, token} = useContext(AppContext);
  const {show} = useContext(ToastContext);

  // State
  const [trucks, setTrucks] = useState<Truck[]>([]);
  const [routes, setRoutes] = useState<Route[]>([]);
  const [drivers, setDrivers] = useState<SMT_User[]>([]);
  const [inspections, setInspections] = useState<any[]>([]);

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
      .then((res) => {
        console.log(res.status);
        return res.json();
      })
      .then((data) => {
        if (data.status == 'success') {
          setTrucks(data.data);
        } else {
          show({message: data.message});
        }
      })
      .catch((err) => show({message: err.message}));
  };

  const getRoutes = async () => {
    await fetch(`${Configs.TCMC_URI}/api/routes`, {
      //method: 'POST',
      //body: JSON.stringify({group_id: grpId}),
      headers: {'Content-Type': 'application/json', 'x-access-token': token},
    })
      .then((res) => {
        console.log(res.status);
        return res.json();
      })
      .then((data) => {
        if (data.status == 'success') {
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
      .then((res) => {
        console.log(res.status);
        return res.json();
      })
      .then((data) => {
        console.log(data)
        if (data.status == 'success') {
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
      .then((res) => {
        console.log(res.status);
        return res.json();
      })
      .then((data) => {
        console.log(data)
        if (data.status == 'success') {
          setInspections(data.data);
        } else {
          show({message: data.message});
        }
      })
      .catch((err) => show({message: err.message}));
  };

  return (
    <View>
      <AppTitle title="Routes" help search />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.contentContainer}
        >

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
                      title="See Details"
                      onPress={() => console.log('Truck Details')}
                    />
                    <View
                      style={{
                        flexDirection: 'row',
                      }}>
                      <AppButton
                        title="Inspections"
                        onPress={() => console.log('Truck Inspections')}
                      />
                      <AppButton
                        title="Service"
                        onPress={() => console.log('Truck Service')}
                        backgroundColor={Colors.SMT_Secondary_2_Light_1}
                      />
                    </View>
                  </View>
                </View>
              );
            })}
          </View>
        )}

        <TouchableOpacity onPress={() => {
            getRoutes();
            setRouteToggle(!routeToggle)
          }}>
          <AppTitle title="Routes" />
        </TouchableOpacity>
        {!routeToggle ? null : (
          <View style={styles.subList}>
            <AppAddNew title="ROUTE" modal="CreateRouteModal" />
            {routes.map((u, i) => {
              return (
                <View style={styles.card} key={u._id}>
                  <Text>
                    Route: {u._id}, Start: {u.start_location}
                  </Text>
                  <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                    }}>
                    <AppButton
                      outlined
                      title="See Details"
                      onPress={() => console.log('Route Details')}
                    />
                    <View
                      style={{
                        flexDirection: 'row',
                      }}>
                      <AppButton
                        title="Inspections"
                        onPress={() => console.log('Route Inspections')}
                      />
                      <AppButton
                        title="Optimize"
                        onPress={() => console.log('Optimize Route')}
                        backgroundColor={Colors.SMT_Secondary_2_Light_1}
                      />
                    </View>
                  </View>
                </View>
              );
            })}
          </View>
        )}

        <TouchableOpacity onPress={() => {
            getDrivers();
            setDriverToggle(!driverToggle)
          }}>
          <AppTitle title="Drivers" />
        </TouchableOpacity>
        {!driverToggle ? null : (
          <View style={styles.subList}>
            <AppAddNew title="DRIVER" modal="CreateDriverModal" />
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
                      title="Driver Profile"
                      onPress={() => console.log('Driver Profile')}
                    />
                    <View
                      style={{
                        flexDirection: 'row',
                      }}>
                      <AppButton
                        title="Logs"
                        onPress={() => console.log('Logs')}
                      />
                      <AppButton
                        title="Contact"
                        onPress={() => console.log('Contact')}
                        backgroundColor={Colors.SMT_Secondary_2_Light_1}
                      />
                    </View>
                  </View>
                </View>
              );
            })}
          </View>
        )}

        <TouchableOpacity onPress={() => {
            getInspections();
            setInspectionsToggle(!inspectionsToggle)
          }}>
          <AppTitle title="Inspections" />
        </TouchableOpacity>
        {!inspectionsToggle ? null : (
          <View style={styles.subList}>
            <AppAddNew title="INSPECTION" modal="CreatePreTripInspectionModal" />
            {inspections.map((u, i) => {
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
                      title="Driver Profile"
                      onPress={() => console.log('Driver Profile')}
                    />
                    <View
                      style={{
                        flexDirection: 'row',
                      }}>
                      <AppButton
                        title="Logs"
                        onPress={() => console.log('Logs')}
                      />
                      <AppButton
                        title="Contact"
                        onPress={() => console.log('Contact')}
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
          onPress={() => setUnassignedToggle(!unassignedToggle)}>
          <AppTitle title="Unassigned" />
        </TouchableOpacity>
        {!unassignedToggle ? null : (
          <View style={styles.subList}>
            <AppList
              url={`${Configs.TCMC_URI}/api/routesBy`}
              httpMethod="POST"
              renderItem={(u,i) => {
                return (
                  <View></View>
                )
              }}
            />
          </View>
        )}

        <TouchableOpacity onPress={() => setAssignedToggle(!assignedToggle)}>
          <AppTitle title="Assigned" />
        </TouchableOpacity>
        {!assignedToggle ? null : (
          <View style={styles.subList}>
            <AppList
              url={`${Configs.TCMC_URI}/api/routesBy`}
              httpMethod="POST"
              renderItem={(u,i) => {
                return (
                  <View></View>
                )
              }}
            />
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
