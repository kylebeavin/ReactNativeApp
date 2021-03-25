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
  const model: Order = route.params.model;
  
  //#region Use State Variables
  const navigation = useNavigation();

  // Toggles
  const [statusToggle, setStatusToggle] = useState(false);
  const [urlToggle, setUrlToggle] = useState(false);
  const [notesToggle, setNotesToggle] = useState(false);
  //#endregion
  return (
    <View style={{marginBottom: 50}}>
      <AppTitle title='Order Detail' />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.contentContainer}>
        <AppNavBtnGrp>
          <View style={{marginRight: 60, marginTop: 12, paddingLeft: 10}}>
            <AppButton
              title='Back'
              onPress={() => navigation.goBack()}
              outlined={true}
              icon={{type: 'MaterialIcons', name: 'arrow-back'}}
            />
          </View>
          <View style={{paddingTop: 5}}>
            <AppEditBtn item={model} modal='UpdateOrderModal' />
          </View>
        </AppNavBtnGrp>

        <View style={{paddingLeft: 10}}>
          <Text style={{fontWeight: 'bold'}}>{model.order_id}</Text>
          <Text>Account: {model.account_id.account_name}</Text>
          <Text>Agreement: {model.agreement_id ? 'Yes' : 'No'}</Text>
          <Text>Group: {model.group_id}</Text>
          <Text>Recurring: {model.is_recurring ? 'Yes' : 'No'}</Text>
          <Text>Active: {model.is_active ? 'Yes' : 'No'}</Text>
          <Text>Demo: {model.is_demo ? 'Yes' : 'No'}</Text>
          <Text>Services: {model.services.toString()}</Text>
          <Text>Days: {model.service_day}</Text>
          <Text>Monthly Rate: {model.monthly_rate}</Text>
          <Text>Demand Rate: {model.demand_rate}</Text>
          <Text>
            Service Date: {getDateStringsFromDate(model.service_date).date}
          </Text>

          {model.order_status === 'completed' ? (
            <View>
            <View style={{marginTop: 10}}>
              <Text style={{ fontWeight: 'bold'}}>Completed:</Text>
              </View>
            <View style={{marginLeft: 20}}>
              <Text>Containers Smashed: {model.containers_serviced}</Text>
              <Text>Coords: {model.completed_geo_location}</Text>
              <Text>Time: {getDateStringsFromDate(model.completed_time).date}{' '}{getDateStringsFromDate(model.completed_time).time}</Text>
            </View>
            </View>
          ) : null}
        </View>

        <TouchableOpacity onPress={() => setStatusToggle(!statusToggle)}>
          <AppTitle title='Status' />
        </TouchableOpacity>
        {!statusToggle ? null : (
          <View style={{paddingLeft: 10}}>
            <AppOrderStatusIndicator
              id={model._id}
              currentStatus={model.order_status}
            />
          </View>
        )}

        <TouchableOpacity onPress={() => setUrlToggle(!urlToggle)}>
          <AppTitle title='Url' />
        </TouchableOpacity>
        {!urlToggle ? null : (
          <View style={{paddingLeft: 10, paddingTop: 10, alignItems: 'center'}}>
            {model.url.map((item: string) => {
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
          <AppTitle title='Notes' />
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
