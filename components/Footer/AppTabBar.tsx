import React from "react";
import { StyleSheet, View } from "react-native";

import Colors from "../../constants/Colors";
import AppTab from "./AppTab";

const AppTabBar = (props: any) => {
  const { state, navigation, position } = props;

  return (
    <View style={styles.tabBarContainer}>
      {state.routes.map((route: any, index: any) => {
        if (
          route.name === "Dashboard" ||
          route.name === "Settings" ||
          route.name === "Reports"
        ) {
          return null;
        }
        return (
          <AppTab
            key={index}
            title={route.name}
            onPress={() => navigation.navigate(route.name)}
          />
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  tabBarContainer: {
    height: 55,
    paddingTop: 5,
    paddingLeft: 10,
    //paddingRight: 10,
    backgroundColor: Colors.SMT_Primary_2,
    flexDirection: "row",
    alignItems: "center",
  },
});

export default AppTabBar;
