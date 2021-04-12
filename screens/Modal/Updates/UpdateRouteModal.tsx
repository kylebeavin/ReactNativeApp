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

interface Props {
  route: Route;
}

const UpdateRouteModal: React.FC<Props> = ({route}) => {
  //#region Form Initializers
  const formValues = {
    truck_id: '',
    is_active: true,
    start_location: '',
    driver: '',
    service_stop: [],
    notes: '',
  };
  const formErrors = {
    truck_id: [],
    is_active: [],
    start_location: [],
    driver: [],
    service_stop: [],
    notes: [],
  };
  const formValidations = {
    truck_id: [],
    is_active: [],
    start_location: [isRequired],
    driver: [isRequired],
    service_stop: [],
    notes: [],
  };
  //#endregion

  //#region Use State Variables
  const navigation = useNavigation();
  const {grpId, token} = useContext(AppContext);
  const {show} = useContext(ToastContext);
  const {handleChange, handleSubmit, values, errors, setErrors} = useForm(
    formValues,
    formErrors,
    formValidations,
    updateNewRoute,
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
      .then((res) => res.json())
      .then((data) => {
        if (isSuccessStatusCode(data.status)) {
          setTrucksList(data.data);
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
      .then((res) => res.json())
      .then((json) => (userList = json.data))
      .catch((err) => null);

    return userList;
  };

  const getFormData = async () => {
    const updatedRoute: Route = {
      _id: '',
      route_id: route.route_id,
      group_id: grpId,
      truck_id: values.truck_id,
      inspection_id: route.inspection_id,
      is_active: values.is_active,
      route_stage: 'unassigned',
      start_location: values.start_location,
      driver_id: values.driver,
      service_stop: values.service_stop,
      notes: values.notes,
    };
    return updatedRoute;
  };

  async function updateNewRoute() {
    const route: Route = await getFormData();
    await fetch(`${Configs.TCMC_URI}/api/routes`, {
      method: 'PUT',
      body: JSON.stringify(route),
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
        {/* Start Location */}
        <AppTextInput
          label='Start Location'
          name='start_location'
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
              onValueChange={(itemValue, itemIndex) => handleChange('truck_id', itemValue.toString())}>
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

        {/* Driver */}
        <View style={styles.fieldContainer}>
          <Text style={styles.text}>Driver</Text>
          <View style={styles.picker}>
            <Picker
              selectedValue={values.driver}
              onValueChange={(itemValue) =>
                handleChange('driver', itemValue.toString())
              }>
              {ownersList.map((item) => {
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

        {/* Notes */}
        <AppTextInput
          label='Notes'
          name='notes'
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
    borderColor: Colors.SMT_Secondary_1_Light_1,
    borderWidth: 2,
    borderRadius: 3,
  },
});

export default UpdateRouteModal;
