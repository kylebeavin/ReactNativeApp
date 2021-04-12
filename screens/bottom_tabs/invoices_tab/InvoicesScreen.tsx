import React, {useContext, useEffect, useState} from 'react';
import {StyleSheet, View} from 'react-native';
import AppButton from '../../../components/layout/AppButton';
import { ToastContext } from '../../../providers/ToastProvider';
import { CameraContext } from '../../../providers/CameraProvider';
import useTest from '../../../hooks/useTest';
import AppBtnGrp from '../../../components/layout/AppBtnGrp';

const InvoicesScreen = () => {
  const {show} = useContext(ToastContext);
  const {showCamera} = useContext(CameraContext);
  const {generateTestRouteWithStops} = useTest();
  
  const [btnObj, setBtnObj] = useState<{[index: string]: boolean}>({['SU']: false, ['M']: false, ['T']: false, ['W']: false, ['TH']: false, ['F']: false, ['S']: false});

  return (
    <View style={styles.container}>

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