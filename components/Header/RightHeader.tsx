import { useNavigation } from '@react-navigation/native';
import React, { useContext } from 'react';
import { TouchableOpacity } from 'react-native';
import { StyleSheet, Text, View } from 'react-native';
import { Avatar } from "react-native-elements";
import Ionicons from 'react-native-vector-icons/Ionicons';

import Colors from '../../constants/Colors';
import AppContext from '../../providers/AppContext';

interface Props {
    text: string;
}

const RightHeader: React.FC<Props> = (props) => {
    const navigation = useNavigation();
    const {headerStyle, displayName} = useContext(AppContext);

    const renderRightHeader = () => {
      if (headerStyle === 1) {
        return (
          <View style={styles.container}>
            <TouchableOpacity onPress={() => navigation.navigate("Dashboard")}>
              <Avatar
              size={55}
                rounded
                containerStyle={styles.avatar}
                icon={{ name: "ios-images", type: "ionicon", size: 40, color: Colors.SMT_Primary_1 }}
              />
              <Text style={styles.text}>{props.text}</Text>
            </TouchableOpacity>
          </View>
        );
      } else if (headerStyle === 2) {
        return (
          <View style={styles.container2}>
          <TouchableOpacity onPress={() => navigation.navigate("Dashboard")}>
            {/* <Avatar
            size={55}
              rounded
              containerStyle={styles.avatar}
              icon={{ name: "ios-images", type: "ionicon", size: 40, color: Colors.SMT_Primary_1 }}
            /> */}
            <Ionicons
              style={styles.icon2}
              name="ios-images"
              size={44}
              color={Colors.SMT_Primary_1_Light_1}
              />
            <Text style={styles.text2}>{props.text}</Text>
          </TouchableOpacity>
        </View>
        )
      } else if (headerStyle === 3) {
        return (
          <View style={styles.container3}>
            <TouchableOpacity onPress={() => navigation.navigate('Dashboard')}>
              <Avatar
                size={55}
                rounded
                containerStyle={styles.avatar}
                source={displayName === "Justin Forrestal" ? require("../../assets/images/nigel.png") : require("../../assets/images/wilson.png")}
              />
              <Text style={styles.text}>{displayName === "Justin Forrestal" && headerStyle === 3 ? "SMASHING" : props.text}</Text>
            </TouchableOpacity>
          </View>
        );
      }
    };

    return <>{renderRightHeader()}</>;
}

const styles = StyleSheet.create({
   //=== Header Style 1 ===//
   container: {
    height: '100%',
    width: '100%',
    justifyContent: 'center',
  },
  avatar: {
    marginTop: 2,
    marginBottom: 2,
    borderRadius: 140,
    backgroundColor: Colors.SMT_Secondary_1_Light_1,
    alignSelf: 'center',
  },
  text: {
    textAlign: 'center',
    color: Colors.SMT_Tertiary_1,
    fontSize: 11,
  },
  //=== Header Style 1 ===//

  //=== Header Style 2 ===//
  container2: {
    height: '100%',
    width: '100%',
    justifyContent: 'center',
    marginRight: 10,
  },
  icon2: {
    marginTop: 15,
    marginBottom: -2,
    alignSelf: 'center',
  },
  text2: {
    textAlign: 'center',
    color: Colors.SMT_Tertiary_1,
    fontSize: 11,
  },
  //=== Header Style 2 ===//

  //=== Header Style 3 ===//
  container3: {
    height: '100%',
    width: '100%',
    justifyContent: 'center',
    marginRight: 10,
  },
  icon3: {
    marginTop: 15,
    marginBottom: -2,
    alignSelf: 'center',
  },
  text3: {
    textAlign: 'center',
    color: Colors.SMT_Tertiary_1,
    fontSize: 11,
  },
  //=== Header Style 3 ===//
});

export default RightHeader;