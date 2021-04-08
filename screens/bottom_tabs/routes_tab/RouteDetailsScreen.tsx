import {useNavigation} from '@react-navigation/native';
import React, {useState} from 'react';
import {
  StyleSheet,
  View,
  ScrollView,
  TouchableOpacity,
  Text,
} from 'react-native';
import AppButton from '../../../components/layout/AppButton';
import AppEditBtn from '../../../components/layout/AppEditBtn';
import AppNavBtnGrp from '../../../components/layout/AppNavBtnGrp';
import AppTitle from '../../../components/layout/AppTitle';
import {Route} from '../../../types/routes';

interface Props {
  route: any;
}

const RouteDetailsScreen: React.FC<Props> = ({route}) => {
  const model: Route = route.params.model;

  //#region Use State Variables
  const navigation = useNavigation();

  // Toggles
  const [inspectionsToggle, setInspectionsToggle] = useState(false);
  const [stopsToggle, setStopsToggle] = useState(false);
  //#endregion

  return (
    <View>
      <AppTitle title='Route Detail' />

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
          <View style={{paddingTop: 5}}>
            <AppEditBtn item={model} modal='UpdateRouteModal' />
          </View>
        </AppNavBtnGrp>

        <View style={{paddingLeft: 10}}>
          <Text>_id: {model._id}</Text>
          <Text>driver: {model.driver_id}</Text>
          <Text>group_id: {model.group_id}</Text>
          <Text>is_active: {model.is_active}</Text>
          <Text>route_stage: {model.route_stage}</Text>
          <Text>notes: {model.notes}</Text>
          <Text>service_stop: {model.service_stop}</Text>
          <Text>start_location: {model.start_location}</Text>
          <Text>time: {model.time}</Text>
          <Text>truck_id: {model.truck_id}</Text>
          <Text>truck_vin: {model.truck_vin}</Text>
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
