import React, {useContext, useEffect, useState} from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import {Picker} from '@react-native-picker/picker';

import Colors from '../../../constants/Colors';
import Configs from '../../../constants/Configs';
import {Account, Meeting, Contact} from '../../../types/crm';
import ModalButtons from '../ModalButtons';
import Layout from '../../../constants/Layout';
import {Calendar} from 'react-native-calendars';
import {
  formatDateString,
  getDateStringsFromDate,
  isSuccessStatusCode,
} from '../../../utils/Helpers';
import {TextInputMask} from 'react-native-masked-text';
import AppButton from '../../../components/Layout/AppButton';
import {isRequired} from '../../../utils/Validators';
import {useNavigation} from '@react-navigation/native';
import AppContext from '../../../providers/AppContext';
import {ToastContext} from '../../../providers/ToastProvider';
import useForm from '../../../hooks/useForm';
import AppTextInput from '../../../components/Layout/AppTextInput';

interface Props {
  meeting: Meeting;
}

const UpdateMeetingModal: React.FC<Props> = ({meeting}) => {
  //#region Form Initializers
  const formValues = {
    name: meeting.title,
    date: getDateStringsFromDate(meeting.meeting_time).date,
    startTime: getDateStringsFromDate(meeting.meeting_time).time,
    endTime: '',
    street: meeting.address_street,
    city: meeting.address_city,
    state: meeting.address_state,
    zip: meeting.address_zip,
    account: meeting.account_id,
    contact: meeting.contact_id,
    notes: meeting.notes,
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
    account: [isRequired],
    contact: [isRequired],
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
    updateMeeting,
  );

  // State
  const [showCalendar, setShowCalendar] = useState(false);

  // Drop downs
  const [accountList, setAccountList] = useState<Account[]>();
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

  const getContactList = async (accountId: string) => {
    await fetch(`${Configs.TCMC_URI}/api/contactsBy`, {
      method: 'POST',
      body: JSON.stringify({account_id: accountId}),
      headers: {'Content-Type': 'application/json', 'x-access-token': token},
    })
      .then((res) => res.json())
      .then((json) => setContactList(json.data))
      .catch((err) => show({message: err.message}));
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
    const updatedMeeting: Meeting = {
      _id: meeting._id,
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
    return updatedMeeting;
  };

  async function updateMeeting() {
    const updatedMeeting = await getFormData();
    await fetch(`${Configs.TCMC_URI}/api/meetings/${updatedMeeting._id}`, {
      method: 'PUT',
      body: JSON.stringify(updatedMeeting),
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
        {/* Name */}
        <AppTextInput
          label='Name'
          name='name'
          value={values.name}
          onChange={(val) => handleChange('name', val)}
          validations={[isRequired]}
          errors={errors.name}
          setErrors={setErrors}
        />

        {/* Account */}
        <View style={styles.fieldContainer}>
          <Text style={styles.text}>Account</Text>
          <View style={styles.picker}>
            <Picker
              selectedValue={values.account}
              onValueChange={(itemValue, ItemIndex) => {
                handleChange('account', itemValue.toString());
                getContactList(itemValue.toString());
              }}>
              {accountList?.map((item, index) => {
                return (
                  <Picker.Item
                    key={item._id}
                    label={item.account_name}
                    value={item._id}
                  />
                );
              })}
            </Picker>
          </View>
        </View>

        {/* Contact */}
        <View style={styles.fieldContainer}>
          <Text style={styles.text}>Contact</Text>
          <View style={styles.picker}>
            <Picker
              enabled={contactList.length === 0 ? false : true}
              selectedValue={values.contact}
              onValueChange={(itemValue, ItemIndex) => {
                itemValue === null
                  ? handleChange('contact', '')
                  : handleChange('contact', itemValue.toString());
              }}>
              {contactList?.map((item, index) => {
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
                title='Calendar'
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
                style={{textAlign: 'center', fontWeight: 'bold', fontSize: 18}}>
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

        {/* Street */}
        <AppTextInput
          label='Street'
          name='street'
          value={values.street}
          onChange={(val) => handleChange('street', val)}
          validations={[isRequired]}
          errors={errors.street}
          setErrors={setErrors}
        />

        {/* City */}
        <AppTextInput
          label='City'
          name='city'
          value={values.city}
          onChange={(val) => handleChange('city', val)}
          validations={[isRequired]}
          errors={errors.city}
          setErrors={setErrors}
        />

        {/* State */}
        <AppTextInput
          label='State'
          name='state'
          value={values.state}
          onChange={(val) => handleChange('state', val)}
          validations={[isRequired]}
          errors={errors.state}
          setErrors={setErrors}
        />

        {/* Zip */}
        <AppTextInput
          label='Zip'
          name='zip'
          value={values.zip}
          onChange={(val) => handleChange('zip', val)}
          validations={[isRequired]}
          errors={errors.zip}
          setErrors={setErrors}
        />

        {/* Notes */}
        <View style={{marginBottom: 40}}>
          <AppTextInput
            label='Notes'
            name='notes'
            value={values.notes}
            onChange={(val) => handleChange('notes', val)}
            validations={[]}
            errors={errors.notes}
            setErrors={setErrors}
            multiline
          />
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
    maxHeight: Layout.window.height / 1.42,
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

export default UpdateMeetingModal;
