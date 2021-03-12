import React, {useContext, useEffect, useRef, useState} from 'react';
import {
  StyleSheet,
  Animated,
  Easing,
  View,
  Text,
  TouchableOpacity,
} from 'react-native';
import {RNCamera} from 'react-native-camera';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {CameraContext} from '../providers/CameraProvider';
import Colors from '../constants/Colors';
import Layout from '../constants/Layout';

const AppCamera = () => {
  const {camera, hide, takePic} = useContext(CameraContext);
  let cameraRef = useRef<RNCamera>(null).current;

  const takePicture = async () => {
    if (camera.ref) {
        const options = {quality: 0.5, base64: true};
        const data = await camera.ref.takePictureAsync(options);
        takePic({base64: data.base64, uri: data.uri});
        hide();
      }
  };

  return (
    <>
      {camera.visible ? (
        <View>
          <RNCamera
            ref={(ref) => (camera.ref = ref)}
            captureAudio={false}
            style={styles.preview}
            type={RNCamera.Constants.Type.back}
            androidCameraPermissionOptions={{
              title: 'Permission to use camera',
              message: 'We need your permission to use your camera',
              buttonPositive: 'Ok',
              buttonNegative: 'Cancel',
            }}
            androidRecordAudioPermissionOptions={{
              title: 'Permission to use audio recording',
              message: 'We need your permission to use your audio',
              buttonPositive: 'Ok',
              buttonNegative: 'Cancel',
            }}
          />
          <View style={styles.bottomToolbar}>
            <TouchableOpacity style={styles.backButton} onPress={() => hide()}>
              <MaterialIcons
                name="arrow-back-ios"
                size={30}
                color={Colors.SMT_Tertiary_1}
              />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.cameraButton}
              onPress={() => takePicture()}>
              <MaterialIcons
                name="camera-alt"
                size={50}
                color={Colors.SMT_Tertiary_1}
              />
            </TouchableOpacity>
          </View>
        </View>
      ) : null}
    </>
  );
};

const styles = StyleSheet.create({
  preview: {
    height: Layout.window.height,
  },
  bottomToolbar: {
    position: 'absolute',
    bottom: 0,
    flexDirection: 'row',
    padding: 10,
  },
  backButton: {
    flex: 1,
    opacity: 0.5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cameraButton: {
    flex: 1,
    opacity: 0.5,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default AppCamera;
