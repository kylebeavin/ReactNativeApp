import React, {useState} from 'react';
import {StyleSheet, View} from 'react-native';

import Colors from '../../constants/Colors';
import SettingsMenu from './SettingsMenu';
import AccountSettingsMenu from './AccountSettingsMenu';
import CRMSettingsMenu from './CRMSettingsMenu';

function SettingsList() {
    const [menu, setMenu] = useState("Settings");
    const [isVisible, setIsVisible] = useState([{"Settings": true},{"Account": false},{"CRM": false}])
    const setSettingsList = () => {

    }
    
    const setSettingsMenu = (name: string) => {
        if (name === "Settings"){
            setIsVisible([{"Settings": true},{"Account": false},{"CRM": false}])
        } else if(name === "Account"){
            setIsVisible([{"Settings": false},{"Account": true},{"CRM": false}])
        } else if(name === "CRM"){
            setIsVisible([{"Settings": false},{"Account": false},{"CRM": true}])
        }
        //setMenu(name);
    };
    
    return (
      <View style={{ flex: 1 }}>
          <SettingsMenu title="Settings" setSettingsMenu={setSettingsMenu} isVisible={isVisible[0].Settings}/>
          <AccountSettingsMenu title="Account Settings" setSettingsMenu={setSettingsMenu} isVisible={isVisible[1].Account}/>
          <CRMSettingsMenu title="CRM Settings" setSettingsMenu={setSettingsMenu} isVisible={isVisible[2].CRM} />
      </View>
    );
}

const styles = StyleSheet.create({
    settingsListContainer: {
        flex: 1,
    },

    //===== Title Component =====
    settingsListTitle: {
        borderBottomWidth: 3,
        borderBottomColor: Colors.TCMC_LightGray,
    },
    settingsListTitleText: {
        marginLeft: 20,
        fontSize: 20,
        fontWeight: "bold",
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
    settingsItemIcon: {
        marginHorizontal: 50,
        fontSize: 40,
        color: Colors.Secondary,
    },
    settingsItemText: {
        fontSize: 20,
        textAlignVertical: 'center',
    },
    //===== Settings Items ====== 
})

export default SettingsList;