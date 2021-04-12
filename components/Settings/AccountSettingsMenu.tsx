import {useNavigation} from '@react-navigation/native';
import React, {useContext} from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import Colors from '../../constants/Colors';
import AppContext from '../../providers/AppContext';
import AppTitle from '../layout/AppTitle';

interface Props {
  title: string;
  setSettingsMenu: (name: string) => void;
  isVisible?: boolean;
}

const AccountSettingsMenu: React.FC<Props> = (props) => {
  const {role} = useContext(AppContext);
  const navigation = useNavigation();

  return (
    <ScrollView
      style={[
        styles.settingsListContainer,
        props.isVisible ? {display: 'flex'} : {display: 'none'},
      ]}>
      <AppTitle title={props.title} />

      <View style={styles.settingsItemsContainer}>
        <View style={styles.settingsItem}>
          <View style={styles.accountSettingsLabel}>
            <Text style={styles.settingsItemText}>Edit Display Name</Text>
          </View>
          <View style={styles.accountSettingsInput}>
            <TextInput placeholder="Display Name" />
          </View>
        </View>

        {role !== 'admin' ? null : (
          <>
            <TouchableOpacity
              style={styles.settingsItem}
              onPress={() =>
                navigation.navigate('Modal', {modal: 'CreateGroupModal'})
              }>
              <View style={styles.accountSettingsLabel}>
                <Text style={styles.settingsItemText}>
                  Create New Franchise Group
                </Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.settingsItem}
              onPress={() =>
                navigation.navigate('Modal', {modal: 'CreateUserModal'})
              }>
              <View style={styles.accountSettingsLabel}>
                <Text style={styles.settingsItemText}>
                  Create New Franchise User
                </Text>
              </View>
            </TouchableOpacity>
          </>
        )}

        <TouchableOpacity
          style={styles.settingsItem}
          onPress={() => props.setSettingsMenu('Settings')}>
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
    marginVertical: -15,
  },
  settingsItemIcon: {
    marginHorizontal: 50,
    fontSize: 40,
    color: Colors.Secondary,
  },
  settingsItemText: {
  },
  //===== Settings Items ======
  headerStyle: {
    flex: 1,
  },
  text: {
    textAlign: 'center',
    color: Colors.SMT_Secondary_2_Light_1,
  },
  selected: {
    color: Colors.SMT_Primary_1_Light_1,
  },
});

export default AccountSettingsMenu;
