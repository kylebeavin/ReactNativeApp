import React from 'react';
import {StyleSheet, View, Text, TouchableOpacity} from 'react-native';
import Colors from '../../constants/Colors';
import AppTitle from '../layout/AppTitle';

interface Props {
  role: string;
}

const RoutesStatus: React.FC<Props> = ({role}) => {
  const renderRouteStatus = () => {
    switch (role) {
      case 'admin':
        return <RoutesAdminStatus />;
      case 'corporate':
        return null;
      case 'driver':
        return <RoutesDriverStatus />;
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

  return renderRouteStatus();
};

const RoutesAdminStatus = () => {
  return (
    <View style={styles.container}>
      {/* Summary Card */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Today's Summary</Text>

        {/* Card Content */}
        <View style={styles.cardContent}>
          <View style={styles.cardContentItem}>
            <Text style={{textAlign: 'center'}}>Close Percentage</Text>
            <Text>00%</Text>
          </View>
          <View style={styles.cardContentItem}>
            <Text style={{textAlign: 'center'}}>Demos Done</Text>
            <Text>00</Text>
          </View>
          <View style={styles.cardContentItem}>
            <Text style={{textAlign: 'center'}}>Average Time Per Smash</Text>
            <Text>00:00</Text>
          </View>
          <View style={styles.cardContentItem}>
            <Text style={{textAlign: 'center'}}>Smashes Per Hour</Text>
            <Text>00</Text>
          </View>
        </View>
      </View>

      <TouchableOpacity>
        <AppTitle title="Today's Route List" />
      </TouchableOpacity>
    </View>
  );
};

const RoutesDriverStatus = () => {
  return (
    <View style={styles.container}>
      <TouchableOpacity>
        <AppTitle title="Today's Route List" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  //====== Base Styles==============
  container: {
    paddingHorizontal: 10,
    paddingTop: 10,
  },
  //====== Base Styles==============

  //====== Card Styles==============
  card: {
    padding: 10,
    borderRadius: 3,
    borderWidth: 2,
    borderColor: Colors.SMT_Secondary_1_Light_1,
  },
  cardContent: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  cardContentItem: {
    padding: 10,
    width: '50%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardTitle: {
    marginBottom: 10,
    fontSize: 20,
    fontWeight: 'bold',
  },
  picker: {
    flex: 1,
    paddingLeft: 15,
    borderColor: Colors.SMT_Secondary_1_Light_1,
    borderWidth: 2,
    borderRadius: 3,
    height: 36,
    overflow: 'hidden',
  },
  //====== Card Styles ==============
});

export default RoutesStatus;
