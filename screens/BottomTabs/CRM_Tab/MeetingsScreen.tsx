import React, {useEffect, useState} from 'react';
import { useIsFocused } from '@react-navigation/native';
import { ScrollView, StyleSheet, View, Text, ActivityIndicator } from 'react-native';

import {Meeting} from '../../../types/index';
import Configs from '../../../constants/Configs';
import AppButton from '../../../components/Layout/AppButton';
import Colors from '../../../constants/Colors';
import AppTitle from '../../../components/Layout/AppTitle';
import AppNavBtnGrp from '../../../components/Layout/AppNavBtnGrp';
import LinkConfig from '../../../navigation/LinkingConfiguration';
import AppAddNew from '../../../components/Layout/AppAddNew';
import AppEmptyCard from '../../../components/Layout/AppEmptyCard';
import useAsyncStorage from '../../../hooks/useAsyncStorage';
import { getRequestHeadersAsync } from '../../../utils/Helpers';

interface Props {
  navigation: any;
}

const MeetingsScreen: React.FC<Props> = ({navigation}) => {
  const [isLoading, setLoading] = useState(true);
  const [meetings, setMeetings] = useState<Meeting[]>([]);
  const isFocused = useIsFocused();
  
  useEffect(() => {
    getMeetings();
  }, [isFocused]);

  const getMeetings = async () => {
    let grpId = await useAsyncStorage().getUserAsync().then(user => user.group_id)

    await fetch(`${Configs.TCMC_URI}/api/meetingsBy`, {
      headers: await getRequestHeadersAsync().then(header => header),
      method: "POST",
      body: JSON.stringify({group_id: grpId}),
    })
    .then(res => {
      console.log(res.status)
      return res.json()
    })
    .then(json => {
      if (json.data){
        setMeetings(json.data)
      }
    })
    .catch((err) => console.log(err))
    .finally(() => setLoading(false));
  }

  return (
    <View style={styles.screen}>
      <AppTitle title="CRM" help search />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.contentContainer}>
        <AppNavBtnGrp>
          <AppButton
            title="CLIENTS"
            onPress={() => navigation.navigate('AccountsScreen')}
            outlined={true}
          />
          <AppButton
            title="MEETINGS"
            onPress={() => navigation.navigate('MeetingsScreen')}
            outlined={false}
          />
          <View style={{marginRight: -10}}>
            <AppButton
              title="MAP"
              onPress={() => navigation.navigate('MapScreen')}
              outlined={true}
            />
          </View>
        </AppNavBtnGrp>

        {meetings.length === 0 ? null : (
          <AppAddNew title="MEETING" modal="CreateMeetingModal" />
        )}

        {isLoading ? (
          <ActivityIndicator color={Colors.SMT_Primary_2} animating={true} />
        ) : (
          <View>
            {meetings.length === 0 ? (
              <AppEmptyCard entity="meetings" modal="CreateMeetingModal" />
            ) : (
              meetings.map((u, i) => {
                return (
                  <View style={styles.card} key={i}>
                    <View style={styles.column1}>
                      <Text style={{fontWeight: 'bold'}}>{u.title}</Text>
                      <Text>{u.address_city + ', ' + u.address_state}</Text>
                    </View>

                    <View style={styles.column2}>
                      <AppButton
                        title="Details"
                        backgroundColor={Colors.SMT_Secondary_2}
                        onPress={() =>
                          navigation.navigate('Modal', {
                            modal: 'UpdateMeetingModal',
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
}

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    backgroundColor: Colors.SMT_Tertiary_1,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: Colors.SMT_Secondary_2_Light_1,
    borderRadius: 3,
    padding: 5,
  },
  column1: {},
  container: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    marginBottom: 20,
  },
  contentContainer: {
    // This is the scrollable part
  },
  column2: {
    flex: 1,
    alignItems: "flex-end",
  },
  screen: {
    marginBottom: 36,
  },
  scrollView: {
    height: "100%",
    width: "100%",
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

export default MeetingsScreen;