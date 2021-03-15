import {useNavigation} from '@react-navigation/native';
import React, {useContext, useEffect, useState} from 'react';
import {
  StyleSheet,
  View,
  Image,
  TouchableOpacity,
  Text,
  Platform,
} from 'react-native';
import AppButton from '../../../components/Layout/AppButton';
import Colors from '../../../constants/Colors';
import Configs from '../../../constants/Configs';
import Layout from '../../../constants/Layout';
import AppContext from '../../../providers/AppContext';
import {ToastContext} from '../../../providers/ToastProvider';
import {isSuccessStatusCode} from '../../../utils/Helpers';
import ModalButtons from '../ModalButtons';
import {CameraContext} from '../../../providers/CameraProvider';
import AppTitle from '../../../components/Layout/AppTitle';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

interface Props {
  order: {_id: string};
}

const StartOrderModal: React.FC<Props> = ({order}) => {
  const navigation = useNavigation();
  const {token} = useContext(AppContext);
  const {show} = useContext(ToastContext);
  const {camera, pictures, showCamera, clearPics} = useContext(CameraContext);
  const [truckImage, setTruckImage] = useState('');
  const [containerImage, setContainerImage] = useState({base64: '', uri: ''});
  const [valid, setValid] = useState(true);

  const createFormData = (photo: any, body: any) => {
    const data = new FormData();
    data.append('photo', {
      name: 'order_started.jpeg',
      type: 'image/jpeg',
      uri:
        Platform.OS === 'android'
          ? photo.uri
          : photo.uri.replace('file://', ''),
    });

    Object.keys(body).forEach((key) => {
      data.append(key, body[key]);
    });
    return data;
  };

  const updateStatus = async () => {
    if (containerImage.uri === '') {
      setValid(false);
      return;
    }

    let requestBody = {_id: order._id, order_status: 'started'};

    await fetch(`${Configs.TCMC_URI}/api/orderPics`, {
      method: 'POST',
      headers: {'x-access-token': token},
      body: createFormData(containerImage, requestBody),
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

  useEffect(() => {
    if (containerImage.uri !== '') setValid(true);
    Object.keys(pictures).map((key) => {
      if (key === 'Container') {
        setContainerImage({
          base64: pictures[key].base64,
          uri: pictures[key].uri,
        });
      }
    });

    return unmount;
  }, [camera, containerImage]);

  const unmount = () => {
    clearPics({});
  };

  return (
    <>
      <View style={styles.form}>
        <View style={{marginBottom: 10}}>
          <AppTitle title='Start Order' />
        </View>
        <View style={styles.formGroup}>
          <AppButton
            title='Container'
            onPress={() => showCamera({key: 'Container'})}
            icon={{type: 'MaterialIcons', name: 'camera-alt'}}
          />
          <View>
            <Image
              source={
                containerImage.uri === ''
                  ? require('../../../assets/images/thumbnail_placeholder.jpg')
                  : {uri: containerImage.uri}
              }
              style={styles.thumbnail}
            />
            {containerImage.uri === '' ? null : (
              <TouchableOpacity
                style={{position: 'absolute', top: 0, right: 0}}
                onPress={() => {
                  unmount();
                  setContainerImage({base64: '', uri: ''});
                  setValid(false);
                }}>
                <MaterialIcons
                  style={{opacity: 0.5}}
                  name='cancel'
                  size={50}
                  color={Colors.SMT_Tertiary_1}
                />
              </TouchableOpacity>
            )}
          </View>
        </View>
        {valid ? null : (
          <View>
            <Text style={{textAlign: 'center', color: Colors.SMT_Primary_1}}>
              You must provide an image of container before smashing!
            </Text>
          </View>
        )}
      </View>
      <ModalButtons navigation={navigation} save={() => updateStatus()} />
    </>
  );
};

const styles = StyleSheet.create({
  form: {
    maxHeight: Layout.window.height / 1.5,
    marginBottom: 20,
    borderRadius: 4,
    backgroundColor: Colors.SMT_Tertiary_1,
  },
  formGroup: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
    marginBottom: 10,
  },
  thumbnail: {
    height: 200,
    width: 200,
    borderRadius: 4,
  },
});

export default StartOrderModal;
