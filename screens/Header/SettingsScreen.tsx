import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

import Colors from '../../constants/Colors';
import SettingsList from '../../components/Settings/SettingsList';

interface Props {
    logOut: () => void;
}

const SettingsScreen: React.FC<Props> = (props) => {
    return (
      <View style={styles.settingsContainer}>

        {/* Settings List Component */}
        <SettingsList />

        <View style={styles.linksContainer}>
          <TouchableOpacity onPress={() => console.log("Help Center")}>
            <View style={styles.link}>
              <Text style={[styles.linkText, { fontWeight: "bold" }]}>
                Help Center
              </Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => logOutButton(props)}>
            <View style={styles.link}>
              <Text style={styles.linkText}>Log Out</Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>
    );
}

const logOutButton = async (props:Props) => {
    await AsyncStorage.removeItem('@google_user');
    props.logOut();
}

const styles = StyleSheet.create({
    settingsContainer: {
        flex: 1,
        margin: -10,
    },
    //======== ScrollView =======

    //======== ScrollView =======

    //===== Links Container =====
    linksContainer: {
        bottom: 0,
        borderTopWidth: 3,
        borderTopColor: Colors.Secondary,
        backgroundColor: Colors.TCMC_LightGray,
    },
    link: {
        paddingVertical: 10,
        borderBottomColor: Colors.Secondary,
        borderBottomWidth: 3,
    },
    linkText: {
        marginLeft: 30,
        fontSize: 16,
    },
    //===== Links Container =====
})

export default SettingsScreen;