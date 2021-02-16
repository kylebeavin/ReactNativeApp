import {useNavigation} from '@react-navigation/native';
import React, {useState} from 'react';
import {ScrollView, StyleSheet, View} from 'react-native';
import {TouchableOpacity} from 'react-native-gesture-handler';
import AppButton from '../../../components/Layout/AppButton';
import AppList from '../../../components/Layout/AppList';
import AppNavBtnGrp from '../../../components/Layout/AppNavBtnGrp';
import AppTitle from '../../../components/Layout/AppTitle';
import Configs from '../../../constants/Configs';

const RoutesScreen = () => {
  //#region Use State Variables
  const navigation = useNavigation();
  const [truckToggle, setTruckToggle] = useState(false);
  const [routeToggle, setRouteToggle] = useState(false);
  const [driverToggle, setDriverToggle] = useState(false);
  const [unassignedToggle, setUnassignedToggle] = useState(false);
  const [assignedToggle, setAssignedToggle] = useState(false);
  //#endregion

  return (
    <View>
      <AppTitle title="Routes" help search />

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

        <TouchableOpacity onPress={() => setTruckToggle(!truckToggle)}>
          <AppTitle title="Trucks" />
          {!truckToggle ? null : (
            <AppList
              url={`${Configs.TCMC_URI}/api/trucksBy`}
              httpMethod="POST"
            />
          )}
        </TouchableOpacity>

        <TouchableOpacity onPress={() => setRouteToggle(!routeToggle)}>
          <AppTitle title="Routes" />
          {!routeToggle ? null : (
            <AppList
              url={`${Configs.TCMC_URI}/api/routesBy`}
              httpMethod="POST"
            />
          )}
        </TouchableOpacity>

        <TouchableOpacity onPress={() => setDriverToggle(!driverToggle)}>
          <AppTitle title="Drivers" />
          {!driverToggle ? null : (
            <AppList
              url={`${Configs.TCMC_URI}/api/driversBy`}
              httpMethod="POST"
            />
          )}
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => setUnassignedToggle(!unassignedToggle)}>
          <AppTitle title="Unassigned" />
          {!unassignedToggle ? null : (
            <AppList
              url={`${Configs.TCMC_URI}/api/routesBy`}
              httpMethod="POST"
            />
          )}
        </TouchableOpacity>

        <TouchableOpacity onPress={() => setAssignedToggle(!assignedToggle)}>
          <AppTitle title="Assigned" />
          {!assignedToggle ? null : (
            <AppList
              url={`${Configs.TCMC_URI}/api/routesBy`}
              httpMethod="POST"
            />
          )}
        </TouchableOpacity>
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
});

export default RoutesScreen;
