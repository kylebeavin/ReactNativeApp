import React, { useContext, useEffect, useRef, useState} from 'react';
import { useNavigation } from '@react-navigation/native';
import { StyleSheet, View, Text, TextInput, ScrollView, TouchableOpacity } from 'react-native';
import {Picker} from '@react-native-picker/picker';
import {Calendar} from 'react-native-calendars';
import { TextInputMask } from 'react-native-masked-text';
import CheckBox from '@react-native-community/checkbox';

import Colors from '../../../constants/Colors';
import Configs from '../../../constants/Configs';
import {Account} from '../../../types/crm';
import {formatDateString, isSuccessStatusCode} from '../../../utils/Helpers';
import ModalButtons from '../ModalButtons';
import AppButton from '../../../components/layout/AppButton';
import Layout from '../../../constants/Layout';
import { Agreement } from '../../../types/orders';
import { Days, Services, ServicesPer } from '../../../types/enums';
import AppContext from '../../../providers/AppContext';
import { ToastContext } from '../../../providers/ToastProvider';
import AppBtnGrp from '../../../components/layout/AppBtnGrp';
import AppCheckBox from '../../../components/layout/AppCheckBox';
import AppTextInput from '../../../components/layout/AppTextInput';

interface Props {
}

const CreateAgreementModal: React.FC<Props> = () => {
  //#region === Use State Variables ===//
    const navigation = useNavigation();
    const {id, grpId, token} = useContext(AppContext);
    const {show} = useContext(ToastContext);
    const [account, setAccount] = useState('');
    const [isRecurring, setIsRecurring] = useState(false);
    const [servicePer, setServicePer] = useState(ServicesPer.day.toString());
    const [btnObj, setBtnObj] = useState<{[index: string]: boolean}>({['SU']: false, ['M']: false, ['T']: false, ['W']: false, ['TH']: false, ['F']: false, ['S']: false});
    const [recurringRate, setRecurringRate] = useState('');
    const [demandRate, setDemandRate] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [notes, setNotes] = useState('');
    const [fileUploadUrl, setFileUploadUrl] = useState('');
    const [containerQty, setContainerQty] = useState('0');
    const [location, setLocation] = useState('');

    // DropDowns
    const [accountList, setAccountList] = useState<Account[]>();

    // Popups
    const [showStartDateCalendar, setShowStartDateCalendar] = useState(false);
    const [showEndDateCalendar, setShowEndDateCalendar] = useState(false);
    //#endregion

    useEffect(() => {
      getAccountsDropDown()
        .then((data) => {
          setAccountList(data);
        })
        .catch((err) => show({message: err.message}));
        
    }, []);

    const getAccountsDropDown = async (): Promise<Account[]> => {
      let accountsList: Account[] = [];

      await fetch(`${Configs.TCMC_URI}/api/accountsBy`, {
        method: 'POST',
        body: JSON.stringify({group_id: grpId}),
        headers: {'Content-Type': 'application/json','x-access-token': token},
      })
        .then((res) => res.json())
        .then((json) => (accountsList = json.data))
        .catch((err) => show({message: err.message}));
      return accountsList;
    };
    
    const getFormData = async () => {
      const agreement: Agreement = {
        _id: '',
        account_id: account, 
        container_qty: containerQty,
        demand_rate: demandRate,
        end_date: endDate,
        group_id: grpId,
        is_active: true,
        is_recurring: isRecurring,
        location: location,
        notes: notes,
        owner_id: id,
        recurring_rate: recurringRate,
        services: 'smash',
        service_days: getBtnGrpValues(),
        service_frequency: servicePer,
        start_date: startDate,
        url: fileUploadUrl,
      }
      return agreement;
    }

    const getBtnGrpValues = () : string[] => {
      let strArr: string[] = [];

      Object.entries(btnObj).map((u,i) => {
        if (u[1]){
          
          switch (u[0]) {
            case 'SU':
              return strArr.push('sun');
            case 'M':
              return strArr.push('mon');
            case 'T':
              return strArr.push('tue');
            case 'W':
              return strArr.push('wed');
            case 'TH':
              return strArr.push('thu');
            case 'F':
              return strArr.push('fri');
            case 'S':
              return strArr.push('sat');
            default: 
              return null;
          }
        }
      })

      return strArr;
    };
    
    const postNewAgreement = async () => {
      const agreement: Agreement = await getFormData();
      console.log(JSON.stringify(agreement))
      await fetch(`${Configs.TCMC_URI}/api/agreements`, {
        method: 'POST',
        body: JSON.stringify(agreement),
        headers: {'Content-Type': 'application/json','x-access-token': token},
        })
        .then((res) => res.json())
        .then(json => {
          if (isSuccessStatusCode(json.status)) {
            show({message: json.message});
            navigation.navigate('OrdersScreen')
          } else {
            console.log(json)
            show({message: json.message});
          }
        })
        .catch((err) => show({message: err.message}));
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
                onValueChange={(itemValue, ItemIndex) =>
                  setAccount(itemValue.toString())
                }>
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
          
          {/* Container Qty */}
          <AppTextInput 
            label='Container Qty'
            name='container_qty'
            value={containerQty}
            onChange={(val) => setContainerQty(val)}
            validations={[]}
            errors={[]}
            setErrors={() => null}
            keyboardType='number-pad'
          />

          {/* Frequency */}
          <View style={styles.fieldContainer}>
            <Text style={styles.text}>Frequency</Text>
            <View style={styles.picker}>
              <Picker
                selectedValue={servicePer}
                onValueChange={(itemValue, ItemIndex) =>
                  setServicePer(itemValue.toString())
                }>
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
            <AppBtnGrp state={{btnObj, setBtnObj}} />
          </View>

          {/* Recurring Rate */}
          <View style={styles.fieldContainer}>
            <Text style={styles.text}>Recurring Rate</Text>
            <TextInput
              style={styles.textInput}
              value={recurringRate}
              onChange={(text) => setRecurringRate(text.nativeEvent.text)}
            />
          </View>

          {/* On Demand Rate */}
          <View style={styles.fieldContainer}>
            <Text style={styles.text}>On Demand Rate</Text>
            <TextInput
              style={styles.textInput}
              value={demandRate}
              onChange={(text) => setDemandRate(text.nativeEvent.text)}
            />
          </View>

          {/* Location */}
          <AppTextInput
            label='Location'
            name='location'
            value={location}
            onChange={val => setLocation(val)}
            validations={[]}
            errors={[]}
            setErrors={() => null}
          />

          {/* Start Date */}
          <View style={styles.fieldContainer}>
            <View style={styles.columnContainer}>
              <View style={styles.column}>
                <Text style={styles.text}>Start Date</Text>
                <View style={styles.textInput}>
                  <TextInputMask
                    type={'datetime'}
                    options={{
                      format: 'MM/DD/YYYY',
                    }}
                    value={startDate}
                    onChangeText={(text) => setStartDate(text)}
                  />
                </View>
              </View>
              <View style={[styles.column, styles.calendarButton]}>
                <AppButton
                  title="Calendar"
                  onPress={() => openStartDateCalendar(true)}
                  icon={{name: 'calendar', type: 'MaterialCommunityIcons'}}
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
                    type={'datetime'}
                    options={{
                      format: 'MM/DD/YYYY',
                    }}
                    value={endDate}
                    onChangeText={(text) => setEndDate(text)}
                  />
                </View>
              </View>
              <View style={[styles.column, styles.calendarButton]}>
                <AppButton
                  title="Calendar"
                  onPress={() => openEndDateCalendar(true)}
                  icon={{name: 'calendar', type: 'MaterialCommunityIcons'}}
                  backgroundColor={Colors.SMT_Secondary_2}
                />
              </View>
            </View>
          </View>

          {/* isRecurring */}
            <AppCheckBox
              containerStyle={{marginRight: 15}}
              label='Is Recurring'
              name='is_recurring'
              value={isRecurring}
              onChange={(newValue) => setIsRecurring(!isRecurring)}
              validations={[]}
              errors={[]}
              setErrors={null}
            />

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
          <View style={[styles.fieldContainer, {marginBottom: 40}]}>
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
            onPress={() => setShowStartDateCalendar(false)}>
            <Calendar
              style={{borderRadius: 4}}
              onDayPress={(day) => {
                setStartDate(formatDateString(day.dateString));
                setShowStartDateCalendar(false);
              }}
            />
          </TouchableOpacity>
        ) : null}
        {showEndDateCalendar ? (
          <TouchableOpacity
            style={styles.calendarPopup}
            onPress={() => setShowEndDateCalendar(false)}>
            <Calendar
              style={{borderRadius: 4}}
              onDayPress={(day) => {
                setEndDate(formatDateString(day.dateString));
                setShowEndDateCalendar(false);
              }}
            />
          </TouchableOpacity>
        ) : null}
      </View>
    );
}

const styles = StyleSheet.create({
    form: {
        maxHeight: Layout.window.height/1.52,
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