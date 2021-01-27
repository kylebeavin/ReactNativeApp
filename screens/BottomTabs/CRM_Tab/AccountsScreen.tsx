import React, {useState, useEffect, useContext} from 'react';
import { StyleSheet, View, ActivityIndicator, FlatList, ScrollView} from 'react-native';
import { useIsFocused, useNavigation } from '@react-navigation/native';

import Colors from '../../../constants/Colors';
import Configs from '../../../constants/Configs';
import {Account} from '../../../types/crm';
import AppTitle from '../../../components/Layout/AppTitle';
import AppAddNew from '../../../components/Layout/AppAddNew';
import AppNavBtnGrp from '../../../components/Layout/AppNavBtnGrp';
import AppCard from '../../../components/Layout/AppCard';
import AppEmptyCard from '../../../components/Layout/AppEmptyCard';
import AppButton from '../../../components/Layout/AppButton';
import { useFetch } from '../../../hooks/useFetch';

interface Props {
}

const AccountScreen: React.FC<Props> = () => {
  const {status, data, error} = useFetch(`${Configs.TCMC_URI}/api/accountsBy`, 'POST');
  const navigation = useNavigation();
  const [isLoading, setIsLoading] = useState(true);
  const [accounts, setAccounts] = useState<Account[]>([]);
  const isFocused = useIsFocused();

  useEffect(() => {
    if (status === "fetched"){
      getAccounts();
    }
  }, [isFocused, status]);
  
  const getAccounts = () => {
    data.data.map((account: Account) => {
      account.drawerIsVisible = false,
      account.contacts = []
    })
    setAccounts(data.data)
    setIsLoading(false);
  }

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
                  >
                  </AppCard>
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