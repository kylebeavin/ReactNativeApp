import React, {useState, useEffect} from 'react';
import { StyleSheet, View, ActivityIndicator, FlatList, ScrollView} from 'react-native';
import { useIsFocused, useNavigation } from '@react-navigation/native';

import Colors from '../../../constants/Colors';
import Configs from '../../../constants/Configs';
import { Account, Contact } from '../../../types/crm';
import AppTitle from '../../../components/Layout/AppTitle';
import AppAddNew from '../../../components/Layout/AppAddNew';
import AppNavBtnGrp from '../../../components/Layout/AppNavBtnGrp';
import AppCard from '../../../components/Layout/AppCard';
import AppEmptyCard from '../../../components/Layout/AppEmptyCard';
import { getRequestHeadersAsync } from '../../../utils/Helpers';
import AppButton from '../../../components/Layout/AppButton';

interface Props {
}

const AccountScreen: React.FC<Props> = () => {
  const navigation = useNavigation();
  const [isLoading, setLoading] = useState(true);
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [toggle, setToggle] = useState(false);
  const isFocused = useIsFocused();

  useEffect(() => {
    getAccounts();
  }, [isFocused]);
  
  const getAccounts = async () => {
    fetch(`${Configs.TCMC_URI}/api/accounts`, {
      headers: await getRequestHeadersAsync().then(header => header)
    }) // ToDo: get accounts by group id 
      .then((res) => res.json())
      .then((json) => {
        if (json.data) {
          json.data.map((account: any) => {
            account.drawerIsVisible = false,
            account.contacts = []
          })

          setAccounts(json.data)
        }
      })
      .catch((err) => console.log(err))
      .finally(() => setLoading(false));
  }

  const onToggleCardDrawer = async ( item: Account, index: number) => {
    let account = accounts;
    let contacts : Contact[] = [];
    account[index].drawerIsVisible = !account[index].drawerIsVisible;

    if (item.drawerIsVisible){
      contacts = await getContactsList(item._id, index)
      account[index].contacts = contacts;
    }

    setAccounts(account);
    setToggle(!toggle);
  };

  const getContactsList = async (account_id: string, index: number) : Promise<Contact[]> => {
    let contacts : Contact[] = [];
    
    await fetch(`${Configs.TCMC_URI}/api/contactsBy`, {
      method: "POST",
      body: JSON.stringify({account_id: account_id}),
      headers: await getRequestHeadersAsync().then(header => header)
    })
    .then((res) => res.json())
    .then((json) => contacts = json.data)
    .catch((err) => console.log(err))
    return contacts;
  };

  return (
    <View style={{ flex: 1 }}>
      <AppTitle title="CRM" help search />

      <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.contentContainer}
      >

      <AppNavBtnGrp>
            <AppButton
              title="CLIENTS"
              onPress={() => navigation.navigate("AccountsScreen")}
              outlined={false}
            />
            <AppButton
              title="MEETINGS"
              onPress={() => navigation.navigate("MeetingsScreen")}
              outlined={true}
            />
            <View style={{marginRight: -10}}>
            <AppButton
              title="MAP"
              onPress={() => navigation.navigate("MapScreen")}
              outlined={true}
            />
            </View>
      </AppNavBtnGrp>

      {accounts.length === 0 ? null : (
        <AppAddNew title="ACCOUNT" modal="CreateAccountModal" />
      )}

      {isLoading ? (
        <ActivityIndicator color={Colors.SMT_Primary_2} animating={true} />
      ) : (
        <View style={{ flex: 1 }}>
          {accounts.length === 0 ? (
            <AppEmptyCard entity="accounts" modal="CreateAccountModal" />
          ) : (
            accounts.map((u, i) => {
              return (
                <AppCard
                  key={i}
                  item={u}
                  index={i}
                  onToggleCardDrawer={onToggleCardDrawer}></AppCard>
              );})
          )}
        </View>
      )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  contentContainer: {
    // This is the scrollable part
  },
  scrollView: {
    height: "100%",
    width: "100%",
    paddingHorizontal: 10
  },
});

export default AccountScreen;