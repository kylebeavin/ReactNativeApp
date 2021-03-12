import React, {useContext} from 'react';
import {StyleSheet, View, ScrollView} from 'react-native';
import {useNavigation} from '@react-navigation/native';

import Colors from '../../../constants/Colors';
import Layout from '../../../constants/Layout';
import ModalButtons from '../ModalButtons';
import useForm from '../../../hooks/useForm';
import {Truck} from '../../../types/routes';
import {isRequired} from '../../../utils/Validators';
import AppContext from '../../../providers/AppContext';
import {ToastContext} from '../../../providers/ToastProvider';
import Configs from '../../../constants/Configs';
import {isSuccessStatusCode} from '../../../utils/Helpers';
import AppTextInput from '../../../components/Layout/AppTextInput';
import {TruckServiceStatus, VehicleType} from '../../../types/enums';

const CreateTruckModal = () => {
  //#region Form Initializers
  const formValues = {
    body_subtype: '',
    body_type: '',
    color: '',
    documents: [],
    group_id: [],
    hours: '',
    is_active: true,
    license_number: '',
    msrp: '',
    name: '',
    odo: '',
    operator: '',
    ownership: '',
    pictures: [],
    service_history: [],
    service_status: TruckServiceStatus.good,
    trim: '',
    registration: '',
    vehicle_make: '',
    vehicle_model: '',
    vehicle_type: VehicleType.smashTruck,
    vin: '',
    year: '',
  };
  const formErrors = {
    body_subtype: [],
    body_type: [],
    color: [],
    documents: [],
    group_id: [],
    hours: [],
    is_active: [],
    license_number: [],
    msrp: [],
    name: [],
    odo: [],
    operator: [],
    ownership: [],
    pictures: [],
    service_history: [],
    service_status: [],
    trim: [],
    registration: [],
    vehicle_make: [],
    vehicle_model: [],
    vehicle_type: [],
    vin: [],
    year: [],
  };
  const formValidations = {
    body_subtype: [isRequired],
    body_type: [isRequired],
    color: [isRequired],
    documents: [],
    group_id: [],
    hours: [isRequired],
    is_active: [],
    license_number: [isRequired],
    msrp: [isRequired],
    name: [isRequired],
    odo: [isRequired],
    operator: [],
    ownership: [isRequired],
    pictures: [],
    service_history: [],
    service_status: [],
    trim: [isRequired],
    registration: [isRequired],
    vehicle_make: [isRequired],
    vehicle_model: [isRequired],
    vehicle_type: [],
    vin: [isRequired],
    year: [isRequired],
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
    postNewTruck,
  );
  //#endregion

  const getFormData = async () => {
    const truck: Truck = {
      _id: '',
      body_subtype: values.body_subtype,
      body_type: values.body_type,
      color: values.color,
      documents: values.documents,
      group_id: grpId,
      hours: values.hours,
      is_active: values.is_active,
      license_number: values.license_number,
      msrp: values.msrp,
      name: values.name,
      odo: values.odo,
      operator: id,
      ownership: values.ownership,
      pictures: values.pictures,
      service_history: values.service_history,
      service_status: values.service_status,
      trim: values.trim,
      registration: values.registration,
      vehicle_make: values.vehicle_make,
      vehicle_model: values.vehicle_model,
      vehicle_type: values.vehicle_type,
      vin: values.vin,
      year: values.year,
    };
    return truck;
  };

  async function postNewTruck() {
    const truck: Truck = await getFormData();
    await fetch(`${Configs.TCMC_URI}/api/trucks`, {
      method: 'POST',
      body: JSON.stringify(truck),
      headers: {'Content-Type': 'application/json', 'x-access-token': token},
    })
      .then((res) => res.json())
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
          label='Body Type'
          name='body_type'
          value={values.body_type}
          onChange={(val) => handleChange('body_type', val)}
          validations={[isRequired]}
          errors={errors.body_type}
          setErrors={setErrors}
        />

        {/* Body Subtype */}
        <AppTextInput
          label='Body Subtype'
          name='body_subtype'
          value={values.body_subtype}
          onChange={(val) => handleChange('body_subtype', val)}
          validations={[isRequired]}
          errors={errors.body_subtype}
          setErrors={setErrors}
        />

        {/* Color */}
        <AppTextInput
          label='Color'
          name='color'
          value={values.color}
          onChange={(val) => handleChange('color', val)}
          validations={[isRequired]}
          errors={errors.color}
          setErrors={setErrors}
        />

        {/* Hours */}
        <AppTextInput
          label='Hours'
          name='hours'
          value={values.hours}
          onChange={(val) => handleChange('hours', val)}
          validations={[isRequired]}
          errors={errors.hours}
          setErrors={setErrors}
        />

        {/* License Plate */}
        <AppTextInput
          label='License Plate'
          name='license_number'
          value={values.license_number}
          onChange={(val) => handleChange('license_number', val)}
          validations={[isRequired]}
          errors={errors.license_number}
          setErrors={setErrors}
        />

        {/* MSRP */}
        <AppTextInput
          label='MSRP'
          name='msrp'
          value={values.msrp}
          onChange={(val) => handleChange('msrp', val)}
          validations={[isRequired]}
          errors={errors.msrp}
          setErrors={setErrors}
        />

        {/* Display Name */}
        <AppTextInput
          label='Display Name'
          name='name'
          value={values.name}
          onChange={(val) => handleChange('name', val)}
          validations={[isRequired]}
          errors={errors.name}
          setErrors={setErrors}
        />

        {/* Odometer */}
        <AppTextInput
          label='Odometer'
          name='odo'
          value={values.odo}
          onChange={(val) => handleChange('odo', val)}
          validations={[isRequired]}
          errors={errors.odo}
          setErrors={setErrors}
        />

        {/* Ownership */}
        <AppTextInput
          label='Ownership'
          name='ownership'
          value={values.ownership}
          onChange={(val) => handleChange('ownership', val)}
          validations={[isRequired]}
          errors={errors.ownership}
          setErrors={setErrors}
        />

        {/* Trim */}
        <AppTextInput
          label='Trim'
          name='trim'
          value={values.trim}
          onChange={(val) => handleChange('trim', val)}
          validations={[isRequired]}
          errors={errors.trim}
          setErrors={setErrors}
        />

        {/* Registration */}
        <AppTextInput
          label='Registration'
          name='registration'
          value={values.registration}
          onChange={(val) => handleChange('registration', val)}
          validations={[isRequired]}
          errors={errors.registration}
          setErrors={setErrors}
        />

        {/* Make */}
        <AppTextInput
          label='Make'
          name='vehicle_make'
          value={values.vehicle_make}
          onChange={(val) => handleChange('vehicle_make', val)}
          validations={[isRequired]}
          errors={errors.vehicle_make}
          setErrors={setErrors}
        />

        {/* Model */}
        <AppTextInput
          label='Model'
          name='vehicle_model'
          value={values.vehicle_model}
          onChange={(val) => handleChange('vehicle_model', val)}
          validations={[isRequired]}
          errors={errors.vehicle_model}
          setErrors={setErrors}
        />

        {/* VIN */}
        <AppTextInput
          label='VIN'
          name='vin'
          value={values.vin}
          onChange={(val) => handleChange('vin', val)}
          validations={[isRequired]}
          errors={errors.vin}
          setErrors={setErrors}
        />

        {/* Year */}
        <View style={{marginBottom: 40}}>
          <AppTextInput
            label='Year'
            name='year'
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

export default CreateTruckModal;
