import React, {useContext} from 'react';
import {
  StyleSheet,
  ScrollView,
} from 'react-native';

import AdminDashboard from '../../components/dashboard/AdminDashboard';
import AppContext from '../../providers/AppContext';
import DriverDashboard from '../../components/dashboard/DriverDashboard';

const DashboardScreen = () => {
  //#region Use State Variables
  const {role} = useContext(AppContext);
  //#endregion

  const renderDashboard = () => {
    switch (role) {
      case 'admin':
        return <AdminDashboard />;
      case 'corporate':
        return null;
      case 'driver':
        return <DriverDashboard/>;
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
