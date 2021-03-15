import {useNavigation} from '@react-navigation/native';
import React from 'react';
import {
  StyleSheet,
  View,
  ScrollView,
  Text,
} from 'react-native';
import AppButton from '../../../components/Layout/AppButton';
import AppEditBtn from '../../../components/Layout/AppEditBtn';
import AppNavBtnGrp from '../../../components/Layout/AppNavBtnGrp';
import AppTitle from '../../../components/Layout/AppTitle';
import Colors from '../../../constants/Colors';
import { Meeting } from '../../../types/crm';
import {getDateStringsFromDate} from '../../../utils/Helpers';

interface Props {
  route: any;
}

const MeetingDetailsScreen: React.FC<Props> = ({route}) => {
  const model: Meeting = route.params.model;

  //#region Use State Variables
  const navigation = useNavigation();
  //#endregion

  return (
    <View style={{marginBottom: 50}}>
      <AppTitle title="Meeting Detail" />

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
            <AppEditBtn item={model} modal="UpdateMeetingModal" />
          </View>
        </AppNavBtnGrp>

        <View style={{paddingLeft: 10}}>
          <Text style={{fontWeight: 'bold'}}>{model.title}</Text>
          <Text>Account: {model.account_id.account_name}</Text>
          <Text>Group: {model.group_id}</Text>
          <Text>Contact: {model.contact_id}</Text>
          <Text>Owner: {model.owner_id}</Text>
          <Text>Active: {model.is_active ? 'Yes' : 'No'}</Text>
          <Text>Address: {model.address_street}</Text>
          <Text>City: {model.address_city}</Text>
          <Text>State: {model.address_state}</Text>
          <Text>Zip: {model.address_zip}</Text>
          <Text>
            Meeting Date: {getDateStringsFromDate(model.meeting_time).date}
          </Text>
          <Text>Meeting Time: {getDateStringsFromDate(model.meeting_time).time}</Text>
          <Text>Created On: {getDateStringsFromDate(model.createdAt).date} {getDateStringsFromDate(model.createdAt).time}</Text>
          <Text>Updated On: {getDateStringsFromDate(model.updatedAt).date} {getDateStringsFromDate(model.updatedAt).time}</Text>
        </View>
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

export default MeetingDetailsScreen;
