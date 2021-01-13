import React, { useEffect, useRef, useState} from 'react';
import { StyleSheet, View, Text, TextInput, ScrollView, TouchableOpacity } from 'react-native';
import {Picker} from '@react-native-picker/picker';
import {Calendar} from 'react-native-calendars';
import { TextInputMask } from 'react-native-masked-text';

import Colors from '../../../constants/Colors';
import Configs from '../../../constants/Configs';
import useAsyncStorage from '../../../hooks/useAsyncStorage';
import {Meeting, Account, Contact, SMT_User} from '../../../types/index';
import {formatDateString, getRequestHeadersAsync} from '../../../utils/Helpers';
import ModalButtons from '../ModalButtons';
import AppButton from '../../../components/Layout/AppButton';
import Layout from '../../../constants/Layout';

interface Props {
    navigation: any;
}

const CreateMeetingModal: React.FC<Props> = ({navigation}) => {
    //#region === Use State Variables ===//
    const [name, setName] = useState("");
    const [date, setDate] = useState("");
    const [startTime, setStartTime] = useState("");
    const [endTime, setEndTime] = useState("");
    const [street, setStreet] = useState("");
    const [city, setCity] = useState("");
    const [state, setState] = useState("");
    const [zip, setZip] = useState("");
    const [account, setAccount] = useState("");
    const [accountList, setAccountList] = useState<Account[]>();
    const [contact, setContact] = useState("");
    const [contactList, setContactList] = useState<Contact[]>([]);
    const [showCalendar, setShowCalendar] = useState(false);
    //#endregion

    //#region === Mutable Ref Variables ===//
    const nameRef = useRef<TextInput>(null);
    const accountRef = useRef<Picker>(null); // ToDo: figure out how to auto focus Picker element
    const dateRef = useRef<TextInput>(null);
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
      let grpId = await useAsyncStorage().getUserAsync().then((user) => user.group_id);
      let accountsList: Account[] = [];

      await fetch(`${Configs.TCMC_URI}/api/accountsBy`, {
        method: "POST",
        body: JSON.stringify({group_id: grpId}),
        headers: await getRequestHeadersAsync().then(header => header)
        })
        .then((res) => res.json())
        .then((json) => (accountsList = json.data))
        .catch((err) => console.log(err));
      return accountsList;
    };

    const getContactList = async (accountId: string) => {
      await fetch(`${Configs.TCMC_URI}/api/contactsBy`, {
        method: "POST",
        body: JSON.stringify({account_id: accountId}),
        headers: await getRequestHeadersAsync().then(header => header)
        })
        .then((res) => res.json())
        .then((json) => setContactList(json.data))
        .catch((err) => console.log(err));
    };

    const getSMT_User = async (): Promise<SMT_User> => {
      return await useAsyncStorage().getUserAsync()
        .then((user) => {
          let smtUser: SMT_User = {
            _id: user._id,
            is_active: user.is_active,
            first_name: user.first_name,
            last_name: user.last_name,
            created: user.created,
            email: user.email,
            group_id: user.group_id,
            role: user.role,
            password: user.password,
            image: user.image,
            token: user.token
          }
          return smtUser;
        });
    };

    const getMeetingTime = () : Date => {
      let dateArr = date.split("/");
      let timeArr = startTime.split(":");
      let timeString = dateArr[2] + "-" + dateArr[0] + "-" + dateArr[1] + "T" + timeArr[0] + ":" + timeArr[1] + ":00";

      return new Date(timeString)
    }

    const getFormData = async () => {
      let user : SMT_User = await getSMT_User();
      const meeting: Meeting = {
        _id: "",
        group_id: user.group_id,
        account_id: account, 
        contact_id: contact,
        owner_id: user._id,
        title: name,
        address_street: street,
        address_city: city,
        address_state: state,
        address_zip: zip,
        created: "",
        meeting_time: getMeetingTime(),
        is_active: true,
      }
      return meeting;
    }
    
    const postNewMeeting = async () => {
      const meeting: Meeting = await getFormData();

      await fetch(`${Configs.TCMC_URI}/api/meetings`, {
        method: "POST",
        body: JSON.stringify(meeting),
        headers: await getRequestHeadersAsync().then(header => header)
        })
        .then((res) => res.json())
        .then((data) => data)
        .catch((err) => {
          // ToDo: Come up with error handling strategy.
          console.log(err);
          err;
        });
    
      navigation.navigate("MeetingsScreen");
    };

    const openCalendar = (show: boolean) => {
      setShowCalendar(show);
    };

    return (
      <View>
        <ScrollView style={styles.form}>
          {/* Name */}
          <View style={styles.fieldContainer}>
            <Text style={styles.text}>Meeting Name</Text>
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
                onValueChange={(itemValue, ItemIndex) => {
                  setAccount(itemValue.toString());
                  getContactList(itemValue.toString());
                }}
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

          {/* Contact Id */}
          <View style={styles.fieldContainer}>
            <Text style={styles.text}>Contact</Text>
            <View style={styles.picker}>
              <Picker
                enabled={contactList.length === 0 ? false : true}
                selectedValue={contact}
                onValueChange={(itemValue, ItemIndex) => {
                  itemValue === null
                    ? setContact("")
                    : setContact(itemValue.toString());
                }}
              >
                {contactList?.map((item, index) => {
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

          {/* Date */}
          <View style={styles.fieldContainer}>
            <View style={styles.columnContainer}>
              <View style={styles.column}>
                <Text style={styles.text}>Date</Text>
                <View style={styles.textInput}>
                  <TextInputMask 
                    type={"datetime"}
                    options={{
                      format: "MM/DD/YYYY"
                    }}
                    value={date}
                    onChangeText={text => setDate(text)}
                  />
                </View>
              </View>
              <View style={[styles.column, styles.calendarButton]}>
                <AppButton
                  title="Calendar"
                  onPress={() => openCalendar(true)}
                  icon={{ name: "calendar", type: "MaterialCommunityIcons" }}
                  backgroundColor={Colors.SMT_Secondary_2}
                />
              </View>
            </View>
          </View>

          {/* Time */}
          <View style={styles.fieldContainer}>
            <View style={styles.columnContainer}>
              <View style={styles.column}>
                <Text style={styles.text}>Start Time</Text>
                <View style={styles.textInput}>
                  <TextInputMask 
                    type={"datetime"}
                    options={{
                      format: 'HH:mm'
                    }}
                    value={startTime}
                    onChangeText={text => setStartTime(text)}
                    />
                </View>
              </View>
              <View style={[styles.column, {flex: 0, justifyContent: 'center', marginTop: 20, marginHorizontal: 20}]}>
                <Text style={{textAlign: 'center', fontWeight: 'bold', fontSize: 18}}>To:</Text>
              </View>
              <View style={styles.column}>
              <Text style={styles.text}>End Time</Text>
                <View style={styles.textInput}>
                  <TextInputMask 
                    type={"datetime"}
                    options={{
                      format: 'HH:mm'
                    }}
                    value={endTime}
                    onChangeText={text => setEndTime(text)}
                  />
                </View>
              </View>
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
          <View style={[styles.fieldContainer, {marginBottom: 40}]}>
            <Text style={styles.text}>Zip</Text>
            <TextInput
              style={styles.textInput}
              ref={zipRef}
              value={zip}
              onChange={(text) => setZip(text.nativeEvent.text)}
            />
          </View>
        </ScrollView>

        <ModalButtons navigation={navigation} save={() => postNewMeeting()} />

        {showCalendar ? (
          <TouchableOpacity
            style={styles.calendarPopup}
            onPress={() => setShowCalendar(false)}
          >
            <Calendar 
              style={{borderRadius: 4}}
              onDayPress={(day) => {
                setDate(formatDateString(day.dateString));
                setShowCalendar(false)
              }}
            />
          </TouchableOpacity>
        ) : null}
      </View>
    );
}

const styles = StyleSheet.create({
    form: {
        maxHeight: Layout.window.height/1.42,
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
      borderColor: Colors.SMT_Secondary_1_Light_1,
      borderWidth: 2,
      borderRadius: 3,
  },
  columnContainer: {
    flexDirection: 'row',
  },
  column: {
    flex: 1,
  },
  calendarButton: {
    flex: 0,
    marginTop: 22,
    marginBottom: -3,
    marginLeft: 20,
  },
  calendarPopup: {
    position: 'absolute',
    height: '100%',
    width: '100%',
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.55)',
  },
})

export default CreateMeetingModal;