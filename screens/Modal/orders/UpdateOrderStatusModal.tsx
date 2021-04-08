import {useNavigation} from '@react-navigation/native';
import React, {useContext, useState} from 'react';
import {View, StyleSheet, Text} from 'react-native';
import {ButtonGroup} from 'react-native-elements';
import AppTitle from '../../../components/layout/AppTitle';

import Colors from '../../../constants/Colors';
import Configs from '../../../constants/Configs';
import Layout from '../../../constants/Layout';
import AppContext from '../../../providers/AppContext';
import {ToastContext} from '../../../providers/ToastProvider';
import {Order} from '../../../types/orders';
import {isSuccessStatusCode} from '../../../utils/Helpers';
import ModalButtons from '../ModalButtons';

interface Props {
  order: Order;
}

const UpdateOrderStatusModal: React.FC<Props> = ({order}) => {
  const navigation = useNavigation();
  const {token} = useContext(AppContext);
  const {show} = useContext(ToastContext);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const buttons = ['Not Started', 'Started', 'Completed', 'Cancelled'];

  const updateIndex = (selectedIndex: number) => {
    setSelectedIndex(selectedIndex);
  };

  const updateStatus = async () => {
    await fetch(`${Configs.TCMC_URI}/api/orders`, {
      method: 'PUT',
      body: JSON.stringify({
        _id: order._id,
        order_status: buttons[selectedIndex].toLowerCase(),
      }),
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

  const getButtonStyles = () => {
    switch (selectedIndex) {
      case 0:
        return {backgroundColor: Colors.SMT_Secondary_1};
      case 1:
        return {backgroundColor: Colors.SMT_Secondary_2_Light_1};
      case 2:
        return {backgroundColor: 'limegreen'};
      case 3:
        return {backgroundColor: Colors.SMT_Primary_1};
      default:
        return null;
    }
  };

  return (
    <>
      <View style={styles.form}>
        <AppTitle title={order.order_id} />
        <View style={styles.orderContainer}>
          <ButtonGroup
            onPress={updateIndex}
            selectedIndex={selectedIndex}
            buttons={buttons}
            containerStyle={{flex: 1}}
            selectedButtonStyle={getButtonStyles()}
          />
        </View>
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
  orderContainer: {
    flexDirection: 'row',
  },
  orderItem: {
    marginRight: 5,
  },
});

export default UpdateOrderStatusModal;
