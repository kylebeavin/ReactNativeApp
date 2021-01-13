import React from "react";
import { StyleSheet, View, Text } from "react-native";

import Colors from "../constants/Colors";

function SplashScreen() {
  return (
    <View style={styles.container}>
      <Text>Loading...</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: Colors.TCMC_LightGray,
  },
});

export default SplashScreen;