import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Colors from '../../constants/Colors';

interface Props {
    add: {
        title: string;
        modal: string;
    };
    list: string;
    schedule: string;
    map: string;
    focused: string;
}

const AppNavGroup: React.FC<Props> = ({add, list, schedule, map, focused}) => {
    const navigation = useNavigation();

    return (
      <View>
        <View style={styles.container}>
          <TouchableOpacity
            style={[styles.buttonContainer, styles.addButton]}
            onPress={() => navigation.navigate('Modal', {modal: add.modal})}
            >
                <MaterialIcons style={[styles.text, {color: Colors.SMT_Tertiary_1}]} name="add-box" size={24} />
                <Text style={[styles.text, {color: Colors.SMT_Tertiary_1}]}>Add</Text>
            </TouchableOpacity>
          <TouchableOpacity
            style={[styles.buttonContainer, focused === 'List' && styles.focused]}
            onPress={() => navigation.navigate(list)}
            >
                <MaterialIcons style={[styles.text, focused === 'List' && styles.focusedText]} name="list-alt" size={24} />
                <Text style={[styles.text, focused === 'List' && styles.focusedText]}>List</Text>
            </TouchableOpacity>
          <TouchableOpacity
            style={[styles.buttonContainer, focused === 'Schedule' ? styles.focused : null]}
            onPress={() => navigation.navigate(schedule)}
            >
                <MaterialCommunityIcons style={[styles.text, focused === 'Schedule' && styles.focusedText]} name="calendar" size={24} />
                <Text style={[styles.text, focused === 'Schedule' && styles.focusedText]}>Schedule</Text>
            </TouchableOpacity>
          <TouchableOpacity
            style={[styles.buttonContainer, focused === 'Map' ? styles.focused : null]}
            onPress={() => navigation.navigate(map)}
            >
                <MaterialIcons style={[styles.text, focused === 'Map' && styles.focusedText]} name="map" size={24} />
                <Text style={[styles.text, focused === 'Map' && styles.focusedText]}>Map</Text>
            </TouchableOpacity>
        </View>
      </View>
    );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    marginBottom: 10,
    marginTop: 10,
    marginRight: -10
  },
  buttonContainer: {
    flex: 1,
    height: '100%',
    width: '100%',
    marginRight: 10,
    borderRadius: 5,
    borderWidth: 2,
    borderColor: Colors.SMT_Secondary_2_Dark_1,
    backgroundColor: 'transparent',
    paddingVertical: 2,
  },
  focused: {
    backgroundColor: Colors.SMT_Secondary_2_Dark_1,
  },
  focusedText: {
      color: Colors.SMT_Tertiary_1,
  },
  addButton: {
    backgroundColor: Colors.SMT_Primary_1_Dark_1,
    borderColor: Colors.SMT_Primary_1_Dark_1,
  },
  text: {
    textAlign: 'center',
    fontWeight: 'bold',
    color: Colors.SMT_Secondary_2_Dark_1
  }
});

export default AppNavGroup;