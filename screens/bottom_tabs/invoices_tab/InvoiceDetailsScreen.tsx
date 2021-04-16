import {useNavigation} from '@react-navigation/native';
import React, {useState} from 'react';
import {
  StyleSheet,
  View,
  ScrollView,
  TouchableOpacity,
  Text,
} from 'react-native';
import AppButton from '../../../components/layout/AppButton';
import AppEditBtn from '../../../components/layout/AppEditBtn';
import AppNavBtnGrp from '../../../components/layout/AppNavBtnGrp';
import AppTitle from '../../../components/layout/AppTitle';
import Colors from '../../../constants/Colors';
import { Invoice } from '../../../types/invoices';
import {getDateStringsFromDate} from '../../../utils/Helpers';

interface Props {
  route: any;
}

const InvoiceDetailsScreen: React.FC<Props> = ({route}) => {
  const model: Invoice = route.params.model;
  
  //#region Use State Variables
  const navigation = useNavigation();

  //#endregion
  return (
    <View style={{marginBottom: 50}}>
      <AppTitle title="Invoice Detail" />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.contentContainer}>
        <AppNavBtnGrp>
          <View style={{marginRight: 60, marginTop: 12, paddingLeft: 10}}>
            <AppButton
              title="Back"
              onPress={() => navigation.goBack()}
              outlined={true}
              icon={{type: 'MaterialIcons', name: 'arrow-back'}}
            />
          </View>
          <View style={{paddingTop: 5}}>
            <AppEditBtn item={model} modal="UpdateInvoiceModal" />
          </View>
        </AppNavBtnGrp>

        <View style={{paddingLeft: 10}}>
          <Text style={{fontWeight: 'bold'}}>{model.invoice_id}</Text>
          <Text>Account: {model.account_id.account_name}</Text>
          <Text>Contact: {model.contact_id ? model.contact_id.first_name + ' ' + model.contact_id.last_name : 'No Name'}</Text>
          <Text>Charges: {model.charges.length === 0 ? '0' : model.charges.map(u => `${u}, `)}</Text>
          <Text>Invoice Date: {getDateStringsFromDate(model.invoice_date).date}</Text>
          <Text>Active: {model.is_active ? 'Yes' : 'No'}</Text>
          <Text>Purchase Order: {model.purchase_order}</Text>
          <Text>Orders: {model.order_id.length === 0 ? '0' : model.order_id.map(u => `${u}, `)}</Text>
          <Text>Subtotal: {model.subtotal}</Text>
          <Text>Tax: {model.tax}</Text>
          <Text>Total: {model.total}</Text>
          <Text>Type: {model.type}</Text>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  contentContainer: {
    // This is the scrollable part
  },
  scrollView: {
    height: '100%',
    width: '100%',
  },
  link: {
    color: Colors.SMT_Secondary_2_Light_1,
  },
  thumbnail: {
    height: 200,
    width: 200,
    borderRadius: 4,
  },
});

export default InvoiceDetailsScreen;
