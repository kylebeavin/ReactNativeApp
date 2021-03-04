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
import AppButton from '../../../components/Layout/AppButton';
import Colors from '../../../constants/Colors';
import AppTitle from '../../../components/Layout/AppTitle';
import AppNavBtnGrp from '../../../components/Layout/AppNavBtnGrp';
import {Order} from '../../../types/service';
import AppEmptyCard from '../../../components/Layout/AppEmptyCard';
import AppEditBtn from '../../../components/Layout/AppEditBtn';
import AppAddNew from '../../../components/Layout/AppAddNew';
import AppContext from '../../../providers/AppContext';
import {useContext} from 'react';
import {ToastContext} from '../../../providers/ToastProvider';
import {TouchableOpacity} from 'react-native-gesture-handler';
import { getDateStringsFromDate } from '../../../utils/Helpers';

const ServicesScreen = () => {
  //#region Use State Variables
  const navigation = useNavigation();
  const {grpId, token} = useContext(AppContext);
  const {show} = useContext(ToastContext);
  const [isLoading, setIsLoading] = useState(true);
  const [orders, setOrders] = useState<Order[]>([]);
  const isFocused = useIsFocused();

  const [sortItem, setSortItem] = useState('');
  //#endregion

  useEffect(() => {
    getOrders();
  }, [isFocused]);

  const getOrders = async () => {
    await fetch(`${Configs.TCMC_URI}/api/ordersBy`, {
      method: 'POST',
      body: JSON.stringify({group_id: grpId}),
      headers: {'Content-Type': 'application/json', 'x-access-token': token},
    })
      .then((res) => res.json())
      .then((json) => setOrders(json.data))
      .catch((err) => show({message: err.message}));

    setIsLoading(false);
  };

  return (
    <View style={styles.screen}>
      <AppTitle title="Service" help search />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.contentContainer}>
        <AppNavBtnGrp>
          <AppButton
            title="ORDERS"
            onPress={() => navigation.navigate('OrdersScreen')}
            outlined={false}
          />
          <AppButton
            title="CALENDAR"
            onPress={() => navigation.navigate('OrdersCalendarScreen')}
            outlined={true}
          />
          <View style={{marginRight: -10}}>
            <AppButton
              title="MAP"
              onPress={() => navigation.navigate('OrdersMapScreen')}
              outlined={true}
            />
          </View>
        </AppNavBtnGrp>

        {orders.length === 0 ? null : (
          <AppAddNew title="ORDER" modal="CreateOrderModal" />
        )}

        {isLoading ? (
          <ActivityIndicator color={Colors.SMT_Primary_2} animating={true} />
        ) : (
          <View>
            {/* Orders List */}
            {orders.length === 0 ? (
              <AppEmptyCard entity="orders" modal="CreateOrderModal" />
            ) : (
              orders.map((u, i) => {
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
    borderColor: Colors.SMT_Secondary_2_Light_1,
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
    paddingHorizontal: 10,
  },
});

export default ServicesScreen;
