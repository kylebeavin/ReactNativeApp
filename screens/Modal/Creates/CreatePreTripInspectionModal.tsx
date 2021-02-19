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
import AppTextInput from '../../../components/Layout/AppTextInput';
import {TruckServiceStatus, VehicleType} from '../../../types/enums';
import {Picker} from '@react-native-picker/picker';
import {SMT_User} from '../../../types';
import CheckBox from '@react-native-community/checkbox';

const CreatePreTripInspectionModal = () => {
  //#region Form Initializers
  const formValues = {
    // Truck Identity
    truck_id: '',
    type: '',

    // Truck Checklist
    odometer_reading: '',
    fuel_level: '',
    seat_belts: false,

    // Smash Unit Checklist
    machine_hours: '',
  };
  const formErrors = {
    truck_id: [],
    type: [],
    odometer_reading: [],
    fuel_level: [],
    machine_hours: [],
    seat_belts: [],
  };
  const formValidations = {
    truck_id: [isRequired],
    type: [isRequired],
    odometer_reading: [isRequired],
    fuel_level: [isRequired],
    machine_hours: [isRequired],
    seat_belts: [],
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
    postNewPreTripInspection,
  );

  // State
  const [type, setType] = useState('');

  // Drop Down
  const [trucksList, setTrucksList] = useState<Truck[]>([]);
  const [ownersList, setOwnersList] = useState<SMT_User[]>([]);
  //#endregion

  useEffect(() => {
    getTrucksDropDown();
    getOwnersDropDown()
      .then((data) => {
        setOwnersList(data);
      })
      .catch((err) => show({message: err.message}));
  }, []);

  const getTrucksDropDown = async () => {
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
          setTrucksList(data.data);
          setType(data.data[0].vin);
          //handleChange("truck_vin", data.data[0].vin);
        } else {
          show({message: data.message});
        }
      })
      .catch((err) => show({message: err.message}));
  };

  const getOwnersDropDown = async (): Promise<SMT_User[]> => {
    let userList: SMT_User[] = [];

    await fetch(`${Configs.TCMC_URI}/api/usersBy`, {
      method: 'POST',
      body: JSON.stringify({group_id: grpId}),
      headers: {'Content-Type': 'application/json', 'x-access-token': token},
    })
      .then((res) => {
        console.log(res.status);
        return res.json();
      })
      .then((json) => (userList = json.data))
      .catch((err) => console.log(err));

    return userList;
  };

  const getFormData = async () => {
    const preTripInspection = {
      _id: '',
    // Truck Identity
    truck_id: '',
    type: '',

    // Truck Checklist
    odometer_reading: '',
    fuel_level: '',
    seat_belts: false,

    // Smash Unit Checklist
    machine_hours: '',
    };
    return preTripInspection;
  };

  async function postNewPreTripInspection() {
    const preTripInspection = await getFormData();
    await fetch(`${Configs.TCMC_URI}/api/pre-tripBy`, {
      method: 'POST',
      body: JSON.stringify(preTripInspection),
      headers: {'Content-Type': 'application/json', 'x-access-token': token},
    })
      .then((res) => {
        console.log(res.status);
        return res.json();
      })
      .then((data) => {
        console.log(data);
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
        {/* Truck */}
        <View style={styles.fieldContainer}>
          <Text style={styles.text}>Truck</Text>
          <View style={styles.picker}>
            <Picker
              selectedValue={values.truck_id}
              onValueChange={(itemValue, itemIndex) => {
                handleChange('truck_id', itemValue.toString());
                setType(trucksList[itemIndex].vehicle_type);
              }}>
              {trucksList.map((item, index) => {
                return (
                  <Picker.Item
                    key={item.vin}
                    label={item.license_number}
                    value={item._id}
                  />
                );
              })}
            </Picker>
          </View>
        </View>

        {/* Type */}
        <AppTextInput
          label="Type"
          name="type"
          value={type}
          onChange={(val) => setType(val)}
          validations={[isRequired]}
          errors={errors.type}
          setErrors={setErrors}
        />

        {/* Odometer */}
        <AppTextInput
          label="Odometer"
          name="odometer_reading"
          value={values.odometer_reading}
          onChange={(val) => handleChange('odometer_reading', val)}
          validations={[isRequired]}
          errors={errors.odometer_reading}
          setErrors={setErrors}
        />

        {/* Fuel Level */}
        <AppTextInput
          label="Fuel Level"
          name="fuel_level"
          value={values.fuel_level}
          onChange={(val) => handleChange('fuel_level', val)}
          validations={[isRequired]}
          errors={errors.fuel_level}
          setErrors={setErrors}
        />

        {/* Machine Hours */}
        <AppTextInput
          label="Machine Hours"
          name="machine_hours"
          value={values.machine_hours}
          onChange={(val) => handleChange('machine_hours', val)}
          validations={[isRequired]}
          errors={errors.machine_hours}
          setErrors={setErrors}
        />

        {/* Seat Belts */}
        <View style={styles.fieldContainer}>
          <Text style={styles.text}>Seat Belts</Text>
          <CheckBox
            disabled={false}
            value={values.seat_belts}
            onValueChange={(newValue) => handleChange('seat_belts', !newValue)}
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
  fieldContainer: {
    marginBottom: 10,
  },
  text: {
    fontWeight: 'bold',
    color: Colors.SMT_Secondary_1,
  },
  picker: {
    paddingLeft: 15,
    //paddingVertical: 5,
    borderColor: Colors.SMT_Secondary_1_Light_1,
    borderWidth: 2,
    borderRadius: 3,
  },
});

export default CreatePreTripInspectionModal;
