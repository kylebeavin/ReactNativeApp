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
import {Agreement, Order} from '../../../types/orders';
import AppEmptyCard from '../../../components/layout/AppEmptyCard';
import AppContext from '../../../providers/AppContext';
import {useContext} from 'react';
import {ToastContext} from '../../../providers/ToastProvider';
import {TouchableOpacity} from 'react-native-gesture-handler';
import { getDateStringsFromDate, isSuccessStatusCode } from '../../../utils/Helpers';
import AppNavGroup from '../../../components/layout/AppNavGroup';

const OrdersScreen = () => {
  //#region Use State Variables
  const navigation = useNavigation();
  const {grpId, token} = useContext(AppContext);
  const {show} = useContext(ToastContext);
  const [isLoading, setIsLoading] = useState(true);
  const [orders, setOrders] = useState<Order[]>([]);
  const [agreements, setAgreements] = useState<Agreement[]>([]);
  const isFocused = useIsFocused();

  // Toggles
  const [agreementToggle, setAgreementToggle] = useState(false);
  const [orderToggle, setOrderToggle] = useState(false);
  //#endregion

  useEffect(() => {
    getOrders();
  }, [isFocused]);

  const getAgreements = async () => {
    await fetch(`${Configs.TCMC_URI}/api/agreementsBy`, {
    method: 'POST',
    body: JSON.stringify({group_id: grpId}),
    headers: {'Content-Type': 'application/json', 'x-access-token': token},
  })
    .then((res) => res.json())
    .then((json) => {
      if (isSuccessStatusCode(json.status)) {
        setAgreements(json.data)
      } else {
        show({message: json.message});
      }

    })
    .catch((err) => show({message: err.message}));
  };

  const getOrders = async () => {
    await fetch(`${Configs.TCMC_URI}/api/ordersBy`, {
      method: 'POST',
      body: JSON.stringify({group_id: grpId}),
      headers: {'Content-Type': 'application/json', 'x-access-token': token},
    })
      .then((res) => res.json())
      .then((json) => {
        
        setOrders(json.data)
      })
      .catch((err) => show({message: err.message}));

    setIsLoading(false);
  };

  return (
    <View style={styles.screen}>
      <AppTitle title="Orders" />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.contentContainer}>
        <View style={{paddingHorizontal: 10}}>
          <AppNavGroup
            add={{
              title: 'Order',
              modal: 'ModalPopup',
              modals: ['CreateAgreementModal', 'CreateOrderModal'],
            }}
            list="OrdersScreen"
            schedule="OrdersCalendarScreen"
            map="OrdersMapScreen"
            focused="List"
          />
        </View>

        <TouchableOpacity
          onPress={() => {
            getAgreements();
            setAgreementToggle(!agreementToggle);
          }}
          >
            <AppTitle title='Agreements' />
          </TouchableOpacity>
          {!agreementToggle ? null : (
            <View style={styles.subList}>
            {agreements.map((u, i) => {
              return (
                <TouchableOpacity
                  style={styles.card}
                  key={u._id}
                  onPress={() =>
                    navigation.navigate('AgreementDetailsScreen', {model: u})
                  }>
                  <View style={{flexDirection: 'row'}}>
                    <View style={{flex: 1}}>
                      <Text numberOfLines={1} style={{fontWeight: 'bold'}}>
                        {u._id}
                      </Text>
                      <Text numberOfLines={1}>{u.owner_id}</Text>
                    </View>
                    <View >
                      <Text style={{color: Colors.SMT_Primary_1}}>
                        {u.is_recurring ? 'Recurring' : 'Demand'}
                      </Text>
                      <Text style={{color: Colors.SMT_Secondary_2_Light_1}}>{u.is_active ? 'Active' : 'Inactive'}</Text>
                    </View>
                  </View>
                </TouchableOpacity>
              );
            })}
            </View>
          )}

        <TouchableOpacity
          onPress={() => {
            getOrders();
            setOrderToggle(!orderToggle);
          }}>
          <AppTitle title="Orders" />
        </TouchableOpacity>
        {!orderToggle ? null : isLoading ? (
          <ActivityIndicator color={Colors.SMT_Primary_2} animating={true} />
        ) : (
          <View style={{padding: 10}}>
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
                      navigation.navigate('OrderDetailsScreen', {model: u})
                    }>
                    <View style={{flexDirection: 'row'}}>
                      <View style={{flex: 1}}>
                        <Text style={styles.titleText}>{u.order_id}</Text>
                        <Text>{u.account_id.account_name}</Text>
                      </View>
                      <View style={{flex: 1}}>
                        <Text
                          style={{
                            color: Colors.SMT_Primary_1,
                            textAlign: 'right',
                          }}>
                          {getDateStringsFromDate(u.service_date).date}
                        </Text>
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

export default OrdersScreen;
