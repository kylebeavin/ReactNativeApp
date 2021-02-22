import React, {useContext, useRef, useState} from 'react';
import {StyleSheet, View, Text, Image, TextInput} from 'react-native';

import Colors from '../../constants/Colors';
import AppButton from '../../components/Layout/AppButton';
import Configs from '../../constants/Configs';
import Layout from '../../constants/Layout';
import Ionicons from 'react-native-vector-icons/Ionicons';
import AppContext from '../../providers/AppContext';
import {isValidEmail, isValidPassword} from '../../utils/Helpers';
import {ToastContext} from '../../providers/ToastProvider';

interface Props {
}

const AuthScreen: React.FC<Props> = () => {
  //#region State Variables
  const [email, setEmail] = useState('kyle.beavin@tcmcllc.com');
  const [password, setPassword] = useState('password123');
  const [emailValidator, setEmailValidator] = useState({isValid: false, message: '', isVisible: false});
  const [passwordValidator, setPasswordValidator] = useState({isValid: false, message: '', isVisible: false});
  const {setId, setIsAuth, setToken, setGrpId, setDisplayName, setGrpArr, setRole} = useContext(AppContext);
  const {show} = useContext(ToastContext);

  const emailRef = useRef<TextInput>(null);
  const passwordRef = useRef<TextInput>(null);
  //#endregion

  const signIn = async () => {
    let user = {
      email: email,
      password: password,
    };

    await fetch(`${Configs.TCMC_URI}/api/login`, {
      method: 'POST',
      body: JSON.stringify(user),
      headers: {'Content-type': 'application/json; charset=UTF-8'},
    })
      .then((res) => res.json())
      .then((json) => {
        if (json.auth) {
          setToken(json.data.token);
          setGrpArr(json.data.group_id);
          setGrpId(json.data.group_id[0])
          setId(json.data._id);
          setDisplayName(json.data.display_name);
          setRole(json.data.role[0]);
          setIsAuth(true);
        } else {
          show({message: 'Login Failed.'}); // ToDo: need to update response json to provide message.
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
          source={require("../../assets/images/smt_logo.png")}
        />
      </View>

      <View style={styles.form}>
        {/* Email Address */}
        <View style={styles.fieldContainer}>
          <Text style={styles.text}>Email Address</Text>
          <TextInput
            style={styles.textInput}
            ref={emailRef}
            value={email}
            onChange={(text) => setEmail(text.nativeEvent.text)}
            returnKeyType="next"
            onSubmitEditing={() => {
              let test = isValidEmail(email.trim());
              if (test.isValid) {
                setEmailValidator({
                  isValid: true,
                  message: test.message,
                  isVisible: false,
                });
                return passwordRef.current!.focus();
              } else {
                setEmailValidator({
                  isValid: false,
                  message: test.message,
                  isVisible: true,
                });
                return emailRef.current!.focus();
              }
            }}
            blurOnSubmit={false}
          />
          <View style={emailValidator.isVisible ? {opacity: 1} : {opacity: 0}}>
            <Text style={{color: Colors.SMT_Primary_1}}>
              {emailValidator.message}
            </Text>
          </View>
        </View>

        {/* Password */}
        <View style={[styles.fieldContainer, {marginBottom: 20}]}>
          <Text style={styles.text}>Password</Text>
          <TextInput
            style={styles.textInput}
            secureTextEntry={true}
            ref={passwordRef}
            value={password}
            onChange={(text) => setPassword(text.nativeEvent.text)}
            onSubmitEditing={() => {
              let test = isValidPassword(password.trim());
              if (test.isValid) {
                setPasswordValidator({
                  isValid: true,
                  message: test.message,
                  isVisible: false,
                });
              } else {
                setPasswordValidator({
                  isValid: false,
                  message: test.message,
                  isVisible: true,
                });
              }
            }}
          />
          <View
            style={passwordValidator.isVisible ? {opacity: 1} : {opacity: 0}}>
            <Text style={{color: Colors.SMT_Primary_1}}>
              {passwordValidator.message}
            </Text>
          </View>
        </View>

        {/* Buttons */}
        <View style={styles.buttonContainer}>
          <View style={styles.button}>
            <AppButton title="Log In" onPress={() => signIn()} />
          </View>
        </View>
      </View>

      {/* Need Help? */}
      <View style={styles.needHelpContainer}>
        <Text style={{marginLeft: 15}}>
          Need Help?{' '}
          <Text
            style={{
              color: Colors.SMT_Secondary_2_Light_1,
              borderBottomColor: Colors.SMT_Secondary_2_Light_1,
              textDecorationLine: 'underline',
            }}>
            Contact Us
          </Text>
        </Text>
        <View style={{flex: 1, alignItems: 'flex-end'}}>
          <Ionicons style={styles.helpIcon} name="ios-help-circle" />
        </View>
      </View>
    
    </View>
  );
};

const styles = StyleSheet.create({
  buttonContainer: {
    //flex: 1,
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
  fieldContainer: {
    marginBottom: 10,
  },
  helpIcon: {
    fontSize: 40,
    color: Colors.SMT_Secondary_1,
    marginTop: -20,
    marginRight: 20,
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
  needHelpContainer: {
    width: '100%',
    flexDirection: 'row',
  },
  title: {
    fontWeight: 'bold',
    fontSize: 35,
    color: 'black',
  },
  text: {
    fontWeight: 'bold',
    color: 'black',
  },
  textInput: {
    paddingLeft: 15,
    paddingVertical: 5,
    borderColor: Colors.SMT_Secondary_1_Light_1,
    //borderWidth: 2,
    borderRadius: 3,
    backgroundColor: Colors.SMT_Tertiary_1,
    elevation: 1,
  },
});

export default AuthScreen;
