import React, {useState} from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
} from 'react-native';

import AppTitle from '../../components/Layout/AppTitle';
import AdminDashboard from '../../components/Dashboard/AdminDashboard';

interface Props {
  key: any;
}

const DashboardScreen: React.FC<Props> = () => {
  //#region Use State Variables
  const [groupToggle, setGroupToggle] = useState(true);
  const [crmToggle, setCrmToggle] = useState(false);
  const [servicesToggle, setServicesToggle] = useState(false);
  const [routesToggle, setRoutesToggle] = useState(false);
  const [invoicesToggle, setInvoicesToggle] = useState(false);
  //#endregion

  return (
    <>
      <TouchableOpacity onPress={() => setGroupToggle(!groupToggle)}>
        <AppTitle title='Dashboard' />
      </TouchableOpacity>

      <ScrollView>
        {groupToggle ? (
          <AdminDashboard />
        ) : null}
        <TouchableOpacity onPress={() => setCrmToggle(!crmToggle)}>
          <AppTitle title='CRM Status' />
        </TouchableOpacity>
        {crmToggle ? (
          <View style={styles.container}>
            <Text>Hello World!</Text>
          </View>
        ) : null}
        <TouchableOpacity onPress={() => setServicesToggle(!servicesToggle)}>
          <AppTitle title='Services Status' />
        </TouchableOpacity>
        {servicesToggle ? (
          <View style={styles.container}>
            <Text>Hello World!</Text>
          </View>
        ) : null}
        <TouchableOpacity onPress={() => setRoutesToggle(!routesToggle)}>
          <AppTitle title='Routes Status' />
        </TouchableOpacity>
        {routesToggle ? (
          <View style={styles.container}>
            <Text>Hello World!</Text>
          </View>
        ) : null}
        <TouchableOpacity onPress={() => setInvoicesToggle(!invoicesToggle)}>
          <AppTitle title='Invoices Status' />
        </TouchableOpacity>
        {invoicesToggle ? (
          <View style={[styles.container, {marginBottom: 40}]}>
            <Text>Hello World!</Text>
          </View>
        ) : null}
      </ScrollView>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 10,
    paddingTop: 10,
  },
});

export default DashboardScreen;
