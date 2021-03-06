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
import {Route} from '../../../types/routes';
import {isRequired} from '../../../utils/Validators';
import AppContext from '../../../providers/AppContext';
import {ToastContext} from '../../../providers/ToastProvider';
import Configs from '../../../constants/Configs';
import {
  formatDateString,
  isSuccessStatusCode,
} from '../../../utils/Helpers';
import AppTextInput from '../../../components/layout/AppTextInput';
import {TextInputMask} from 'react-native-masked-text';
import AppButton from '../../../components/layout/AppButton';
import {Calendar} from 'react-native-calendars';
import { Picker } from '@react-native-picker/picker';
import AppPicker from '../../../components/layout/AppPicker';

const CreateRouteModal = () => {
  //#region Form Initializers
  const formValues = {
    start_location: '',
    time: new Date().toLocaleDateString(),
    notes: '',
  };
  const formErrors = {
    start_location: [],
    time: [],
    notes: [],
  };
  const formValidations = {
    start_location: [isRequired],
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
  const [showCalendar, setShowCalendar] = useState(false);

  // Drop Down
  const [locationsList, setLocationsList] = useState<string[]>([]);
  //#endregion

  useEffect(() => {
    getTruckLocations();
  }, []);

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

  const getFormData = async () => {
    const route: Route = {
      _id: '',
      route_id: '',
      group_id: grpId,
      inspection_id: '',
      is_active: true,
      route_stage: 'unassigned',
      start_location: values.start_location,
      truck_vin: '_',
      service_stop: [],
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
                title="Calendar"
                onPress={() => openCalendar(true)}
                icon={{name: 'calendar', type: 'MaterialCommunityIcons'}}
                backgroundColor={Colors.SMT_Secondary_2}
              />
            </View>
          </View>
        </View>

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

export default CreateRouteModal;
