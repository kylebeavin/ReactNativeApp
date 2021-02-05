import React, {useContext, useRef, useState} from 'react';
import {StyleSheet, View, Text, TextInput, ScrollView} from 'react-native';

import Colors from '../../../constants/Colors';
import Configs from '../../../constants/Configs';
import Layout from '../../../constants/Layout';
import useAsyncStorage from '../../../hooks/useAsyncStorage';
import AppContext from '../../../providers/AppContext';
import {ToastContext} from '../../../providers/ToastProvider';
import {Account} from '../../../types/crm';
import {
  getRequestHeadersAsync,
  isSuccessStatusCode,
} from '../../../utils/Helpers';
import ModalButtons from '../ModalButtons';

interface Props {
  navigation: any;
  account: Account;
}

const UpdateAccountModal: React.FC<Props> = ({navigation, account}) => {
  //#region State Variables
  const {show} = useContext(ToastContext);
  const {grpId, token} = useContext(AppContext);
  const [name, setName] = useState(account.account_name);
  const [email, setEmail] = useState(account.email);
  const [street, setStreet] = useState(account.address_street);
  const [city, setCity] = useState(account.address_city);
  const [state, setState] = useState(account.address_state);
  const [zip, setZip] = useState(account.address_zip);
  const [notes, setNotes] = useState(account.notes);
  const nameRef = useRef<TextInput>(null);
  const emailRef = useRef<TextInput>(null);
  const streetRef = useRef<TextInput>(null);
  const cityRef = useRef<TextInput>(null);
  const stateRef = useRef<TextInput>(null);
  const zipRef = useRef<TextInput>(null);
  const notesRef = useRef<TextInput>(null);
  //#endregion

  const getFormData = async () => {
    const updatedAccount: Account = {
      _id: account._id,
      group_id: grpId,
      owner_id: account.owner_id,
      owner_name: account.owner_name,
      account_name: name,
      address_street: street,
      address_city: city,
      address_state: state,
      address_zip: zip,
      created: account.created,
      demo: account.demo,
      email: email,
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
      notes: notes,
      drawerIsVisible: account.drawerIsVisible,
    };

    return updatedAccount;
  };

  const updateAccount = async () => {
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
        <View style={styles.fieldContainer}>
          <Text style={styles.text}>Name</Text>
          <TextInput
            style={styles.textInput}
            ref={nameRef}
            value={name}
            onChange={(text) => setName(text.nativeEvent.text)}
            returnKeyType="next"
            onSubmitEditing={() => emailRef.current!.focus()}
            blurOnSubmit={false}
          />
        </View>

        {/* Email Address */}
        <View style={styles.fieldContainer}>
          <Text style={styles.text}>Email Address</Text>
          <TextInput
            style={styles.textInput}
            ref={emailRef}
            value={email}
            onChange={(text) => setEmail(text.nativeEvent.text)}
            returnKeyType="next"
            onSubmitEditing={() => streetRef.current!.focus()}
            blurOnSubmit={false}
          />
        </View>

        {/* Street Address */}
        <View style={styles.fieldContainer}>
          <Text style={styles.text}>Street Address</Text>
          <TextInput
            style={styles.textInput}
            ref={streetRef}
            value={street}
            onChange={(text) => setStreet(text.nativeEvent.text)}
            returnKeyType="next"
            onSubmitEditing={() => cityRef.current!.focus()}
            blurOnSubmit={false}
          />
        </View>

        {/* City */}
        <View style={styles.fieldContainer}>
          <Text style={styles.text}>City</Text>
          <TextInput
            style={styles.textInput}
            ref={cityRef}
            value={city}
            onChange={(text) => setCity(text.nativeEvent.text)}
            returnKeyType="next"
            onSubmitEditing={() => stateRef.current!.focus()}
            blurOnSubmit={false}
          />
        </View>

        {/* State */}
        <View style={styles.fieldContainer}>
          <Text style={styles.text}>State</Text>
          <TextInput
            style={styles.textInput}
            ref={stateRef}
            value={state}
            onChange={(text) => setState(text.nativeEvent.text)}
            returnKeyType="next"
            onSubmitEditing={() => zipRef.current!.focus()}
            blurOnSubmit={false}
          />
        </View>

        {/* Zip */}
        <View style={styles.fieldContainer}>
          <Text style={styles.text}>Zip</Text>
          <TextInput
            style={styles.textInput}
            ref={zipRef}
            value={zip}
            onChange={(text) => setZip(text.nativeEvent.text)}
          />
        </View>

        {/* Notes */}
        <View style={[styles.fieldContainer, {marginBottom: 40}]}>
          <Text style={styles.text}>Notes</Text>
          <TextInput
            style={styles.textInput}
            ref={notesRef}
            value={notes[0]}
            onChange={(text) => setNotes([text.nativeEvent.text])}
          />
        </View>
      </ScrollView>

      {/* Buttons */}
      <ModalButtons navigation={navigation} save={() => updateAccount()} />
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
});

export default UpdateAccountModal;
