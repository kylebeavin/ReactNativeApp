import React, {useContext, useEffect, useRef, useState} from 'react';
import {StyleSheet, View, Text, TextInput, ScrollView} from 'react-native';
import {Picker} from '@react-native-picker/picker';

import Colors from '../../../constants/Colors';
import Configs from '../../../constants/Configs';
import {ContactType, Status} from '../../../types/enums';
import {SMT_User} from '../../../types/index';
import {Contact, Account} from '../../../types/crm';
import ModalButtons from '../ModalButtons';
import Layout from '../../../constants/Layout';
import AppContext from '../../../providers/AppContext';
import {isRequired, isEmail} from '../../../utils/Validators';
import {ToastContext} from '../../../providers/ToastProvider';
import AppTextInput from '../../../components/Layout/AppTextInput';
import useForm from '../../../hooks/useForm';
import {isSuccessStatusCode} from '../../../utils/Helpers';

interface Props {
  navigation: any;
  account: Account;
}

const CreateContactModal: React.FC<Props> = ({navigation, account}) => {
  //#region Form Initializers
  const formValues = {
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    role: '',
    owner: '',
    status: '',
    notes: '',
  };

  const formErrors = {
    first_name: [],
    last_name: [],
    email: [],
    phone: [],
    role: [],
    owner: [],
    status: [],
    notes: [],
  };

  const formValidations = {
    first_name: [isRequired],
    last_name: [isRequired],
    email: [isRequired, isEmail],
    phone: [isRequired],
    role: [isRequired],
    owner: [isRequired],
    status: [isRequired],
    notes: [],
  };

  //#endregion

  //#region === Use State Variables ===//
  const {grpId, token} = useContext(AppContext);
  const {handleChange, handleSubmit, values, errors, setErrors} = useForm(
    formValues,
    formErrors,
    formValidations,
    postNewContact,
  );
  const {show} = useContext(ToastContext);

  // Drop downs
  const [ownerList, setOwnerList] = useState<SMT_User[]>();
  //#endregion

  useEffect(() => {
    // Fetch Dropdowns on page load.

    // Fetch Users by group id
    getOwnersDropDown()
      .then((data) => {
        setOwnerList(data);
      })
      .catch((err) => show({message: err.message}));
  }, []);

  const getFormData = async () => {
    const contact: Contact = {
      _id: '',
      first_name: values.first_name,
      last_name: values.last_name,
      type: values.role,
      account_id: account._id,
      phone: values.phone,
      email: values.email,
      owner_id: values.owner,
      createdAt: '',
      is_active: values.status === 'Active' ? true : false,
      method: 'email',
    };

    return contact;
  };

  const getOwnersDropDown = async (): Promise<SMT_User[]> => {
    let userList: SMT_User[] = [];

    await fetch(`${Configs.TCMC_URI}/api/usersBy`, {
      method: 'POST',
      body: JSON.stringify({group_id: { $in: [`mongoose.Types.ObjectId(${grpId}`]}}),
      headers: {'Content-Type': 'application/json', 'x-access-token': token},
    })
      .then((res) => res.json())
      .then((json) => (userList = json.data))
      .catch((err) => show({message: err.message}));

    return userList;
  };

  async function postNewContact() {
    const contact = await getFormData();

    await fetch(`${Configs.TCMC_URI}/api/contacts`, {
      method: 'POST',
      body: JSON.stringify(contact),
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
  }

  return (
    <View>
      <ScrollView style={styles.form}>
        {/* First Name */}
        <AppTextInput
          label='First Name'
          name='first_name'
          value={values.first_name}
          onChange={(val) => handleChange('first_name', val)}
          validations={[isRequired]}
          errors={errors.first_name}
          setErrors={setErrors}
        />

        {/* Last Name */}
        <AppTextInput
          label='Last Name'
          name='last_name'
          value={values.last_name}
          onChange={(val) => handleChange('last_name', val)}
          validations={[isRequired]}
          errors={errors.last_name}
          setErrors={setErrors}
        />

        {/* Role */}
        <View style={styles.fieldContainer}>
          <Text style={styles.text}>ROLE</Text>
          <View style={styles.picker}>
            <Picker
              selectedValue={values.role}
              onValueChange={(itemValue, itemIndex) =>
                handleChange('role', itemValue.toString())
              }>
              {Object.values(ContactType).map((item, index) => {
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

        {/* Phone */}
        <AppTextInput
          label='Phone'
          name='phone'
          value={values.phone}
          onChange={(val) => handleChange('phone', val)}
          validations={[isRequired]}
          errors={errors.phone}
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

        {/* Owner */}
        <View style={styles.fieldContainer}>
          <Text style={styles.text}>CONTACT OWNER</Text>
          <View style={styles.picker}>
            <Picker
              selectedValue={values.owner}
              onValueChange={(itemValue, ItemIndex) =>
                handleChange('owner', itemValue.toString())
              }>
              {ownerList?.map((item, index) => {
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

        {/* Status */}
        <View style={styles.fieldContainer}>
          <Text style={styles.text}>CONTACT STATUS</Text>
          <View style={styles.picker}>
            <Picker
              selectedValue={values.status}
              onValueChange={(itemValue, itemIndex) =>
                handleChange('status', itemValue.toString())
              }>
              <Picker.Item
                label={Status.active}
                value={Status.active.toString()}
              />
              <Picker.Item
                label={Status.inactive}
                value={Status.inactive.toString()}
              />
            </Picker>
          </View>
        </View>

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

export default CreateContactModal;
