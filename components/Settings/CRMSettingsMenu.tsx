import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import Colors from '../../constants/Colors';
import AppTitle from '../layout/AppTitle';

interface Props {
  title: string;
  setSettingsMenu: (name: string) => void;
  isVisible?: boolean;
}

const CRMSettingsMenu: React.FC<Props> = ({title, setSettingsMenu, isVisible}) => {
  return (
    <ScrollView
      style={[
        styles.settingsListContainer,
        isVisible ? {display: 'flex'} : {display: 'none'},
      ]}>
      <AppTitle title={title}/>

      <View style={styles.settingsItemsContainer}>
        <TouchableOpacity style={styles.settingsItem}>
          <View style={styles.accountSettingsLabel}>
            <Text style={styles.settingsItemText}>Edit Company Info</Text>
          </View>
          <View style={styles.accountSettingsInput}>
            <TextInput placeholder='Company Name' />
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.settingsItem}
          onPress={() => setSettingsMenu('Settings')}>
          <View style={styles.accountSettingsLabel}>
            <Text style={styles.settingsItemText}>Go Back to Settings</Text>
          </View>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  settingsListContainer: {
    flex: 1,
    display: 'none',
  },

  //===== Title Component =====
  settingsListTitle: {
    borderBottomWidth: 3,
    borderBottomColor: Colors.TCMC_LightGray,
  },
  settingsListTitleText: {
    marginLeft: 20,
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  //===== Title Component =====

  //===== Settings Items ======
  settingsItemsContainer: {
    flex: 1,
  },
  settingsItem: {
    flex: 1,
    flexDirection: 'row',
    paddingVertical: 10,
    borderBottomColor: Colors.TCMC_LightGray,
    borderBottomWidth: 3,
  },
  accountSettingsLabel: {
    flex: 1,
    marginLeft: 25,
    justifyContent: 'center',
  },
  accountSettingsInput: {
    flex: 1,
  },
  settingsItemIcon: {
    marginHorizontal: 50,
    fontSize: 40,
    color: Colors.Secondary,
  },
  settingsItemText: {
  },
  //===== Settings Items ======
});

export default CRMSettingsMenu;
