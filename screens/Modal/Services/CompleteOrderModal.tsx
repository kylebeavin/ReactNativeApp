import {useNavigation} from '@react-navigation/native';
import React, {useContext, useEffect, useState} from 'react';
import {
  StyleSheet,
  View,
  Image,
  TouchableOpacity,
  Text,
  Platform,
  ScrollView,
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
import useForm from '../../../hooks/useForm';
import AppTextInput from '../../../components/Layout/AppTextInput';
import {ifNeedHaul, isRequired} from '../../../utils/Validators';
import Geolocation from '@react-native-community/geolocation';
import AppCheckBox from '../../../components/Layout/AppCheckBox';

interface Props {
  order: {_id: string};
}

const CompleteOrderModal: React.FC<Props> = ({order}) => {
  //#region Form Initializers
  const formValues = {
    containers_serviced: '',
    haul: true,
    needing_hauled: '',
    notes: '',
  };

  const formErrors = {
    containers_serviced: [],
    haul: [],
    needing_hauled: [],
    notes: [],
  };

  const formValidations = {
    containers_serviced: [isRequired],
    haul: [],
    notes: [],
  };
  //#endregion

  //#region Use State Variables
  const navigation = useNavigation();
  const {token} = useContext(AppContext);
  const {show} = useContext(ToastContext);
  const {camera, pictures, showCamera, clearPics} = useContext(CameraContext);
  const [location, setLocation] = useState('');
  const [containerImage, setContainerImage] = useState({base64: '', uri: ''});
  const [valid, setValid] = useState(true);
  const {handleChange, handleSubmit, values, errors, setErrors} = useForm(
    formValues,
    formErrors,
    formValidations,
    updateStatus,
  );
  //#endregion

  useEffect(() => {
    Geolocation.getCurrentPosition((info) =>
      setLocation(`${info.coords.longitude},${info.coords.latitude}`),
    );
  }, []);

  const createFormData = (photo: any, body: any) => {
    const data = new FormData();
    data.append('photo', {
      name: 'order_completed.jpeg',
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

  async function updateStatus() {
    if (containerImage.uri === '') {
      setValid(false);
      return;
    }

    let requestBody = {
      _id: order._id,
      order_status: 'completed',
      containers_serviced: values.containers_serviced,
      haul: values.haul,
      needing_haul: !values.haul ? 0 : values.needing_hauled,
      completed_geo_location: location,
      completed_time: new Date().toISOString(),
    };

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
  }

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
    <View>
      <ScrollView style={styles.form}>
        <View>
          <View style={{marginBottom: 10}}>
            <AppTitle title='Complete Order' help />
          </View>

          {/* Containers Serviced */}
          <View style={{paddingHorizontal: 10}}>
            <AppTextInput
              label='Containers Serviced'
              name='containers_serviced'
              value={values.containers_serviced}
              onChange={(val) => handleChange('containers_serviced', val)}
              validations={[isRequired]}
              errors={errors.containers_serviced}
              setErrors={setErrors}
              keyboardType='number-pad'
            />
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
                You must provide an image of container after smashing!
              </Text>
            </View>
          )}
        </View>

        <View style={styles.formGroup}>
          {/* Haul */}
          <View style={{paddingHorizontal: 10}}>
            <AppCheckBox
              label='Haul'
              name='haul'
              value={values.haul}
              onChange={(name, val) => handleChange(name, val)}
              validations={[]}
              errors={errors.haul}
              setErrors={setErrors}
            />
          </View>

          {!values.haul ? null : (
            <View style={{paddingHorizontal: 10}}>
              {/* Need Hauled */}
              <AppTextInput
                label='Needing Hauled'
                name='needing_hauled'
                value={values.needing_hauled}
                onChange={(val) => handleChange('needing_hauled', val)}
                validations={[]}
                errors={errors.needing_hauled}
                setErrors={setErrors}
                keyboardType='number-pad'
              />
            </View>
          )}
        </View>

        {/* Notes */}
        <View style={{paddingHorizontal: 10}}>
          <AppTextInput
            label='Notes'
            name='notes'
            value={values.notes}
            onChange={(val) => handleChange('notes', val)}
            validations={[]}
            errors={errors.notes}
            setErrors={setErrors}
          />
        </View>
      </ScrollView>
      <ModalButtons navigation={navigation} save={handleSubmit} />
    </View>
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
  fieldContainer: {
    marginBottom: 10,
  },
});

export default CompleteOrderModal;
