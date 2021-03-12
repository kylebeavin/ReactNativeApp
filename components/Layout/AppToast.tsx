import React, {useContext, useEffect, useRef} from 'react';
import {
  Text,
  Animated,
  Easing,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import Colors from '../../constants/Colors';

import {ToastContext} from '../../providers/ToastProvider';

export const Toast = () => {
  const {toast, hide} = useContext(ToastContext);
  const translateYRef = useRef(new Animated.Value(-100));

  useEffect(() => {
    if (toast.visible) {
      Animated.timing(translateYRef.current, {
        duration: 500,
        easing: Easing.ease,
        toValue: 0,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(translateYRef.current, {
        duration: 500,
        easing: Easing.ease,
        toValue: -200,
        useNativeDriver: true,
      }).start();
    }
  }, [toast]);

  return (
    <Animated.View
      style={[
        styles.container,
        {transform: [{translateY: translateYRef.current}]},
      ]}>
      <TouchableOpacity onPress={hide} style={styles.content}>
        <Text style={styles.toastMessage}>{toast.message}</Text>
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    height: 100,
    width: '100%',
    position: 'absolute',
    top: 0,
    zIndex: 2,
    right: 0,
    left: 0,
    backgroundColor: Colors.SMT_Secondary_1_Light_1,
    borderBottomColor: Colors.SMT_Secondary_1,
    borderBottomWidth: 3,
    padding: 40,
  },
  content: {
    flex: 1,
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: 32,
  },
  toastMessage: {
    textAlign: 'center',
  },
});

export default Toast;
