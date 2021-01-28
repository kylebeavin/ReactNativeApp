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
import AppEditBtn from '../../../components/Layout/AppEditBtn';
import AppAddNew from '../../../components/Layout/AppAddNew';
import { useFetch } from '../../../hooks/useFetch';

interface Props {
  navigation: any;
}

const ServicesScreen: React.FC<Props> = ({navigation}) => {
  //#region Use State Variables
  const {status, data, error} = useFetch(`${Configs.TCMC_URI}/api/ordersBy`, 'POST');
  const [isLoading, setIsLoading] = useState(true);
  const [orders, setOrders] = useState<Order[]>([]);
  const isFocused = useIsFocused();

  const [sortItem, setSortItem] = useState('');
  //#endregion

  useEffect(() => {
    if (status === "fetched") {
      getOrders();
    }
  }, [isFocused, status]);

  const getOrders = async () => {
    setOrders(data.data);
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

        <AppAddNew title="ORDER" modal="CreateOrderModal"/>

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
                  <View style={styles.card} key={i}>

                    <AppEditBtn item={u}/>

                    <View style={styles.title}>
                      <Text style={styles.titleText}>Name Here - {u.services}</Text>
                      <Text style={styles.titleText}>Status:
                        <Text style={{fontWeight: 'bold', color: Colors.SMT_Secondary_2_Light_1}}> On Schedule</Text>
                      </Text>
                    </View>

                    <View style={styles.content}>
                      <Text>Driver: Name Here</Text>
                      <Text>Notes: {u.notes}</Text>
                    </View>

                    <View style={styles.btnContainer}>
                      <AppButton title="Complete" onPress={() => console.log("Complete")} />
                      <AppButton title="Report" onPress={() => console.log("Complete")} outlined />
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
    backgroundColor: Colors.SMT_Tertiary_1,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: Colors.SMT_Secondary_2_Light_1,
    borderRadius: 3,
    paddingVertical: 5,
    paddingHorizontal: 10,
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
