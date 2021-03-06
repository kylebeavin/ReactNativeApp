import React, {useContext, useEffect, useState} from 'react';
import {StyleSheet, View, ScrollView, Text} from 'react-native';
import {useNavigation} from '@react-navigation/native';

import Colors from '../../../constants/Colors';
import Layout from '../../../constants/Layout';
import ModalButtons from '../ModalButtons';
import useForm from '../../../hooks/useForm';
import {Route, Truck} from '../../../types/routes';
import {isRequired} from '../../../utils/Validators';
import AppContext from '../../../providers/AppContext';
import {ToastContext} from '../../../providers/ToastProvider';
import Configs from '../../../constants/Configs';
import {isSuccessStatusCode} from '../../../utils/Helpers';
import AppTextInput from '../../../components/layout/AppTextInput';
import {Picker} from '@react-native-picker/picker';
import {SMT_User} from '../../../types';
import AppCheckBox from '../../../components/layout/AppCheckBox';
import {FuelPercentage, RouteStages} from '../../../types/enums';
import AppTitle from '../../../components/layout/AppTitle';
import AppPicker from '../../../components/layout/AppPicker';

interface Props {
  route: Route;
  onComplete: () => void;
}

const CreatePostTripInspectionModal: React.FC<Props> = ({route, onComplete}) => {
  //#region Form Initializers
  const formValues = {
    // Identify truck
    group_id: '',
    owner_id: '',
    is_active: true,
    type: '',
    truck_id: '',
    route_id: route._id,

    // Truck Checklist
    odometer_reading: '',
    fuel_level: FuelPercentage.hundred,
    seat_belts: false,
    pto_switch: false,
    engine_fluids: false,
    transmission: false,
    steering_mechanism: false,
    horn: false,
    windshield_wipers: false,
    mirrors: false,
    truck_lights: false,
    parking_brake: false,
    service_brake: false,
    tires: false,
    rims: false,
    emergency_equipment: false,
    tools_gear: false,
    chocks_chains: false,

    // Smash Unit Checklist
    drum_cap: false,
    grease_distribution: false,
    chain_tension: false,
    machine_lights: false,
    machine_hours: '',

    // Sign-Off Checklist
    vehicle_condition: false,
    required_documents: [],
    engine_warning: false,
    drivers_signature: '', // will point to url of driver signature image.
  };
  const formErrors = {
    // Identify truck
    group_id: [],
    owner_id: [],
    is_active: [],
    type: [],
    truck_id: [],
    route_id: [],

    // Truck Checklist
    odometer_reading: [],
    fuel_level: [],
    seat_belts: [],
    pto_switch: [],
    engine_fluids: [],
    transmission: [],
    steering_mechanism: [],
    horn: [],
    windshield_wipers: [],
    mirrors: [],
    truck_lights: [],
    parking_brake: [],
    service_brake: [],
    tires: [],
    rims: [],
    emergency_equipment: [],
    tools_gear: [],
    chocks_chains: [],

    // Smash Unit Checklist
    drum_cap: [],
    grease_distribution: [],
    chain_tension: [],
    machine_lights: [],
    machine_hours: [],

    // Sign-Off Checklist
    vehicle_condition: [],
    required_documents: [],
    engine_warning: [],
    drivers_signature: [], // will point to url of driver signature image.
  };
  const formValidations = {
    // Identify truck
    group_id: [],
    owner_id: [],
    is_active: [],
    type: [],
    truck_id: [],
    route_id: [],

    // Truck Checklist
    odometer_reading: [isRequired],
    fuel_level: [isRequired],
    seat_belts: [],
    pto_switch: [],
    engine_fluids: [],
    transmission: [],
    steering_mechanism: [],
    horn: [],
    windshield_wipers: [],
    mirrors: [],
    truck_lights: [],
    parking_brake: [],
    service_brake: [],
    tires: [],
    rims: [],
    emergency_equipment: [],
    tools_gear: [],
    chocks_chains: [],

    // Smash Unit Checklist
    drum_cap: [],
    grease_distribution: [],
    chain_tension: [],
    machine_lights: [],
    machine_hours: [isRequired],

    // Sign-Off Checklist
    vehicle_condition: [],
    required_documents: [],
    engine_warning: [],
    drivers_signature: [isRequired], // will point to url of driver signature image.
  };
  //#endregion

  //#region Use State Variables
  const navigation = useNavigation();
  const {id, grpId, token} = useContext(AppContext);
  const {show} = useContext(ToastContext);
  const {handleChange, handleSubmit, values, errors, setErrors} = useForm(
    formValues,
    formErrors,
    formValidations,
    postNewPostTripInspection,
  );

  // State
  const [truck, setTruck] = useState<Truck>();
  //#endregion

  useEffect(() => {
    getTruck();
  }, []);

  const getTruck = async () => {
    await fetch(`${Configs.TCMC_URI}/api/truckBy`, {
      method: 'POST',
      headers: {'Content-Type': 'application/json', 'x-access-token': token},
      body: JSON.stringify({group_id: grpId, _id: route.truck_id})
    })
    .then(res => res.json())
    .then(json => {
      if (isSuccessStatusCode(json.status)) {
        setTruck(json.data[0]);
      } else {
        show({message: json.message})
      }
    })
    .catch(err => show({message: err.message}));
  };

  const getFormData = async () => {
    const postTripInspection = {
      // Identify truck
      group_id: grpId,
      owner_id: id,
      //is_active: values.is_active,
      type: truck?.vehicle_type.toString(),
      truck_id: truck?._id,
      route_id: route._id,

      // Truck Checklist
      odometer_reading: values.odometer_reading,
      fuel_level: values.fuel_level,
      seat_belts: values.seat_belts,
      pto_switch: values.pto_switch,
      engine_fluids: values.engine_fluids,
      transmission: values.transmission,
      steering_mechanism: values.steering_mechanism,
      horn: values.horn,
      windshield_wipers: values.windshield_wipers,
      mirrors: values.mirrors,
      truck_lights: values.truck_lights,
      parking_brake: values.parking_brake,
      service_brake: values.service_brake,
      tires: values.tires,
      rims: values.rims,
      emergency_equipment: values.emergency_equipment,
      tools_gear: values.tools_gear,
      chocks_chains: values.chocks_chains,

      // Smash Unit Checklist
      drum_cap: values.drum_cap,
      grease_distribution: values.grease_distribution,
      chain_tension: values.chain_tension,
      machine_lights: values.machine_lights,
      machine_hours: values.machine_hours,

      // Sign-Off Checklist
      vehicle_condition: values.vehicle_condition,
      required_documents: values.required_documents,
      engine_warning: values.engine_warning,
      drivers_signature: values.drivers_signature,
    };
    return postTripInspection;
  };

  async function postNewPostTripInspection() {
    const postTripInspection = await getFormData();
    await fetch(`${Configs.TCMC_URI}/api/post-trip`, {
      method: 'POST',
      body: JSON.stringify(postTripInspection),
      headers: {'Content-Type': 'application/json', 'x-access-token': token},
    })
      .then((res) => res.json())
      .then(async (data) => {
        if (isSuccessStatusCode(data.status)) {
          onComplete();
          show({message: data.message});
          // navigation.navigate('DashboardScreen');
          navigation.pop();
        } else {
          show({message: data.message});
        }
      })
      .catch((err) => show({message: err.message}));
  }

  return (
    <View>
      <View style={styles.form}>
        <AppTitle title="Post-trip Inspection" />
        <ScrollView style={styles.container}>
          <View style={styles.formGroup}>
            {/* Truck */}
            <View style={{flex: 1, marginRight: 15}}>
              <AppTextInput
                label="Truck"
                name="truck"
                value={truck?.name ? truck.name : 'No Truck'}
                onChange={(val) => null}
                validations={[]}
                errors={errors.truck_id}
                setErrors={setErrors}
                disabled
              />
            </View>

            {/* Type */}
            <AppTextInput
              label="Type"
              name="type"
              value={
                truck?.vehicle_type ? truck.vehicle_type.toString() : 'No Type'
              }
              onChange={(val) => null}
              validations={[]}
              errors={errors.type}
              setErrors={setErrors}
              disabled
            />
          </View>

          <View style={styles.formGroup}>
            <View style={{flex: 1, marginRight: 15}}>
              {/* Odometer */}
              <AppTextInput
                label="Odometer"
                name="odometer_reading"
                value={values.odometer_reading}
                onChange={(val) => handleChange('odometer_reading', val)}
                validations={[isRequired]}
                errors={errors.odometer_reading}
                setErrors={setErrors}
                keyboardType="number-pad"
              />
            </View>
            <View style={{flex: 1}}>
              {/* Fuel Level */}
              <AppPicker
                label='Fuel Level'
                name='fuel_level'
                value={values.fuel_level}
                list={Object.values(FuelPercentage).map(u => {return {_id: u, label: u, value: u}})}
                onChange={(itemValue) => handleChange('fuel_level', itemValue.toString())}
                validations={[]}
                errors={errors.route_id}
                setErrors={setErrors}
              />
            </View>
          </View>

          <View style={styles.formGroup}>
            <View style={{flex: 1, marginRight: 15}}>
              {/* Machine Hours */}
              <AppTextInput
                label="Machine Hours"
                name="machine_hours"
                value={values.machine_hours}
                onChange={(val) => handleChange('machine_hours', val)}
                validations={[isRequired]}
                errors={errors.machine_hours}
                setErrors={setErrors}
                keyboardType="number-pad"
              />
            </View>
            <View style={{flex: 1}}>
              {/* Route */}
              <View style={styles.fieldContainer}>
                <AppTextInput
                  label="Route"
                  name="route_id"
                  value={route.route_id}
                  onChange={(val) => null}
                  validations={[]}
                  errors={errors.route_id}
                  setErrors={setErrors}
                  disabled
                />
              </View>
            </View>
          </View>

          {/* Checkboxes */}
          <View style={styles.formGroup}>
            <View style={{flex: 1}}>
              {/* seat_belts */}
              <AppCheckBox
                containerStyle={{marginRight: 15}}
                label="seat_belts"
                name="seat_belts"
                value={values.seat_belts}
                onChange={(name, val) => handleChange(name, val)}
                validations={[isRequired]}
                errors={errors.seat_belts}
                setErrors={setErrors}
              />

              {/* pto_switch */}
              <AppCheckBox
                containerStyle={{marginRight: 15}}
                label="pto_switch"
                name="pto_switch"
                value={values.pto_switch}
                onChange={(name, val) => handleChange(name, val)}
                validations={[isRequired]}
                errors={errors.pto_switch}
                setErrors={setErrors}
              />

              {/* engine_fluids */}
              <AppCheckBox
                label="engine_fluids"
                name="engine_fluids"
                value={values.engine_fluids}
                onChange={(name, val) => handleChange(name, val)}
                validations={[isRequired]}
                errors={errors.engine_fluids}
                setErrors={setErrors}
              />

              {/* transmission */}
              <AppCheckBox
                containerStyle={{marginRight: 15}}
                label="transmission"
                name="transmission"
                value={values.transmission}
                onChange={(name, val) => handleChange(name, val)}
                validations={[isRequired]}
                errors={errors.transmission}
                setErrors={setErrors}
              />

              {/* steering_mechanism */}
              <AppCheckBox
                containerStyle={{marginRight: 15}}
                label="steering_mechanism"
                name="steering_mechanism"
                value={values.steering_mechanism}
                onChange={(name, val) => handleChange(name, val)}
                validations={[isRequired]}
                errors={errors.steering_mechanism}
                setErrors={setErrors}
              />

              {/* horn */}
              <AppCheckBox
                containerStyle={{marginRight: 15}}
                label="horn"
                name="horn"
                value={values.horn}
                onChange={(name, val) => handleChange(name, val)}
                validations={[isRequired]}
                errors={errors.horn}
                setErrors={setErrors}
              />

              {/* windshield_wipers */}
              <AppCheckBox
                containerStyle={{marginRight: 15}}
                label="windshield_wipers"
                name="windshield_wipers"
                value={values.windshield_wipers}
                onChange={(name, val) => handleChange(name, val)}
                validations={[isRequired]}
                errors={errors.windshield_wipers}
                setErrors={setErrors}
              />

              {/* mirrors */}
              <AppCheckBox
                label="mirrors"
                name="mirrors"
                value={values.mirrors}
                onChange={(name, val) => handleChange(name, val)}
                validations={[isRequired]}
                errors={errors.mirrors}
                setErrors={setErrors}
              />

              {/* truck_lights */}
              <AppCheckBox
                containerStyle={{marginRight: 15}}
                label="truck_lights"
                name="truck_lights"
                value={values.truck_lights}
                onChange={(name, val) => handleChange(name, val)}
                validations={[isRequired]}
                errors={errors.truck_lights}
                setErrors={setErrors}
              />

              {/* parking_brake */}
              <AppCheckBox
                containerStyle={{marginRight: 15}}
                label="parking_brake"
                name="parking_brake"
                value={values.parking_brake}
                onChange={(name, val) => handleChange(name, val)}
                validations={[isRequired]}
                errors={errors.parking_brake}
                setErrors={setErrors}
              />

              {/* service_brake */}
              <AppCheckBox
                containerStyle={{marginRight: 15}}
                label="service_brake"
                name="service_brake"
                value={values.service_brake}
                onChange={(name, val) => handleChange(name, val)}
                validations={[isRequired]}
                errors={errors.service_brake}
                setErrors={setErrors}
              />
            </View>

            <View style={{flex: 1}}>
              {/* tires */}
              <AppCheckBox
                label="tires"
                name="tires"
                value={values.tires}
                onChange={(name, val) => handleChange(name, val)}
                validations={[isRequired]}
                errors={errors.tires}
                setErrors={setErrors}
              />

              {/* rims */}
              <AppCheckBox
                label="rims"
                name="rims"
                value={values.rims}
                onChange={(name, val) => handleChange(name, val)}
                validations={[isRequired]}
                errors={errors.rims}
                setErrors={setErrors}
              />

              {/* emergency_equipment */}
              <AppCheckBox
                label="emergency_equipment"
                name="emergency_equipment"
                value={values.emergency_equipment}
                onChange={(name, val) => handleChange(name, val)}
                validations={[isRequired]}
                errors={errors.emergency_equipment}
                setErrors={setErrors}
              />

              {/* tools_gear */}
              <AppCheckBox
                label="tools_gear"
                name="tools_gear"
                value={values.tools_gear}
                onChange={(name, val) => handleChange(name, val)}
                validations={[isRequired]}
                errors={errors.tools_gear}
                setErrors={setErrors}
              />

              {/* chocks_chains */}
              <AppCheckBox
                label="chocks_chains"
                name="chocks_chains"
                value={values.chocks_chains}
                onChange={(name, val) => handleChange(name, val)}
                validations={[isRequired]}
                errors={errors.chocks_chains}
                setErrors={setErrors}
              />

              {/* drum_cap */}
              <AppCheckBox
                label="drum_cap"
                name="drum_cap"
                value={values.drum_cap}
                onChange={(name, val) => handleChange(name, val)}
                validations={[isRequired]}
                errors={errors.drum_cap}
                setErrors={setErrors}
              />

              {/* grease_distribution */}
              <AppCheckBox
                label="grease_distribution"
                name="grease_distribution"
                value={values.grease_distribution}
                onChange={(name, val) => handleChange(name, val)}
                validations={[isRequired]}
                errors={errors.grease_distribution}
                setErrors={setErrors}
              />

              {/* chain_tension */}
              <AppCheckBox
                label="chain_tension"
                name="chain_tension"
                value={values.chain_tension}
                onChange={(name, val) => handleChange(name, val)}
                validations={[isRequired]}
                errors={errors.chain_tension}
                setErrors={setErrors}
              />

              {/* machine_lights */}
              <AppCheckBox
                label="machine_lights"
                name="machine_lights"
                value={values.machine_lights}
                onChange={(name, val) => handleChange(name, val)}
                validations={[isRequired]}
                errors={errors.machine_lights}
                setErrors={setErrors}
              />

              {/* vehicle_condition */}
              <AppCheckBox
                label="vehicle_condition"
                name="vehicle_condition"
                value={values.vehicle_condition}
                onChange={(name, val) => handleChange(name, val)}
                validations={[isRequired]}
                errors={errors.vehicle_condition}
                setErrors={setErrors}
              />

              {/* engine_warning */}
              <AppCheckBox
                label="engine_warning"
                name="engine_warning"
                value={values.engine_warning}
                onChange={(name, val) => handleChange(name, val)}
                validations={[isRequired]}
                errors={errors.engine_warning}
                setErrors={setErrors}
              />
            </View>
          </View>

          {/* Drivers Signature */}
          <AppTextInput
            containerStyle={{marginBottom: 40}}
            label="Drivers Signature"
            name="drivers_signature"
            value={values.drivers_signature}
            onChange={(val) => handleChange('drivers_signature', val)}
            validations={[isRequired]}
            errors={errors.drivers_signature}
            setErrors={setErrors}
          />
        </ScrollView>
      </View>

      <ModalButtons navigation={navigation} save={handleSubmit} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
  },
  form: {
    maxHeight: Layout.window.height / 1.5,
    marginBottom: 20,
    borderRadius: 4,
    backgroundColor: Colors.SMT_Tertiary_1,
  },
  fieldContainer: {
    flex: 1,
  },
  text: {
    fontWeight: 'bold',
    color: Colors.SMT_Secondary_1,
  },
  picker: {
    paddingLeft: 15,
    borderColor: Colors.SMT_Secondary_1_Light_1,
    borderWidth: 2,
    borderRadius: 3,
  },
  formGroup: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
});

export default CreatePostTripInspectionModal;
