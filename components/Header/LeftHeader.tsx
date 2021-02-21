import React, { useContext } from "react";
import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Avatar } from "react-native-elements";

import Colors from "../../constants/Colors";
import AppContext from "../../providers/AppContext";
import Ionicons from "react-native-vector-icons/Ionicons";

interface Props {
  text: string;
}

const LeftHeader: React.FC<Props> = (props) => {
  const {headerStyle} = useContext(AppContext);
  const navigation = useNavigation();

  const renderLeftHeader = () => {
    if (headerStyle === 1) {
      return ( 
        <View style={styles.container}>
          <TouchableOpacity onPress={() => navigation.navigate("Settings")}>
            <Avatar
              size={55}
              rounded
              containerStyle={styles.avatar}
              icon={{
                name: "settings",
                size: 40,
                color: Colors.SMT_Primary_1,
              }}
            />
            <Text style={styles.text}>{props.text}</Text>
          </TouchableOpacity>
        </View>
      );
    } else if (headerStyle === 2) {
      return (
        <View style={styles.container2}>
          <TouchableOpacity onPress={() => navigation.navigate('Settings')}>
            <Ionicons
              style={styles.icon2}
              name="settings-outline"
              size={44}
              color={Colors.SMT_Primary_1_Light_1}
            />
            <Text style={styles.text2}>{props.text}</Text>
          </TouchableOpacity>
        </View>
      );
    } else if (headerStyle === 3) {
      return (
        <View style={styles.container3}>
          <TouchableOpacity onPress={() => navigation.navigate('Settings')}>
            <Avatar
              size={55}
              rounded
              containerStyle={styles.avatar}
              icon={{
                name: 'settings',
                size: 40,
                color: Colors.SMT_Primary_1,
              }}
            />
            <Text style={styles.text3}>{props.text}</Text>
          </TouchableOpacity>
        </View>
      );
    }
  }

  return ( 
    <>
      {renderLeftHeader()}
    </>
  );
};
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
    marginLeft: 10,
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
    marginLeft: 10,
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

export default LeftHeader;





// import React from "react";
// import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
// import { useNavigation } from "@react-navigation/native";
// import Ionicons from "react-native-vector-icons/Ionicons";

// import Colors from "../../constants/Colors";

// interface Props {
//   text: string;
// }

// const LeftHeader: React.FC<Props> = (props) => {
//   const navigation = useNavigation();

//   return (
//     <View style={styles.container}>
//       <TouchableOpacity onPress={() => navigation.navigate("Settings")}>
//         <Ionicons style={styles.icon} name="settings-outline" size={44} color={Colors.SMT_Primary_1_Light_1} />
//         <Text style={styles.text}>{props.text}</Text>
//       </TouchableOpacity>
//     </View>
//   );
// };
// const styles = StyleSheet.create({
//   container: {
//     height: "100%",
//     width: "100%",
//     justifyContent: "center",
//     marginLeft: 10,
//   },
//   icon: {
//     marginTop: 15,
//     marginBottom: -2,
//     alignSelf: "center",
//   },
//   text: {
//     textAlign: "center",
//     color: Colors.SMT_Tertiary_1,
//     fontSize: 11,
//   },
// });

// export default LeftHeader;
