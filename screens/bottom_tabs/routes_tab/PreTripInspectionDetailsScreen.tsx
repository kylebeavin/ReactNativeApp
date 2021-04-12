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
import {PreTripInspection} from '../../../types/routes';

interface Props {
  route: any;
}

const PreTripInspectionDetailsScreen: React.FC<Props> = ({route}) => {
  const model: PreTripInspection = route.params.model;

  //#region Use State Variables
  const navigation = useNavigation();

  // Toggles
  const [inspectionsToggle, setInspectionsToggle] = useState(false);
  const [stopsToggle, setStopsToggle] = useState(false);
  //#endregion

  return (
    <View>
      <AppTitle title='Pre Trip Inspection Detail' />

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

        <View style={{paddingLeft: 10, paddingBottom: 50}}>
          <Text>Type: {model.type}</Text>
          <Text>Odometer Reading: {model.odometer_reading}</Text>
          <Text>Fuel Level: {model.fuel_level}</Text>
          <Text>Machine Hours: {model.machine_hours}</Text>
          <Text>Driver Signature: {model.drivers_signature}</Text>

          <Text>Seat Belts: {model.seat_belts.toString()}</Text>
          <Text>PTO Switch: {model.pto_switch.toString()}</Text>
          <Text>Engine Fluids: {model.engine_fluids.toString()}</Text>
          <Text>Transmission: {model.transmission.toString()}</Text>
          <Text>Steering Mechanism: {model.steering_mechanism.toString()}</Text>
          <Text>Horn: {model.horn.toString()}</Text>
          <Text>Windshied Wipers: {model.windshield_wipers.toString()}</Text>
          <Text>Mirrors: {model.mirrors.toString()}</Text>
          <Text>Truck Lights: {model.truck_lights.toString()}</Text>
          <Text>Parking Brake: {model.parking_brake.toString()}</Text>
          <Text>Service Brake: {model.service_brake.toString()}</Text>
          <Text>Tires: {model.tires.toString()}</Text>
          <Text>Rims: {model.rims.toString()}</Text>
          <Text>Emergency Equipment: {model.emergency_equipment.toString()}</Text>
          <Text>Tools Gear: {model.tools_gear.toString()}</Text>
          <Text>Chocks Chains: {model.chocks_chains}</Text>
          <Text>Drum Cap: {model.drum_cap.toString()}</Text>
          <Text>Grease Distribution: {model.grease_distribution.toString()}</Text>
          <Text>Chain Tension: {model.chain_tension.toString()}</Text>
          <Text>Machine Lights: {model.machine_lights.toString()}</Text>
          <Text>Vehicle Condition: {model.vehicle_condition.toString()}</Text>
          <Text>Engine Warning: {model.engine_warning.toString()}</Text>
        </View>
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

export default PreTripInspectionDetailsScreen;
