import {useNavigation} from '@react-navigation/native';
import React, {useContext} from 'react';
import {TouchableOpacity} from 'react-native';
import {StyleSheet, Text, View} from 'react-native';
import {Avatar} from 'react-native-elements';
import Ionicons from 'react-native-vector-icons/Ionicons';

import Colors from '../../constants/Colors';
import AppContext from '../../providers/AppContext';

interface Props {
  text: string;
}

const RightHeader: React.FC<Props> = (props) => {
  const navigation = useNavigation();
  const {image} = useContext(AppContext);

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => navigation.navigate('Dashboard')}>
        {image != '' || image != null ? (
          <Avatar
            size={44}
            rounded
            containerStyle={styles.avatar}
            source={{uri: image}}
            icon={{
              name: 'ios-images',
              type: 'ionicon',
              size: 40,
              color: Colors.SMT_Primary_1,
            }}
          />
        ) : (
          <Ionicons
            style={styles.icon}
            name="ios-images"
            size={44}
            color={Colors.SMT_Primary_1_Light_1}
          />
        )}
        <Text style={styles.text}>{props.text}</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  avatar: {
    marginTop: 15,
    borderRadius: 140,
    backgroundColor: Colors.SMT_Secondary_1_Light_1,
    alignSelf: 'center',
  },
  container: {
    height: '100%',
    width: '100%',
    justifyContent: 'center',
    marginRight: 10,
  },
  icon: {
    marginTop: 15,
    marginBottom: -2,
    alignSelf: 'center',
  },
  text: {
    textAlign: 'center',
    color: Colors.SMT_Tertiary_1,
    fontSize: 11,
  },
});

export default RightHeader;
