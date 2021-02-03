import {useNavigation} from '@react-navigation/native';
import React, {useContext, useState} from 'react';
import {StyleSheet, View, ScrollView} from 'react-native';
import AppTextInput from '../../../components/Layout/AppTextInput';

import Colors from '../../../constants/Colors';
import Configs from '../../../constants/Configs';
import Layout from '../../../constants/Layout';
import AppContext from '../../../providers/AppContext';
import {ToastContext} from '../../../providers/ToastProvider';
import {Account} from '../../../types/crm';
import {isSuccessStatusCode} from '../../../utils/Helpers';
import ModalButtons from '../ModalButtons';

const defaultValues = {
  name: '',
  email: '',
  street: '',
  city: '',
  state: '',
  zip: '',
  notes: ''
}

const defaultErrors = {
  name: [],
  email: [],
  street: [],
  city: [],
  state: [],
  zip: [],
  notes: []
}

const isRequired = (val: string) => {
  return val.length > 0 ? '' : 'Can not be blank';
};

const isEmail = (val: string) => {
  const ai = val.indexOf("@");
  const gdi = val.split("").reduce((acc:any, char: any, i: any) => char === "." ? i : acc, 0);
  return ai > -1 && gdi > ai ? "" : "Must be an email";
};

const CreateAccountModal = () => {
  //#region State Variables
  const navigation = useNavigation();

  const {grpId, token, id, displayName} = useContext(AppContext);
  const {show} = useContext(ToastContext);
  
  const [values, setValues] = useState(defaultValues);
  const [errors, setErrors] = useState(defaultErrors);
  
  // const nameRef = useRef<TextInput>(null);
  // const emailRef = useRef<TextInput>(null);
  // const streetRef = useRef<TextInput>(null);
  // const cityRef = useRef<TextInput>(null);
  // const stateRef = useRef<TextInput>(null);
  // const zipRef = useRef<TextInput>(null);
  // const notesRef = useRef<TextInput>(null);
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
      created: '',
      demo: '',
      email: values.email,
      hauling_contract: false,
      hauling_expiration: '',
      stage: 'Lead',
      geo_location: '',
      is_active: true,
      contacts: [],
      conversion: new Date(),
      national: false,
      referral: false,
      referral_group_id: '',
      notes: [values.notes],
      drawerIsVisible: false,
    };

    return account;
  };

  const postNewAccount = async () => {
    const account = await getFormData();
    
    if (false){
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
    } else {
      show({message: "Validation error."});
    }
  };

  return (
    <View>
      <ScrollView style={styles.form}>

        {/* Name */}
        <AppTextInput
          label="Name"
          name="name"
          value={values.name}
          onChange={(val) => {
            const name = val;
            setValues((prev) => ({
              ...prev,
              name,
            }))
          }}
          validations={[isRequired]}
          errors={errors.name}
          setErrors={setErrors}
        />

        {/* Email */}
        <AppTextInput
          label="Email"
          name="email"
          value={values.email}
          onChange={(val) => {
            const email = val;
            setValues((prev) => ({
              ...prev,
              email,
            }))
          }}
          validations={[isRequired, isEmail]}
          errors={errors.email}
          setErrors={setErrors}
        />

        {/* Street */}
        <AppTextInput
          label="Street"
          name="street"
          value={values.street}
          onChange={(val) => {
            const street = val;
            setValues((prev) => ({
              ...prev,
              street,
            }))
          }}
          validations={[isRequired]}
          errors={errors.street}
          setErrors={setErrors}
        />

        {/* City */}
        <AppTextInput
          label="City"
          name="city"
          value={values.city}
          onChange={(val) => {
            const city = val;
            setValues((prev) => ({
              ...prev,
              city,
            }))
          }}
          validations={[isRequired]}
          errors={errors.city}
          setErrors={setErrors}
        />

        {/* State */}
        <AppTextInput
          label="State"
          name="state"
          value={values.state}
          onChange={(val) => {
            const state = val;
            setValues((prev) => ({
              ...prev,
              state,
            }))
          }}
          validations={[isRequired]}
          errors={errors.state}
          setErrors={setErrors}
        />

        {/* Zip */}
        <AppTextInput
          label="Zip"
          name="zip"
          value={values.zip}
          onChange={(val) => {
            const zip = val;
            setValues((prev) => ({
              ...prev,
              zip,
            }))
          }}
          validations={[isRequired]}
          errors={errors.zip}
          setErrors={setErrors}
        />

        {/* Notes */}
        <View style={{marginBottom: 40}}>
        <AppTextInput
          label="Notes"
          name="notes"
          value={values.notes}
          onChange={(val) => {
            const notes = val;
            setValues((prev) => ({
              ...prev,
              notes,
            }))
          }}
          validations={[]}
          errors={errors.notes}
          setErrors={setErrors}
          multiline
        />
        </View>

      </ScrollView>

      {/* Buttons */}
      <ModalButtons navigation={navigation} save={() => postNewAccount()} />
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
  }
});

export default CreateAccountModal;
