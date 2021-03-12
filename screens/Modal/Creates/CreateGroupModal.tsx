import React, {useContext, useState} from 'react';
import {
  StyleSheet,
  View,
  ScrollView,
  Text,
  TouchableOpacity,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';

import useForm from '../../../hooks/useForm';
import Colors from '../../../constants/Colors';
import Configs from '../../../constants/Configs';
import Layout from '../../../constants/Layout';
import AppContext from '../../../providers/AppContext';
import {ToastContext} from '../../../providers/ToastProvider';
import {formatDateString, isSuccessStatusCode} from '../../../utils/Helpers';
import AppTextInput from '../../../components/Layout/AppTextInput';
import ModalButtons from '../ModalButtons';
import {isRequired, isEmail} from '../../../utils/Validators';
import {Group} from '../../../types';
import AppButton from '../../../components/Layout/AppButton';
import {TextInputMask} from 'react-native-masked-text';
import {Calendar} from 'react-native-calendars';

const CreateGroupModal = () => {
  //#region Form Initializers
  const formValues = {
    address_city: '',
    address_state: '',
    address_street: '',
    address_zip: '',
    dba: '',
    ein: '',
    email: '',
    is_active: true,
    launch_date: new Date(),
    legal_company: '',
    name: '',
    phone: '',
    region: '',
    signing_date: '',
    tax_rate: '',
    territory_zips: [],
    time_zone: '',
    webpage: '',
  };

  const formErrors = {
    address_city: [],
    address_state: [],
    address_street: [],
    address_zip: [],
    dba: [],
    ein: [],
    email: [],
    is_active: [],
    launch_date: [],
    legal_company: [],
    name: [],
    phone: [],
    region: [],
    signing_date: [],
    tax_rate: [],
    territory_zips: [],
    time_zone: [],
    webpage: [],
  };

  const formValidations = {
    address_city: [isRequired],
    address_state: [isRequired],
    address_street: [isRequired],
    address_zip: [isRequired],
    dba: [isRequired],
    ein: [isRequired],
    email: [isRequired, isEmail],
    is_active: [],
    launch_date: [isRequired],
    legal_company: [isRequired],
    name: [isRequired],
    phone: [isRequired],
    region: [isRequired],
    signing_date: [isRequired],
    tax_rate: [isRequired],
    territory_zips: [isRequired],
    time_zone: [isRequired],
    webpage: [isRequired],
  };
  //#endregion

  //#region State Variables
  const navigation = useNavigation();

  const {token} = useContext(AppContext);
  const {show} = useContext(ToastContext);
  const {handleChange, handleSubmit, values, errors, setErrors} = useForm(
    formValues,
    formErrors,
    formValidations,
    postNewGroup,
  );

  // State
  const [showSigningDateCalendar, setShowSigningDateCalendar] = useState(false);
  const [showLaunchDateCalendar, setShowLaunchDateCalendar] = useState(false);
  // ToDo: Figure out how to useRefs to set focus onSubmit of TextInput.
  //#endregion

  const getFormData = async () => {
    const group: Group = {
      _id: '',
      address: {
        address_city: values.address_city,
        address_state: values.address_state,
        address_street: values.address_street,
        address_zip: values.address_zip,
      },
      dba: values.dba,
      ein: values.ein,
      email: values.email,
      is_active: values.is_active,
      launch_date: values.launch_date,
      legal_company: values.legal_company,
      name: values.name,
      phone: values.phone,
      region: values.region,
      signing_date: values.signing_date,
      tax_rate: values.tax_rate,
      territory_zips: values.territory_zips,
      time_zone: values.time_zone,
      webpage: values.webpage,
    };

    return group;
  };

  async function postNewGroup() {
    const group = await getFormData();

    await fetch(`${Configs.TCMC_URI}/api/groups`, {
      method: 'POST',
      headers: {'Content-Type': 'application/json', 'x-access-token': token},
      body: JSON.stringify(group),
    })
      .then((res) => res.json())
      .then((data) => {
        if (isSuccessStatusCode(data.status)) {
          show({message: data.message});
          navigation.navigate('DashboardScreen');
        } else {
          show({message: data.message});
        }
      })
      .catch((err) => show({message: 'Error: ' + err.message}));
  }

  const openSigningDateCalendar = (show: boolean) => {
    setShowSigningDateCalendar(show);
  };
  const openLaunchDateCalendar = (show: boolean) => {
    setShowLaunchDateCalendar(show);
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

        {/* DBA */}
        <AppTextInput
          label='DBA'
          name='dba'
          value={values.dba}
          onChange={(val) => handleChange('dba', val)}
          validations={[isRequired]}
          errors={errors.dba}
          setErrors={setErrors}
        />

        {/* Legal Company */}
        <AppTextInput
          label='Legal Company'
          name='legal_company'
          value={values.legal_company}
          onChange={(val) => handleChange('legal_company', val)}
          validations={[isRequired]}
          errors={errors.legal_company}
          setErrors={setErrors}
        />

        {/* EIN */}
        <AppTextInput
          label='EIN'
          name='ein'
          value={values.ein}
          onChange={(val) => handleChange('ein', val)}
          validations={[isRequired]}
          errors={errors.ein}
          setErrors={setErrors}
        />

        {/* Address City */}
        <AppTextInput
          label='City'
          name='address_city'
          value={values.address_city}
          onChange={(val) => handleChange('address_city', val)}
          validations={[isRequired]}
          errors={errors.address_city}
          setErrors={setErrors}
        />

        {/* Address State */}
        <AppTextInput
          label='State'
          name='address_state'
          value={values.address_state}
          onChange={(val) => handleChange('address_state', val)}
          validations={[isRequired]}
          errors={errors.address_state}
          setErrors={setErrors}
        />

        {/* Address Street */}
        <AppTextInput
          label='Street'
          name='address_street'
          value={values.address_street}
          onChange={(val) => handleChange('address_street', val)}
          validations={[isRequired]}
          errors={errors.address_street}
          setErrors={setErrors}
        />

        {/* Address Zip */}
        <AppTextInput
          label='Zip'
          name='address_zip'
          value={values.address_zip}
          onChange={(val) => handleChange('address_zip', val)}
          validations={[isRequired]}
          errors={errors.address_zip}
          setErrors={setErrors}
        />

        {/* Phone */}
        <AppTextInput
          label='Phone'
          name='phone'
          value={values.phone}
          onChange={(val) => handleChange('phone', val)}
          validations={[isRequired]}
          errors={errors.phone}
          setErrors={setErrors}
          keyboardType='number-pad'
        />

        {/* Email */}
        <AppTextInput
          label='Email'
          name='email'
          value={values.email}
          onChange={(val) => handleChange('email', val)}
          validations={[isRequired, isEmail]}
          errors={errors.email}
          setErrors={setErrors}
        />

        {/* Region */}
        <AppTextInput
          label='Region'
          name='region'
          value={values.region}
          onChange={(val) => handleChange('region', val)}
          validations={[isRequired]}
          errors={errors.region}
          setErrors={setErrors}
        />

        {/* Tax Rate */}
        <AppTextInput
          label='Tax Rate'
          name='tax_rate'
          value={values.tax_rate}
          onChange={(val) => handleChange('tax_rate', val)}
          validations={[isRequired]}
          errors={errors.tax_rate}
          setErrors={setErrors}
        />

        {/* Time Zone */}
        <AppTextInput
          label='Time Zone'
          name='time_zone'
          value={values.time_zone}
          onChange={(val) => handleChange('time_zone', val)}
          validations={[isRequired]}
          errors={errors.time_zone}
          setErrors={setErrors}
        />

        {/* Territory Zips */}
        <AppTextInput
          label='Territory Zips'
          name='territory_zips'
          value={values.territory_zips}
          onChange={(val) => handleChange('territory_zips', val)}
          validations={[isRequired]}
          errors={errors.territory_zips}
          setErrors={setErrors}
        />

        {/* Signing Date */}
        <View style={styles.fieldContainer}>
          <View style={styles.columnContainer}>
            <View style={styles.column}>
              <Text style={styles.text}>Signing Date</Text>
              <View style={styles.textInput}>
                <TextInputMask
                  type={'datetime'}
                  options={{
                    format: 'MM/DD/YYYY',
                  }}
                  value={values.signing_date}
                  onChangeText={(text) => handleChange('signing_date', text)}
                />
              </View>
            </View>
            <View style={[styles.column, styles.calendarButton]}>
              <AppButton
                title='Calendar'
                onPress={() => openSigningDateCalendar(true)}
                icon={{name: 'calendar', type: 'MaterialCommunityIcons'}}
                backgroundColor={Colors.SMT_Secondary_2}
              />
            </View>
          </View>
        </View>

        {/* Launch Date */}
        <View style={styles.fieldContainer}>
          <View style={styles.columnContainer}>
            <View style={styles.column}>
              <Text style={styles.text}>Launch Date</Text>
              <View style={styles.textInput}>
                <TextInputMask
                  type={'datetime'}
                  options={{
                    format: 'MM/DD/YYYY',
                  }}
                  value={values.launch_date.toString()}
                  onChangeText={(text) => handleChange('date', text)}
                />
              </View>
            </View>
            <View style={[styles.column, styles.calendarButton]}>
              <AppButton
                title='Calendar'
                onPress={() => openLaunchDateCalendar(true)}
                icon={{name: 'calendar', type: 'MaterialCommunityIcons'}}
                backgroundColor={Colors.SMT_Secondary_2}
              />
            </View>
          </View>
        </View>

        {/* Webpage */}
        <View style={{marginBottom: 40}}>
          <AppTextInput
            label='Webpage'
            name='webpage'
            value={values.webpage}
            onChange={(val) => handleChange('webpage', val)}
            validations={[]}
            errors={errors.webpage}
            setErrors={setErrors}
          />
        </View>
      </ScrollView>

      {/* Buttons */}
      <ModalButtons navigation={navigation} save={handleSubmit} />

      {showSigningDateCalendar ? (
        <TouchableOpacity
          style={styles.calendarPopup}
          onPress={() => setShowSigningDateCalendar(false)}>
          <Calendar
            style={{borderRadius: 4}}
            onDayPress={(day) => {
              handleChange('signing_date', formatDateString(day.dateString));
              setShowSigningDateCalendar(false);
            }}
          />
        </TouchableOpacity>
      ) : null}

      {showLaunchDateCalendar ? (
        <TouchableOpacity
          style={styles.calendarPopup}
          onPress={() => setShowLaunchDateCalendar(false)}>
          <Calendar
            style={{borderRadius: 4}}
            onDayPress={(day) => {
              handleChange('launch_date', formatDateString(day.dateString));
              setShowLaunchDateCalendar(false);
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

export default CreateGroupModal;
