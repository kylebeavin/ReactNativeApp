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
import AppPicker from '../../../components/layout/AppPicker';
import { acc } from 'react-native-reanimated';
import AppDatePicker from '../../../components/layout/AppDatePicker';

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

    // Frequency
    const [sunFreq, setSunFreq] = useState('');
    const [monFreq, setMonFreq] = useState('');
    const [tueFreq, setTueFreq] = useState('');
    const [wedFreq, setWedFreq] = useState('');
    const [thuFreq, setThuFreq] = useState('');
    const [friFreq, setFriFreq] = useState('');
    const [satFreq, setSatFreq] = useState('');


    // DropDowns
    const [accountList, setAccountList] = useState<Account[]>([]);

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
        agreement_id: '',
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
        //service_days: getBtnGrpValues(),
        //service_frequency: servicePer,
        start_date: startDate,
        url: fileUploadUrl,

        sun_freq: parseInt(sunFreq),
        mon_freq: parseInt(monFreq),
        tue_freq: parseInt(tueFreq),
        wed_freq: parseInt(wedFreq),
        thu_freq: parseInt(thuFreq),
        fri_freq: parseInt(friFreq),
        sat_freq: parseInt(satFreq),
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
      await fetch(`${Configs.TCMC_URI}/api/agreementsRecurring`, {
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
          <AppPicker
            label="Account"
            name="account"
            value={account}
            list={accountList.map((u) => {
              return {_id: u._id, label: u.account_name, value: u._id};
            })}
            onChange={(itemValue) => setAccount(itemValue.toString())}
            validations={[]}
            errors={[]}
            setErrors={() => null}
          />

          {/* Container Qty */}
          <AppTextInput
            label="Container Qty"
            name="container_qty"
            value={containerQty}
            onChange={(val) => setContainerQty(val)}
            validations={[]}
            errors={[]}
            setErrors={() => null}
            keyboardType="number-pad"
          />

          {/* Frequency */}
          {/* <AppPicker
            label="Frequency"
            name="frequency"
            value={servicePer}
            list={Object.values(ServicesPer).map((u) => {
              return {_id: u, label: u, value: u};
            })}
            onChange={(itemValue) => setServicePer(itemValue.toString())}
            validations={[]}
            errors={[]}
            setErrors={() => null}
          /> */}

          {/* Service Days */}
          {/* <View style={styles.fieldContainer}>
            <Text style={styles.text}>Days</Text>
            <AppBtnGrp state={{btnObj, setBtnObj}} />
          </View> */}

          {/* Frequency */}
          <AppTextInput
            label="Sunday"
            name="sun_freq"
            value={sunFreq}
            onChange={(val) => setSunFreq(val)}
            validations={[]}
            errors={[]}
            setErrors={() => null}
            keyboardType='number-pad'
          />
          <AppTextInput
            label="Monday"
            name="mon_freq"
            value={monFreq}
            onChange={(val) => setMonFreq(val)}
            validations={[]}
            errors={[]}
            setErrors={() => null}
            keyboardType='number-pad'

          />
          <AppTextInput
            label="Tuesday"
            name="tue_freq"
            value={tueFreq}
            onChange={(val) => setTueFreq(val)}
            validations={[]}
            errors={[]}
            setErrors={() => null}
            keyboardType='number-pad'

          />
          <AppTextInput
            label="Wednesday"
            name="wed_freq"
            value={wedFreq}
            onChange={(val) => setWedFreq(val)}
            validations={[]}
            errors={[]}
            setErrors={() => null}
            keyboardType='number-pad'

          />
          <AppTextInput
            label="Thursday"
            name="thu_freq"
            value={thuFreq}
            onChange={(val) => setThuFreq(val)}
            validations={[]}
            errors={[]}
            setErrors={() => null}
            keyboardType='number-pad'
          />
          <AppTextInput
            label="Friday"
            name="fri_freq"
            value={friFreq}
            onChange={(val) => setFriFreq(val)}
            validations={[]}
            errors={[]}
            setErrors={() => null}
            keyboardType='number-pad'
          />
          <AppTextInput
            label="Saturday"
            name="sat_freq"
            value={satFreq}
            onChange={(val) => setSatFreq(val)}
            validations={[]}
            errors={[]}
            setErrors={() => null}
            keyboardType='number-pad'
          />

          {/* Recurring Rate */}
          <AppTextInput 
            label='Recurring Rate'
            name='recurring_rate'
            value={recurringRate}
            onChange={(val) => setRecurringRate(val)}
            validations={[]}
            errors={[]}
            setErrors={() => null}
          />

          {/* On Demand Rate */}
          <AppTextInput 
            label='On Demand Rate'
            name='demand_rate'
            value={demandRate}
            onChange={(val) => setDemandRate(val)}
            validations={[]}
            errors={[]}
            setErrors={() => null}
          />

          {/* Location */}
          <AppTextInput
            label="Location"
            name="location"
            value={location}
            onChange={(val) => setLocation(val)}
            validations={[]}
            errors={[]}
            setErrors={() => null}
          />

          {/* Start Date */}
          <AppDatePicker 
            label='Start Date'
            name='start_date'
            value={startDate}
            onChange={(text) => setStartDate(text)}
            validations={[]}
            errors={[]}
            setErrors={() => null}
          />

          {/* End Date */}
          <AppDatePicker 
            label='End Date'
            name='end_date'
            value={endDate}
            onChange={(text) => setEndDate(text)}
            validations={[]}
            errors={[]}
            setErrors={() => null}
          />

          {/* isRecurring */}
          <AppCheckBox
            containerStyle={{marginRight: 15}}
            label="Is Recurring"
            name="is_recurring"
            value={isRecurring}
            onChange={(name, val) => setIsRecurring(val)}
            validations={[]}
            errors={[]}
            setErrors={null}
          />

          {/* File Upload URL */}
          <AppTextInput 
            label='File Upload URL'
            name='url'
            value={fileUploadUrl}
            onChange={(val) => setFileUploadUrl(val)}
            validations={[]}
            errors={[]}
            setErrors={() => null}
          />

          {/* Notes */}
          <View style={[styles.fieldContainer, {marginBottom: 40}]}>
          <AppTextInput 
            label='Notes'
            name='notes'
            value={notes}
            onChange={(val) => setNotes(val)}
            validations={[]}
            errors={[]}
            setErrors={() => null}
          />
          </View>
        </ScrollView>

        <ModalButtons navigation={navigation} save={() => postNewAgreement()} />
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