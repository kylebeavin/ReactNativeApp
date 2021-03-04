import React, {useContext, useEffect, useState} from 'react';
import {ScrollView, StyleSheet, View, Text, TouchableOpacity} from 'react-native';
import {useIsFocused, useNavigation} from '@react-navigation/native';
import {Picker} from '@react-native-picker/picker';

import Configs from '../../../constants/Configs';
import AppButton from '../../../components/Layout/AppButton';
import Colors from '../../../constants/Colors';
import AppTitle from '../../../components/Layout/AppTitle';
import AppNavBtnGrp from '../../../components/Layout/AppNavBtnGrp';
import {formatDate, getDateStringsFromDate} from '../../../utils/Helpers';
import {Services} from '../../../types/enums';
import {Calendar} from 'react-native-calendars';
import AppContext from '../../../providers/AppContext';
import AppList from '../../../components/Layout/AppList';
import { ToastContext } from '../../../providers/ToastProvider';

const ServicesScreen = () => {
  //#region Use State Variables
  const {grpId, token} = useContext(AppContext);
  const {show} = useContext(ToastContext);
  const navigation = useNavigation();
  const isFocused = useIsFocused();
  const [greaterThanDate, setGreaterThanDate] = useState(formatDate(new Date()));
  const [lessThanDate, setLessThanDate] = useState(formatDate(new Date()));
  const [sortItem, setSortItem] = useState('');
  const [selectedDate, setSelectedDate] = useState<any>({[formatDate(new Date())]: {selected: true}});
  //#endregion

  useEffect(() => {
    setTodaysDate();
    setOutstandingOrders();
  }, []);

  const setTodaysDate = () => {
    let today = formatDate(new Date());
    let lessThan = new Date();
    lessThan.setDate(lessThan.getDate() + 1);

    // Mark The Calendar with this state.
    setSelectedDate({[today]: {selected: true}});

    // Set our queries less than date.
    setLessThanDate(formatDate(lessThan));

    // Set todays date in state to make api call.
    setGreaterThanDate(today);
  };

  const onDayPress = (day: any) => {
    let lessThan = new Date(day.dateString);
    lessThan.setDate(lessThan.getDate() + 1);

    // Mark The Calendar with this state.
    setSelectedDate({[day.dateString]: {selected: true}});

    // Set our queries less than date.
    setLessThanDate(lessThan.setDate(lessThan.getDate() + 1).toString());

    // Set todays date in state to make api call.
    setGreaterThanDate(day.dateString);
  };

  const setOutstandingOrders = async () => {
    var date = new Date();
    var firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
    
    await fetch(`${Configs.TCMC_URI}/api/ordersBy`, {
      method: 'POST',
      body: JSON.stringify({group_id: grpId, start_date: {$gte: firstDay.setHours(0,0,0,0), $lt: date.setHours(0,0,0,0)}, order_status: {$ne: "completed"}}),
      headers: {'Content-Type': 'application/json', 'x-access-token': token},
    })
      .then(res => res.json())
      .then(json => {
        let outstandingOrders: any = {};
        json.data.map((u: any, i: any) => {
          return (
            outstandingOrders[formatDate(u.start_date)] = {selected: true, selectedColor: Colors.SMT_Primary_1_Light_1}
          )
        })

        setSelectedDate({...selectedDate, ...outstandingOrders})
      })
      .catch(err => show({message: "Error getting outstanding orders."}))
    
  };

  const onMonthChange = () => {};

  return (
    <View style={styles.screen}>
      <AppTitle title="Calendar" help search />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.contentContainer}>
        <AppNavBtnGrp>
          <View style={{marginRight: 60, marginTop: 12}}>
            <AppButton
              title="Back"
              onPress={() => navigation.goBack()}
              outlined={true}
              icon={{type: 'MaterialIcons', name: 'arrow-back'}}
            />
          </View>
          <View style={{marginRight: -10}}>
            <View style={{flex: 1}}>
              <Text style={{fontSize: 12}}>List View</Text>
              <View style={styles.picker}>
                <Picker
                  style={{height: 30}}
                  selectedValue={sortItem}
                  mode="dropdown"
                  onValueChange={(itemValue, itemIndex) =>
                    setSortItem(itemValue.toString())
                  }>
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
          </View>
        </AppNavBtnGrp>

        <View style={styles.calendarContainer}>
          <Calendar
            markedDates={selectedDate}
            onDayPress={onDayPress}
            onMonthChange={setOutstandingOrders}
            theme={{
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

        <View style={{marginBottom: 20}}>
          <AppTitle title="Service Events" />
        </View>

        <AppList
          url={`${Configs.TCMC_URI}/api/ordersBy`}
          httpMethod="POST"
          params={{
            group_id: grpId,
            start_date: {$gte: greaterThanDate, $lt: lessThanDate},
          }}
          renderItem={(u: any, i: number) => {
            return (
              <TouchableOpacity
              style={styles.card}
              key={i}
              onPress={() =>
                navigation.navigate('OrderDetailsScreen', {order: u})
              }>
              <View style={{flexDirection: 'row'}}>
                <View style={{flex: 1}}>
                  <Text style={styles.titleText}>{u.order_id}</Text>
                  <Text>{u.account_id.account_name}</Text>
                </View>
                <View style={{flex: 1}}>
                  <Text style={{color: Colors.SMT_Primary_1, textAlign: 'right'}}>{getDateStringsFromDate(u.start_date).date}</Text>
                  <Text
                    style={{
                      fontWeight: 'bold',
                      color: Colors.SMT_Secondary_2_Light_1,
                      textAlign: 'right',
                    }}>
                    {u.order_status}
                  </Text>
                </View>
              </View>
            </TouchableOpacity>
            );
          }}
        />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  calendar: {},
  calendarContainer: {
    marginBottom: 20,
  },
  column1: {},
  container: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    marginBottom: 20,
  },
  contentContainer: {
    // This is the scrollable part
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
  screen: {
    marginBottom: 36,
  },
  scrollView: {
    height: '100%',
    width: '100%',
    paddingHorizontal: 10,
  },
  status: {},
  statusValid: {
    color: Colors.Success,
  },
  statusInvalid: {
    color: Colors.Info,
  },
  content: {
    marginBottom: 10,
  },

  //=== Card ===//
  btnContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  card: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: Colors.SMT_Tertiary_1,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: Colors.SMT_Secondary_2_Light_1,
    borderRadius: 3,
    padding: 5,
  },
  title: {
    marginBottom: 10,
  },
  titleText: {
    fontWeight: 'bold',
  },
});

export default ServicesScreen;
