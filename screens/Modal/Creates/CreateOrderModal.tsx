import React, {useContext, useEffect, useState} from 'react';
import {useNavigation} from '@react-navigation/native';
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
import CheckBox from '@react-native-community/checkbox';

import Colors from '../../../constants/Colors';
import Configs from '../../../constants/Configs';
import {Account} from '../../../types/crm';
import {formatDateString, isSuccessStatusCode} from '../../../utils/Helpers';
import ModalButtons from '../ModalButtons';
import AppButton from '../../../components/Layout/AppButton';
import Layout from '../../../constants/Layout';
import {Order} from '../../../types/service';
import {Days, Services} from '../../../types/enums';
import AppContext from '../../../providers/AppContext';
import {isRequired} from '../../../utils/Validators';
import {ToastContext} from '../../../providers/ToastProvider';
import useForm from '../../../hooks/useForm';
import AppTextInput from '../../../components/Layout/AppTextInput';

interface Props {}

const CreateOrderModal: React.FC<Props> = () => {
  //#region Form Initializers
  const formValues = {
    account: '',
    monthlyRate: '',
    demandRate: '',
    serviceDate: '',
    fileUploadUrl: '',
    notes: '',
  };

  const formErrors = {
    account: [],
    monthlyRate: [],
    demandRate: [],
    serviceDate: [],
    fileUploadUrl: [],
    notes: [],
  };

  const formValidations = {
    account: [isRequired],
    monthlyRate: [isRequired],
    demandRate: [isRequired],
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

  // Checkboxes
  const [isRecurring, setIsRecurring] = useState(false);
  const [isDemo, setIsDemo] = useState(false);

  // DropDowns
  const [accountList, setAccountList] = useState<Account[]>();
  const [services, setServices] = useState(Services.smash.toString());
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
      agreement_id: '',
      container_qty: 0,
      demand_rate: values.demandRate,
      group_id: grpId,
      haul_status: false,
      is_active: true,
      is_demo: isDemo,
      is_recurring: isRecurring,
      monthly_rate: values.monthlyRate,
      notes: [values.notes],
      order_id: '',
      order_status: 'not started',
      services: services,
      service_date: values.serviceDate,
      service_days: serviceDays,
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
        <View style={styles.fieldContainer}>
          <Text style={styles.text}>Account</Text>
          <View style={styles.picker}>
            <Picker
              selectedValue={values.account}
              onValueChange={(itemValue) => {
                handleChange('account', itemValue.toString());
              }}>
              {accountList?.map((item) => {
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

        {/* isRecurring */}
        <View style={styles.fieldContainer}>
          <Text style={styles.text}>Is Recurring</Text>
          <CheckBox
            disabled={false}
            value={isRecurring}
            onValueChange={(newValue) => setIsRecurring(!isRecurring)}
          />
        </View>

        {/* Services */}
        <View style={styles.fieldContainer}>
          <Text style={styles.text}>Service</Text>
          <View style={styles.picker}>
            <Picker
              selectedValue={services}
              onValueChange={(itemValue) =>
                setServices(itemValue.toString())
              }>
              {Object.values(Services).map((item) => {
                return (
                  <Picker.Item
                    key={item.toString()}
                    label={item.toString()}
                    value={item.toString()}
                  />
                );
              })}
            </Picker>
          </View>
        </View>

        {/* Service Days */}
        <View style={styles.fieldContainer}>
          <Text style={styles.text}>Days</Text>
          <View style={styles.picker}>
            <Picker
              selectedValue={serviceDays}
              onValueChange={(itemValue) =>
                setServiceDays(itemValue.toString())
              }>
              {Object.values(Days).map((item) => {
                return (
                  <Picker.Item
                    key={item.toString()}
                    label={item.toString()}
                    value={item.toString()}
                  />
                );
              })}
            </Picker>
          </View>
        </View>

        {/* Monthly Rate */}
        <AppTextInput
          label='Monthly Rate'
          name='monthlyRate'
          value={values.monthlyRate}
          onChange={(val) => handleChange('monthlyRate', val)}
          validations={[isRequired]}
          errors={errors.monthlyRate}
          setErrors={setErrors}
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

        {/* isDemo */}
        <View style={styles.fieldContainer}>
          <Text style={styles.text}>Is Demo</Text>
          <CheckBox
            disabled={false}
            value={isDemo}
            onValueChange={() => setIsDemo(!isDemo)}
          />
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
              handleChange('startDate', formatDateString(day.dateString));
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
