import React, {useContext} from 'react';
import {StyleSheet, View, ScrollView} from 'react-native';
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
import AppTextInput from '../../../components/Layout/AppTextInput';
import { TruckServiceStatus, VehicleType } from '../../../types/enums';

const CreateRouteModal = () => {
  //#region Form Initializers
  const formValues = {
    truck_id: '',
    is_active: true,
    start_location: '',
    driver: '',
    truck_vin: '',
    service_stop: [],
    time: new Date(),
    notes: '',
  };
  const formErrors = {
    truck_id: [],
    is_active: [],
    start_location: [],
    driver: [],
    truck_vin: [],
    service_stop: [],
    time: [],
    notes: [],
  };
  const formValidations = {
    truck_id: [],
    is_active: [],
    start_location: [isRequired],
    driver: [isRequired],
    truck_vin: [isRequired],
    service_stop: [isRequired],
    time: [isRequired],
    notes: [],
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
    postNewRoute,
  );
  //#endregion

  const getFormData = async () => {
    const route: Route = {
        _id: '',
        group_id: grpId,
        truck_id: values.truck_id,
        is_active: values.is_active,
        start_location: values.start_location,
        driver: values.driver,
        truck_vin: values.truck_vin,
        service_stop: values.service_stop,
        time: values.time,
        notes: values.notes,
    };
    return route;
  };

  async function postNewRoute() {
    const route: Route = await getFormData();
    await fetch(`${Configs.TCMC_URI}/api/trucks`, {
      method: 'POST',
      body: JSON.stringify(route),
      headers: {'Content-Type': 'application/json', 'x-access-token': token},
    })
      .then((res) => {
        console.log(res.status);
        return res.json();
      })
      .then((data) => {
        if (isSuccessStatusCode(data.status)) {
          show({message: data.message});
          navigation.navigate('RoutesScreen');
        } else {
          show({message: data.message});
        }
      })
      .catch((err) => show({message: err.message}));
  }

  return (
    <View>
      <ScrollView style={styles.form}>

        {/* Body Type */}
        <AppTextInput
          label="Body Type"
          name="body_type"
          value={values.body_type}
          onChange={(val) => handleChange('body_type', val)}
          validations={[isRequired]}
          errors={errors.body_type}
          setErrors={setErrors}
        />

        {/* Body Subtype */}
        <AppTextInput
          label="Body Subtype"
          name="body_subtype"
          value={values.body_subtype}
          onChange={(val) => handleChange('body_subtype', val)}
          validations={[isRequired]}
          errors={errors.body_subtype}
          setErrors={setErrors}
        />

        {/* Color */}
        <AppTextInput
          label="Color"
          name="color"
          value={values.color}
          onChange={(val) => handleChange('color', val)}
          validations={[isRequired]}
          errors={errors.color}
          setErrors={setErrors}
        />

        {/* Hours */}
        <AppTextInput
          label="Hours"
          name="hours"
          value={values.hours}
          onChange={(val) => handleChange('hours', val)}
          validations={[isRequired]}
          errors={errors.hours}
          setErrors={setErrors}
        />

        {/* License Plate */}
        <AppTextInput
          label="License Plate"
          name="license_number"
          value={values.license_number}
          onChange={(val) => handleChange('license_number', val)}
          validations={[isRequired]}
          errors={errors.license_number}
          setErrors={setErrors}
        />

        {/* MSRP */}
        <AppTextInput
          label="MSRP"
          name="msrp"
          value={values.msrp}
          onChange={(val) => handleChange('msrp', val)}
          validations={[isRequired]}
          errors={errors.msrp}
          setErrors={setErrors}
        />

        {/* Display Name */}
        <AppTextInput
          label="Display Name"
          name="name"
          value={values.name}
          onChange={(val) => handleChange('name', val)}
          validations={[isRequired]}
          errors={errors.name}
          setErrors={setErrors}
        />

        {/* Odometer */}
        <AppTextInput
          label="Odometer"
          name="odo"
          value={values.odo}
          onChange={(val) => handleChange('odo', val)}
          validations={[isRequired]}
          errors={errors.odo}
          setErrors={setErrors}
        />

        {/* Ownership */}
        <AppTextInput
          label="Ownership"
          name="ownership"
          value={values.ownership}
          onChange={(val) => handleChange('ownership', val)}
          validations={[isRequired]}
          errors={errors.ownership}
          setErrors={setErrors}
        />

        {/* Trim */}
        <AppTextInput
          label="Trim"
          name="trim"
          value={values.trim}
          onChange={(val) => handleChange('trim', val)}
          validations={[isRequired]}
          errors={errors.trim}
          setErrors={setErrors}
        />

        {/* Registration */}
        <AppTextInput
          label="Registration"
          name="registration"
          value={values.registration}
          onChange={(val) => handleChange('registration', val)}
          validations={[isRequired]}
          errors={errors.registration}
          setErrors={setErrors}
        />

        {/* Make */}
        <AppTextInput
          label="Make"
          name="vehicle_make"
          value={values.vehicle_make}
          onChange={(val) => handleChange('vehicle_make', val)}
          validations={[isRequired]}
          errors={errors.vehicle_make}
          setErrors={setErrors}
        />

        {/* Model */}
        <AppTextInput
          label="Model"
          name="vehicle_model"
          value={values.vehicle_model}
          onChange={(val) => handleChange('vehicle_model', val)}
          validations={[isRequired]}
          errors={errors.vehicle_model}
          setErrors={setErrors}
        />

        {/* VIN */}
        <AppTextInput
          label="VIN"
          name="vin"
          value={values.vin}
          onChange={(val) => handleChange('vin', val)}
          validations={[isRequired]}
          errors={errors.vin}
          setErrors={setErrors}
        />

        {/* Year */}
        <View style={{marginBottom: 40}}>
          <AppTextInput
            label="Year"
            name="year"
            value={values.year}
            onChange={(val) => handleChange('year', val)}
            validations={[isRequired]}
            errors={errors.year}
            setErrors={setErrors}
          />
        </View>

      </ScrollView>

      <ModalButtons navigation={navigation} save={handleSubmit} />

    </View>
  );
};

const styles = StyleSheet.create({
  form: {
    maxHeight: Layout.window.height / 1.5,
    marginBottom: 20,
    padding: 20,
    borderRadius: 4,
    backgroundColor: Colors.SMT_Tertiary_1,
  },
});

export default CreateRouteModal;
