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
import {Account} from '../../../types/crm';
import AppTitle from '../../../components/layout/AppTitle';
import AppEmptyCard from '../../../components/layout/AppEmptyCard';
import AppContext from '../../../providers/AppContext';
import {ToastContext} from '../../../providers/ToastProvider';
import {getDateStringsFromDate} from '../../../utils/Helpers';
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
        if (json.data) {
          json.data.map((account: any) => {
            (account.drawerIsVisible = false), (account.contacts = []);
          });

          setAccounts(json.data);
        }
      })
      .catch((err) => show({message: err.message}))
      .finally(() => setIsLoading(false));
  };

  return (
    <View style={{flex: 1}}>
      <AppTitle title='CRM' />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.contentContainer}>

        <AppNavGroup
          add={{title: 'Account', modal: 'ModalPopup', modals: ['CreateAccountModal', 'CreateContactModal', 'CreateMeetingModal']}}
          list='CrmScreen'
          schedule='CrmCalendarScreen'
          map='CrmMapScreen'
          focused='List'
        />

        {isLoading ? (
          <ActivityIndicator color={Colors.SMT_Primary_2} animating={true} />
        ) : (
          <View style={{flex: 1}}>
            {accounts.length === 0 ? (
              <AppEmptyCard entity='accounts' modal='CreateAccountModal' />
            ) : (
              accounts.map((u, i) => {
                return (
                  <TouchableOpacity
                    style={styles.card}
                    key={i}
                    onPress={() =>
                      navigation.navigate('AccountDetailsScreen', {model: u})
                    }>
                    <View style={{flexDirection: 'row'}}>
                      <View style={{flex: 1}}>
                        <Text style={styles.titleText}>{u.account_name}</Text>
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
    paddingHorizontal: 10,
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
