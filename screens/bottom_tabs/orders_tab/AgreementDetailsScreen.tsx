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
import {Agreement, Order} from '../../../types/orders';
import {getDateStringsFromDate} from '../../../utils/Helpers';

interface Props {
  route: any;
}

const AgreementDetailsScreen: React.FC<Props> = ({route}) => {
  const model: Agreement = route.params.model;
  
  //#region Use State Variables
  const navigation = useNavigation();

  // Toggles
  const [statusToggle, setStatusToggle] = useState(false);
  const [notesToggle, setNotesToggle] = useState(false);
  //#endregion
  return (
    <View style={{marginBottom: 50}}>
      <AppTitle title="Agreement Detail" />

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
            <AppEditBtn item={model} modal="UpdateAgreementModal" />
          </View>
        </AppNavBtnGrp>

        <View style={{paddingLeft: 10}}>
          <Text style={{fontWeight: 'bold'}}>{model._id}</Text>
          <Text>Account: {model.account_id.account_name}</Text>
          <Text>Active: {model.is_active ? 'Yes' : 'No'}</Text>
          <Text>Recurring: {model.is_recurring ? 'Yes' : 'No'}</Text>
          <Text>Recurring Rate: {model.recurring_rate}</Text>
          <Text>On Demand Rate: {model.demand_rate}</Text>
          <Text>Location: {model.location}</Text>
          <Text>Start Date: {getDateStringsFromDate(model.start_date).date}</Text>
          <Text>End Date: {getDateStringsFromDate(model.end_date).date}</Text>
          <Text>Container Qty: {model.container_qty}</Text>
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

export default AgreementDetailsScreen;
