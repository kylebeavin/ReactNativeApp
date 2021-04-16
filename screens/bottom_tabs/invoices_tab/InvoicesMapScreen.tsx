import React, {useContext, useEffect, useState} from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import Configs from '../../../constants/Configs';
import Colors from '../../../constants/Colors';
import AppTitle from '../../../components/layout/AppTitle';
import {useNavigation} from '@react-navigation/native';
import {getDateStringsFromDate, isSuccessStatusCode} from '../../../utils/Helpers';
import AppContext from '../../../providers/AppContext';
import { ToastContext } from '../../../providers/ToastProvider';
import MapboxGL from '@react-native-mapbox-gl/maps';
import { PermissionContext } from '../../../providers/PermissionContext';
import Geolocation from '@react-native-community/geolocation';
import useDates from '../../../hooks/useDates';
import AppNavGroup from '../../../components/layout/AppNavGroup';
import { Invoice } from '../../../types/invoices';
import AppMapbox from '../../../components/map/AppMapbox';
import AppEmptyCard from '../../../components/layout/AppEmptyCard';

const InvoicesMapScreen = () => {
  //#region Use State Variables
  const {grpId, token} = useContext(AppContext);
  const {show} = useContext(ToastContext);
  const {getPermissions} = useContext(PermissionContext);
  const navigation = useNavigation();
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const {getSelectedDateRange} = useDates();
  //#endregion

  useEffect(() => {
    getInvoices();
  }, []);

  const getInvoices = async () => {
    let {gte, lt} = getSelectedDateRange();
    await fetch(`${Configs.TCMC_URI}/api/invoicesBy`, {
      headers: {'Content-Type': 'application/json', 'x-access-token': token},
      method: 'POST',
      body: JSON.stringify({group_id: grpId}),
    })
      .then((res) => res.json())
      .then((json) => {
        if (isSuccessStatusCode(json.status)) {
          setInvoices(json.data);
        } else {
            show({message: json.message});
        }
      })
      .catch((err) => show({message: err.message}));
  };

  return (
    <View style={styles.screen}>
      <AppTitle title="Invoices" />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.contentContainer}>
        <View style={{paddingHorizontal: 10}}>
          <AppNavGroup
            add={{title: 'Invoice', modal: 'CreateInvoiceModal'}}
            list="InvoicesScreen"
            schedule="InvoicesCalendarScreen"
            map="InvoicesMapScreen"
            focused="Map"
          />
        </View>

        <View style={{paddingHorizontal: 10}}>
          <AppMapbox></AppMapbox>
        </View>

        <View style={{marginBottom: 10}}>
          <AppTitle title='Invoice Events' />
        </View>

        <View style={{paddingHorizontal: 10}}>
          {invoices.length === 0 ? <AppEmptyCard entity='invoices' modal='CreateInvoiceModal' /> : invoices.map((u: Invoice, i: number) => {
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
                  <View>
                    <Text style={{color: Colors.SMT_Primary_1}}>
                      {getDateStringsFromDate(u.invoice_date).date}
                    </Text>
                    <Text style={{color: Colors.SMT_Secondary_2_Light_1}}>
                      {u.total}
                    </Text>
                  </View>
                </View>
              </TouchableOpacity>
            );
          })}
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  mapContainer: {
    height: '100%',
    width: '100%',
  },
  map: {
    flex: 1,
  },
  card: {
    backgroundColor: Colors.SMT_Tertiary_1,
    marginBottom: 3,
    borderWidth: 1,
    borderColor: Colors.SMT_Secondary_1_Light_1,
    borderRadius: 3,
    paddingVertical: 3,
    paddingHorizontal: 5,
  },
  // column1: {},
  // container: {
  //   flexDirection: 'row',
  //   justifyContent: 'space-evenly',
  //   marginBottom: 20,
  // },
  contentContainer: {
    // This is the scrollable part
  },
  // column2: {
  //   flex: 1,
  //   alignItems: 'flex-end',
  // },
  // picker: {
  //   flex: 1,
  //   paddingLeft: 15,
  //   borderColor: Colors.SMT_Secondary_1_Light_1,
  //   borderWidth: 2,
  //   borderRadius: 3,
  //   height: 36,
  //   overflow: 'hidden',
  // },
  screen: {
    marginBottom: 36,
  },
  scrollView: {
    height: '100%',
    width: '100%',
  },
  // status: {},
  // statusValid: {
  //   color: Colors.Success,
  // },
  // statusInvalid: {
  //   color: Colors.Info,
  // },
  titleText: {
    fontWeight: 'bold',
    color: 'black'
  },
});

export default InvoicesMapScreen;
