import React from 'react';
import {StyleSheet} from 'react-native';
import {Header} from 'react-native-elements';

import Colors from '../../constants/Colors';
import CenterHeader from './CenterHeader';
import LeftHeader from './LeftHeader';
import RightHeader from './RightHeader';

interface Props {}

const HeaderContainer: React.FC<Props> = (props) => {
  return (
    <Header
      containerStyle={styles.container}
      leftComponent={<LeftHeader text='SETTINGS' />}
      centerComponent={<CenterHeader text='Franchise' />}
      rightComponent={<RightHeader text='DASHBOARD' />}
    />
  );
};

const styles = StyleSheet.create({
  container: {
    height: 100,
    paddingTop: 0,
    backgroundColor: Colors.SMT_Primary_2,
    paddingHorizontal: 0,
    marginTop: -15,
  },
});

export default HeaderContainer;
