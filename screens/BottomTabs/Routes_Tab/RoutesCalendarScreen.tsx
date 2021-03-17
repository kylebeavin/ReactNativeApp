import React, {useContext, useEffect, useState, useRef} from 'react';
import {
  ScrollView,
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {Picker} from '@react-native-picker/picker';
import {Calendar} from 'react-native-calendars';

import {RouteEvents} from '../../../types/enums';
import Colors from '../../../constants/Colors';
import Configs from '../../../constants/Configs';
import AppContext from '../../../providers/AppContext';
import {ToastContext} from '../../../providers/ToastProvider';
import AppButton from '../../../components/Layout/AppButton';
import AppTitle from '../../../components/Layout/AppTitle';
import AppNavBtnGrp from '../../../components/Layout/AppNavBtnGrp';
import {formatDate, getDateStringsFromDate} from '../../../utils/Helpers';
import useDates from '../../../hooks/useDates';
import { Route } from '../../../types/routes';

interface IMarkedDays {
  [key: string]: {
    selected: boolean;
    selectedColor: string;
  };
}

const RoutesCalendarScreen = () => {
  //#region Use State Variables
  const {grpId, token} = useContext(AppContext);
  const {show} = useContext(ToastContext);
  const navigation = useNavigation();
  const [date, setDate] = useState(new Date());
  const {addDays, firstDay, lastDay} = useDates();
  
  let firstDayOfThisMonth = new Date(date.getFullYear(), date.getMonth(), 1);
  // Refs
  let selectedQuery = useRef({group_id: grpId, time: {$gte: formatDate(new Date()), $lt: new Date(addDays(date, 1).toLocaleDateString())}}).current;
  let outstandingQuery = useRef({group_id: grpId, time: {$gte: formatDate(firstDayOfThisMonth), $lt: new Date(date.setHours(0))}, route_stage: {$ne: "completed"}}).current;
  // Calendar
  const [selectedDates, setSelectedDates] = useState<any>({
    [formatDate(new Date())]: {selected: true},
  });
  const [outstandingRoutes, setOutstandingRoutes] = useState<any>({});

  // List
  const [selectedRoutes, setSelectedRoutes] = useState<Route[]>([]);

  // Picker
  const [sortItem, setSortItem] = useState('');
  //#endregion

  useEffect(() => {
    getSelectedDates();
  }, []);

  const onDayPress = async (day: any) => {
    outstandingQuery = {
      group_id: grpId,
      time: {
        $gte: formatDate(firstDay(day.dateString)),
        $lt: addDays(lastDay(day.dateString), 1),
      },
      route_stage: {$ne: 'Completed'},
    };
    // DeSelect Day
    let lessThan = new Date(day.dateString);
    let newDays = selectedDates;

    // Find and Remove the date object with only 1 key (currently selected date).
    Object.keys(newDays).find((key) => {
      if (shallowEqual(newDays[key])) {
        delete newDays[key];
      }
    });

    // Select Day
    newDays[day.dateString] = {selected: true};

    //update queries
    selectedQuery = {
      group_id: grpId,
      time: {
        $gte: day.dateString,
        $lt: lessThan.setDate(lessThan.getDate() + 1),
      },
    };
    // Fetch Orders
    await getSelectedDates();
  };

  const onMonthChange = (month: any) => {
    // Get First and Last Day for query.
    outstandingQuery = {group_id: grpId, time: {$gte: formatDate(firstDay(month.dateString)), $lt: addDays(lastDay(month.dateString), 1)}, route_stage: {$ne: "Completed"}};
    // Fetch Outstanding Orders
    getSelectedDates();
  };

  const getSelectedDates = async () => {
    await getSelectedRoutes();
    const oRouteDays: IMarkedDays[] = await getOutstandingRoutes();
    setSelectedDates({...oRouteDays, ...selectedDates});
  };

  const getOutstandingRoutes = async (): Promise<IMarkedDays[]> => {
    console.log(outstandingQuery)
    const orders: any = await fetch(
      `${Configs.TCMC_URI}/api/routesBy`,
      {
        method: 'POST',
        body: JSON.stringify(outstandingQuery),
        headers: {'Content-Type': 'application/json', 'x-access-token': token},
      },
    )
      .then((res) => res.json())
      .then((json) => {
        let outstandingRoutes: IMarkedDays = {};
        json.data.map((u: any, i: any) => {
          return (
            outstandingRoutes[formatDate(u.time)] = {selected: true, selectedColor: Colors.SMT_Primary_1}
            )
          })
        setOutstandingRoutes({...outstandingRoutes});
        return outstandingRoutes;
      })
      .catch((err) => show({message: 'Error getting routes.'}));

    return orders;
  };

  const getSelectedRoutes = async () => {
    await fetch(`${Configs.TCMC_URI}/api/routesBy`, {
      method: 'POST',
      body: JSON.stringify(selectedQuery),
      headers: {'Content-Type': 'application/json', 'x-access-token': token},
    })
      .then((res) => res.json())
      .then((json) => {
        setSelectedRoutes(json.data)
      })
      .catch((err) => show({message: 'Error getting routes.'}));
  };

  const shallowEqual = (object1: any) => {
    // Not a complete shallow comparison 
    const keys1 = Object.keys(object1);
    const keys2 = Object.keys({"selected": true});
  
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
      <AppTitle title="Calendar" />

      <ScrollView
        style={styles.scrollView}>
        <View style={{paddingHorizontal: 10}}>
          <AppNavBtnGrp>
            <View style={{marginRight: 60, marginTop: 16}}>
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
                    {Object.values(RouteEvents).map((item, index) => {
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
        </View>

        <View style={styles.calendarContainer}>
          <Calendar
            markedDates={selectedDates}
            onDayPress={onDayPress}
            onMonthChange={onMonthChange}
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

        <View style={{marginBottom: 10}}>
          <AppTitle title="Route Events" />
        </View>

        <View style={{paddingHorizontal: 10}}>
          {selectedRoutes.map((u: Route) => {
            return (
              <TouchableOpacity
                style={styles.card}
                key={u._id}
                onPress={() => navigation.navigate('RouteDetailsScreen', {model: u})}>
                <View style={{flexDirection: 'row'}}>
                  <View style={{flex: 1}}>
                    <Text numberOfLines={1} style={styles.titleText}>
                      {u._id}
                    </Text>
                    <Text>{u.route_stage}</Text>
                  </View>
                  <View style={{flex: 1}}>
                    <Text
                      style={{
                        color: Colors.SMT_Primary_1,
                        textAlign: 'right',
                      }}>
                      {getDateStringsFromDate(u.time).date}
                    </Text>
                    <Text
                      style={{
                        fontWeight: 'bold',
                        color: Colors.SMT_Secondary_2_Light_1,
                        textAlign: 'right',
                      }}>
                      {getDateStringsFromDate(u.time).time}
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
    marginBottom: 10,
    marginTop: -10,
    paddingHorizontal: 10
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

export default RoutesCalendarScreen;
