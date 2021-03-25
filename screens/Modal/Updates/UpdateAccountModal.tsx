import React, {useContext, useRef, useState} from 'react';
import {StyleSheet, View, Text, TextInput, ScrollView} from 'react-native';

import Colors from '../../../constants/Colors';
import Configs from '../../../constants/Configs';
import Layout from '../../../constants/Layout';
import AppContext from '../../../providers/AppContext';
import {ToastContext} from '../../../providers/ToastProvider';
import {Account} from '../../../types/crm';
import {isSuccessStatusCode} from '../../../utils/Helpers';
import ModalButtons from '../ModalButtons';
import {isRequired, isEmail} from '../../../utils/Validators';
import AppTextInput from '../../../components/Layout/AppTextInput';
import useForm from '../../../hooks/useForm';

interface Props {
  navigation: any;
  account: Account;
}

const UpdateAccountModal: React.FC<Props> = ({navigation, account}) => {
  //#region Form Initializers
  const formValues = {
    name: account.account_name,
    email: account.email,
    street: account.address_street,
    city: account.address_city,
    state: account.address_state,
    zip: account.address_zip,
    notes: account.notes,
  };

  const formErrors = {
    name: [],
    email: [],
    street: [],
    city: [],
    state: [],
    zip: [],
    notes: [],
  };

  const formValidations = {
    name: [isRequired],
    email: [isRequired, isEmail],
    street: [isRequired],
    city: [isRequired],
    state: [isRequired],
    zip: [isRequired],
    notes: [],
  };
  //#endregion

  //#region State Variables
  const {handleChange, handleSubmit, values, errors, setErrors} = useForm(
    formValues,
    formErrors,
    formValidations,
    updateAccount,
  );
  const {show} = useContext(ToastContext);
  const {grpId, token} = useContext(AppContext);
  //#endregion

  const getFormData = async () => {
    const updatedAccount: Account = {
      _id: account._id,
      group_id: grpId,
      owner_id: account.owner_id,
      owner_name: account.owner_name,
      account_name: values.name,
      address_street: values.street,
      address_city: values.city,
      address_state: values.state,
      address_zip: values.zip,
      demo: account.demo,
      email: values.email,
      hauling_contract: account.hauling_contract,
      hauling_expiration: account.hauling_expiration,
      stage: account.stage,
      geo_location: account.geo_location,
      is_active: account.is_active,
      contacts: [],
      conversion: account.conversion,
      national: account.national,
      referral: account.referral,
      referral_group_id: account.referral_group_id,
      notes: values.notes,
      drawerIsVisible: account.drawerIsVisible,
      createdAt: account.createdAt,
      updatedAt: account.updatedAt,
    };

    return updatedAccount;
  };

  async function updateAccount() {
    const updatedAccount = await getFormData();
    const data = await fetch(`${Configs.TCMC_URI}/api/accounts/`, {
      method: 'PUT',
      body: JSON.stringify(updatedAccount),
      headers: {'Content-Type': 'application/json', 'x-access-token': token},
    })
      .then((res) => res.json())
      .then((data) => {
        if (isSuccessStatusCode(data.status)) {
          show({message: data.message});
          navigation.navigate('AccountsScreen');
        } else {
          show({message: data.message});
        }
      })
      .catch((err) => show({message: 'Error: ' + err.message}));

    return data;
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
          value={values.notes[0]}
          onChange={(val) => handleChange('notes', val)}
          validations={[]}
          errors={errors.notes}
          setErrors={setErrors}
          multiline
        />
        </View>

      </ScrollView>

      {/* Buttons */}
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
});

export default UpdateAccountModal;
