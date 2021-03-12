import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Animated } from 'react-native';
import Colors from '../../constants/Colors';

import AppButton from '../Layout/AppButton';

const AppTab = (props: any) => {
    const { focusAnim, title, onPress} = props;
    
    return (
      <View style={styles.container}>
        <AppButton title={title} onPress={onPress} backgroundColor={Colors.SMT_Primary_1_Dark_1} />
      </View>
    );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    height: "100%",
    width: "100%",
    justifyContent: "center",
    marginRight: 10,
  },
});

export default AppTab;