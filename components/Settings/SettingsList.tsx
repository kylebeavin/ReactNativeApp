import React, {useState} from 'react';
import {View} from 'react-native';

import SettingsMenu from './SettingsMenu';
import AccountSettingsMenu from './AccountSettingsMenu';
import CRMSettingsMenu from './CRMSettingsMenu';

function SettingsList() {
  const [isVisible, setIsVisible] = useState([
    {Settings: true},
    {Account: false},
    {CRM: false},
  ]);

  const setSettingsMenu = (name: string) => {
    if (name === 'Settings') {
      setIsVisible([{Settings: true}, {Account: false}, {CRM: false}]);
    } else if (name === 'Account') {
      setIsVisible([{Settings: false}, {Account: true}, {CRM: false}]);
    } else if (name === 'CRM') {
      setIsVisible([{Settings: false}, {Account: false}, {CRM: true}]);
    }
  };

  return (
    <View style={{flex: 1}}>
      <SettingsMenu
        title='Settings'
        setSettingsMenu={setSettingsMenu}
        isVisible={isVisible[0].Settings}
      />
      <AccountSettingsMenu
        title='Account Settings'
        setSettingsMenu={setSettingsMenu}
        isVisible={isVisible[1].Account}
      />
      <CRMSettingsMenu
        title='CRM Settings'
        setSettingsMenu={setSettingsMenu}
        isVisible={isVisible[2].CRM}
      />
    </View>
  );
}

export default SettingsList;