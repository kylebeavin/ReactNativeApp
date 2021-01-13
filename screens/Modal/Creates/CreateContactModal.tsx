import React, { useEffect, useRef, useState} from 'react';
import { StyleSheet, View, Text, TextInput, ScrollView } from 'react-native';
import { Picker } from '@react-native-picker/picker';

import Colors from '../../../constants/Colors';
import Configs from '../../../constants/Configs';
import { ContactRole, Status } from '../../../types/enums';
import {Contact, Account, SMT_User} from '../../../types/index';
import ModalButtons from '../ModalButtons';
import useAsyncStorage from '../../../hooks/useAsyncStorage';
import { getRequestHeadersAsync } from '../../../utils/Helpers';

interface Props {
    navigation: any;
    account: Account;
}

const CreateContactModal: React.FC<Props> = ({navigation, account}) => {
    //#region === Use State Variables ===//
    const [name, setName] = useState("");
    const [role, setRole] = useState("");
    const [phone, setPhone] = useState("");
    const [email, setEmail] = useState("");
    const [owner, setOwner] = useState("");
    const [status, setStatus] = useState("");
    const [notes, setNotes] = useState("");
    const [ownerList, setOwnerList] = useState<SMT_User[]>();
    //#endregion

    //#region === Mutable Ref Variables ===//
    const nameRef = useRef<TextInput>(null);
    const roleRef = useRef<TextInput>(null);
    const phoneRef = useRef<TextInput>(null);
    const emailRef = useRef<TextInput>(null);
    const ownerRef = useRef<TextInput>(null);
    const statusRef = useRef<TextInput>(null);
    const notesRef = useRef<TextInput>(null);
    //#endregion

    useEffect(() => {
        // Fetch Dropdowns on page load.

        // Fetch Users by group id
        getOwnersDropDown()
          .then((data) => {
            setOwnerList(data);
            // Might need to setOwner(account.owner_id); here.
          })
          .catch((err) => console.log(err));

    }, []);

    const getFormData = async () => {
      let firstName = name.split(" ").slice(0, -1).join(" ");
      let lastName = name.split(" ").slice(-1).join(" ");

      const contact: Contact = {
        _id: "",
        first_name: firstName,
        last_name: lastName,
        type: role,
        account_id: account._id, // Set id
        phone: phone,
        email: email,
        owner_id: owner,
        created: "",
        is_active: status === "Active" ? true : false,
        method: "Phone",
      };

      return contact;
    };

    const getOwnersDropDown = async () : Promise<SMT_User[]> => {
      let grpId = await useAsyncStorage().getUserAsync().then((user) => user.group_id);
        let userList : SMT_User[] = [];
        
        await fetch(`${Configs.TCMC_URI}/api/usersBy`, {
          method: "POST",
          body: JSON.stringify({group_id: grpId}),
          headers: await getRequestHeadersAsync().then(header => header)
        })
        .then((res) => res.json())
        .then((json) => userList = json.data)
        .catch((err) => console.log(err))

        return userList;
    };
    
    const postNewContact = async () => {
        const contact = await getFormData();
        
        const data = await fetch(`${Configs.TCMC_URI}/api/contacts`, {
            method: "POST",
            body: JSON.stringify(contact),
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
                <Picker.Item
                  label={ContactRole.billing}
                  value={ContactRole.billing.toString()}
                />
                <Picker.Item
                  label={ContactRole.notifications}
                  value={ContactRole.notifications.toString()}
                />
                <Picker.Item
                  label={ContactRole.hauling}
                  value={ContactRole.hauling.toString()}
                />
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
          <View style={styles.fieldContainer}>
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