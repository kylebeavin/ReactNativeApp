import {useNavigation} from '@react-navigation/native';
import React, {useState} from 'react';
import {
  StyleSheet,
  View,
  ScrollView,
  TouchableOpacity,
  Text,
} from 'react-native';
import AppButton from '../../../components/Layout/AppButton';
import AppNavBtnGrp from '../../../components/Layout/AppNavBtnGrp';
import AppTitle from '../../../components/Layout/AppTitle';
import {Route} from '../../../types/routes';

interface Props {
  route: any;
}

const RouteDetailsScreen: React.FC<Props> = ({route}) => {
  //#region Use State Variables
  const navigation = useNavigation();

  // Toggles
  const [inspectionsToggle, setInspectionsToggle] = useState(false);
  const [stopsToggle, setStopsToggle] = useState(false);
  //#endregion

  return (
    <View>
      <AppTitle title='Route Detail' help search />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.contentContainer}>
        <AppNavBtnGrp>
          <View style={{marginRight: 60, marginTop: 12, paddingLeft: 10}}>
            <AppButton
              title='Back'
              onPress={() => navigation.goBack()}
              outlined={true}
              icon={{type: 'MaterialIcons', name: 'arrow-back'}}
            />
          </View>
          <View style={{marginRight: -10}}>{/* Placeholder */}</View>
        </AppNavBtnGrp>

        <View style={{paddingLeft: 10}}>
          <Text>_id: {route.params.route._id}</Text>
          <Text>driver: {route.params.route.driver}</Text>
          <Text>group_id: {route.params.route.group_id}</Text>
          <Text>is_active: {route.params.route.is_active}</Text>
          <Text>route_stage: {route.params.route.route_stage}</Text>
          <Text>notes: {route.params.route.notes}</Text>
          <Text>service_stop: {route.params.route.service_stop}</Text>
          <Text>start_location: {route.params.route.start_location}</Text>
          <Text>time: {route.params.route.time}</Text>
          <Text>truck_id: {route.params.route.truck_id}</Text>
          <Text>truck_vin: {route.params.route.truck_vin}</Text>
        </View>

        <TouchableOpacity
          onPress={() => setInspectionsToggle(!inspectionsToggle)}>
          <AppTitle title='Inspections' />
        </TouchableOpacity>
        {!inspectionsToggle ? null : (
          <View style={{paddingLeft: 10}}>
            <Text>Hello World!</Text>
          </View>
        )}

        <TouchableOpacity onPress={() => setStopsToggle(!stopsToggle)}>
          <AppTitle title='Stops' />
        </TouchableOpacity>
        {!stopsToggle ? null : (
          <View style={{paddingLeft: 10}}>
            <Text>Hello stops!</Text>
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
});

export default RouteDetailsScreen;
