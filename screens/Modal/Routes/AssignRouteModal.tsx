import React, {useContext, useEffect, useState} from 'react';
import {
  StyleSheet,
  View,
  ScrollView,
  Text,
  TouchableOpacity,
} from 'react-native';
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
import {
  formatDateString,
  getDateStringsFromDate,
  isSuccessStatusCode,
} from '../../../utils/Helpers';
import AppTextInput from '../../../components/layout/AppTextInput';
import {Picker} from '@react-native-picker/picker';
import {SMT_User} from '../../../types';
import {TextInputMask} from 'react-native-masked-text';
import AppButton from '../../../components/layout/AppButton';
import {Calendar} from 'react-native-calendars';
import AppPicker from '../../../components/layout/AppPicker';

interface Props {
  route: Route;
}

const AssignRouteModal: React.FC<Props> = ({route}) => {
  //#region Form Initializers
  const formValues = {
    truck_id: route.truck_id,
    is_active: route.is_active,
    start_location: route.start_location,
    route_stage: route.route_stage,
    driver: route.driver_id,
    truck_vin: route.truck_vin,
    service_stop: route.service_stop,
    time: getDateStringsFromDate(route.time).date,
    notes: route.notes,
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
    assignRoute,
  );

  // State
  const [showCalendar, setShowCalendar] = useState(false);

  // Drop Down
  const [trucksList, setTrucksList] = useState<Truck[]>([]);
  const [ownersList, setOwnersList] = useState<SMT_User[]>([]);
  const [locationsList, setLocationsList] = useState<string[]>([]);
  //#endregion

  useEffect(() => {
    getTruckLocations();
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

  const getTruckLocations = async () => {
    await fetch(`${Configs.TCMC_URI}/api/groupsBy`, {
      method: 'POST',
      headers: {'Content-Type': 'application/json', 'x-access-token': token},
      body: JSON.stringify({_id: grpId})
    })
    .then(res => res.json())
    .then(json => {
      if (isSuccessStatusCode(json.status)) {
        setLocationsList(json.data[0].truck_location);
      } else {
        show({message: json.message});
      }
    })
    .catch(err => show({message: err.message}));
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
      .catch((err) => show({message: err.message}));

    return userList;
  };

  const getFormData = async () => {
    const reassignedRoute: Route = {
      _id: route._id,
      route_id: route.route_id,
      group_id: route.group_id,
      truck_id: values.truck_id,
      inspection_id: route.inspection_id,
      is_active: values.is_active,
      route_stage: 'assigned',
      start_location: values.start_location,
      driver_id: values.driver,
      truck_vin: route.truck_vin,
      service_stop: values.service_stop,
      time: new Date(values.time),
      notes: values.notes,
    };
    return reassignedRoute;
  };

  async function assignRoute() {
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

  const openCalendar = (show: boolean) => {
    setShowCalendar(show);
  };

  return (
    <View>
      <ScrollView style={styles.form}>
        {/* Start Location */}
        <AppPicker
          label='Start Location'
          name='start_location'
          value={values.start_location}
          list={locationsList.map(u => {return {_id: u, label: u, value: u}})}
          onChange={(itemValue) => handleChange('start_location', itemValue.toString())}
          validations={[]}
          errors={errors.start_location}
          setErrors={setErrors}
        />

        {/* Truck */}
        <AppPicker
          label='Truck'
          name='truck'
          value={values.truck_id!}
          list={trucksList.map(u => {return {_id: u._id, label: u.name, value: u._id}})}
          onChange={(itemValue) => handleChange('truck', itemValue.toString())}
          validations={[]}
          errors={errors.truck_id}
          setErrors={setErrors}
        />

        {/* Driver */}
        <AppPicker
          label='Driver'
          name='driver'
          value={values.driver!}
          list={ownersList.map(u => {return {_id: u._id, label: u.first_name + ' ' + u.last_name, value: u._id}})}
          onChange={(itemValue) => handleChange('driver', itemValue.toString())}
          validations={[]}
          errors={errors.driver}
          setErrors={setErrors}
        />

        {/* Time */}
        <View style={styles.fieldContainer}>
          <View style={styles.columnContainer}>
            <View style={styles.column}>
              <Text style={styles.text}>Start Date</Text>
              <View style={styles.textInput}>
                <TextInputMask
                  type={'datetime'}
                  options={{
                    format: 'MM/DD/YYYY',
                  }}
                  value={values.time}
                  onChangeText={(text) => handleChange('time', text)}
                />
              </View>
            </View>
            <View style={[styles.column, styles.calendarButton]}>
              <AppButton
                title='Calendar'
                onPress={() => openCalendar(true)}
                icon={{name: 'calendar', type: 'MaterialCommunityIcons'}}
                backgroundColor={Colors.SMT_Secondary_2}
              />
            </View>
          </View>
        </View>

        {/* Notes */}
        <AppTextInput
          label='Notes'
          name='notes'
          value={values.notes}
          onChange={(val) => handleChange('notes', val)}
          validations={[]}
          errors={errors.notes}
          setErrors={setErrors}
        />
      </ScrollView>

      <ModalButtons navigation={navigation} save={handleSubmit} />

      {showCalendar ? (
        <TouchableOpacity
          style={styles.calendarPopup}
          onPress={() => setShowCalendar(false)}>
          <Calendar
            style={{borderRadius: 4}}
            onDayPress={(day) => {
              handleChange('time', formatDateString(day.dateString));
              setShowCalendar(false);
            }}
          />
        </TouchableOpacity>
      ) : null}
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
  //=== Date Fields ===//
  fieldContainer: {
    marginBottom: 10,
  },
  text: {
    fontWeight: 'bold',
    color: Colors.SMT_Secondary_1,
  },
  textInput: {
    paddingLeft: 15,
    paddingVertical: 5,
    borderColor: Colors.SMT_Secondary_1_Light_1,
    borderWidth: 2,
    borderRadius: 3,
  },
  picker: {
    paddingLeft: 15,
    borderColor: Colors.SMT_Secondary_1_Light_1,
    borderWidth: 2,
    borderRadius: 3,
  },
  columnContainer: {
    flexDirection: 'row',
  },
  column: {
    flex: 1,
  },
  calendarButton: {
    flex: 0,
    marginTop: 22,
    marginBottom: -3,
    marginLeft: 20,
  },
  calendarPopup: {
    position: 'absolute',
    height: '100%',
    width: '100%',
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.55)',
  },
});

export default AssignRouteModal;
