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
import AppTitle from '../Layout/AppTitle';

interface Props {
  title: string;
  setSettingsMenu: (name: string) => void;
  isVisible?: boolean;
}

const AccountSettingsMenu: React.FC<Props> = (props) => {
  const {headerStyle, setHeaderStyle} = useContext(AppContext);

  const handleOnPress = (val: number) => {
    setHeaderStyle(val);
  };

  return (
    <ScrollView
      style={[
        styles.settingsListContainer,
        props.isVisible ? {display: 'flex'} : {display: 'none'},
      ]}>
      <AppTitle title={props.title}/>

      {/* Account Settings Menu */}
      <View style={styles.settingsItemsContainer}>

        <View style={styles.settingsItem}>
          <View style={styles.accountSettingsLabel}>
            <Text style={styles.settingsItemText}>Edit Display Name</Text>
          </View>
          <View style={styles.accountSettingsInput}>
            <TextInput placeholder="Display Name" />
            {/* <Ionicons style={styles.settingsItemIcon} name="md-person" /> */}
          </View>
        </View>

        <View style={styles.settingsItem}>
          <View style={styles.accountSettingsLabel}>
            <Text style={styles.settingsItemText}>Header Style</Text>
          </View>
          <View style={[styles.accountSettingsInput, {flexDirection: 'row', marginRight: 45}]}>
            <TouchableOpacity style={[styles.headerStyle]}>
              <Text
                style={[styles.text, headerStyle === 1 ? styles.selected : null]}
                onPress={() => handleOnPress(1)}
              >
                1
              </Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.headerStyle]}>
              <Text
                style={[styles.text, headerStyle === 2 ? styles.selected : null]}
                onPress={() => handleOnPress(2)}
              >
                2
              </Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.headerStyle}>
              <Text
                style={[styles.text, headerStyle === 3 ? styles.selected : null]}
                onPress={() => handleOnPress(3)}
              >
                3
              </Text>
            </TouchableOpacity>
            {/* <Ionicons style={styles.settingsItemIcon} name="md-person" /> */}
          </View>
        </View>

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
    // borderBottomColor: Colors.TCMC_LightGray,
    // borderBottomWidth: 3,
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
    //fontSize: 20,
    //textAlignVertical: 'center',
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
  }
});

export default AccountSettingsMenu;
