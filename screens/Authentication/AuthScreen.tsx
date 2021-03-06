import React, {useContext} from 'react';
import {StyleSheet, View, Image} from 'react-native';

import Colors from '../../constants/Colors';
import AppButton from '../../components/layout/AppButton';
import Configs from '../../constants/Configs';
import Layout from '../../constants/Layout';
import AppContext from '../../providers/AppContext';
import {ToastContext} from '../../providers/ToastProvider';
import { isEmail, isRequired } from '../../utils/Validators';
import useForm from '../../hooks/useForm';
import AppTextInput from '../../components/layout/AppTextInput';
import { isSuccessStatusCode } from '../../utils/Helpers';

interface Props {
}

const AuthScreen: React.FC<Props> = () => {
    //#region Form Initializers
    const formValues = {
      email: 'kyle.beavin@tcmcllc.com',
      password: 'password123',
    };
    const formErrors = {
      email: [],
      password: [],
    };
    const formValidations = {
      email: [isRequired, isEmail],
      password: [isRequired],
    };
    //#endregion

  //#region State Variables
  const {setId, setIsAuth, setToken, setGrpId, setDisplayName, setGrpArr, setRole, setImage} = useContext(AppContext);
  const {show} = useContext(ToastContext);
  const {handleChange, handleSubmit, values, errors, setErrors} = useForm(
    formValues,
    formErrors,
    formValidations,
    signIn,
  );
  //#endregion

  async function signIn() {
    let user = {
      email: values.email,
      password: values.password,
    };

    await fetch(`${Configs.TCMC_URI}/api/login`, {
      method: 'POST',
      body: JSON.stringify(user),
      headers: {'Content-type': 'application/json; charset=UTF-8'},
    })
      .then((res) => res.json())
      .then((json) => {
        if (isSuccessStatusCode(json.status)) {
          setToken(json.data.token);
          setGrpArr(json.data.group_id);
          setGrpId(json.data.group_id[0]);
          setId(json.data._id);
          setDisplayName(json.data.display_name);
          setRole(json.data.role[0]);
          setImage(json.data.image);
          setIsAuth(true);
        } else {
          show({message: 'Login Failed.'});
        }
      })
      .catch((err) => show({message: 'Error: ' + err.message}));
  };

  return (
    <View style={styles.container}>

      {/* Image Container */}
      <View style={styles.imageContainer}>
        <Image 
          style={styles.image}
          source={require('../../assets/images/smt_logo.png')}
        />
      </View>

      <View style={styles.form}>
        {/* Email Address */}
        <AppTextInput
          containerStyle={{flex: 0}}
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
          containerStyle={{flex: 0}}
          label='Password'
          name='password'
          secureTextEntry={true}
          value={values.password}
          onChange={(val) => handleChange('password', val)}
          validations={[isRequired]}
          errors={errors.password}
          setErrors={setErrors}
        />

        {/* Buttons */}
        <View style={styles.buttonContainer}>
          <View style={styles.button}>
            <AppButton title='Log In' onPress={handleSubmit} backgroundColor={Colors.SMT_Primary_1}/>
          </View>
        </View>
      </View>
    
    </View>
  );
};

const styles = StyleSheet.create({
  buttonContainer: {
    alignItems: 'center',
  },
  button: {
    width: 100,
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: 10,
    backgroundColor: Colors.SMT_Secondary_1_Light_1,
  },
  form: {
    flex: 1,
    width: '60%',
    justifyContent: 'center',
    alignContent: 'center',
  },
  image: {
    width: Layout.window.width,
    height: 300,
    marginBottom: 5,
  },
  imageContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.SMT_Tertiary_1,
    elevation: 1,
  },
});

export default AuthScreen;
