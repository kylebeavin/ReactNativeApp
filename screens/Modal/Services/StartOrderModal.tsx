import {useNavigation} from '@react-navigation/native';
import React, {useContext, useRef, useState} from 'react';
import {StyleSheet, View, Text, TouchableOpacity} from 'react-native';
import AppButton from '../../../components/Layout/AppButton';
import Colors from '../../../constants/Colors';
import Configs from '../../../constants/Configs';
import Layout from '../../../constants/Layout';
import AppContext from '../../../providers/AppContext';
import {ToastContext} from '../../../providers/ToastProvider';
import {isSuccessStatusCode} from '../../../utils/Helpers';
import ModalButtons from '../ModalButtons';
import {RNCamera} from 'react-native-camera';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

interface Props {
  order: string;
}

const StartOrderModal: React.FC<Props> = ({order}) => {
  const navigation = useNavigation();
  const {token} = useContext(AppContext);
  const {show} = useContext(ToastContext);
  let camera = useRef<RNCamera>(null).current;
  const [cameraToggle, setCameraToggle] = useState(false);

  const updateStatus = async () => {
    await fetch(`${Configs.TCMC_URI}/api/orders`, {
      method: 'PUT',
      body: JSON.stringify({_id: order, order_status: 'started'}),
      headers: {'Content-Type': 'application/json', 'x-access-token': token},
    })
      .then((res) => res.json())
      .then((json) => {
        if (isSuccessStatusCode(json.status)) {
          show({message: json.message});
          navigation.navigate('OrdersScreen');
        } else {
          show({message: json.message});
        }
      })
      .catch((err) => show({message: err.message}));
  };

  const takePicture = async () => {
    if (camera) {
      const options = {quality: 0.5, base64: true};
      const data = await camera.takePictureAsync(options);
      console.log(data.uri);
    }
  };

  return (
    <>
      <View style={styles.form}>
        <View style={{flexDirection: 'row'}}>
          <AppButton
            title="Truck"
            onPress={() => setCameraToggle(true)}
            icon={{type: 'MaterialIcons', name: 'camera-alt'}}
          />
        </View>
        <View style={{flexDirection: 'row'}}>
          <AppButton
            title="Container"
            onPress={() => setCameraToggle(true)}
            icon={{type: 'MaterialIcons', name: 'camera-alt'}}
          />
        </View>
      </View>
      <ModalButtons navigation={navigation} save={() => updateStatus()} />
      {cameraToggle ? (
        <View>
          <RNCamera
            ref={(ref) => (camera = ref)}
            captureAudio={false}
            style={styles.preview}
            type={RNCamera.Constants.Type.back}
            //flashMode={RNCamera.Constants.FlashMode.on}
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
            onGoogleVisionBarcodesDetected={({barcodes}) => {
              console.log(barcodes);
            }}
          />
          <View style={{flex: 0, flexDirection: 'row', justifyContent: 'center'}}>
            <TouchableOpacity onPress={takePicture}>
              {/* <Text style={{fontSize: 14}}> SNAP </Text> */}
              <MaterialIcons style={{opacity: .5}} name="camera-alt" size={50} color={Colors.SMT_Tertiary_1} />
            </TouchableOpacity>
          </View>
        </View>
      ) : null}
    </>
  );
};

const styles = StyleSheet.create({
  form: {
    maxHeight: Layout.window.height / 1.5,
    marginBottom: 20,
    padding: 20,
    borderRadius: 4,
    backgroundColor: Colors.SMT_Tertiary_1,
  },
  preview: {
    position: 'absolute',
    top: -200,
    height: '100%',
    width: '100%',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },

});

export default StartOrderModal;
