import React, {useEffect, useState} from 'react';
import {
  ScrollView,
  StyleSheet,
  View,
  Text,
  ActivityIndicator,
} from 'react-native';
import {useIsFocused, useNavigation} from '@react-navigation/native';
import {Picker} from '@react-native-picker/picker';

import Configs from '../../../constants/Configs';
import AppButton from '../../../components/Layout/AppButton';
import Colors from '../../../constants/Colors';
import AppTitle from '../../../components/Layout/AppTitle';
import AppNavBtnGrp from '../../../components/Layout/AppNavBtnGrp';
import {Order} from '../../../types/service';
import useAsyncStorage from '../../../hooks/useAsyncStorage';
import {formatDate, getRequestHeadersAsync} from '../../../utils/Helpers';
import {Services} from '../../../types/enums';
import { Calendar } from 'react-native-calendars';

interface Props {
}

const ServicesScreen: React.FC<Props> = () => {
  const navigation = useNavigation();
  //#region
  const [isLoading, setLoading] = useState(true);
  const [orders, setOrders] = useState<Order[]>([]);
  const isFocused = useIsFocused();

  const [sortItem, setSortItem] = useState('');
  const [selectedDate, setSelectedDate] = useState({[formatDate(new Date())]: {selected: true}})
  //#endregion

  
  useEffect(() => {
    // let today = setTodaysDate()
    
    getOrders(Object.keys(selectedDate)[0]);
  }, [isFocused]);

  const setTodaysDate = () => {
    let today = formatDate(new Date());
    setSelectedDate({[today]: {selected: true}})
    return today;
  }

  const getOrders = async (dateString?: string) => {
    let grpId = await useAsyncStorage()
      .getUserAsync()
      .then((user) => user.group_id);

    await fetch(`${Configs.TCMC_URI}/api/ordersBy`, {
      headers: await getRequestHeadersAsync().then((header) => header),
      method: 'POST',
      body: JSON.stringify({group_id: grpId, start_date: dateString}),
    })
      .then((res) => {
        console.log(res.status)
        return res.json()
      })
      .then((json) => {
        if (json.data) {
          console.log(json)
          setOrders(json.data);
        }
      })
      .catch((err) => console.log(err))
      .finally(() => setLoading(false));
  };

  const onDayPress = (day: any) => {
    setSelectedDate({[day.dateString]: {selected: true}});
    getOrders(day.dateString);
  };

  return (
    <View style={styles.screen}>
      <AppTitle title="Calendar" help search />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.contentContainer}
        >
        <AppNavBtnGrp>
          <View style={{marginRight: 60, marginTop: 12}}>
            <AppButton
              title="Back"
              onPress={() => navigation.goBack()}
              outlined={true}
              icon={{type: "MaterialIcons", name: "arrow-back"}}
              />
          </View>
          <View style={{marginRight: -10}}>
          <View style={{flex: 1}}>
              <Text style={{fontSize: 12,}}>List View</Text>
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
            theme={{
              'stylesheet.calendar.header': {
                header: {
                  flexDirection: 'row',
                  justifyContent: 'space-around',
                  paddingLeft: 10,
                  paddingRight: 10,
                  marginTop: 6,
                  alignItems: 'center'
                },
                monthText: {
                  fontSize: 30,
                  fontWeight: 'bold',
                  color: Colors.Dark,
                },
                arrow: {
                },
                arrowImage: {
                  tintColor: "#ffffff",
                  backgroundColor: Colors.SMT_Secondary_2_Dark_1,
                  height: 30,
                  width: 30,
                  borderRadius: 30/2
                },
                dayHeader: {
                  color: 'black'
                }
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
                  borderRadius: 0
                },
                today: {
                },
                todayText: {

                },
              },
            }}
          />
        </View>

        <View style={{marginBottom: 20}}>
          <AppTitle title="Service Events"/>
        </View>

        {isLoading ? (
          <ActivityIndicator color={Colors.SMT_Primary_2} animating={true} />
        ) : (
          <View>
            {/* OrdersCalendar List */}
            {orders.length === 0 ? (
              // <AppEmptyCard entity="orders" modal="CreateOrderModal" />
              <View>
                <Text style={{textAlign: 'center'}}>No Orders on this date.</Text>
              </View>
            ) : (
              orders.map((u, i) => {
                return (
                  <View style={styles.card} key={i}>

                    <View style={styles.title}>
                      <Text style={styles.titleText}>Name Here - {u.services}</Text>
                      <Text style={styles.titleText}>Status:
                        <Text style={{fontWeight: 'bold', color: Colors.SMT_Secondary_2_Light_1}}> On Schedule</Text>
                      </Text>
                    </View>

                    <View style={styles.btnContainer}>
                      <AppButton title="Details" onPress={() => console.log("Details")} />
                    </View>
                  </View>
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
  calendar: {
  },
  calendarContainer: {
    marginBottom: 20
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
  title: {
    marginBottom: 10,
  },
  titleText: {
    fontWeight: 'bold',
  },
  btnContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  content: {
    marginBottom: 10,
  },
});

export default ServicesScreen;
