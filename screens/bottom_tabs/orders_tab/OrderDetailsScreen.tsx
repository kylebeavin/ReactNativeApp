import {useNavigation} from '@react-navigation/native';
import React, {useState} from 'react';
import {
  StyleSheet,
  View,
  ScrollView,
  TouchableOpacity,
  Text,
} from 'react-native';
import AppButton from '../../../components/layout/AppButton';
import AppEditBtn from '../../../components/layout/AppEditBtn';
import AppNavBtnGrp from '../../../components/layout/AppNavBtnGrp';
import AppOrderStatusIndicator from '../../../components/layout/AppOrderStatusIndicator';
import AppTitle from '../../../components/layout/AppTitle';
import Colors from '../../../constants/Colors';
import {Order} from '../../../types/orders';
import {getDateStringsFromDate} from '../../../utils/Helpers';

interface Props {
  route: any;
}

const OrderDetailsScreen: React.FC<Props> = ({route}) => {
  const model: Order = route.params.model;
  
  //#region Use State Variables
  const navigation = useNavigation();

  // Toggles
  const [statusToggle, setStatusToggle] = useState(false);
  const [notesToggle, setNotesToggle] = useState(false);
  //#endregion
  return (
    <View style={{marginBottom: 50}}>
      <AppTitle title="Order Detail" />

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
            <AppEditBtn item={model} modal="UpdateOrderModal" />
          </View>
        </AppNavBtnGrp>

        <View style={{paddingLeft: 10}}>
          <Text style={{fontWeight: 'bold'}}>{model.order_id}</Text>
          <Text>Account: {model.account_id.account_name}</Text>
          <Text>Agreement: {model.agreement_id ? 'Yes' : 'No'}</Text>
          <Text>Recurring: {model.is_recurring ? 'Yes' : 'No'}</Text>
          <Text>Demo: {model.is_demo ? 'Yes' : 'No'}</Text>
          <Text>Order Date: {getDateStringsFromDate(model.service_date).date}</Text>
          <Text>Order Status: {model.order_status}</Text>
          <Text>Containers Smashed: {model.containers_serviced}</Text>
        </View>

        <TouchableOpacity onPress={() => setNotesToggle(!notesToggle)}>
          <AppTitle title="Notes" />
        </TouchableOpacity>
        {!notesToggle ? null : (
          <View style={{paddingLeft: 10}}>
            {model.notes.map((item: string) => {
              return (
                <View key={item}>
                  <Text style={styles.link} onPress={() => null}>
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
