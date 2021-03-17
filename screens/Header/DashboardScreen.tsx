import React, {useContext, useState} from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
} from 'react-native';

import AppTitle from '../../components/Layout/AppTitle';
import AdminDashboard from '../../components/Dashboard/AdminDashboard';
import AppContext from '../../providers/AppContext';
import DriverDashboard from '../../components/Dashboard/DriverDashboard';
import RoutesStatus from '../../components/Dashboard/RoutesStatus';

interface Props {
  key: any;
}

const DashboardScreen: React.FC<Props> = () => {
  //#region Use State Variables
  const {role} = useContext(AppContext);

  // Toggles
  const [dashboardToggle, setDashboardToggle] = useState(role === 'admin' ? true : false);
  const [crmToggle, setCrmToggle] = useState(role === '');
  const [servicesToggle, setServicesToggle] = useState(false);
  const [routesToggle, setRoutesToggle] = useState(role === 'driver' ? true : false);
  const [invoicesToggle, setInvoicesToggle] = useState(false);
  //#endregion

  const renderDashboard = () => {
    switch (role) {
      case 'admin':
        return <AdminDashboard />;
      case 'corporate':
        return null;
      case 'driver':
        return <DriverDashboard />;
        case 'gm':
          return null;
      case 'mechanic':
        return null;
      case 'partner':
        return null;
      case 'sales':
        return null;
      default: 
        return null;
    }
  };

  return (
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.contentContainer}>
        {renderDashboard()}
      </ScrollView>
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
});

export default DashboardScreen;
