import React, {useContext, useEffect, useState} from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import {Picker} from '@react-native-picker/picker';
import {Calendar} from 'react-native-calendars';
import {TextInputMask} from 'react-native-masked-text';
import {useNavigation} from '@react-navigation/native';

import Colors from '../../../constants/Colors';
import Configs from '../../../constants/Configs';
import {Meeting, Account, Contact} from '../../../types/crm';
import {formatDateString, isSuccessStatusCode} from '../../../utils/Helpers';
import ModalButtons from '../ModalButtons';
import AppButton from '../../../components/layout/AppButton';
import Layout from '../../../constants/Layout';
import AppContext from '../../../providers/AppContext';
import {isRequired} from '../../../utils/Validators';
import {ToastContext} from '../../../providers/ToastProvider';
import useForm from '../../../hooks/useForm';
import AppTextInput from '../../../components/layout/AppTextInput';
import AppTitle from '../../../components/layout/AppTitle';
import AppPicker from '../../../components/layout/AppPicker';

interface Props {}

const CreateMeetingModal: React.FC<Props> = () => {
  //#region Form Initializers
  const formValues = {
    name: '',
    date: '',
    startTime: '',
    endTime: '',
    street: '',
    city: '',
    state: '',
    zip: '',
    account: '',
    contact: '',
    notes: '',
  };

  const formErrors = {
    name: [],
    date: [],
    startTime: [],
    endTime: [],
    street: [],
    city: [],
    state: [],
    zip: [],
    account: [],
    contact: [],
    notes: [],
  };

  const formValidations = {
    name: [isRequired],
    date: [isRequired],
    startTime: [isRequired],
    endTime: [isRequired],
    street: [isRequired],
    city: [isRequired],
    state: [isRequired],
    zip: [isRequired],
    account: [],
    contact: [],
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
    postNewMeeting,
  );

  // State
  const [showCalendar, setShowCalendar] = useState(false);

  // Drop downs
  const [accountList, setAccountList] = useState<Account[]>([]);
  const [contactList, setContactList] = useState<Contact[]>([]);
  //#endregion

  useEffect(() => {
    // Fetch Accounts by group id
    getAccountsDropDown()
      .then((data) => {
        setAccountList(data);
      })
      .catch((err) => show({message: err.message}));
  }, []);

  const getAccountsDropDown = async (): Promise<Account[]> => {
    let accountsList: Account[] = [];

    await fetch(`${Configs.TCMC_URI}/api/accountsBy`, {
      method: 'POST',
      body: JSON.stringify({group_id: grpId}),
      headers: {'Content-Type': 'application/json', 'x-access-token': token},
    })
      .then((res) => res.json())
      .then((json) => (accountsList = json.data))
      .catch((err) => show({message: err.message}));
    return accountsList;
  };

  const getMeetingTime = (): Date => {
    let dateArr = values.date.split('/');
    let timeArr = values.startTime.split(':');
    let timeString =
      dateArr[2] +
      '-' +
      dateArr[0] +
      '-' +
      dateArr[1] +
      'T' +
      timeArr[0] +
      ':' +
      timeArr[1] +
      ':00';

    return new Date(timeString);
  };

  const getFormData = async () => {
    const meeting: Meeting = {
      _id: '',
      group_id: grpId,
      account_id: values.account,
      contact_id: values.contact,
      owner_id: id,
      title: values.name,
      address_street: values.street,
      address_city: values.city,
      address_state: values.state,
      address_zip: values.zip,
      createdAt: '',
      updatedAt: '',
      meeting_time: getMeetingTime(),
      is_active: true,
      notes: values.notes,
    };
    return meeting;
  };

  async function postNewMeeting() {
    const meeting: Meeting = await getFormData();
    await fetch(`${Configs.TCMC_URI}/api/meetings`, {
      method: 'POST',
      body: JSON.stringify(meeting),
      headers: {'Content-Type': 'application/json', 'x-access-token': token},
    })
      .then((res) => res.json())
      .then((data) => {
        if (isSuccessStatusCode(data.status)) {
          show({message: data.message});
          navigation.navigate('MeetingsScreen');
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
        <AppTitle title="Meeting Details" />

        <View style={{paddingHorizontal: 10, paddingTop: 10}}>
          {/* Name */}
          <AppTextInput
            label="Name"
            name="name"
            value={values.name}
            onChange={(val) => handleChange('name', val)}
            validations={[isRequired]}
            errors={errors.name}
            setErrors={setErrors}
          />

          {/* Account */}
          <AppPicker
            label='Account'
            name='account'
            value={values.account}
            list={accountList.map((u) => {
              return {_id: u._id, label: u.account_name, value: u._id};
            })}
            onChange={(itemValue) => handleChange('role', itemValue.toString())}
            validations={[isRequired]}
            errors={errors.account}
            setErrors={setErrors}
          />
        </View>

        <AppTitle title="Date and Time" />

        <View style={{paddingHorizontal: 10, paddingTop: 10}}>
          {/* Date */}
          <View style={styles.fieldContainer}>
            <View style={styles.columnContainer}>
              <View style={styles.column}>
                <Text style={styles.text}>Date</Text>
                <View style={styles.textInput}>
                  <TextInputMask
                    type={'datetime'}
                    options={{
                      format: 'MM/DD/YYYY',
                    }}
                    value={values.date}
                    onChangeText={(text) => handleChange('date', text)}
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

          {/* Time */}
          <View style={styles.fieldContainer}>
            <View style={styles.columnContainer}>
              <View style={styles.column}>
                <Text style={styles.text}>Start Time</Text>
                <View style={styles.textInput}>
                  <TextInputMask
                    type={'datetime'}
                    options={{
                      format: 'HH:mm',
                    }}
                    value={values.startTime}
                    onChangeText={(text) => handleChange('startTime', text)}
                  />
                </View>
              </View>
              <View
                style={[
                  styles.column,
                  {
                    flex: 0,
                    justifyContent: 'center',
                    marginTop: 20,
                    marginHorizontal: 20,
                  },
                ]}>
                <Text
                  style={{
                    textAlign: 'center',
                    fontWeight: 'bold',
                    fontSize: 18,
                  }}>
                  To:
                </Text>
              </View>
              <View style={styles.column}>
                <Text style={styles.text}>End Time</Text>
                <View style={styles.textInput}>
                  <TextInputMask
                    type={'datetime'}
                    options={{
                      format: 'HH:mm',
                    }}
                    value={values.endTime}
                    onChangeText={(text) => handleChange('endTime', text)}
                  />
                </View>
              </View>
            </View>
          </View>
        </View>

        <AppTitle title="Location" />

        <View style={{paddingHorizontal: 10, paddingTop: 10}}>
          {/* Street */}
          <AppTextInput
            label="Street"
            name="street"
            value={values.street}
            onChange={(val) => handleChange('street', val)}
            validations={[isRequired]}
            errors={errors.street}
            setErrors={setErrors}
          />

          {/* City */}
          <AppTextInput
            label="City"
            name="city"
            value={values.city}
            onChange={(val) => handleChange('city', val)}
            validations={[isRequired]}
            errors={errors.city}
            setErrors={setErrors}
          />

          {/* State */}
          <AppTextInput
            label="State"
            name="state"
            value={values.state}
            onChange={(val) => handleChange('state', val)}
            validations={[isRequired]}
            errors={errors.state}
            setErrors={setErrors}
          />

          {/* Zip */}
          <AppTextInput
            label="Zip"
            name="zip"
            value={values.zip}
            onChange={(val) => handleChange('zip', val)}
            validations={[isRequired]}
            errors={errors.zip}
            setErrors={setErrors}
          />

          {/* Notes */}
          <View style={{marginBottom: 10}}>
            <AppTextInput
              label="Notes"
              name="notes"
              value={values.notes}
              onChange={(val) => handleChange('notes', val)}
              validations={[]}
              errors={errors.notes}
              setErrors={setErrors}
              multiline
            />
          </View>
        </View>
      </ScrollView>

      <ModalButtons navigation={navigation} save={handleSubmit} />

      {showCalendar ? (
        <TouchableOpacity
          style={styles.calendarPopup}
          onPress={() => setShowCalendar(false)}>
          <Calendar
            style={{borderRadius: 4}}
            onDayPress={(day) => {
              handleChange('date', formatDateString(day.dateString));
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
    //padding: 20,
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

export default CreateMeetingModal;
