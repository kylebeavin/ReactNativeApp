import React, { useContext } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';

import Colors from '../../constants/Colors';
import SettingsList from '../../components/Settings/SettingsList';
import useAsyncStorage from '../../hooks/useAsyncStorage';
import { useNavigation } from '@react-navigation/native';
import AppContext from '../../providers/AppContext';

interface Props {
}

const SettingsScreen: React.FC<Props> = (props) => {
  const {setIsAuth, setToken, setGrpId} = useContext(AppContext);
  const navigation = useNavigation();

  const logOut = async () => {
    setToken("");
    setGrpId([]);
    setIsAuth(false);
  }

  return (
    <View style={styles.settingsContainer}>
      {/* Settings List Component */}
      <SettingsList />

      <View style={styles.linksContainer}>
        <TouchableOpacity onPress={() => console.log('Help Center')}>
          <View style={styles.link}>
            <Text style={[styles.linkText, {fontWeight: 'bold'}]}>
              Help Center
            </Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => logOut()}>
          <View style={styles.link}>
            <Text style={styles.linkText}>Log Out</Text>
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
    settingsContainer: {
        flex: 1,
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