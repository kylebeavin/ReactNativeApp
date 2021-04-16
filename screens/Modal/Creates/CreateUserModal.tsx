import React, {useContext} from 'react';
import {StyleSheet, View, ScrollView, Text} from 'react-native';
import {useNavigation} from '@react-navigation/native';

import Colors from '../../../constants/Colors';
import Layout from '../../../constants/Layout';
import ModalButtons from '../ModalButtons';
import useForm from '../../../hooks/useForm';
import {isEmail, isRequired} from '../../../utils/Validators';
import AppContext from '../../../providers/AppContext';
import {ToastContext} from '../../../providers/ToastProvider';
import Configs from '../../../constants/Configs';
import {isSuccessStatusCode} from '../../../utils/Helpers';
import AppTextInput from '../../../components/layout/AppTextInput';
import {SMT_Roles} from '../../../types/enums';
import {Picker} from '@react-native-picker/picker';
import {SMT_User} from '../../../types';
import AppPicker from '../../../components/layout/AppPicker';

const CreateUserModal = () => {
  //#region Form Initializers
  const formValues = {
    first_name: '',
    last_name: '',
    email: '',
    password: '',
    token: '',
    role: SMT_Roles.corporate.toString(),
    group_id: '',
    created: '',
    is_active: true,
  };
  const formErrors = {
    first_name: [],
    last_name: [],
    email: [],
    password: [],
    token: [],
    role: [],
    group_id: [],
    created: [],
    is_active: [],
  };
  const formValidations = {
    first_name: [isRequired],
    last_name: [isRequired],
    email: [isRequired, isEmail],
    password: [isRequired],
    token: [],
    role: [isRequired],
    group_id: [],
    created: [],
    is_active: [],
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
    postNewUser,
  );
  //#endregion

  const getFormData = async () => {
    const user: SMT_User = {
      _id: '',
      first_name: values.first_name,
      last_name: values.last_name,
      email: values.email,
      password: values.password,
      token: '',
      image: '',
      role: values.role,
      group_id: grpId,
      created: values.created,
      is_active: values.is_active,
    };
    return user;
  };

  async function postNewUser() {
    const driver: SMT_User = await getFormData();
    await fetch(`${Configs.TCMC_URI}/api/users`, {
      method: 'POST',
      body: JSON.stringify(driver),
      headers: {'Content-Type': 'application/json', 'x-access-token': token},
    })
      .then((res) => res.json())
      .then((data) => {
        if (isSuccessStatusCode(data.status)) {
          show({message: data.message});
          navigation.navigate('RoutesScreen');
        } else {
          show({message: data.message});
        }
      })
      .catch((err) => show({message: err.message}));
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

        {/* Password */}
        <AppTextInput
          label='Password'
          name='password'
          value={values.password}
          onChange={(val) => handleChange('password', val)}
          validations={[isRequired]}
          errors={errors.password}
          setErrors={setErrors}
        />

        {/* Role */}
        <AppPicker
          label='Role'
          name='role'
          value={values.role}
          list={Object.values(SMT_Roles).map(u => {return {_id: u, label: u, value: u}})}
          onChange={(itemValue) => handleChange('role', itemValue.toString())}
          validations={[]}
          errors={errors.role}
          setErrors={setErrors}
        />
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
  picker: {
    paddingLeft: 15,
    borderColor: Colors.SMT_Secondary_1_Light_1,
    borderWidth: 2,
    borderRadius: 3,
  },
});

export default CreateUserModal;
