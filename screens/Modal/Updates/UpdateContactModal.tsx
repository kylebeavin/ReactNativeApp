import React, {useContext, useEffect, useRef, useState} from 'react';
import {StyleSheet, View, Text, TextInput, ScrollView} from 'react-native';
import {Picker} from '@react-native-picker/picker';

import Colors from '../../../constants/Colors';
import Configs from '../../../constants/Configs';
import {ContactType, Status} from '../../../types/enums';
import {SMT_User} from '../../../types/index';
import {Contact} from '../../../types/crm';
import ModalButtons from '../ModalButtons';
import Layout from '../../../constants/Layout';
import AppContext from '../../../providers/AppContext';
import AppTextInput from '../../../components/Layout/AppTextInput';
import {isEmail, isRequired} from '../../../utils/Validators';
import {ToastContext} from '../../../providers/ToastProvider';
import useForm from '../../../hooks/useForm';

interface Props {
  navigation: any;
  contact: Contact;
}

const UpdateContactModal: React.FC<Props> = ({navigation, contact}) => {
  //#region Form Initializers
  const formValues = {
    name: contact.first_name,
    email: contact.email,
    phone: contact.phone,
    role: contact.type,
    owner: contact.owner_id,
    status: contact.is_active,
    notes: '',
  };

  const formErrors = {
    name: [],
    email: [],
    phone: [],
    role: [],
    owner: [],
    status: [],
    notes: [],
  };

  const formValidations = {
    name: [isRequired],
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
    updateContact,
  );
  const {show} = useContext(ToastContext);

  // Drop downs
  const [ownerList, setOwnerList] = useState<SMT_User[]>();
  //#endregion

  useEffect(() => {
    // Fetch Dropdowns
    const ownerList = getOwnersDropDown();
    ownerList
      .then((data) => {
        setOwnerList(data);
      })
      .catch((err) => console.log(err));
  }, []);

  const getFormData = async () => {
    const updatedContact: Contact = {
      _id: contact._id,
      first_name: values.name,
      last_name: contact.last_name,
      type: values.role,
      account_id: contact.account_id,
      phone: values.phone,
      email: values.email,
      owner_id: values.owner,
      created: contact.created,
      is_active: values.status === 'Active' ? true : false,
      method: contact.method,
    };
    return updatedContact;
  };

  const getOwnersDropDown = async (): Promise<SMT_User[]> => {
    let userList: SMT_User[] = [];

    await fetch(`${Configs.TCMC_URI}/api/usersBy`, {
      method: 'POST',
      body: JSON.stringify({group_id: grpId}),
      headers: {'Content-Type': 'application/json', 'x-access-token': token},
    })
      .then((res) => {
        console.log(res.status);
        return res.json();
      })
      .then((json) => (userList = json.data))
      .catch((err) => console.log(err));

    return userList;
  };

  async function updateContact() {
    const contact = await getFormData();

    const data = await fetch(
      `${Configs.TCMC_URI}/api/contacts/${contact._id}`,
      {
        method: 'PUT',
        body: JSON.stringify(contact),
        headers: {'Content-Type': 'application/json', 'x-access-token': token},
      },
    )
      .then((res) => res.json())
      .then((data) => data)
      .catch((err) => {
        // ToDo: Come up with error handling strategy.
        console.log(err);
        return err;
      });

    navigation.navigate('AccountsScreen');

    return data;
  }

  return (
    <View>
      <ScrollView style={styles.form}>
        {/* Name */}
        <AppTextInput
          label="Contact Name"
          name="name"
          value={values.name}
          onChange={(val) => handleChange('name', val)}
          validations={[isRequired]}
          errors={errors.name}
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
          label="Phone"
          name="phone"
          value={values.phone}
          onChange={(val) => handleChange('phone', val)}
          validations={[isRequired]}
          errors={errors.phone}
          setErrors={setErrors}
        />

        {/* Email */}
        <AppTextInput
          label="Email"
          name="email"
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
      </ScrollView>
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

export default UpdateContactModal;
