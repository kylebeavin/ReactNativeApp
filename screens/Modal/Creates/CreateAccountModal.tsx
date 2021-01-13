import React, {useRef, useState} from 'react';
import { StyleSheet, View, Text, TextInput, ScrollView } from 'react-native';

import Colors from '../../../constants/Colors';
import Configs from '../../../constants/Configs';
import useAsyncStorage from '../../../hooks/useAsyncStorage';
import {Account} from '../../../types/index';
import { getRequestHeadersAsync } from '../../../utils/Helpers';
import ModalButtons from '../ModalButtons';

interface Props {
    navigation: any;
}

const CreateAccountModal: React.FC<Props> = ({navigation}) => {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [street, setStreet] = useState("");
    const [city, setCity] = useState("");
    const [state, setState] = useState("");
    const [zip, setZip] = useState("");
    const nameRef = useRef<TextInput>(null);
    const emailRef = useRef<TextInput>(null);
    const streetRef = useRef<TextInput>(null);
    const cityRef = useRef<TextInput>(null);
    const stateRef = useRef<TextInput>(null);
    const zipRef = useRef<TextInput>(null);

    const getFormData = async () => {
      const account: Account = {
        _id: "",
        group_id: "",
        owner_id: "",
        name: name,
        address_street: street,
        address_city: city,
        address_state: state,
        address_zip: zip,
        created: "",
        demo: "",
        email: email,
        hauling_contract: false,
        hauling_expiration: "",
        stage: "Lead",
        is_active: true,
        contacts: [],
        conversion: new Date(),
        national: false,
        referral: false,
        referral_group_id: "",
        notes: ""
      }

      await useAsyncStorage().getUserAsync()
              .then(data => {
                account.owner_id = data._id,
                account.group_id = data.group_id 
              });

      return account;
    }
    
    const postNewAccount = async () => {
        const account = await getFormData();
        
        const data = await fetch(`${Configs.TCMC_URI}/api/accounts`, {
            method: "POST",
            body: JSON.stringify(account),
            headers: await getRequestHeadersAsync().then(header => header)
            })
            .then(res => res.json())
            .then(data => data)
            .catch(err => {
              // ToDo: Come up with error handling strategy.
              console.log(err);
              return err
            });

        navigation.navigate("AccountsScreen");

        return data;
    };

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
        <ModalButtons navigation={navigation} save={() => postNewAccount()}/>
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

export default CreateAccountModal;