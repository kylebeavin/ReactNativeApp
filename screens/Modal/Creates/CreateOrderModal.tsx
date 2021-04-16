import React, {useContext, useEffect, useState} from 'react';
import {useNavigation} from '@react-navigation/native';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import {Calendar} from 'react-native-calendars';
import {TextInputMask} from 'react-native-masked-text';
import CheckBox from '@react-native-community/checkbox';

import Colors from '../../../constants/Colors';
import Configs from '../../../constants/Configs';
import {Account} from '../../../types/crm';
import {formatDateString, isSuccessStatusCode} from '../../../utils/Helpers';
import ModalButtons from '../ModalButtons';
import AppButton from '../../../components/layout/AppButton';
import Layout from '../../../constants/Layout';
import {Order} from '../../../types/orders';
import {Days} from '../../../types/enums';
import AppContext from '../../../providers/AppContext';
import {isRequired} from '../../../utils/Validators';
import {ToastContext} from '../../../providers/ToastProvider';
import useForm from '../../../hooks/useForm';
import AppTextInput from '../../../components/layout/AppTextInput';
import AppPicker from '../../../components/layout/AppPicker';
import AppCheckBox from '../../../components/layout/AppCheckBox';

interface Props {}

const CreateOrderModal: React.FC<Props> = () => {
  //#region Form Initializers
  const formValues = {
    account: '',
    monthlyRate: '',
    demandRate: '',
    location: '',
    serviceDate: '',
    fileUploadUrl: '',
    notes: '',
  };

  const formErrors = {
    account: [],
    monthlyRate: [],
    demandRate: [],
    location: [],
    serviceDate: [],
    fileUploadUrl: [],
    notes: [],
  };

  const formValidations = {
    account: [isRequired],
    monthlyRate: [isRequired],
    demandRate: [isRequired],
    location: [],
    serviceDate: [isRequired],
    fileUploadUrl: [],
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
    postNewOrder,
  );

  // State
  const [location, setLocation] = useState('');

  // Checkboxes
  const [isRecurring, setIsRecurring] = useState(false);
  const [isDemo, setIsDemo] = useState(false);

  // DropDowns
  const [accountList, setAccountList] = useState<Account[]>([]);
  const [serviceDays, setServiceDays] = useState(Days.sun.toString());

  // Popups
  const [showStartDateCalendar, setShowStartDateCalendar] = useState(false);
  //#endregion

  useEffect(() => {
    // Fetch Accounts by group id
    getAccountsDropDown()
      .then((data) => {
        setAccountList(data);
      })
      .catch((err) => show({message: err.message}));
  }, []);

  useEffect(() => {
    if (accountList.length > 0) {
      setLocation(
        `${accountList![0].address_street}, ${accountList![0].address_city}, ${
          accountList![0].address_state
        } ${accountList![0].address_zip}`,
      );
    }
  }, [accountList]);

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

  const getFormData = async () => {
    const order: Order = {
      _id: '',
      account_id: values.account,
      containers_serviced: 0,
      container_qty: 0,
      demand_rate: values.demandRate,
      group_id: grpId,
      haul_status: false,
      is_active: true,
      is_demo: isDemo,
      is_recurring: isRecurring,
      location: location,
      monthly_rate: values.monthlyRate,
      notes: [values.notes],
      order_id: '',
      order_status: 'not started',
      services: 'smash',
      service_date: values.serviceDate,
      service_day: serviceDays,
      url: [values.fileUploadUrl],

      account_name: '',
    };
    return order;
  };

  async function postNewOrder() {
    const order: Order = await getFormData();

    await fetch(`${Configs.TCMC_URI}/api/orders`, {
      method: 'POST',
      body: JSON.stringify(order),
      headers: {'Content-Type': 'application/json', 'x-access-token': token},
    })
      .then((res) => res.json())
      .then((data) => {
        if (isSuccessStatusCode(data.status)) {
          show({message: data.message});
          navigation.navigate('OrdersScreen');
        } else {
          show({message: data.message});
        }
      })
      .catch((err) => show({message: err.message}));
  }

  const openStartDateCalendar = (show: boolean) => {
    setShowStartDateCalendar(show);
  };

  return (
    <View>
      <ScrollView style={styles.form}>
        {/* Account */}
          <AppPicker
            label="Account"
            name="account"
            value={values.account}
            list={accountList.map((u) => {
              return {_id: u._id, label: u.account_name, value: u.account_name};
            })}
            onChange={(itemValue) => {
              handleChange('account', itemValue.toString());
              setLocation(
                `${accountList!.filter(u => u._id === itemValue)[0].address_street}, ${
                  accountList.filter(u => u._id === itemValue)[0].address_city
                }, ${accountList.filter(u => u._id === itemValue)[0].address_state} ${
                  accountList.filter(u => u._id === itemValue)[0].address_zip
                }`)
            }}
            validations={[isRequired]}
            errors={errors.account}
            setErrors={setErrors}
          />

        {/* Location */}
        <AppTextInput
          label='Location'
          name='location'
          value={location}
          onChange={(val) => null}
          validations={[]}
          errors={errors.location}
          setErrors={setErrors}
          disabled
        />

        {/* isRecurring */}
        <AppCheckBox
          label='Is Recurring'
          name='is_recurring'
          value={isRecurring}
          onChange={(name, val) => setIsRecurring(val)}
          validations={[]}
          errors={[]}
          setErrors={() => null}
        />
        
        {/* isDemo */}
        <AppCheckBox
          label='Is Demo'
          name='is_demo'
          value={isDemo}
          onChange={(name, val) => setIsDemo(val)}
          validations={[]}
          errors={[]}
          setErrors={() => null}
        />

        {/* Service Days */}
          <AppPicker
            label="Day"
            name="day"
            value={serviceDays}
            list={Object.values(Days).map((u) => {
              return {_id: u, label: u, value: u};
            })}
            onChange={(itemValue) => setServiceDays(itemValue.toString())}
            validations={[isRequired]}
            errors={errors.account}
            setErrors={setErrors}
          />

        {/* Monthly Rate */}
        <AppTextInput
          label='Monthly Rate'
          name='monthlyRate'
          value={values.monthlyRate}
          onChange={(val) => handleChange('monthlyRate', val)}
          validations={[isRequired]}
          errors={errors.monthlyRate}
          setErrors={setErrors}
          keyboardType='number-pad'
        />

        {/* Demand Rate */}
        <AppTextInput
          label='Demand Rate'
          name='demandRate'
          value={values.demandRate}
          onChange={(val) => handleChange('demandRate', val)}
          validations={[isRequired]}
          errors={errors.demandRate}
          setErrors={setErrors}
          keyboardType='number-pad'
        />

        {/* Service Date */}
        <View style={styles.fieldContainer}>
          <View style={styles.columnContainer}>
            <View style={styles.column}>
              <Text style={styles.text}>Service Date</Text>
              <View style={styles.textInput}>
                <TextInputMask
                  type={'datetime'}
                  options={{
                    format: 'MM/DD/YYYY',
                  }}
                  value={values.serviceDate}
                  onChangeText={(text) => handleChange('serviceDate', text)}
                />
              </View>
            </View>
            <View style={[styles.column, styles.calendarButton]}>
              <AppButton
                title='Calendar'
                onPress={() => openStartDateCalendar(true)}
                icon={{name: 'calendar', type: 'MaterialCommunityIcons'}}
                backgroundColor={Colors.SMT_Secondary_2}
              />
            </View>
          </View>
        </View>

        {/* File Upload URL */}
        <AppTextInput
          label='File Upload URL'
          name='fileUploadUrl'
          value={values.fileUploadUrl}
          onChange={(val) => handleChange('fileUploadUrl', val)}
          validations={[]}
          errors={errors.fileUploadUrl}
          setErrors={setErrors}
        />

        {/* Notes */}
        <View style={[styles.fieldContainer, {marginBottom: 40}]}>
          <AppTextInput
            label='Notes'
            name='notes'
            value={values.notes}
            onChange={(val) => handleChange('notes', val)}
            validations={[]}
            errors={errors.notes}
            setErrors={setErrors}
          />
        </View>
      </ScrollView>

      <ModalButtons navigation={navigation} save={handleSubmit} />

      {showStartDateCalendar ? (
        <TouchableOpacity
          style={styles.calendarPopup}
          onPress={() => setShowStartDateCalendar(false)}>
          <Calendar
            style={{borderRadius: 4}}
            onDayPress={(day) => {
              handleChange('serviceDate', formatDateString(day.dateString));
              setShowStartDateCalendar(false);
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

export default CreateOrderModal;
