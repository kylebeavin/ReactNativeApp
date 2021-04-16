import React, {useEffect, useState} from 'react';
import {
  ScrollView,
  StyleSheet,
  View,
  Text,
  ActivityIndicator,
} from 'react-native';
import {useIsFocused, useNavigation} from '@react-navigation/native';
import Configs from '../../../constants/Configs';
import Colors from '../../../constants/Colors';
import AppTitle from '../../../components/layout/AppTitle';
import {Invoice} from '../../../types/invoices';
import AppEmptyCard from '../../../components/layout/AppEmptyCard';
import AppContext from '../../../providers/AppContext';
import {useContext} from 'react';
import {ToastContext} from '../../../providers/ToastProvider';
import {TouchableOpacity} from 'react-native-gesture-handler';
import { getDateStringsFromDate, isSuccessStatusCode } from '../../../utils/Helpers';
import AppNavGroup from '../../../components/layout/AppNavGroup';

const InvoicesScreen = () => {
  //#region Use State Variables
  const navigation = useNavigation();
  const {grpId, token} = useContext(AppContext);
  const {show} = useContext(ToastContext);
  const [isLoading, setIsLoading] = useState(true);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [outstandingInvoices, setOutstandingInvoices] = useState<Invoice[]>([]);
  const [paidInvoices, setPaidInvoices] = useState<Invoice[]>([]);
  const isFocused = useIsFocused();

  // Toggles
  const [outstandingToggle, setOutstandingToggle] = useState(false);
  const [paidToggle, setPaidToggle] = useState(false);
  //#endregion

  useEffect(() => {
    getInvoices();
  }, [isFocused]);

  const getInvoices = async () => {
    await fetch(`${Configs.TCMC_URI}/api/invoicesBy`, {
      method: 'POST',
      body: JSON.stringify({group_id: grpId}),
      headers: {'Content-Type': 'application/json', 'x-access-token': token},
    })
      .then((res) => res.json())
      .then((json) => {
        if (isSuccessStatusCode(json.status)) {
          setInvoices(json.data)
        } else {
          show({message: json.message});
        }
      })
      .catch((err) => show({message: err.message}));

    setIsLoading(false);
  };

  const getOutstandingInvoices = () => {

  };

  const getPaidInvoices = () => {

  };

  return (
    <View style={styles.screen}>
      <AppTitle title="Invoices" />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.contentContainer}>
        <View style={{paddingHorizontal: 10}}>
          <AppNavGroup
            add={{
              title: 'Invoice',
              modal: 'CreateInvoiceModal',
            }}
            list="InvoicesScreen"
            schedule="InvoicesCalendarScreen"
            map="InvoicesMapScreen"
            focused="List"
          />
        </View>

        <TouchableOpacity
          onPress={() => {
            getOutstandingInvoices();
            setOutstandingToggle(!outstandingToggle);
          }}
          >
            <AppTitle title='Outstanding Invoices' />
          </TouchableOpacity>
          {!outstandingToggle ? null : isLoading ? (
          <ActivityIndicator color={Colors.SMT_Primary_2} animating={true} />
        ) : (
          <View style={{padding: 10}}>
            {paidInvoices.length === 0 ? (
              <AppEmptyCard entity="invoices" modal="CreateInvoiceModal" />
            ) : (
              outstandingInvoices.map((u, i) => {
                return (
                  <TouchableOpacity
                  style={styles.card}
                  key={u._id}
                  onPress={() =>
                    navigation.navigate('InvoiceDetailsScreen', {model: u})
                  }>
                  <View style={{flexDirection: 'row'}}>
                    <View style={{flex: 1}}>
                      <Text numberOfLines={1} style={{fontWeight: 'bold'}}>
                        {u.account_id ? u.account_id.account_name : 'N/A'}
                      </Text>
                      <Text>{u.type}</Text>
                    </View>
                    <View >
                      <Text style={{color: Colors.SMT_Primary_1}}>
                        {getDateStringsFromDate(u.invoice_date).date}
                      </Text>
                      <Text style={{color: Colors.SMT_Secondary_2_Light_1}}>{u.total}</Text>
                    </View>
                  </View>
                </TouchableOpacity>
                );
              })
            )}
          </View>
        )}

        <TouchableOpacity
          onPress={() => {
            getPaidInvoices();
            setPaidToggle(!paidToggle);
          }}>
          <AppTitle title="Paid Invoices" />
        </TouchableOpacity>
        {!paidToggle ? null : isLoading ? (
          <ActivityIndicator color={Colors.SMT_Primary_2} animating={true} />
        ) : (
          <View style={{padding: 10}}>
            {paidInvoices.length === 0 ? (
              <AppEmptyCard entity="invoices" modal="CreateInvoiceModal" />
            ) : (
              paidInvoices.map((u, i) => {
                return (
                  <TouchableOpacity
                  style={styles.card}
                  key={u._id}
                  onPress={() =>
                    navigation.navigate('InvoiceDetailsScreen', {model: u})
                  }>
                  <View style={{flexDirection: 'row'}}>
                    <View style={{flex: 1}}>
                      <Text numberOfLines={1} style={{fontWeight: 'bold'}}>
                        {u.account_id ? u.account_id.account_name : 'N/A'}
                      </Text>
                      <Text>{u.type}</Text>
                    </View>
                    <View >
                      <Text style={{color: Colors.SMT_Primary_1}}>
                        {getDateStringsFromDate(u.invoice_date).date}
                      </Text>
                      <Text style={{color: Colors.SMT_Secondary_2_Light_1}}>{u.total}</Text>
                    </View>
                  </View>
                </TouchableOpacity>
                );
              })
            )}
          </View>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.SMT_Tertiary_1,
    marginBottom: 3,
    borderWidth: 1,
    borderColor: Colors.SMT_Secondary_1_Light_1,
    borderRadius: 3,
    paddingVertical: 3,
    paddingHorizontal: 5,
  },
  titleText: {
    fontWeight: 'bold',
  },
  contentContainer: {
    // This is the scrollable part
  },
  screen: {
    marginBottom: 36,
  },
  scrollView: {
    height: '100%',
    width: '100%',
  },
    //=== List ===//
    subList: {
      padding: 10,
    },
});

export default InvoicesScreen;
