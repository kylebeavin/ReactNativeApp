import {useNavigation} from '@react-navigation/native';
import React, {useContext, useRef, useState} from 'react';
import {StyleSheet, View, Text, TextInput, ScrollView} from 'react-native';

import Colors from '../../../constants/Colors';
import Configs from '../../../constants/Configs';
import Layout from '../../../constants/Layout';
import useAsyncStorage from '../../../hooks/useAsyncStorage';
import AppContext from '../../../providers/AppContext';
import {ToastContext} from '../../../providers/ToastProvider';
import { IValidator, Validator } from '../../../types';
import {Account} from '../../../types/crm';
import {
  getRequestHeadersAsync,
  isSuccessStatusCode,
  isValidEmail,
} from '../../../utils/Helpers';
import ModalButtons from '../ModalButtons';

interface Props {}

const CreateAccountModal: React.FC<Props> = () => {
  //#region State Variables
  const navigation = useNavigation();
  const {grpId, token, id, displayName} = useContext(AppContext);
  const {show} = useContext(ToastContext);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [street, setStreet] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [zip, setZip] = useState('');
  const [notes, setNotes] = useState('');

  const [nameValidator, setNameValidator] = useState(new Validator());
  const [emailValidator, setEmailValidator] = useState(new Validator());
  const [streetValidator, setStreetValidator] = useState(new Validator());
  const [cityValidator, setCityValidator] = useState(new Validator());
  const [stateValidator, setStateValidator] = useState(new Validator());
  const [zipValidator, setZipValidator] = useState(new Validator());
  const [notesValidator, setNotesValidator] = useState(new Validator());

  const nameRef = useRef<TextInput>(null);
  const emailRef = useRef<TextInput>(null);
  const streetRef = useRef<TextInput>(null);
  const cityRef = useRef<TextInput>(null);
  const stateRef = useRef<TextInput>(null);
  const zipRef = useRef<TextInput>(null);
  const notesRef = useRef<TextInput>(null);
  //#endregion

  const getFormData = async () => {
    const account: Account = {
      _id: '',
      group_id: grpId,
      owner_id: id,
      owner_name: displayName,
      account_name: name,
      address_street: street,
      address_city: city,
      address_state: state,
      address_zip: zip,
      created: '',
      demo: '',
      email: email,
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
      notes: [notes],
      drawerIsVisible: false,
    };

    return account;
  };

  const postNewAccount = async () => {
    const account = await getFormData();
    const validator = validateAccountForm(account);
    
    if (validator.isValid){
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

  const validateAccountForm = (account: Account) : IValidator => {
    let validator : IValidator = new Validator();
    validator.isVisible = true;
    let emailObj = isValidEmail(email);

    if (!account) return validator;
    if (!name || name.trim().length === 0) {
      setNameValidator({isVisible: true, isValid: false, message: "Name required."})
    } else {
      setNameValidator({isValid: true, message: "", isVisible: false});
    }
    if (emailObj.isValid) {
      setEmailValidator({isValid: true, message: emailObj.message, isVisible: false});
    } else {
      setEmailValidator({isValid: false, message: emailObj.message, isVisible: true})
    }
    if (!street || street.trim().length === 0) {
      setStreetValidator({isValid: false, message: "Street required.", isVisible: true})
    } else {
      setStreetValidator({isValid: true, message: "", isVisible: false})
    }
    if (!city || city.trim().length === 0) {
      setCityValidator({isValid: false, message: "City required.", isVisible: true})
    } else {
      setCityValidator({isValid: true, message: "", isVisible: false})
    }
    if (!state || state.trim().length === 0) {
      setStateValidator({isValid: false, message: "State required.", isVisible: true})
    } else {
      setStateValidator({isValid: true, message: "", isVisible: false})
    }    
    if (!zip || zip.trim().length === 0) {
      setZipValidator({isValid: false, message: "Zip required.", isVisible: true})
    } else {
      setZipValidator({isValid: true, message: "", isVisible: false})
    }

    if (!nameValidator.isVisible && !emailValidator.isVisible && !streetValidator.isVisible && !cityValidator.isVisible && !stateValidator.isVisible && !zipValidator.isVisible) {
        validator.isValid = true;
    }

    return validator;
  }

  return (
    <View>
      <ScrollView style={styles.form}>
        {/* Name */}
        <View style={styles.fieldContainer}>
          <Text style={styles.text}>Name</Text>
          <TextInput
            style={nameValidator.isVisible ? [styles.textInput, {borderBottomColor: Colors.SMT_Primary_1}] : styles.textInput} 
            ref={nameRef}
            value={name}
            onChange={(text) => setName(text.nativeEvent.text)}
            returnKeyType="next"
            onSubmitEditing={() => {
              if (!name || name.trim().length === 0) {
                setNameValidator({isVisible: true, isValid: false, message: "Name required."})
              } else {
                setNameValidator({isValid: true, message: "", isVisible: false});
              }
              return emailRef.current!.focus();
            }}
            blurOnSubmit={false}
          />
          <View style={nameValidator.isVisible ? {opacity: 1} : {opacity: 0}}>
            <Text style={{color: Colors.SMT_Primary_1}}>
              {nameValidator.message}
            </Text>
          </View>
        </View>

        {/* Email Address */}
        <View style={styles.fieldContainer}>
          <Text style={styles.text}>Email Address</Text>
          <TextInput
            style={emailValidator.isVisible ? [styles.textInput, {borderBottomColor: Colors.SMT_Primary_1}] : styles.textInput} 
            ref={emailRef}
            value={email}
            onChange={(text) => setEmail(text.nativeEvent.text)}
            returnKeyType="next"
            onSubmitEditing={() => {
              let test = isValidEmail(email.trim());
              if (test.isValid) {
                setEmailValidator({isValid: true, message: test.message, isVisible: false});
              } else {
                setEmailValidator({isValid: false, message: test.message, isVisible: true})
              }
              return streetRef.current!.focus();
            }}
            blurOnSubmit={false}
          />
          <View style={emailValidator.isVisible ? {opacity: 1} : {opacity: 0}}>
            <Text style={{color: Colors.SMT_Primary_1}}>
              {emailValidator.message}
            </Text>
          </View>
        </View>

        {/* Street Address */}
        <View style={styles.fieldContainer}>
          <Text style={styles.text}>Street Address</Text>
          <TextInput
            style={streetValidator.isVisible ? [styles.textInput, {borderBottomColor: Colors.SMT_Primary_1}] : styles.textInput} 
            ref={streetRef}
            value={street}
            onChange={(text) => setStreet(text.nativeEvent.text)}
            returnKeyType="next"
            onSubmitEditing={() => {
              if (!street || street.trim().length === 0) {
                setStreetValidator({isValid: false, message: "Street required.", isVisible: true})
              } else {
                setStreetValidator({isValid: true, message: "", isVisible: false})
              }
              return cityRef.current!.focus();
            }}
            blurOnSubmit={false}
          />
          <View style={streetValidator.isVisible ? {opacity: 1} : {opacity: 0}}>
            <Text style={{color: Colors.SMT_Primary_1}}>
              {streetValidator.message}
            </Text>
          </View>
        </View>

        {/* City */}
        <View style={styles.fieldContainer}>
          <Text style={styles.text}>City</Text>
          <TextInput
            style={cityValidator.isVisible ? [styles.textInput, {borderBottomColor: Colors.SMT_Primary_1}] : styles.textInput} 
            ref={cityRef}
            value={city}
            onChange={(text) => setCity(text.nativeEvent.text)}
            returnKeyType="next"
            onSubmitEditing={() => {
              if (!city || city.trim().length === 0) {
                setCityValidator({isValid: false, message: "City required.", isVisible: true})
              } else {
                setCityValidator({isValid: true, message: "", isVisible: false})
              }
              return stateRef.current!.focus();
            }}
            blurOnSubmit={false}
          />
          <View style={cityValidator.isVisible ? {opacity: 1} : {opacity: 0}}>
            <Text style={{color: Colors.SMT_Primary_1}}>
              {cityValidator.message}
            </Text>
          </View>
        </View>

        {/* State */}
        <View style={styles.fieldContainer}>
          <Text style={styles.text}>State</Text>
          <TextInput
            style={stateValidator.isVisible ? [styles.textInput, {borderBottomColor: Colors.SMT_Primary_1}] : styles.textInput} 
            ref={stateRef}
            value={state}
            onChange={(text) => setState(text.nativeEvent.text)}
            returnKeyType="next"
            onSubmitEditing={() => {
              if (!state || state.trim().length === 0) {
                setStateValidator({isValid: false, message: "State required.", isVisible: true})
              } else {
                setStateValidator({isValid: true, message: "", isVisible: false})
              }
              return zipRef.current!.focus();
            }}
            blurOnSubmit={false}
          />
          <View style={stateValidator.isVisible ? {opacity: 1} : {opacity: 0}}>
            <Text style={{color: Colors.SMT_Primary_1}}>
              {stateValidator.message}
            </Text>
          </View>
        </View>

        {/* Zip */}
        <View style={styles.fieldContainer}>
          <Text style={styles.text}>Zip</Text>
          <TextInput
            style={zipValidator.isVisible ? [styles.textInput, {borderBottomColor: Colors.SMT_Primary_1}] : styles.textInput} 
            ref={zipRef}
            value={zip}
            returnKeyType="next"
            onSubmitEditing={() => {
              if (!zip || zip.trim().length === 0) {
                setZipValidator({isValid: false, message: "Zip required.", isVisible: true})
              } else {
                setZipValidator({isValid: true, message: "", isVisible: false})
              }            
              return notesRef.current!.focus();
            }}
            onChange={(text) => setZip(text.nativeEvent.text)}
            blurOnSubmit={false}
          />
          <View style={zipValidator.isVisible ? {opacity: 1} : {opacity: 0}}>
            <Text style={{color: Colors.SMT_Primary_1}}>
              {zipValidator.message}
            </Text>
          </View>
        </View>

        {/* Notes */}
        <View style={[styles.fieldContainer, {marginBottom: 40}]}>
          <Text style={styles.text}>Notes</Text>
          <TextInput
            style={styles.textInput}
            ref={notesRef}
            value={notes}
            onChange={(text) => setNotes(text.nativeEvent.text)}
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
  },
  fieldContainer: {
    //marginBottom: 10,
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
});

export default CreateAccountModal;
