import React, { useEffect, useRef, useState} from 'react';
import { StyleSheet, View, Text, TextInput, ScrollView } from 'react-native';
import { Picker } from '@react-native-picker/picker';

import Colors from '../../../constants/Colors';
import Configs from '../../../constants/Configs';
import { ContactRole, ContactType, Status } from '../../../types/enums';
import {SMT_User} from '../../../types/index';
import {Contact} from '../../../types/crm';
import ModalButtons from '../ModalButtons';
import useAsyncStorage from '../../../hooks/useAsyncStorage';
import { getRequestHeadersAsync } from '../../../utils/Helpers';
import Layout from '../../../constants/Layout';

interface Props {
    navigation: any;
    contact: Contact;
}

const UpdateContactModal: React.FC<Props> = ({navigation, contact}) => {
    //#region === Use State Variables ===//
    const [name, setName] = useState(contact.first_name);
    const [role, setRole] = useState(ContactType[contact.type.toString()]);
    const [phone, setPhone] = useState(contact.phone);
    const [email, setEmail] = useState(contact.email);
    const [owner, setOwner] = useState(contact.owner_id);
    const [status, setStatus] = useState(contact.is_active ? Status.active.toString() : Status.inactive.toString());
    const [notes, setNotes] = useState("");
    const [ownerList, setOwnerList] = useState<SMT_User[]>();
    //#endregion

    //#region === Mutable Refs Variables ===//
    const nameRef = useRef<TextInput>(null);
    const roleRef = useRef<View>(null);
    const phoneRef = useRef<TextInput>(null);
    const emailRef = useRef<TextInput>(null);
    const ownerRef = useRef<TextInput>(null);
    const statusRef = useRef<TextInput>(null);
    const notesRef = useRef<TextInput>(null);
    //#endregion

    useEffect(() => {
      console.log(role)
      // setRole(contact.type)
        // Fetch Dropdowns
        const ownerList = getOwnersDropDown();
        ownerList
          .then((data) => {
            setOwnerList(data);
          })
          .catch((err) => console.log(err));
    }, []);

    const getFormData = async () => {
      // let firstName = name.split(" ").slice(0, -1).join(" ");
      // let lastName = name.split(" ").slice(-1).join(" ");

      const updatedContact: Contact = {
        _id: contact._id,
        first_name: name,
        last_name: contact.last_name,
        type: role,
        account_id: contact.account_id,
        phone: phone,
        email: email,
        owner_id: owner,
        created: contact.created,
        is_active: status === "Active" ? true : false,
        method: contact.method,
      };
      return updatedContact;
    };

    const getOwnersDropDown = async () : Promise<SMT_User[]> => {
        let userList : SMT_User[] = [];
        let grpId : string = await useAsyncStorage().getUserAsync().then(user => user.group_id);

        await fetch(`${Configs.TCMC_URI}/api/usersBy`, {
          method: "POST",
          body: JSON.stringify({group_id: grpId}),
          headers: await getRequestHeadersAsync().then(header => header)
        })
        .then((res) => {
          console.log(res.status)
          return res.json()
        })
        .then((json) => userList = json.data)
        .catch((err) => console.log(err))

        return userList;
    };
    
    const updateContact = async () => {
        const contact = await getFormData();
        
        const data = await fetch(`${Configs.TCMC_URI}/api/contacts/${contact._id}`, {
            method: "PUT",
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
              onSubmitEditing={() => roleRef.current?.focus()}
              blurOnSubmit={false}
            />
          </View>
          <View ref={roleRef} style={styles.fieldContainer}>
            <Text style={styles.text}>ROLE</Text>
            <View ref={roleRef} style={styles.picker}>
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
                onValueChange={(itemValue, itemIndex) => {
                  setStatus(itemValue.toString())
                } 
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
        <ModalButtons navigation={navigation} save={() => updateContact()} />
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

export default UpdateContactModal;