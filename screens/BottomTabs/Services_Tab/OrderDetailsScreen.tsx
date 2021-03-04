import {useNavigation} from '@react-navigation/native';
import React, {useState} from 'react';
import {
  StyleSheet,
  View,
  ScrollView,
  TouchableOpacity,
  Text,
} from 'react-native';
import AppButton from '../../../components/Layout/AppButton';
import AppEditBtn from '../../../components/Layout/AppEditBtn';
import AppNavBtnGrp from '../../../components/Layout/AppNavBtnGrp';
import AppTitle from '../../../components/Layout/AppTitle';
import {Order} from '../../../types/service';
import { getDateStringsFromDate } from '../../../utils/Helpers';

interface Props {
  route: any;
}

const OrderDetailsScreen: React.FC<Props> = ({route}) => {
  const order: Order = route.params.order;
  
  //#region Use State Variables
  const navigation = useNavigation();
  // Toggles
  const [urlToggle, setUrlToggle] = useState(false);
  const [notesToggle, setNotesToggle] = useState(false);
  //#endregion

  return (
    <View>
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
          <Text>Agreement: {order.agreement_id ? "Yes" : "No"}</Text>
          <Text>Account: {order.account_id.account_name}</Text>
          <Text>group_id: {order.group_id}</Text>
          <Text>order_status: {order.order_status}</Text>
          <Text>is_recurring: {order.is_recurring.toString()}</Text>
          <Text>is_active: {order.is_active.toString()}</Text>
          <Text>is_demo: {order.is_demo.toString()}</Text>
          <Text>services: {order.services.toString()}</Text>
          <Text>service_frequency: {order.service_frequency}</Text>
          <Text>service_per: {order.service_per}</Text>
          <Text>service_days: {order.service_days}</Text>
          <Text>monthly_rate: {order.monthly_rate}</Text>
          <Text>demand_rate: {order.demand_rate}</Text>
          <Text>term_date: {order.term_date}</Text>
          <Text>start_date: {getDateStringsFromDate(order.start_date).date}</Text>
          <Text>end_date: {getDateStringsFromDate(order.end_date).date}</Text>
          <Text>url: {order.url}</Text>
          <Text>notes: {order.notes}</Text>
        </View>

        <TouchableOpacity
          onPress={() => setUrlToggle(!urlToggle)}>
          <AppTitle title="Url" />
        </TouchableOpacity>
        {!urlToggle ? null : (
          <View style={{paddingLeft: 10}}>
            <Text>Photos Go Here</Text>
          </View>
        )}

        <TouchableOpacity onPress={() => setNotesToggle(!notesToggle)}>
          <AppTitle title="Notes" />
        </TouchableOpacity>
        {!notesToggle ? null : (
          <View style={{paddingLeft: 10}}>
            <Text>Notes Go Here</Text>
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
});

export default OrderDetailsScreen;
