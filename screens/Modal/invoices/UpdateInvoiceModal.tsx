import React, {useContext, useEffect, useState} from 'react';
import {useNavigation} from '@react-navigation/native';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import {Picker} from '@react-native-picker/picker';
import {Calendar} from 'react-native-calendars';
import {TextInputMask} from 'react-native-masked-text';

import Colors from '../../../constants/Colors';
import Configs from '../../../constants/Configs';
import {Account, Contact} from '../../../types/crm';
import {formatDateString, getDateStringsFromDate, isSuccessStatusCode} from '../../../utils/Helpers';
import ModalButtons from '../ModalButtons';
import AppButton from '../../../components/layout/AppButton';
import Layout from '../../../constants/Layout';
import AppContext from '../../../providers/AppContext';
import {isRequired} from '../../../utils/Validators';
import {ToastContext} from '../../../providers/ToastProvider';
import useForm from '../../../hooks/useForm';
import { Invoice, InvoiceType } from '../../../types/invoices';
import AppPicker from '../../../components/layout/AppPicker';

interface Props {
  model: Invoice;
}

const UpdateInvoiceModal: React.FC<Props> = ({model}) => {
  //#region Form Initializers
  const formValues = {
    account: model.account_id,
    contact: model.contact_id,
    invoice_date: getDateStringsFromDate(model.invoice_date).date,
    type: model.type,
  };

  const formErrors = {
    account: [],
    contact: [],
    invoice_date: [],
    type: [],
  };

  const formValidations = {
    account: [isRequired],
    contact: [isRequired],
    invoice_date: [isRequired],
    type: [isRequired],
  };
  //#endregion

  //#region Use State Variables
  const navigation = useNavigation();
  const {grpId, token} = useContext(AppContext);
  const {show} = useContext(ToastContext);
  const {handleChange, handleSubmit, values, errors, setErrors} = useForm(
    formValues,
    formErrors,
    formValidations,
    postNewInvoice,
  );

  // DropDowns
  const [accountList, setAccountList] = useState<Account[]>([]);
  const [contactList, setContactList] = useState<Contact[]>([]);

  // Popups
  const [showStartDateCalendar, setShowStartDateCalendar] = useState(false);
  //#endregion

  useEffect(() => {
    getAccountsDropDown();
  }, []);

  const getAccountsDropDown = async () => {
    await fetch(`${Configs.TCMC_URI}/api/accountsBy`, {
      method: 'POST',
      body: JSON.stringify({group_id: grpId}),
      headers: {'Content-Type': 'application/json', 'x-access-token': token},
    })
      .then((res) => res.json())
      .then((json) => {
        if (isSuccessStatusCode(json.status)) {
          setAccountList(json.data);
        } else {
          show({message: json.message});
        }
      })
      .catch((err) => show({message: err.message}));
  };

  const getContactsDropDown = async (accountId: string) => {
    console.log(accountId)
    await fetch(`${Configs.TCMC_URI}/api/contactsBy`, {
      method: 'POST',
      body: JSON.stringify({account_id: accountId}),
      headers: {'Content-Type': 'application/json', 'x-access-token': token},
    })
      .then((res) => res.json())
      .then((json) => {
        if (isSuccessStatusCode(json.status)) {
          setContactList(json.data);
        } else {
          show({message: json.message});
        }
        })
      .catch((err) => show({message: err.message}));
  };

  const getFormData = async () => {
    const invoice: Invoice = {
        _id: '', 
        account_id: values.account,
        charges: [],
        contact_id: values.contact,
        group_id: grpId,
        invoice_date: values.invoice_date,
        invoice_id: '',
        is_active: true,
        purchase_order: '',
        order_id: [],
        subtotal: 0,
        tax: 0,
        total: 0,
        type: values.type
    };
    return invoice;
  };

  async function postNewInvoice() {
    const invoice: Invoice = await getFormData();

    await fetch(`${Configs.TCMC_URI}/api/invoices`, {
      method: 'POST',
      body: JSON.stringify(invoice),
      headers: {'Content-Type': 'application/json', 'x-access-token': token},
    })
      .then((res) => res.json())
      .then((json) => {
        if (isSuccessStatusCode(json.status)) {
          show({message: json.message});
          navigation.navigate('InvoiceDetailsScreen', {model: json.data[0]});
        } else {
          show({message: json.message});
        }
      })
      .catch((err) => show({message: err.message}));
  }

  const openStartDateCalendar = (show: boolean) => {
    setShowStartDateCalendar(show);
  };

  return (
    <View>
      <ScrollView style={styles.form}>
        {/* Account */}
        <AppPicker
          label='Account'
          name='account'
          value={values.account}
          list={accountList.map(u => {return {_id: u._id, label: u.account_name, value: u._id}})}
          onChange={(itemValue) => handleChange('account', itemValue.toString())}
          validations={[]}
          errors={errors.account}
          setErrors={setErrors}
        />

        {/* Contact */}
        <AppPicker 
          label='Contact'
          name='contact'
          value={values.contact}
          list={contactList.map((u => {return {_id: u._id, label: u.first_name + ' ' + u.last_name, value: u._id}}))}
          onChange={(itemValue) => handleChange('contact', itemValue.toString())}
          validations={[isRequired]}
          errors={errors.contact}
          setErrors={setErrors}
        />

        {/* Type */}
        <AppPicker
          label='Type'
          name='type'
          value={values.type}
          list={Object.values(InvoiceType).map(u => {return {_id: u, label: u, value: u}})}
          onChange={(itemValue) => handleChange('type', itemValue.toString())}
          validations={[]}
          errors={errors.type}
          setErrors={setErrors}
        />

        {/* Invoice Date */}
        <View style={[styles.fieldContainer, {marginBottom: 40}]}>
          <View style={styles.columnContainer}>
            <View style={styles.column}>
              <Text style={styles.text}>Invoice Date</Text>
              <View style={styles.textInput}>
                <TextInputMask
                  type={'datetime'}
                  options={{
                    format: 'MM/DD/YYYY',
                  }}
                  value={values.invoice_date}
                  onChangeText={(text) => handleChange('invoice_date', text)}
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
      </ScrollView>

      <ModalButtons navigation={navigation} save={handleSubmit} />

      {showStartDateCalendar ? (
        <TouchableOpacity
          style={styles.calendarPopup}
          onPress={() => setShowStartDateCalendar(false)}>
          <Calendar
            style={{borderRadius: 4}}
            onDayPress={(day) => {
              handleChange('invoice_date', formatDateString(day.dateString));
              setShowStartDateCalendar(false);
            }}
          />
        </TouchableOpacity>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  form: {
    maxHeight: Layout.window.height / 1.5,
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
});

export default UpdateInvoiceModal;
