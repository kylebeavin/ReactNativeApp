import React, {useEffect, useState} from 'react';
import {
  ScrollView,
  StyleSheet,
  View,
  Text,
  ActivityIndicator,
} from 'react-native';

import Configs from '../../../constants/Configs';
import AppButton from '../../../components/Layout/AppButton';
import Colors from '../../../constants/Colors';
import AppTitle from '../../../components/Layout/AppTitle';
import AppNavBtnGrp from '../../../components/Layout/AppNavBtnGrp';
import {Order} from '../../../types/service';
import AppEmptyCard from '../../../components/Layout/AppEmptyCard';
import {useIsFocused} from '@react-navigation/native';
import useAsyncStorage from '../../../hooks/useAsyncStorage';
import {getRequestHeadersAsync} from '../../../utils/Helpers';
import {Picker} from '@react-native-picker/picker';
import {SortOrdersList} from '../../../types/enums';

interface Props {
  navigation: any;
}

const ServicesScreen: React.FC<Props> = ({navigation}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [orders, setOrders] = useState<Order[]>([]);
  const isFocused = useIsFocused();

  //#region
  const [sortItem, setSortItem] = useState('');
  //#endregion

  useEffect(() => {
    getOrders();
  }, [isFocused]);

  const getOrders = async () => {
    // let grpId = await useAsyncStorage()
    //   .getUserAsync()
    //   .then((user) => user.group_id);

    // await fetch(`${Configs.TCMC_URI}/api/ordersBy`, {
    //   headers: await getRequestHeadersAsync().then((header) => header),
    //   method: 'POST',
    //   body: JSON.stringify({group_id: grpId}),
    // })
    //   .then((res) => res.json())
    //   .then((json) => {
    //     if (json.data) {
    //       setOrders(json.data);
    //     }
    //   })
    //   .catch((err) => show({message: err.message})
    //   .finally(() => setLoading(false));
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
            outlined={true}
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
              outlined={false}
            />
          </View>
        </AppNavBtnGrp>

        {orders.length === 0 ? null : (
          <View style={{flex: 1, flexDirection: 'row', marginBottom: 15}}>
            <View style={{flex: 1, marginRight: 15}}>
              <Text style={{fontSize: 12}}>Sort List</Text>
              <View style={styles.picker}>
                <Picker
                  style={{height: 30}}
                  selectedValue={sortItem}
                  mode="dropdown"
                  onValueChange={(itemValue, itemIndex) =>
                    setSortItem(itemValue.toString())
                  }>
                  {Object.values(SortOrdersList).map((item, index) => {
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
                  {Object.values(SortOrdersList).map((item, index) => {
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
        )}

        {isLoading ? (
          <ActivityIndicator color={Colors.SMT_Primary_2} animating={true} />
        ) : (
          <View>
            {/* Agreements List */}
            {orders.length === 0 ? (
              // <AppEmptyCard entity="orders" modal="CreateOrderModal" />
              <View><Text>Under Development</Text></View>
            ) : (
              orders.map((u, i) => {
                return (
                  <View style={styles.card} key={i}>
                    <View style={styles.column1}>
                      <Text style={{fontWeight: 'bold'}}>{u._id}</Text>
                      <Text>{u.account_id}</Text>
                      <Text>{u.created}</Text>
                    </View>

                    <View style={styles.column2}>
                      <AppButton
                        title="Details"
                        backgroundColor={Colors.SMT_Secondary_2}
                        onPress={() =>
                          navigation.navigate('Modal', {
                            modal: 'UpdateOrderModal',
                            item: u,
                          })
                        }
                      />
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
    backgroundColor: Colors.SMT_Tertiary_1,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: Colors.SMT_Secondary_2_Light_1,
    borderRadius: 3,
    padding: 5,
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
});

export default ServicesScreen;
