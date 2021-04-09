import React, {useContext, useEffect, useState} from 'react';
import {StyleSheet, View} from 'react-native';
import AppButton from '../../../components/layout/AppButton';
import { ToastContext } from '../../../providers/ToastProvider';
import { CameraContext } from '../../../providers/CameraProvider';
import useTest from '../../../hooks/useTest';
import AppBtnGrp from '../../../components/layout/AppBtnGrp';

interface Props {
  
}

const InvoicesScreen = () => {
  const {show} = useContext(ToastContext);
  const {showCamera} = useContext(CameraContext);
  const {generateTestRouteWithStops} = useTest();
  
  const [btnObj, setBtnObj] = useState<{[index: string]: boolean}>({['SU']: false, ['M']: false, ['T']: false, ['W']: false, ['TH']: false, ['F']: false, ['S']: false});

  return (
    <View style={styles.container}>
      <View>
          <AppButton title='Show Toast' onPress={() => show({message: "A new 'Entity' has been added to your franchise! "})} />
      </View>
      <View>
          <AppButton title='Show Camera' onPress={() => showCamera({})} />
      </View>
      <View>
          <AppButton title='Generate Test Route &amp; Orders' onPress={() => generateTestRouteWithStops()} />
      </View>
      <View>
        <AppBtnGrp state={{btnObj, setBtnObj}} />
      </View>
    </View> 
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default InvoicesScreen;