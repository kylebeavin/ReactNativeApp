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

const CreateRouteModal = () => {
  //#region Form Initializers
  const formValues = {
    truck_id: '',
    is_active: true,
    start_location: '',
    driver: '',
    truck_vin: '',
    service_stop: [],
    time: new Date().toString(),
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
    truck_vin: [],
    service_stop: [],
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

  // State
  const [truckVin, setTruckVin] = useState('');

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
        if (isSuccessStatusCode(data.status)) {
          setTrucksList(data.data);
          setTruckVin(data.data[0].vin);
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
    const route: Route = {
      _id: '',
      group_id: grpId,
      truck_id: values.truck_id,
      is_active: values.is_active,
      start_location: values.start_location,
      driver: values.driver,
      truck_vin: truckVin,
      service_stop: values.service_stop,
      time: new Date(values.time),
      notes: values.notes,
    };
    return route;
  };

  async function postNewRoute() {
    const route: Route = await getFormData();
    await fetch(`${Configs.TCMC_URI}/api/routes`, {
      method: 'POST',
      body: JSON.stringify(route),
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

  const changeVin = (itemIndex: number) => {
    //handleChange('truck_vin', trucksList[itemIndex].vin)
  };

  return (
    <View>
      <ScrollView style={styles.form}>
        {/* Start Location */}
        <AppTextInput
          label="Start Location"
          name="start_location"
          value={values.start_location}
          onChange={(val) => handleChange('start_location', val)}
          validations={[isRequired]}
          errors={errors.start_location}
          setErrors={setErrors}
        />

        {/* Truck */}
        <View style={styles.fieldContainer}>
          <Text style={styles.text}>Truck</Text>
          <View style={styles.picker}>
            <Picker
              selectedValue={values.truck_id}
              onValueChange={(itemValue, itemIndex) => {
                handleChange('truck_id', itemValue.toString());
                setTruckVin(trucksList[itemIndex].vin);
                //changeVin(itemIndex)
                //handleChange('truck_vin', trucksList[itemIndex].vin)
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

        {/* Truck VIN */}
        <AppTextInput
          label="Truck VIN"
          name="truck_vin"
          value={truckVin}
          onChange={(val) => setTruckVin(val)}
          validations={[isRequired]}
          errors={errors.truck_vin}
          setErrors={setErrors}
        />

        {/* Driver */}
        <View style={styles.fieldContainer}>
          <Text style={styles.text}>Driver</Text>
          <View style={styles.picker}>
            <Picker
              selectedValue={values.driver}
              onValueChange={(itemValue, itemIndex) =>
                handleChange('driver', itemValue.toString())
              }>
              {ownersList.map((item, index) => {
                return (
                  <Picker.Item
                    key={item._id}
                    label={item.first_name + ' ' + item.last_name}
                    value={item._id}
                  />
                );
              })}
            </Picker>
          </View>
        </View>

        {/* Time */}
        <AppTextInput
          label="Time"
          name="time"
          value={values.time}
          onChange={(val) => handleChange('time', val)}
          validations={[isRequired]}
          errors={errors.time}
          setErrors={setErrors}
        />

        {/* Notes */}
        <AppTextInput
          label="Notes"
          name="notes"
          value={values.notes}
          onChange={(val) => handleChange('notes', val)}
          validations={[isRequired]}
          errors={errors.notes}
          setErrors={setErrors}
        />
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

export default CreateRouteModal;
