import React, { useContext, useEffect, useRef, useState} from 'react';
import { StyleSheet, View, Text, TextInput, ScrollView } from 'react-native';
import { Picker } from '@react-native-picker/picker';

import Colors from '../../../constants/Colors';
import Configs from '../../../constants/Configs';
import { ContactType, Status } from '../../../types/enums';
import {SMT_User} from '../../../types/index';
import {Contact, Account} from '../../../types/crm';
import ModalButtons from '../ModalButtons';
import Layout from '../../../constants/Layout';
import AppContext from '../../../providers/AppContext';
import {isRequired, isEmail} from '../../../utils/Validators';
import { ToastContext } from '../../../providers/ToastProvider';

interface Props {
    navigation: any;
    account: Account;
}

const CreateContactModal: React.FC<Props> = ({navigation, account}) => {
  //#region Form Initializers
  const formValues = {
    name: "",
    email: "",
    phone: "",
    role: "",
    owner: "",
    notes: ""
  }
  
  const formErrors = {
    name: [],
    email: [],
    street: [],
    city: [],
    state: [],
    zip: [],
    notes: []
  }
  
  const formValidations = {
    name: [isRequired],
    email: [isRequired, isEmail],
    street: [isRequired],
    city: [isRequired],
    state: [isRequired],
    zip: [isRequired],
    notes: []
  }
  
  //#endregion

  //#region === Use State Variables ===//
    const {grpId, token} = useContext(AppContext);
    const {handleChange,handleSubmit,values,errors,setErrors}= useForm(formValues, formErrors, formValidations, postNewContact);
    const {show} = useContext(ToastContext);

    // Drop downs
    const [ownerList, setOwnerList] = useState<SMT_User[]>();
    //#endregion

    //#region === Mutable Ref Variables ===//
    // const nameRef = useRef<TextInput>(null);
    // const roleRef = useRef<TextInput>(null);
    // const phoneRef = useRef<TextInput>(null);
    // const emailRef = useRef<TextInput>(null);
    // const ownerRef = useRef<TextInput>(null);
    // const statusRef = useRef<TextInput>(null);
    // const notesRef = useRef<TextInput>(null);
    //#endregion

    useEffect(() => {
        // Fetch Dropdowns on page load.

        // Fetch Users by group id
        getOwnersDropDown()
          .then((data) => {
            setOwnerList(data);
            // Might need to setOwner(account.owner_id); here.
          })
          .catch((err) => show({message: err.message}));

    }, []);

    const getFormData = async () => {
      // let firstName = name.split(" ").slice(0, -1).join(" ");
      // let lastName = name.split(" ").slice(-1).join(" ");

      const contact: Contact = {
        _id: "",
        first_name: values.name,
        last_name: "_",
        type: values.role,
        account_id: account._id, // Set id
        phone: values.phone,
        email: values.email,
        owner_id: values.owner,
        created: "",
        is_active: values.status === "Active" ? true : false,
        method: "email",
      };

      return contact;
    };

    const getOwnersDropDown = async () : Promise<SMT_User[]> => {
        let userList : SMT_User[] = [];
        
        await fetch(`${Configs.TCMC_URI}/api/usersBy`, {
          method: "POST",
          body: JSON.stringify({group_id: grpId}),
          headers: {"Content-Type": "application/json","x-access-token": token},
        })
        .then((res) => {
          console.log(res.status)
          return res.json()
        })
        .then((json) => userList = json.data)
        .catch((err) => console.log(err))

        return userList;
    };
    
    const postNewContact = async () => {
        const contact = await getFormData();
        
        const data = await fetch(`${Configs.TCMC_URI}/api/contacts`, {
            method: "POST",
            body: JSON.stringify(contact),
            headers: {"Content-Type": "application/json","x-access-token": token},
            })
            .then(res => {
              console.log(res.status)
              return res.json()
            })
            .then(data => {
              console.log(data)
              return data
            })
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
            <Text style={styles.text}>CONTACT NAME</Text>
            <TextInput
              style={styles.textInput}
              ref={nameRef}
              value={name}
              onChange={(text) => setName(text.nativeEvent.text)}
              returnKeyType="next"
              onSubmitEditing={() => roleRef.current!.focus()}
              blurOnSubmit={false}
            />
          </View>
          <View style={styles.fieldContainer}>
            <Text style={styles.text}>ROLE</Text>
            <View style={styles.picker}>
              <Picker
                selectedValue={role}
                onValueChange={(itemValue, itemIndex) =>
                  setRole(itemValue.toString())
                }
              >
                {Object.values(ContactType).map((item, index) => {
                  return (
                    <Picker.Item
                      key={item.toString()}
                      label={item.toString()}
                      value={item.toString()}
                    />
                  );
                })}
              </Picker>
            </View>
          </View>
          <View style={styles.fieldContainer}>
            <Text style={styles.text}>PHONE NUMBER</Text>
            <TextInput
              style={styles.textInput}
              ref={phoneRef}
              value={phone}
              onChange={(text) => setPhone(text.nativeEvent.text)}
              returnKeyType="next"
              onSubmitEditing={() => emailRef.current!.focus()}
              blurOnSubmit={false}
            />
          </View>
          <View style={styles.fieldContainer}>
            <Text style={styles.text}>EMAIL ADDRESS</Text>
            <TextInput
              style={styles.textInput}
              ref={emailRef}
              value={email}
              onChange={(text) => setEmail(text.nativeEvent.text)}
              returnKeyType="next"
              onSubmitEditing={() => ownerRef.current!.focus()}
              blurOnSubmit={false}
            />
          </View>
          <View style={styles.fieldContainer}>
            <Text style={styles.text}>CONTACT OWNER</Text>
            <View style={styles.picker}>
              <Picker
                ref={ownerRef}
                selectedValue={owner}
                onValueChange={(itemValue, ItemIndex) =>
                  setOwner(itemValue.toString())
                }
              >
                {ownerList?.map((item, index) => {
                  return (
                    <Picker.Item
                      key={item._id}
                      label={item.first_name + " " + item.last_name}
                      value={item._id}
                    />
                  );
                })}
              </Picker>
            </View>
          </View>
          <View style={styles.fieldContainer}>
            <Text style={styles.text}>CONTACT STATUS</Text>
            <View style={styles.picker}>
              <Picker
                selectedValue={status}
                onValueChange={(itemValue, itemIndex) =>
                  setStatus(itemValue.toString())
                }
              >
                <Picker.Item
                  label={Status.active}
                  value={Status.active.toString()}
                />
                <Picker.Item
                  label={Status.inactive}
                  value={Status.inactive.toString()}
                />
              </Picker>
            </View>
          </View>
          <View style={[styles.fieldContainer, {marginBottom: 40}]}>
            <Text style={styles.text}>NOTES</Text>
            <TextInput
              style={styles.textInput}
              multiline
              ref={notesRef}
              value={notes}
              onChange={(text) => setNotes(text.nativeEvent.text)}
            />
          </View>
        </ScrollView>
        <ModalButtons navigation={navigation} save={() => postNewContact()} />
      </View>
    );
}

const styles = StyleSheet.create({
    form: {
      maxHeight: Layout.window.height/1.50,
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

export default CreateContactModal;