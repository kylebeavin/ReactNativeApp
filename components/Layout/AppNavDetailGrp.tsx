import { useNavigation } from '@react-navigation/native';
import React from 'react';
import {StyleSheet, View, Text} from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Colors from '../../constants/Colors';
import { Route } from '../../types/routes';

interface Props {
    route: Route
}

const AppNavDetailGrp: React.FC<Props> = ({route}) => {
    const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <View style={styles.leftComponent}>
        <MaterialIcons name="arrow-back-ios" size={24} color={Colors.SMT_Tertiary_1} onPress={() => navigation.pop()} />
      </View>
      <View style={styles.centerComponent}>
        <Text style={{color: Colors.SMT_Tertiary_1, fontWeight: 'bold', fontSize: 16}}>{route.route_id}</Text>
      </View>
      <View style={styles.rightComponent}>
      {/* <MaterialIcons name="menu" size={24} color={Colors.SMT_Tertiary_1} /> */}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: Colors.SMT_Primary_1_Dark_1,
    marginBottom: 10,
    paddingVertical: 10,
  },
  leftComponent: {
      flex: 1,
      paddingLeft: 15
  },
  centerComponent: {
      flex: 1,
      alignItems: 'center'
  },
  rightComponent: {
      flex: 1,
      alignItems: 'flex-end',
      paddingRight: 15
  },
});

export default AppNavDetailGrp;
