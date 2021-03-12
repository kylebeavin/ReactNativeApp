import {useNavigation} from '@react-navigation/native';
import React, {useState} from 'react';
import {
  StyleSheet,
  View,
  ScrollView,
  TouchableOpacity,
  Text,
  Image,
  Linking,
} from 'react-native';
import AppButton from '../../../components/Layout/AppButton';
import AppEditBtn from '../../../components/Layout/AppEditBtn';
import AppNavBtnGrp from '../../../components/Layout/AppNavBtnGrp';
import AppOrderStatusIndicator from '../../../components/Layout/AppOrderStatusIndicator';
import AppTitle from '../../../components/Layout/AppTitle';
import Colors from '../../../constants/Colors';
import {Order} from '../../../types/service';
import {getDateStringsFromDate} from '../../../utils/Helpers';

interface Props {
  route: any;
}

const OrderDetailsScreen: React.FC<Props> = ({route}) => {
  const order: Order = route.params.order;

  //#region Use State Variables
  const navigation = useNavigation();

  // Toggles
  const [statusToggle, setStatusToggle] = useState(false);
  const [urlToggle, setUrlToggle] = useState(false);
  const [notesToggle, setNotesToggle] = useState(false);
  //#endregion

  return (
    <View style={{marginBottom: 50}}>
      <AppTitle title="Order Detail" help search />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.contentContainer}>
        <AppNavBtnGrp>
          <View style={{marginRight: 60, marginTop: 12, paddingLeft: 10}}>
            <AppButton
              title="Back"
              onPress={() => navigation.goBack()}
              outlined={true}
              icon={{type: 'MaterialIcons', name: 'arrow-back'}}
            />
          </View>
          <View style={{paddingTop: 5}}>
            <AppEditBtn item={order} modal="UpdateOrderModal" />
          </View>
        </AppNavBtnGrp>

        <View style={{paddingLeft: 10}}>
          <Text style={{fontWeight: 'bold'}}>{order.order_id}</Text>
          <Text>Agreement: {order.agreement_id ? 'Yes' : 'No'}</Text>
          <Text>Account: {order.account_id.account_name}</Text>
          <Text>Group: {order.group_id}</Text>
          <Text>Recurring: {order.is_recurring ? 'Yes' : 'No'}</Text>
          <Text>Active: {order.is_active ? 'Yes' : 'No'}</Text>
          <Text>Demo: {order.is_demo ? 'Yes' : 'No'}</Text>
          <Text>Services: {order.services.toString()}</Text>
          <Text>Frequency: {order.service_frequency}</Text>
          <Text>Per: {order.service_per}</Text>
          <Text>Days: {order.service_days}</Text>
          <Text>Monthly Rate: {order.monthly_rate}</Text>
          <Text>Demand Rate: {order.demand_rate}</Text>
          <Text>Term Date: {order.term_date}</Text>
          <Text>
            Start Date: {getDateStringsFromDate(order.start_date).date}
          </Text>
          <Text>End Date: {getDateStringsFromDate(order.end_date).date}</Text>
        </View>

        <TouchableOpacity onPress={() => setStatusToggle(!statusToggle)}>
          <AppTitle title="Status" />
        </TouchableOpacity>
        {!statusToggle ? null : (
          <View style={{paddingLeft: 10}}>
            <AppOrderStatusIndicator id={order._id} currentStatus={order.order_status}/>
          </View>
        )}

        <TouchableOpacity onPress={() => setUrlToggle(!urlToggle)}>
          <AppTitle title="Url" />
        </TouchableOpacity>
        {!urlToggle ? null : (
          <View style={{paddingLeft: 10, paddingTop: 10, alignItems: 'center'}}>
            {order.url.map((item: string) => {
              return (
                <View style={{marginBottom: 10}} key={item}>
                  <Text
                    style={styles.link}
                    onPress={() => Linking.openURL(item)}>
                    {item}
                  </Text>
                  {/* <Image
                    source={{uri: item}}
                    style={styles.thumbnail}
                  /> */}
                </View>
              );
            })}
          </View>
        )}

        <TouchableOpacity onPress={() => setNotesToggle(!notesToggle)}>
          <AppTitle title="Notes" />
        </TouchableOpacity>
        {!notesToggle ? null : (
          <View style={{paddingLeft: 10}}>
            {order.notes.map((item: string) => {
              return (
                <View key={item}>
                  <Text
                    style={styles.link}
                    onPress={() => null}>
                    {item}
                  </Text>
                </View>
              );
            })}
          </View>
        )}
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
  },
  link: {
    color: Colors.SMT_Secondary_2_Light_1,
  },
  thumbnail: {
    height: 200,
    width: 200,
    borderRadius: 4,
  },
});

export default OrderDetailsScreen;
