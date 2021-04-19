import React, {useContext} from 'react';
import {StyleSheet, View, ScrollView} from 'react-native';
import {useNavigation} from '@react-navigation/native';

import useForm from '../../../hooks/useForm';
import Colors from '../../../constants/Colors';
import Configs from '../../../constants/Configs';
import Layout from '../../../constants/Layout';
import AppContext from '../../../providers/AppContext';
import {ToastContext} from '../../../providers/ToastProvider';
import {Account} from '../../../types/crm';
import {isSuccessStatusCode} from '../../../utils/Helpers';
import AppTextInput from '../../../components/layout/AppTextInput';
import ModalButtons from '../ModalButtons';
import {isRequired, isEmail} from '../../../utils/Validators';

const CreateAccountModal = () => {
  //#region Form Initializers
  const formValues = {
    name: '',
    email: '',
    street: '',
    city: '',
    state: '',
    zip: '',
    notes: '',
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
  const navigation = useNavigation();

  const {grpId, token, id, displayName} = useContext(AppContext);
  const {show} = useContext(ToastContext);
  const {handleChange, handleSubmit, values, errors, setErrors} = useForm(
    formValues,
    formErrors,
    formValidations,
    postNewAccount,
  );
  // ToDo: Figure out how to useRefs to set focus onSubmit of TextInput.
  //#endregion

  const getFormData = async () => {
    const account: Account = {
      _id: '',
      group_id: grpId,
      owner_id: id,
      owner_name: displayName,
      account_name: values.name,
      address_street: values.street,
      address_city: values.city,
      address_state: values.state,
      address_zip: values.zip,
      demo: '',
      email: values.email,
      hauling_contract: false,
      hauling_expiration: '',
      stage: 'Lead',
      geo_location: [],
      is_active: true,
      contacts: [],
      conversion: new Date(),
      national: false,
      referral: false,
      referral_group_id: '',
      notes: [values.notes],
      drawerIsVisible: false,
      createdAt: '',
      updatedAt: '',
    };

    return account;
  };

  async function postNewAccount() {
    const account = await getFormData();

    await fetch(`${Configs.TCMC_URI}/api/accounts`, {
      method: 'POST',
      headers: {'Content-Type': 'application/json', 'x-access-token': token},
      body: JSON.stringify(account),
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
  }

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
            value={values.notes}
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

export default CreateAccountModal;
