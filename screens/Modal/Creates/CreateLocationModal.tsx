import React, {useContext, useEffect, useRef, useState} from 'react';
import {Picker} from '@react-native-picker/picker';
import {StyleSheet, View, Text, TextInput, ScrollView} from 'react-native';
import {useNavigation} from '@react-navigation/native';

import Colors from '../../../constants/Colors';
import Configs from '../../../constants/Configs';
import {Location, Account} from '../../../types/crm';
import ModalButtons from '../ModalButtons';
import {isSuccessStatusCode} from '../../../utils/Helpers';
import AppContext from '../../../providers/AppContext';
import {ToastContext} from '../../../providers/ToastProvider';
import useForm from '../../../hooks/useForm';
import {isRequired} from '../../../utils/Validators';
import AppTextInput from '../../../components/Layout/AppTextInput';

interface Props {}

const CreateLocationModal: React.FC<Props> = () => {
  //#region Form Initializers
  const formValues = {
    account: '',
    name: '',
    street: '',
    city: '',
    state: '',
    zip: '',
    notes: '',
  };

  const formErrors = {
    account: [],
    name: [],
    street: [],
    city: [],
    state: [],
    zip: [],
    notes: [],
  };

  const formValidations = {
    account: [isRequired],
    name: [isRequired],
    street: [isRequired],
    city: [isRequired],
    state: [isRequired],
    zip: [isRequired],
    notes: [],
  };
  //#endregion

  //#region === Use State Variables ===//
  const navigation = useNavigation();
  const {grpId, token} = useContext(AppContext);
  const {handleChange, handleSubmit, values, errors, setErrors} = useForm(
    formValues,
    formErrors,
    formValidations,
    postNewLocation,
  );
  const {show} = useContext(ToastContext);
  // Drop downs
  const [accountList, setAccountList] = useState<Account[]>();
  //#endregion

  useEffect(() => {
    // Set State

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
      headers: {'Content-Type': 'application/json', 'x-access-token': token},
      body: JSON.stringify({group_id: grpId}),
    })
      .then((res) => {
        console.log(res.status);
        return res.json();
      })
      .then((json) => (accountsList = json.data))
      .catch((err) => show({message: err.message}));
    return accountsList;
  };

  const getFormData = async () => {
    const location: Location = {
      _id: '',
      account_id: values.account,
      location_name: values.name,
      address_street: values.street,
      address_city: values.city,
      address_state: values.state,
      address_zip: values.zip,
      created: '',
      is_active: true,
      group_id: grpId,
    };
    return location;
  };

  async function postNewLocation() {
    const location = await getFormData();

    await fetch(`${Configs.TCMC_URI}/api/locations`, {
      method: 'POST',
      body: JSON.stringify(location),
      headers: {'Content-Type': 'application/json', 'x-access-token': token},
    })
      .then((res) => {
        console.log(res.status);
        return res.json();
      })
      .then((data) => {
        if (isSuccessStatusCode(data.status)) {
          show({message: data.message});
          navigation.navigate('MapScreen');
        } else {
          show({message: data.message});
        }
      })
      .catch((err) => show({message: err.message}));
  }

  return (
    <View>
      <ScrollView style={styles.form}>
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
        <View style={styles.fieldContainer}>
          <Text style={styles.text}>Account</Text>
          <View style={styles.picker}>
            <Picker
              selectedValue={values.account}
              onValueChange={(itemValue, ItemIndex) =>
                handleChange('account', itemValue.toString())
              }>
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
      </ScrollView>
      <ModalButtons navigation={navigation} save={handleSubmit} />
    </View>
  );
};

const styles = StyleSheet.create({
  form: {
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
    //paddingVertical: 5,
    borderColor: Colors.SMT_Secondary_1_Light_1,
    borderWidth: 2,
    borderRadius: 3,
  },
});

export default CreateLocationModal;
