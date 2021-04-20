import React, {useState, useEffect, useContext} from 'react';
import {
  StyleSheet,
  View,
  ActivityIndicator,
  ScrollView,
  TouchableOpacity,
  Text,
} from 'react-native';
import {useIsFocused, useNavigation} from '@react-navigation/native';

import Colors from '../../../constants/Colors';
import Configs from '../../../constants/Configs';
import {Account, Contact, Meeting} from '../../../types/crm';
import AppTitle from '../../../components/layout/AppTitle';
import AppEmptyCard from '../../../components/layout/AppEmptyCard';
import AppContext from '../../../providers/AppContext';
import {ToastContext} from '../../../providers/ToastProvider';
import {getDateStringsFromDate, isSuccessStatusCode} from '../../../utils/Helpers';
import AppNavGroup from '../../../components/layout/AppNavGroup';

interface Props {}

const CrmScreen: React.FC<Props> = () => {
  //#region State Variables
  const navigation = useNavigation();
  const isFocused = useIsFocused();
  const {grpId, token} = useContext(AppContext);
  const {show} = useContext(ToastContext);
  const [isLoading, setIsLoading] = useState(true);
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [meetings, setMeetings] = useState<Meeting[]>([]);

    // Toggles
    const [accountToggle, setAccountToggle] = useState(false);
    const [contactToggle, setContactToggle] = useState(false);
    const [meetingToggle, setMeetingToggle] = useState(false);
  //#endregion

  useEffect(() => {
    getAccounts();
  }, [isFocused]);

  const getAccounts = async () => {
    fetch(`${Configs.TCMC_URI}/api/accountsBy`, {
      headers: {'Content-Type': 'application/json', 'x-access-token': token},
      method: 'POST',
      body: JSON.stringify({group_id: grpId}),
    })
      .then((res) => res.json())
      .then((json) => {
        if (isSuccessStatusCode(json.status)) {
          setAccounts(json.data);
        } else {
          show({message: json.message});
        }
      })
      .catch((err) => show({message: err.message}))
      .finally(() => setIsLoading(false));
  };

  const getContacts = async () => {
    fetch(`${Configs.TCMC_URI}/api/contactsBy`, {
      headers: {'Content-Type': 'application/json', 'x-access-token': token},
      method: 'POST',
      body: JSON.stringify({group_id: grpId}),
    })
      .then((res) => res.json())
      .then((json) => {
        if (isSuccessStatusCode(json.status)) {
          setContacts(json.data);
        } else {
          show({message: json.message});
        }
      })
      .catch((err) => show({message: err.message}))
      .finally(() => setIsLoading(false));
  };

  const getMeetings = async () => {
    fetch(`${Configs.TCMC_URI}/api/meetingsBy`, {
      headers: {'Content-Type': 'application/json', 'x-access-token': token},
      method: 'POST',
      body: JSON.stringify({group_id: grpId}),
    })
      .then((res) => res.json())
      .then((json) => {
        if (isSuccessStatusCode(json.status)) {
          setMeetings(json.data);
        } else {
          show({message: json.message});
        }
      })
      .catch((err) => show({message: err.message}))
      .finally(() => setIsLoading(false));
  };

  return (
    <View style={{flex: 1}}>
      <AppTitle title="CRM" />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.contentContainer}>
          
        <View style={{paddingHorizontal: 10}}>
          <AppNavGroup
            add={{
              title: 'Account',
              modal: 'ModalPopup',
              modals: [
                'CreateAccountModal',
                'CreateContactModal',
                'CreateMeetingModal',
              ],
            }}
            list="CrmScreen"
            schedule="CrmCalendarScreen"
            map="CrmMapScreen"
            focused="List"
          />
        </View>

        <TouchableOpacity
          onPress={() => {
            getAccounts();
            setAccountToggle(!accountToggle);
          }}>
          <AppTitle title="Accounts" />
        </TouchableOpacity>
        {!accountToggle ? null : (
          <View style={{padding: 10}}>
            {isLoading ? (
              <ActivityIndicator
                color={Colors.SMT_Primary_2}
                animating={true}
              />
            ) : (
              <View style={{flex: 1}}>
                {accounts.length === 0 ? (
                  <AppEmptyCard entity="accounts" modal="CreateAccountModal" />
                ) : (
                  accounts.map((u, i) => {
                    return (
                      <TouchableOpacity
                        style={styles.card}
                        key={i}
                        onPress={() =>
                          navigation.navigate('AccountDetailsScreen', {
                            model: u,
                          })
                        }>
                        <View style={{flexDirection: 'row'}}>
                          <View style={{flex: 1}}>
                            <Text style={styles.titleText}>
                              {u.account_name}
                            </Text>
                            <Text>{u.address_city}</Text>
                          </View>
                          <View style={{flex: 1}}>
                            <Text
                              style={{
                                color: Colors.SMT_Primary_1,
                                textAlign: 'right',
                              }}>
                              {getDateStringsFromDate(u.createdAt).date}
                            </Text>
                            <Text
                              style={{
                                fontWeight: 'bold',
                                color: Colors.SMT_Secondary_2_Light_1,
                                textAlign: 'right',
                              }}>
                              {getDateStringsFromDate(u.createdAt).time}
                            </Text>
                          </View>
                        </View>
                      </TouchableOpacity>
                    );
                  })
                )}
              </View>
            )}
          </View>
        )}

        <TouchableOpacity
          onPress={() => {
            getContacts();
            setContactToggle(!contactToggle);
          }}>
          <AppTitle title="Contacts" />
        </TouchableOpacity>
        {!contactToggle ? null : (
          <View style={{padding: 10}}>
            {isLoading ? (
              <ActivityIndicator
                color={Colors.SMT_Primary_2}
                animating={true}
              />
            ) : (
              <>
                {contacts.length === 0 ? (
                  <AppEmptyCard entity="contacts" modal="CreateContactModal" />
                ) : (
                  <>
                    {contacts.map((u, i) => {
                      return (
                        <TouchableOpacity
                          style={styles.card}
                          key={u._id}
                          onPress={() =>
                            navigation.navigate('ContactDetailsScreen', {
                              model: u,
                            })
                          }>
                          <View style={{flexDirection: 'row'}}>
                            <View style={{flex: 1}}>
                              <Text
                                numberOfLines={1}
                                style={{fontWeight: 'bold'}}>
                                {u.first_name + ' ' + u.last_name}
                              </Text>
                              <Text numberOfLines={1}>{u.type}</Text>
                            </View>
                            <View>
                              <Text style={{color: Colors.SMT_Primary_1}}>
                                {u.method}
                              </Text>
                              <Text
                                style={{color: Colors.SMT_Secondary_2_Light_1}}>
                                {u.is_active ? 'Active' : 'Inactive'}
                              </Text>
                            </View>
                          </View>
                        </TouchableOpacity>
                      );
                    })}
                  </>
                )}
              </>
            )}
          </View>
        )}

        <TouchableOpacity
          onPress={() => {
            getMeetings();
            setMeetingToggle(!meetingToggle);
          }}>
          <AppTitle title="Meetings" />
        </TouchableOpacity>
        {!meetingToggle ? null : (
          <View style={{padding: 10}}>
            {isLoading ? (
              <ActivityIndicator
                color={Colors.SMT_Primary_2}
                animating={true}
              />
            ) : (
              <>
                {meetings.length === 0 ? (
                  <AppEmptyCard entity="meetings" modal="CreateMeetingModal" />
                ) : (
                  <>
                    {meetings.map((u, i) => {
                      return (
                        <TouchableOpacity
                          style={styles.card}
                          key={u._id}
                          onPress={() =>
                            navigation.navigate('MeetingDetailsScreen', {
                              model: u,
                            })
                          }>
                          <View style={{flexDirection: 'row'}}>
                            <View style={{flex: 1}}>
                              <Text
                                numberOfLines={1}
                                style={{fontWeight: 'bold'}}>
                                {u.title}
                              </Text>
                              <Text numberOfLines={1}>{u.address_street}</Text>
                            </View>
                            <View>
                              <Text style={{color: Colors.SMT_Primary_1}}>
                                {getDateStringsFromDate(u.meeting_time).date}
                              </Text>
                              <Text
                                style={{color: Colors.SMT_Secondary_2_Light_1}}>
                                {getDateStringsFromDate(u.meeting_time).time}
                              </Text>
                            </View>
                          </View>
                        </TouchableOpacity>
                      );
                    })}
                  </>
                )}
              </>
            )}
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
  card: {
    backgroundColor: Colors.SMT_Tertiary_1,
    marginBottom: 3,
    borderWidth: 1,
    borderColor: Colors.SMT_Secondary_1_Light_1,
    borderRadius: 3,
    paddingVertical: 3,
    paddingHorizontal: 5,
  },
  title: {
    marginBottom: 10,
  },
  titleText: {
    fontWeight: 'bold',
  },
});

export default CrmScreen;
