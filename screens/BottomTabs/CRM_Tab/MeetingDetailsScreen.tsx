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
import { Meeting } from '../../../types/crm';
import {getDateStringsFromDate} from '../../../utils/Helpers';

interface Props {
  route: any;
}

const MeetingDetailsScreen: React.FC<Props> = ({route}) => {
  const meeting: Meeting = route.params.meeting;

  //#region Use State Variables
  const navigation = useNavigation();

  // Toggles
  const [statusToggle, setStatusToggle] = useState(false);
  const [urlToggle, setUrlToggle] = useState(false);
  const [notesToggle, setNotesToggle] = useState(false);
  //#endregion

  return (
    <View style={{marginBottom: 50}}>
      <AppTitle title="Meeting Detail" help search />

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
            <AppEditBtn item={meeting} modal="UpdateMeetingModal" />
          </View>
        </AppNavBtnGrp>

        <View style={{paddingLeft: 10}}>
          <Text style={{fontWeight: 'bold'}}>{meeting.title}</Text>
          <Text>Account: {meeting.account_id.account_name}</Text>
          <Text>Group: {meeting.group_id}</Text>
          <Text>Contact: {meeting.contact_id}</Text>
          <Text>Owner: {meeting.owner_id}</Text>
          <Text>Active: {meeting.is_active ? 'Yes' : 'No'}</Text>
          <Text>Address: {meeting.address_street}</Text>
          <Text>City: {meeting.address_city}</Text>
          <Text>State: {meeting.address_state}</Text>
          <Text>Zip: {meeting.address_zip}</Text>
          <Text>
            Meeting Date: {getDateStringsFromDate(meeting.meeting_time).date}
          </Text>
          <Text>Meeting Time: {getDateStringsFromDate(meeting.meeting_time).time}</Text>
          <Text>Created On: {getDateStringsFromDate(meeting.createdAt).date} {getDateStringsFromDate(meeting.createdAt).time}</Text>
          <Text>Updated On: {getDateStringsFromDate(meeting.updatedAt).date} {getDateStringsFromDate(meeting.updatedAt).time}</Text>
        </View>

        <TouchableOpacity onPress={() => setStatusToggle(!statusToggle)}>
          <AppTitle title="Status" />
        </TouchableOpacity>
        {!statusToggle ? null : (
          <View style={{paddingLeft: 10}}>
            <AppOrderStatusIndicator id={meeting._id} currentStatus={meeting._id}/>
          </View>
        )}

        <TouchableOpacity onPress={() => setNotesToggle(!notesToggle)}>
          <AppTitle title="Notes" />
        </TouchableOpacity>
        {!notesToggle ? null : (
          <View style={{paddingLeft: 10}}>
            {meeting.notes ? meeting.notes.map((item: string) => {
              return (
                <View key={item}>
                  <Text
                    style={styles.link}
                    onPress={() => null}>
                    {item}
                  </Text>
                </View>
              );
            }) : null}
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

export default MeetingDetailsScreen;
