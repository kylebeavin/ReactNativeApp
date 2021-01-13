import React, { useEffect, useRef, useState} from 'react';
import { StyleSheet, View, Text, TextInput, ScrollView } from 'react-native';

import Colors from '../../../constants/Colors';
import Configs from '../../../constants/Configs';
import useAsyncStorage from '../../../hooks/useAsyncStorage';
import {Account, SMT_User} from '../../../types/index';
import { getRequestHeadersAsync } from '../../../utils/Helpers';
import ModalButtons from '../ModalButtons';

interface Props {
    navigation: any;
    account: Account;
}

const UpdateAccountModal: React.FC<Props> = ({navigation, account}) => {
    const [name, setName] = useState(account.name);
    const [email, setEmail] = useState(account.email);
    const [street, setStreet] = useState(account.address_street);
    const [city, setCity] = useState(account.address_city);
    const [state, setState] = useState(account.address_state);
    const [zip, setZip] = useState(account.address_zip);
    const nameRef = useRef<TextInput>(null);
    const emailRef = useRef<TextInput>(null);
    const streetRef = useRef<TextInput>(null);
    const cityRef = useRef<TextInput>(null);
    const stateRef = useRef<TextInput>(null);
    const zipRef = useRef<TextInput>(null);

    const getFormData = async () => {
      const updatedAccount: Account = {
        _id: account._id,
        group_id: "",
        owner_id: account.owner_id,
        name: name,
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
        is_active: account.is_active,
        contacts: [],
        conversion: account.conversion,
        national: account.national,
        referral: account.referral,
        referral_group_id: account.referral_group_id,
        notes: account.notes
      }

      await useAsyncStorage().getUserAsync()
              .then(user => {
                updatedAccount.group_id = user.group_id 
              });
      
      return updatedAccount;
    }

    const updateAccount = async () => {
        const updatedAccount = await getFormData();
        const data = await fetch(`${Configs.TCMC_URI}/api/accounts/${updatedAccount._id}`, {
            method: "PUT",
            body: JSON.stringify(updatedAccount),
            headers: await getRequestHeadersAsync().then(header => header)
            })
            .then(res => res.json())
            .then(data => data)
            .catch(err => {
              // ToDo: Come up with error handling strategy.
              console.log(err);
              return err;
            });

        navigation.navigate("AccountsScreen");

        return data;
    }

    return (
      <View>
        <ScrollView style={styles.form}>
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
          <View style={styles.fieldContainer}>
            <Text style={styles.text}>Zip</Text>
            <TextInput
             style={styles.textInput}
              ref={zipRef}
              value={zip}
              onChange={(text) => setZip(text.nativeEvent.text)}
              />
          </View>
        </ScrollView>
        <ModalButtons navigation={navigation} save={() => updateAccount()}/>
      </View>
    );
}

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
        fontWeight: "bold",
        color: Colors.SMT_Secondary_1,
    },
    textInput: {
        paddingLeft: 15,
        paddingVertical: 5,
        borderColor: Colors.SMT_Secondary_1_Light_1,
        borderWidth: 2,
        borderRadius: 3,
    }
})

export default UpdateAccountModal;