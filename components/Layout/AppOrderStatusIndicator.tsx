import { useNavigation } from '@react-navigation/native';
import React, { useContext, useState } from 'react';
import {StyleSheet, View, Text, TouchableOpacity} from 'react-native';
import Colors from '../../constants/Colors';
import Configs from '../../constants/Configs';
import AppContext from '../../providers/AppContext';
import { ToastContext } from '../../providers/ToastProvider';
import {OrderStatus} from '../../types/enums';
import { isSuccessStatusCode } from '../../utils/Helpers';
import AppButton from './AppButton';

interface Props {
  currentStatus: string;
  id: string;
}

const AppOrderStatusIndicator: React.FC<Props> = ({id, currentStatus}) => {
  const navigation = useNavigation();
  const [status, setStatus] = useState(currentStatus);
  const {token} = useContext(AppContext);
  const {show} = useContext(ToastContext);

  const getNotStartedColor = () => {
    if (status === 'not started') return Colors.SMT_Secondary_1;
    if (status === 'started') return Colors.SMT_Secondary_2_Light_1;
    if (status === 'completed') return 'limegreen';
    if (status === 'cancelled') return Colors.SMT_Primary_1;
  };

  const getStartedColor = () => {
    if (status === 'not started') return Colors.SMT_Tertiary_1;
    if (status === 'started') return Colors.SMT_Secondary_2_Light_1;
    if (status === 'completed') return 'limegreen';
    if (status === 'cancelled') return Colors.SMT_Tertiary_1;
  };

  const getCompletedColor = () => {
    if (status === 'not started') return Colors.SMT_Tertiary_1;
    if (status === 'started') return Colors.SMT_Tertiary_1;
    if (status === 'completed') return 'limegreen';
    if (status === 'cancelled') return Colors.SMT_Tertiary_1;
  };

  const demote = async () => {
    let demoteStatus = status;

    if (status === 'not started') return show({message: "Can't demote further."});
    if (status === 'cancelled') return show({message: "Can't demote cancelled orders."});
    if (status === 'started') demoteStatus = 'not started';
    if (status === 'completed') demoteStatus = 'started';
    
    await fetch(`${Configs.TCMC_URI}/api/orders`, {
        method: 'PUT', 
        body: JSON.stringify({_id: id, order_status: demoteStatus}), 
        headers: {'Content-Type': 'application/json', 'x-access-token': token}
    })
    .then(res => res.json())
    .then(json => {
        if (isSuccessStatusCode(json.status)) {
            setStatus(demoteStatus);
          } else {
            show({message: json.message});
          }
    })
  };

  const promote = async () => {
    let promoteStatus = status;

    if (status === 'completed') return show({message: "Can't promote further."});
    if (status === 'cancelled') return show({message: "Can't promote cancelled orders."});
    if (status === 'not started') {
        promoteStatus = 'started';
        navigation.navigate('Modal', {modal: "StartOrderModal",item: {_id: id}});
    }
    if (status === 'started') {
        promoteStatus = 'completed';
        navigation.navigate('Modal', {modal: "CompleteOrderModal", item: {_id: id}});
    }
  };

  return (
    <View
      style={{
        flex: 1,
        flexDirection: 'row',
        marginTop: 10,
        justifyContent: 'center',
        alignItems: 'center',
      }}>
      <TouchableOpacity onPress={demote}
        style={{
          backgroundColor: Colors.SMT_Secondary_2,
          marginRight: 5,
          justifyContent: 'center',
          borderRadius: 3,
          paddingHorizontal: 3,
        }}>
        <Text style={{color: Colors.SMT_Tertiary_1, fontWeight: 'bold'}}>Demote</Text>
      </TouchableOpacity>
      {/* <AppButton title="Demote" onPress={() => console.log('demote')} /> */}

      {currentStatus === 'cancelled' ? (
        <View style={{borderWidth: 1, borderColor: 'black'}}>
          <Text>Cancelled</Text>
        </View>
      ) : (
        <View
          style={{
            flexDirection: 'row',
            padding: 5,
            borderWidth: 1,
            borderColor: Colors.SMT_Secondary_1_Light_1,
            marginRight: 5,
            borderRadius: 3, 
            backgroundColor: Colors.SMT_Secondary_1_Light_1,
          }}>
          <View style={{marginRight: 5}}>
            <Text style={{color: getNotStartedColor(), fontSize: 12}}>Not Started</Text>
          </View>

          <View style={{marginRight: 5}}>
            <Text style={{color: getStartedColor(), fontSize: 12}}>={'>'}</Text>
          </View>

          <View style={{marginRight: 5}}>
            <Text style={{color: getStartedColor(), fontSize: 12}}>Started</Text>
          </View>

          <View style={{marginRight: 5}}>
            <Text style={{color: getCompletedColor(), fontSize: 12}}>={'>'}</Text>
          </View>

          <View style={{}}>
            <Text style={{color: getCompletedColor(), fontSize: 12}}>Completed</Text>
          </View>
        </View>
      )}

      <TouchableOpacity onPress={promote}
        style={{
          backgroundColor: Colors.SMT_Secondary_2,
          justifyContent: 'center',
          borderRadius: 3,
          paddingHorizontal: 3,
        }}>
        <Text style={{color: Colors.SMT_Tertiary_1, fontWeight: 'bold'}}>Promote</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({});

export default AppOrderStatusIndicator;
