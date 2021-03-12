import {Picker} from '@react-native-picker/picker';
import {useIsFocused, useNavigation} from '@react-navigation/native';
import React, {useContext, useEffect, useState} from 'react';
import {StyleSheet, View, Text, ScrollView} from 'react-native';
import {Calendar} from 'react-native-calendars';
import AppButton from '../../../components/Layout/AppButton';
import AppList from '../../../components/Layout/AppList';
import AppNavBtnGrp from '../../../components/Layout/AppNavBtnGrp';
import AppTitle from '../../../components/Layout/AppTitle';
import Colors from '../../../constants/Colors';
import Configs from '../../../constants/Configs';
import AppContext from '../../../providers/AppContext';
import {RouteEvents} from '../../../types/enums';
import {Route} from '../../../types/routes';
import {formatDate} from '../../../utils/Helpers';

const RoutesCalendarScreen = () => {
  //#region Use State Variables
  const {grpId} = useContext(AppContext);
  const navigation = useNavigation();
  const isFocused = useIsFocused();
  const [greaterThanDate, setGreaterThanDate] = useState(
    formatDate(new Date()),
  );
  const [lessThanDate, setLessThanDate] = useState(formatDate(new Date()));
  const [sortItem, setSortItem] = useState('');
  const [selectedDate, setSelectedDate] = useState({
    [formatDate(new Date())]: {selected: true},
  });
  //#endregion

  useEffect(() => {
    setTodaysDate();
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

  return (
    <View>
      <AppTitle title='Calendar' help search />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.contentContainer}>
        <AppNavBtnGrp>
          <View style={{marginRight: 60, marginTop: 12}}>
            <AppButton
              title='Back'
              onPress={() => navigation.goBack()}
              outlined={true}
              icon={{type: 'MaterialIcons', name: 'arrow-back'}}
            />
          </View>
          <View style={{marginRight: -10}}>
            <View style={{flex: 1}}>
              <Text style={{fontSize: 12}}>Calendar View</Text>
              <View style={styles.picker}>
                <Picker
                  style={{height: 30}}
                  selectedValue={sortItem}
                  mode='dropdown'
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

        <View style={styles.calendarContainer}>
          <Calendar
            markedDates={selectedDate}
            onDayPress={onDayPress}
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
          <AppTitle title='Route Events' />
        </View>

        <AppList
          url={`${Configs.TCMC_URI}/api/routesBy`}
          httpMethod='POST'
          params={{
            group_id: grpId,
            time: {$gte: greaterThanDate, $lt: lessThanDate},
          }}
          renderItem={(u: any, i: number) => {
            return (
              <View style={styles.card} key={i}>
                <View style={styles.title}>
                  <Text style={styles.titleText}>{u.start_location}</Text>
                  <Text style={styles.titleText}>
                    Status:
                    <Text
                      style={{
                        fontWeight: 'bold',
                        color: Colors.SMT_Secondary_2_Light_1,
                      }}>
                      {' '}
                      On Schedule
                    </Text>
                  </Text>
                </View>

                <View style={styles.btnContainer}>
                  <AppButton
                    title='Details'
                    onPress={() =>
                      navigation.navigate('RouteDetailsScreen', {route: u})
                    }
                  />
                </View>
              </View>
            );
          }}
        />
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
    paddingHorizontal: 10,
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
  calendarContainer: {
    marginBottom: 20,
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

export default RoutesCalendarScreen;
