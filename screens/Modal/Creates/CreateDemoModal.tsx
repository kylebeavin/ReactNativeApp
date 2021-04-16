import React, { useContext, useEffect, useState } from 'react'
import { useNavigation } from '@react-navigation/native';
import { View, Text, StyleSheet } from 'react-native';

import { Account } from '../../../types/crm';
import { Demo } from '../../../types/orders';
import Configs from '../../../constants/Configs';
import {ScrollView, TextInput} from 'react-native-gesture-handler';
import Colors from '../../../constants/Colors';
import { Picker } from '@react-native-picker/picker';
import ModalButtons from '../ModalButtons';
import AppContext from '../../../providers/AppContext';
import { ToastContext } from '../../../providers/ToastProvider';

const CreateDemoModal = () => {
    const {grpId, token} = useContext(AppContext);
    const {show} = useContext(ToastContext);
    const navigation = useNavigation();

    //#region Use State Variables
    const [demo, setDemo] = useState('');
    const [account, setAccount] = useState('');
    const [accountList, setAccountList] = useState<Account[]>();
    //#endregion
    
    useEffect(() => {
        // Fetch Users by group id
        getAccountsDropDown()
          .then((data) => {
            setAccountList(data);
          })
          .catch((err) => show({message: err.message}));

    }, []);

    const getAccountsDropDown = async () : Promise<Account[]> => {
          let accounts : Account[] = [];
          
          await fetch(`${Configs.TCMC_URI}/api/accountsBy`, {
            method: 'POST',
            body: JSON.stringify({group_id: grpId}),
            headers: {'Content-Type': 'application/json','x-access-token': token},
          })
          .then((res) => res.json())
          .then((json) => accounts = json.data)
          .catch((err) => show({message: err.message}));
  
          return accounts;
      };

    const getFormData = async () => {
        const demo: Demo = {
            _id: '',
            account_id: account,
            created: '',
        }

        return demo;
    }

    const postNewDemo = async () => {
        const demo = await getFormData();
        
        const data = await fetch(`${Configs.TCMC_URI}/api/demos`, {
            method: 'POST',
            body: JSON.stringify(demo),
            headers: {'Content-Type': 'application/json','x-access-token': token},
            })
            .then(res => res.json())
            .then(data => data)
            .catch(err => show({message: err.message}));

        navigation.navigate('DemosScreen');

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
})

export default CreateDemoModal;