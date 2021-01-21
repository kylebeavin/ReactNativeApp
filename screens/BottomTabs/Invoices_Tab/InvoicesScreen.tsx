import * as React from 'react';
import {StyleSheet, View} from 'react-native';
import AppButton from '../../../components/Layout/AppButton';
import { ToastContext } from '../../../providers/ToastProvider';

interface Props {
  
}

const InvoicesScreen = () => {
  const {show} = React.useContext(ToastContext);
  return (
    <View style={styles.container}>
      <View>
          <AppButton title="Show Toast" onPress={() => show({message: 'A new "Entity" has been added to your franchise! '})} />
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