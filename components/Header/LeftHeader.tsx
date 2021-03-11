import React from "react";
import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";

import Colors from "../../constants/Colors";
import Ionicons from "react-native-vector-icons/Ionicons";

interface Props {
  text: string;
}

const LeftHeader: React.FC<Props> = (props) => {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => navigation.navigate('Settings')}>
        <Ionicons
          style={styles.icon}
          name="settings-outline"
          size={44}
          color={Colors.SMT_Primary_1_Light_1}
        />
        <Text style={styles.text}>{props.text}</Text>
      </TouchableOpacity>
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    height: '100%',
    width: '100%',
    justifyContent: 'center',
    marginLeft: 10,
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
