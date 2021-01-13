import React from 'react';
import { useNavigation } from '@react-navigation/native';
import { StyleSheet, View, Text } from 'react-native';

import AppButton from './AppButton';

interface Props {
    selected: string;
}

const AppNavBtnGrp : React.FC<Props> = (props) => {
    const navigation = useNavigation();
    return (
      <View>
        {/* Button NavStack */}
        <View style={styles.container}>
          <View style={styles.buttonNavStackContainer}>
            <AppButton
              title="CLIENTS"
              onPress={() => navigation.navigate("AccountsScreen")}
              outlined={props.selected === "one" ? false: true}
            />
          </View>
          <View style={styles.buttonNavStackContainer}>
            <AppButton
              title="MEETINGS"
              onPress={() => navigation.navigate("MeetingsScreen")}
              outlined={props.selected === "two" ? false : true}
            />
          </View>
          <View
            style={{ ...styles.buttonNavStackContainer, ...{ marginRight: 0 } }}
          >
            <AppButton
              title="MAP"
              onPress={() => navigation.navigate("MapScreen")}
              outlined={props.selected === "three" ? false : true}
            />
          </View>
        </View>
      </View>
    );
}

const styles = StyleSheet.create({
      //== Buttons NavStack ==
  container: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    marginBottom: 5,
  },
  buttonNavStackContainer: {
    flex: 1,
    height: "100%",
    width: "100%",
    marginRight: 10,
  },
});

export default AppNavBtnGrp;