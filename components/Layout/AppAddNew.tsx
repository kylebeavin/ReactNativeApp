import React from 'react';
import {useNavigation} from '@react-navigation/native';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

import Colors from '../../constants/Colors';

interface Props {
  title: string;
  modal: string;
  backgroundColor?: string;
  item?: any;
}

const AppAddNew: React.FC<Props> = (props) => {
  const {backgroundColor} = props;
  const navigation = useNavigation();

  return (
    <TouchableOpacity
      onPress={() =>
        navigation.navigate('Modal', {modal: props.modal, item: props.item})
      }>
      <View style={{...styles.addNewButtonContainer, backgroundColor}}>
        <View style={styles.addNewIconContainer}>
          <Ionicons
            style={[styles.addNewIcon, {color: backgroundColor}]}
            name='ios-add'
          />
        </View>
        <View>
          <Text style={styles.addNewText}>NEW {props.title}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

AppAddNew.defaultProps = {
  backgroundColor: Colors.SMT_Secondary_1_Light_1,
};

const styles = StyleSheet.create({
  addNewButtonContainer: {
    flex: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 20,
    padding: 5,
    borderStyle: 'dashed',
    borderRadius: 1,
    borderWidth: 3,
    borderColor: Colors.SMT_Primary_2_Light_1,
  },
  addNewIcon: {
    textAlign: 'center',
    fontSize: 35,
    color: Colors.SMT_Secondary_1,
  },
  addNewIconContainer: {
    width: 30,
    marginRight: 20,
    paddingHorizontal: 4,
    borderRadius: 5,
    backgroundColor: Colors.SMT_Primary_2,
  },
  addNewText: {
    fontSize: 20,
  },
  spinner: {
    paddingTop: 0.25,
  },
});

export default AppAddNew;
