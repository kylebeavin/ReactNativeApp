import React, {useContext, useEffect, useState, useRef} from 'react';
import {
  ScrollView,
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {Calendar} from 'react-native-calendars';

import Colors from '../../../constants/Colors';
import Configs from '../../../constants/Configs';
import AppContext from '../../../providers/AppContext';
import {ToastContext} from '../../../providers/ToastProvider';
import AppTitle from '../../../components/layout/AppTitle';
import {formatDate, getDateStringsFromDate} from '../../../utils/Helpers';
import useDates from '../../../hooks/useDates';
import AppNavGroup from '../../../components/layout/AppNavGroup';
import { Invoice } from '../../../types/invoices';
import AppEmptyCard from '../../../components/layout/AppEmptyCard';

interface IMarkedDays {
  [key: string]: {
    selected: boolean;
    selectedColor: string;
  };
}

const InvoicesCalendarScreen = () => {
  //#region Use State Variables
  const {grpId, token} = useContext(AppContext);
  const {show} = useContext(ToastContext);
  const navigation = useNavigation();
  const [date, setDate] = useState(new Date());
  const {getSelectedDateRange, addDays} = useDates();
  
  let firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
  // Refs
  let selectedQuery = useRef<any>({group_id: grpId, service_date: {$gte: formatDate(new Date()), $lt: new Date(addDays(date, 1).toLocaleDateString())}}).current;
  let outstandingQuery = useRef<any>({group_id: grpId, service_date: {$gte: formatDate(firstDay), $lt: new Date(date.setHours(0))}, order_status: {$ne: 'completed'}}).current; // TODO: Update Queries to reflect invoices.
  // Calendar
  const [selectedDates, setSelectedDates] = useState<any>({
    [formatDate(new Date())]: {selected: true},
  });
  const [outstandingInvoices, setOutstandingInvoices] = useState<any>({});

  // List
  const [selectedInvoices, setSelectedInvoices] = useState<Invoice[]>([]);

  // Picker
  const [sortItem, setSortItem] = useState('');
  //#endregion

  useEffect(() => {
    getSelectedDates();
  }, []);

  const onDayPress = async (day: any) => {
    // DeSelect Day
    let lessThan = new Date(day.dateString);
    let newDays = selectedDates;
    // Find and Remove the date object with only 1 key (currently selected date).
    Object.keys(newDays).find(key => {
      if (shallowEqual(newDays[key])) {
        delete newDays[key];
      }
    });

    // Select Day
    newDays[day.dateString] = {selected: true};
    //update queries
    selectedQuery = {group_id: grpId, service_date: {$gte: day.dateString, $lt: lessThan.setDate(lessThan.getDate() + 1)}}
    
    // Fetch Orders
    await getSelectedDates();
  };

  const onMonthChange = (month: any) => {
    // Get First and Last Day
    // Fetch Outstanding Orders
  };

  const getSelectedDates = async () => {
    await getSelectedInvoices();
    const oOrderDays: IMarkedDays[] = await getOutstandingInvoices();

    setSelectedDates({...oOrderDays, ...selectedDates});
  };

  const getOutstandingInvoices = async (): Promise<IMarkedDays[]> => {
    const invoices: any = await fetch(
      `${Configs.TCMC_URI}/api/invoicesBy`,
      {
        method: 'POST',
        body: JSON.stringify(outstandingQuery),
        headers: {'Content-Type': 'application/json', 'x-access-token': token},
      },
    )
      .then((res) => res.json())
      .then((json) => {
        let outstandingInvoices: IMarkedDays = {};
        json.data.map((u: any, i: any) => {
          return (
            outstandingInvoices[formatDate(u.service_date)] = {selected: true, selectedColor: Colors.SMT_Primary_1}
            )
          })
        setOutstandingInvoices({...outstandingInvoices});
        return outstandingInvoices;
      })
      .catch((err) => show({message: 'Error getting invoices.'}));

    return invoices;
  };

  const getSelectedInvoices = async () => {
    await fetch(`${Configs.TCMC_URI}/api/invoicesBy`, {
      method: 'POST',
      body: JSON.stringify(selectedQuery),
      headers: {'Content-Type': 'application/json', 'x-access-token': token},
    })
      .then((res) => res.json())
      .then((json) => {
        setSelectedInvoices(json.data)
      })
      .catch((err) => show({message: 'Error getting invoices.'}));
  };

  const shallowEqual = (object1: any) => {
    // Not a complete shallow comparison 
    const keys1 = Object.keys(object1);
    const keys2 = Object.keys({'selected': true});
  
    if (keys1.length !== keys2.length) {
      return false;
    }
  
    // for (let key of keys1) {
    //   if (object1[key] !== object2[key]) {
    //     return false;
    //   }
    // }
  
    return true;
  }

  return (
    <>
      <AppTitle title="Invoices" />

      <ScrollView style={styles.scrollView}>
        <View style={{paddingHorizontal: 10}}>
          <AppNavGroup
            add={{title: 'Invoice', modal: 'CreateInvoiceModal'}}
            list="InvoicesScreen"
            schedule="InvoicesCalendarScreen"
            map="InvoicesMapScreen"
            focused="Schedule"
          />
        </View>

        <View style={{paddingHorizontal: 10}}>
          <View
            style={[
              styles.calendarContainer,
              {paddingLeft: 1, marginRight: -0, paddingBottom: 7},
            ]}>
            <Calendar
              // ToDo: Modified the Calendars style sheets here C:\Users\kyleb\Desktop\Code\Smash-app-native\node_modules\react-native-calendars\src\calendar\style.js
              // This is bad practice to modify a dependency directly will need to revisit when i make calendar component.
              markedDates={selectedDates}
              onDayPress={onDayPress}
              onMonthChange={onMonthChange}
              theme={{
                calendarBackground: '#ffffff00',
                'stylesheet.calendar.header': {
                  header: {
                    flexDirection: 'row',
                    justifyContent: 'space-around',
                    paddingLeft: 10,
                    paddingRight: 10,
                    marginTop: 6,
                    alignItems: 'center',
                  },
                  monthText: {
                    fontSize: 30,
                    fontWeight: 'bold',
                    color: Colors.Dark,
                  },
                  arrow: {},
                  arrowImage: {
                    tintColor: '#ffffff',
                    backgroundColor: Colors.SMT_Secondary_2_Dark_1,
                    height: 30,
                    width: 30,
                    borderRadius: 30 / 2,
                    marginRight: 10,
                  },
                  dayHeader: {
                    color: 'black',
                  },
                },
                'stylesheet.day.basic': {
                  base: {
                    borderColor: Colors.SMT_Secondary_1_Light_1,
                    borderWidth: 1,
                    //height: 50,
                    width: '100%',
                    justifyContent: 'center',
                    alignItems: 'center',
                    marginBottom: -15,
                  },
                  selected: {
                    backgroundColor: Colors.SMT_Secondary_2_Light_1,
                    borderRadius: 0,
                  },
                  today: {},
                  todayText: {},
                },
              }}
            />
          </View>
        </View>

        <View style={{marginBottom: 10}}>
          <AppTitle title="Invoice Events" />
        </View>

        <View style={{paddingHorizontal: 10}}>
          {selectedInvoices.length === 0 ? <AppEmptyCard entity='invoices' modal='CreateInvoiceModal' /> : selectedInvoices.map((u, i) => {
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
    </>
  );
};

const styles = StyleSheet.create({
  calendarContainer: {
    //marginBottom: 10,
    //marginTop: -10,
    //paddingHorizontal: 10,
    paddingRight: 1,
    borderWidth: 2,
    borderColor: Colors.SMT_Secondary_1_Light_1,
    borderRadius: 5,
    //elevation: 1,
    //overflow: 'hidden'
  },
  container: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    marginBottom: 20,
  },
  column2: {
    flex: 1,
    alignItems: 'flex-end',
  },
  picker: {
    flex: 1,
    paddingLeft: 15,
    borderColor: Colors.SMT_Secondary_1_Light_1,
    borderWidth: 2,
    borderRadius: 3,
    height: 36,
    overflow: 'hidden',
  },
  scrollView: {
    height: '100%',
    width: '100%',
  },
  content: {
    marginBottom: 10,
  },
  //=== Card ===//
  card: {
    backgroundColor: Colors.SMT_Tertiary_1,
    marginBottom: 3,
    borderWidth: 1,
    borderColor: Colors.SMT_Secondary_1_Light_1,
    borderRadius: 3,
    paddingVertical: 3,
    paddingHorizontal: 5,
  },
  title: {
    marginBottom: 10,
  },
  titleText: {
    fontWeight: 'bold',
  },
});

export default InvoicesCalendarScreen;
