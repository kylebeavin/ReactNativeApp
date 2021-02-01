import React, { useContext, useEffect, useState } from 'react'
import { useNavigation } from '@react-navigation/native';
import { View, Text, StyleSheet, SegmentedControlIOSComponent } from 'react-native';

import { Account } from '../../../types/crm';
import { Demo } from '../../../types/service';
import useAsyncStorage from '../../../hooks/useAsyncStorage';
import Configs from '../../../constants/Configs';
import { getRequestHeadersAsync } from '../../../utils/Helpers';
import { ScrollView, TextInput } from 'react-native-gesture-handler';
import Colors from '../../../constants/Colors';
import { Picker } from '@react-native-picker/picker';
import ModalButtons from '../ModalButtons';
import AppContext from '../../../providers/AppContext';

const CreateDemoModal = () => {
    const {grpId, token} = useContext(AppContext);
    const navigation = useNavigation();

    //#region Use State Variables
    const [demo, setDemo] = useState("");
    const [account, setAccount] = useState("");
    const [accountList, setAccountList] = useState<Account[]>();
    //#endregion
    
    useEffect(() => {
        // Fetch Users by group id
        getAccountsDropDown()
          .then((data) => {
            setAccountList(data);
          })
          .catch((err) => console.log(err));

    }, []);

    const getAccountsDropDown = async () : Promise<Account[]> => {
          let accounts : Account[] = [];
          
          await fetch(`${Configs.TCMC_URI}/api/accountsBy`, {
            method: "POST",
            body: JSON.stringify({group_id: grpId}),
            headers: {"Content-Type": "application/json","x-access-token": token},
          })
          .then((res) => {
            console.log(res.status)
            return res.json()
          })
          .then((json) => accounts = json.data)
          .catch((err) => console.log(err))
  
          return accounts;
      };

    const getFormData = async () => {
        const demo: Demo = {
            _id: "",
            account_id: account,
            created: "",
        }

        return demo;
    }

    const postNewDemo = async () => {
        const demo = await getFormData();
        
        const data = await fetch(`${Configs.TCMC_URI}/api/demos`, {
            method: "POST",
            body: JSON.stringify(demo),
            headers: {"Content-Type": "application/json","x-access-token": token},
            })
            .then(res => {
              console.log(res.status)
              return res.json()
            })
            .then(data => data)
            .catch(err => {
              // ToDo: Come up with error handling strategy.
              console.log(err);
              return err
            });

        navigation.navigate("DemosScreen");

        return data;
    };

    return (
        <View>
            <ScrollView style={styles.form}>
                {/* Demo */}
                <View style={styles.fieldContainer}>
                    <Text style={styles.text}>Demo</Text>
                    <TextInput
                      style={styles.textInput}
                      value={demo}
                      onChange={(text) => setDemo(text.nativeEvent.text)}
                    />
                </View>

                {/* Account */}
                <View style={styles.fieldContainer}>
                    <Text style={styles.text}>Account</Text>
                    <View style={styles.picker}>
                      <Picker
                        selectedValue={account}
                        onValueChange={(itemValue, itemIndex) => setAccount(itemValue.toString())}
                      >
                          {accountList?.map((item, index) => {
                              return (
                                  <Picker.Item
                                    key={item._id}
                                    label={item.account_name}
                                    value={item._id}
                                  />
                              );
                          })}
                      </Picker>
                    </View>
                </View>
            </ScrollView>
            <ModalButtons navigation={navigation} save={() => postNewDemo()} />
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

export default CreateDemoModal;