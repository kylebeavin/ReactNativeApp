import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import Ionicons from 'react-native-vector-icons/Ionicons';

import Colors from '../../constants/Colors';
import AppTitle from '../Layout/AppTitle';

interface Props {
  title: string;
  setSettingsMenu: (name: string) => void;
  isVisible?: boolean;
}

const SettingsMenu: React.FC<Props> = (props) => {
  return (
    <ScrollView
      style={[
        styles.settingsListContainer,
        props.isVisible ? {display: 'flex'} : {display: 'none'},
      ]}>
      <AppTitle title='Settings' />

      <View style={styles.settingsItemsContainer}>
        <TouchableOpacity
          style={styles.settingsItem}
          onPress={() => props.setSettingsMenu('Account')}>
          <View style={styles.col1}>
            <Ionicons style={styles.settingsItemIcon} name='md-person' />
          </View>
          <View style={styles.col2}>
            <Text style={styles.settingsItemText}>Account Settings</Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.settingsItem}
          onPress={() => props.setSettingsMenu('CRM')}>
          <View style={styles.col1}>
            <Ionicons style={styles.settingsItemIcon} name='md-people' />
          </View>
          <View style={styles.col2}>
            <Text style={styles.settingsItemText}>CRM Settings</Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity style={styles.settingsItem}>
          <View style={styles.col1}>
            <FontAwesome5
              style={styles.settingsItemIcon}
              name='truck-monster'
            />
          </View>
          <View style={styles.col2}>
            <Text style={styles.settingsItemText}>Service Settings</Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity style={styles.settingsItem}>
          <View style={styles.col1}>
            <FontAwesome5
              style={styles.settingsItemIcon}
              name='map-marked-alt'
            />
          </View>

          <View style={styles.col2}>
            <Text style={styles.settingsItemText}>Route Settings</Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity style={styles.settingsItem}>
          <View style={styles.col1}>
            <FontAwesome5
              style={styles.settingsItemIcon}
              name='file-invoice-dollar'
            />
          </View>
          <View style={styles.col2}>
            <Text style={styles.settingsItemText}>Invoice Settings</Text>
          </View>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  settingsListContainer: {
    flex: 1,
  },
  col1: {
    flex: 1,
    alignItems: 'center',
  },
  col2: {
    flex: 2,
    justifyContent: 'center',
  },
  //===== Settings Items ======
  settingsItemsContainer: {
    flex: 1,
  },
  settingsItem: {
    flex: 1,
    flexDirection: 'row',
    paddingVertical: 5,
    borderBottomColor: Colors.TCMC_LightGray,
    borderBottomWidth: 3,
  },
  settingsItemIcon: {
    fontSize: 40,
    color: Colors.Secondary,
  },
  settingsItemText: {
    fontSize: 20,
    textAlignVertical: 'center',
  },
  //===== Settings Items ======
});

export default SettingsMenu;