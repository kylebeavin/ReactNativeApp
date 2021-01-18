import React, { useEffect, useRef, useState} from 'react';
import { useNavigation } from '@react-navigation/native';
import { StyleSheet, View, Text, TextInput, ScrollView, TouchableOpacity } from 'react-native';
import {Picker} from '@react-native-picker/picker';
import {Calendar} from 'react-native-calendars';
import { TextInputMask } from 'react-native-masked-text';
import CheckBox from '@react-native-community/checkbox';

import Colors from '../../../constants/Colors';
import Configs from '../../../constants/Configs';
import useAsyncStorage from '../../../hooks/useAsyncStorage';
import {SMT_User} from '../../../types/index';
import {Account} from '../../../types/crm';
import {formatDateString, getRequestHeadersAsync} from '../../../utils/Helpers';
import ModalButtons from '../ModalButtons';
import AppButton from '../../../components/Layout/AppButton';
import Layout from '../../../constants/Layout';
import { Agreement, Order } from '../../../types/service';
import { Days, Services, ServicesPer } from '../../../types/enums';

interface Props {
}

const CreateAgreementModal: React.FC<Props> = () => {
    const navigation = useNavigation();

    //#region === Use State Variables ===//
    const [account, setAccount] = useState("");
    const [group, setGroup] = useState("");
    const [isRecurring, setIsRecurring] = useState(false);
    const [services, setServices] = useState(Services.smash.toString());
    const [serviceFrequency, setServiceFrequency] = useState("");
    const [servicePer, setServicePer] = useState(ServicesPer.day.toString());
    const [serviceDays, setServiceDays] = useState(Days.sun.toString());
    const [monthlyRate, setMonthlyRate] = useState("");
    const [demandRate, setDemandRate] = useState("");
    const [termDate, setTermDate] = useState("");
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [notes, setNotes] = useState("");
    const [fileUploadUrl, setFileUploadUrl] = useState("");

    // DropDowns
    const [accountList, setAccountList] = useState<Account[]>();

    // Popups
    const [showStartDateCalendar, setShowStartDateCalendar] = useState(false);
    const [showEndDateCalendar, setShowEndDateCalendar] = useState(false);

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

    const getFormData = async () => {
      let user : SMT_User = await getSMT_User();
      const agreement: Agreement = {
        _id: "",
        account_id: account, 
        group_id: user.group_id,
        is_recurring: isRecurring,
        services: services,
        service_frequency: serviceFrequency,
        service_per: servicePer,
        service_days: serviceDays,
        monthly_rate: monthlyRate,
        demand_rate: demandRate,
        term_date: termDate,
        start_date: startDate,
        end_date: endDate,
        created: "",
        is_active: true,
        notes: notes,
        url: fileUploadUrl,
      }
      return agreement;
    }
    
    const postNewAgreement = async () => {
      const agreement: Agreement = await getFormData();

      await fetch(`${Configs.TCMC_URI}/api/agreements`, {
        method: "POST",
        body: JSON.stringify(agreement),
        headers: await getRequestHeadersAsync().then(header => header)
        })
        .then((res) => res.json())
        .then((data) => data)
        .catch((err) => {
          // ToDo: Come up with error handling strategy.
          console.log(err);
          err;
        });
    
      navigation.navigate("ServicesScreen");
    };

    const openStartDateCalendar = (show: boolean) => {
      setShowStartDateCalendar(show);
    };
    const openEndDateCalendar = (show: boolean) => {
        setShowEndDateCalendar(show);
      };

    return (
      <View>
        <ScrollView style={styles.form}>
          {/* Account Id */}
          <View style={styles.fieldContainer}>
            <Text style={styles.text}>Account</Text>
            <View style={styles.picker}>
              <Picker
                selectedValue={account}
                onValueChange={(itemValue, ItemIndex) => setAccount(itemValue.toString())}
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

          {/* isRecurring */}
          <View style={styles.fieldContainer}>
            <Text style={styles.text}>Is Recurring</Text>
              <CheckBox
                disabled={false}
                value={isRecurring}
                onValueChange={(newValue) => setIsRecurring(!isRecurring)}
              />
          </View>

          {/* Services */}
          <View style={styles.fieldContainer}>
            <Text style={styles.text}>Service</Text>
            <View style={styles.picker}>
              <Picker
                selectedValue={services}
                onValueChange={(itemValue, ItemIndex) => setServices(itemValue.toString())}
              >
                {Object.values(Services).map((item, index) => {
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
          
          {/* Service Frequency */}
          <View style={styles.fieldContainer}>
            <Text style={styles.text}>Frequency</Text>
            <TextInput
              style={styles.textInput}
              value={serviceFrequency}
              onChange={(text) => setServiceFrequency(text.nativeEvent.text)}
            />
          </View>

          {/* Services Per */}
          <View style={styles.fieldContainer}>
            <Text style={styles.text}>Per</Text>
            <View style={styles.picker}>
              <Picker
                selectedValue={servicePer}
                onValueChange={(itemValue, ItemIndex) => setServicePer(itemValue.toString())}
              >
                {Object.values(ServicesPer).map((item, index) => {
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

          {/* Service Days */}
          <View style={styles.fieldContainer}>
            <Text style={styles.text}>Days</Text>
            <View style={styles.picker}>
              <Picker
                selectedValue={serviceDays}
                onValueChange={(itemValue, ItemIndex) => setServiceDays(itemValue.toString())}
              >
                {Object.values(Days).map((item, index) => {
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

          {/* Monthly Rate */}
          <View style={styles.fieldContainer}>
            <Text style={styles.text}>Monthly Rate</Text>
            <TextInput
              style={styles.textInput}
              value={monthlyRate}
              onChange={(text) => setMonthlyRate(text.nativeEvent.text)}
            />
          </View>

          {/* Demand Rate */}
          <View style={styles.fieldContainer}>
            <Text style={styles.text}>Demand Rate</Text>
            <TextInput
              style={styles.textInput}
              value={demandRate}
              onChange={(text) => setDemandRate(text.nativeEvent.text)}
            />
          </View>

          {/* Term Date */}
          <View style={styles.fieldContainer}>
            <Text style={styles.text}>Term Date</Text>
            <TextInput
              style={styles.textInput}
              value={termDate}
              onChange={(text) => setTermDate(text.nativeEvent.text)}
            />
          </View>

          {/* Start Date */}
          <View style={styles.fieldContainer}>
            <View style={styles.columnContainer}>
              <View style={styles.column}>
                <Text style={styles.text}>Start Date</Text>
                <View style={styles.textInput}>
                  <TextInputMask 
                    type={"datetime"}
                    options={{
                      format: "MM/DD/YYYY"
                    }}
                    value={startDate}
                    onChangeText={text => setStartDate(text)}
                  />
                </View>
              </View>
              <View style={[styles.column, styles.calendarButton]}>
                <AppButton
                  title="Calendar"
                  onPress={() => openStartDateCalendar(true)}
                  icon={{ name: "calendar", type: "MaterialCommunityIcons" }}
                  backgroundColor={Colors.SMT_Secondary_2}
                />
              </View>
            </View>
          </View>

          {/* End Date */}
          <View style={styles.fieldContainer}>
            <View style={styles.columnContainer}>
              <View style={styles.column}>
                <Text style={styles.text}>End Date</Text>
                <View style={styles.textInput}>
                  <TextInputMask 
                    type={"datetime"}
                    options={{
                      format: "MM/DD/YYYY"
                    }}
                    value={endDate}
                    onChangeText={text => setEndDate(text)}
                  />
                </View>
              </View>
              <View style={[styles.column, styles.calendarButton]}>
                <AppButton
                  title="Calendar"
                  onPress={() => openEndDateCalendar(true)}
                  icon={{ name: "calendar", type: "MaterialCommunityIcons" }}
                  backgroundColor={Colors.SMT_Secondary_2}
                />
              </View>
            </View>
          </View>

          {/* File Upload URL */}
          <View style={styles.fieldContainer}>
            <Text style={styles.text}>File Upload URL</Text>
            <TextInput
              style={styles.textInput}
              value={fileUploadUrl}
              onChange={(text) => setFileUploadUrl(text.nativeEvent.text)}
            />
          </View>

          {/* Notes */}
          <View style={[styles.fieldContainer, {marginBottom: 40}]} >
            <Text style={styles.text}>Notes</Text>
            <TextInput
                style={styles.textInput}
                value={notes}
                onChange={(text) => setNotes(text.nativeEvent.text)}
            />
          </View>

        </ScrollView>

        <ModalButtons navigation={navigation} save={() => postNewAgreement()} />

        {showStartDateCalendar ? (
          <TouchableOpacity
            style={styles.calendarPopup}
            onPress={() => setShowStartDateCalendar(false)}
          >
            <Calendar 
              style={{borderRadius: 4}}
              onDayPress={(day) => {
                setStartDate(formatDateString(day.dateString));
                setShowStartDateCalendar(false)
              }}
            />
          </TouchableOpacity>
        ) : null}
        {showEndDateCalendar ? (
          <TouchableOpacity
            style={styles.calendarPopup}
            onPress={() => setShowEndDateCalendar(false)}
          >
            <Calendar 
              style={{borderRadius: 4}}
              onDayPress={(day) => {
                setEndDate(formatDateString(day.dateString));
                setShowEndDateCalendar(false)
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

export default CreateAgreementModal;