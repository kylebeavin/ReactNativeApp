import React, { useEffect, useRef, useState} from 'react';
import { Picker } from '@react-native-picker/picker';
import { StyleSheet, View, Text, TextInput, ScrollView } from 'react-native';

import Colors from '../../../constants/Colors';
import Configs from '../../../constants/Configs';
import useAsyncStorage from '../../../hooks/useAsyncStorage';
import {Location, Account} from '../../../types/crm';
import ModalButtons from '../ModalButtons';
import { getRequestHeadersAsync } from '../../../utils/Helpers';

interface Props {
    navigation: any;
}

const CreateLocationModal: React.FC<Props> = ({navigation}) => {
    //#region === Use State Variables ===//
    const [name, setName] = useState("");
    const [street, setStreet] = useState("");
    const [city, setCity] = useState("");
    const [state, setState] = useState("");
    const [zip, setZip] = useState("");
    const [account, setAccount] = useState("");
    const [accountList, setAccountList] = useState<Account[]>();
    //#endregion

    //#region === Mutable Ref Variables ===//
    const nameRef = useRef<TextInput>(null);
    const accountRef = useRef<Picker>(null); // ToDo: figure out how to auto focus Picker element
    const streetRef = useRef<TextInput>(null);
    const cityRef = useRef<TextInput>(null);
    const stateRef = useRef<TextInput>(null);
    const zipRef = useRef<TextInput>(null);
    //#endregion

    useEffect(() => {
      // Set State

      // Fetch Accounts by group id
      getAccountsDropDown()
        .then((data) => {
          setAccountList(data);
        })
        .catch((err) => console.log(err));

    }, []);

    const getAccountsDropDown = async (): Promise<Account[]> => {
      let grpId = await useAsyncStorage().getUserAsync().then(user => user.group_id);
      let accountsList: Account[] = [];

      await fetch(`${Configs.TCMC_URI}/api/accountsBy`, {
        method: "POST",
        headers: await getRequestHeadersAsync().then(header => header),
        body: JSON.stringify({group_id: grpId})
      })
        .then((res) => res.json())
        .then((json) => (accountsList = json.data))
        .catch((err) => console.log(err));
      return accountsList;
    };

    const getFormData = async () => {
      let grpId = await useAsyncStorage().getUserAsync().then(user => user.group_id);

      const location: Location = {
        _id: "",
        account_id: account, 
        location_name: name,
        address_street: street,
        address_city: city,
        address_state: state,
        address_zip: zip,
        created: "",
        is_active: true,
        group_id: grpId,
      }
      return location;
    }
    
    const postNewLocation = async () => {
        const location = await getFormData();

        await fetch(`${Configs.TCMC_URI}/api/locations`, {
            method: "POST",
            body: JSON.stringify(location),
            headers: await getRequestHeadersAsync().then(header => header)
            })
            .then(res => res.json())
            .then(data => {
             console.log(data) 
              data
            })
            .catch(err => {
              // ToDo: Come up with error handling strategy.
              console.log(err);
              err
            });

        navigation.navigate("MapScreen");
    };

    return (
      <View>
        <ScrollView style={styles.form}>
          
          {/* Name */}
          <View style={styles.fieldContainer}>
            <Text style={styles.text}>Business Name</Text>
            <TextInput
              style={styles.textInput}
              ref={nameRef}
              value={name}
              onChange={(text) => setName(text.nativeEvent.text)}
              returnKeyType="next"
              blurOnSubmit={false}
            />
          </View>
          
          {/* Account Id */}
          <View style={styles.fieldContainer}>
            <Text style={styles.text}>Account</Text>
            <View style={styles.picker}>
              <Picker
                selectedValue={account}
                onValueChange={(itemValue, ItemIndex) =>
                  setAccount(itemValue.toString())
                }
              >
                {accountList?.map((item, index) => {
                  return (
                    <Picker.Item
                      key={item._id}
                      label={item.name}
                      value={item._id}
                    />
                  );
                })}
              </Picker>
            </View>
          </View>

          {/* Street */}
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
        
        </ScrollView>
        <ModalButtons navigation={navigation} save={() => postNewLocation()}/>
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
    },
    picker: {
      paddingLeft: 15,
      //paddingVertical: 5,
      borderColor: Colors.SMT_Secondary_1_Light_1,
      borderWidth: 2,
      borderRadius: 3,
  },
})

export default CreateLocationModal;