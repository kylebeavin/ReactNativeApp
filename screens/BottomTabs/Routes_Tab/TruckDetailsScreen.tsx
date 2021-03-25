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
import AppEditBtn from '../../../components/Layout/AppEditBtn';
import AppNavBtnGrp from '../../../components/Layout/AppNavBtnGrp';
import AppTitle from '../../../components/Layout/AppTitle';
import {Truck} from '../../../types/routes';

interface Props {
  route: any;
}

const RouteDetailsScreen: React.FC<Props> = ({route}) => {
  const model: Truck = route.params.model;

  //#region Use State Variables
  const navigation = useNavigation();

  // Toggles
  const [inspectionsToggle, setInspectionsToggle] = useState(false);
  //#endregion

  return (
    <View>
      <AppTitle title='Truck Detail' />

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
            <AppEditBtn item={model} modal='UpdateTruckModal' />
          </View>
        </AppNavBtnGrp>

        <View style={{paddingLeft: 10}}>
          <Text>_id: {model._id}</Text>
          <Text>body_subtype: {model.body_subtype}</Text>
          <Text>body_type: {model.body_type}</Text>
          <Text>color: {model.color}</Text>
          <Text>documents: {model.documents}</Text>
          <Text>group_id: {model.group_id}</Text>
          <Text>hours: {model.hours}</Text>
          <Text>is_active: {model.is_active}</Text>
          <Text>license_number: {model.license_number}</Text>
          <Text>msrp: {model.msrp}</Text>
          <Text>name: {model.name}</Text>
          <Text>odo: {model.odo}</Text>
          <Text>operator: {model.operator}</Text>
          <Text>ownership: {model.ownership}</Text>
          <Text>pictures: {model.pictures}</Text>
          <Text>service_history: {model.service_history}</Text>
          <Text>service_status: {model.service_status}</Text>
          <Text>trim: {model.trim}</Text>
          <Text>registration: {model.registration}</Text>
          <Text>vehicle_make: {model.vehicle_make}</Text>
          <Text>vehicle_model: {model.vehicle_model}</Text>
          <Text>vehicle_type: {model.vehicle_type}</Text>
          <Text>vin: {model.vin}</Text>
          <Text>year: {model.year}</Text>
        </View>

        <TouchableOpacity
          style={{marginBottom: 5}}
          onPress={() => setInspectionsToggle(!inspectionsToggle)}>
          <AppTitle title='Inspections' />
        </TouchableOpacity>
        {!inspectionsToggle ? null : (
          <View style={{paddingLeft: 10, marginBottom: 50}}>
            <Text>Hello World!</Text>
          </View>
        )}
        <View style={{marginBottom: 50}}></View>
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
