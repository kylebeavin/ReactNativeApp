import { Picker } from '@react-native-picker/picker';
import { useNavigation } from '@react-navigation/native';
import React, { useContext, useEffect, useState } from 'react';
import {StyleSheet, Text, View} from 'react-native';
import AppPicker from '../../../components/layout/AppPicker';
import AppTitle from '../../../components/layout/AppTitle';
import Colors from '../../../constants/Colors';
import Configs from '../../../constants/Configs';
import Layout from '../../../constants/Layout';
import AppContext from '../../../providers/AppContext';
import { ToastContext } from '../../../providers/ToastProvider';
import { Route, Truck } from '../../../types/routes';
import { isSuccessStatusCode } from '../../../utils/Helpers';
import ModalButtons from '../ModalButtons';

interface Props {
  route: Route;
}

const AssignTruckModal: React.FC<Props> = ({route}) => {
  //#region Use State Variables
  const navigation = useNavigation();
  const {grpId, token} = useContext(AppContext);
  const {show} = useContext(ToastContext);

  const [truck, setTruck] = useState('');

  const [trucksList, setTrucksList] = useState<Truck[]>([]);
  //#endregion

  useEffect(() => {
    getTrucks();
  }, []);
  
  const getTrucks = async () => {
    await fetch(`${Configs.TCMC_URI}/api/truckBy`, {
        method: 'POST',
        body: JSON.stringify({group_id: grpId}),
        headers: {'Content-Type': 'application/json', 'x-access-token': token}
    })
    .then(res => res.json())
    .then(json => {
        if (isSuccessStatusCode(json.status)) {
            setTrucksList(json.data);
          } else {
            show({message: json.message});
          }
        })
        .catch((err) => show({message: err.message}));
  };

  const getRouteStage = () : string => {
    let stage = 'Empty';

    if (route.service_stop.length > 0) stage = 'Built';
    if (route.time > new Date()) stage = 'Routed';
    if (route.driver_id != null || route.driver_id != '' && route.truck_id != null || route.truck_id != '') stage = 'Assigned';
    if (route.inspection_id != null || route.inspection_id != '') stage = 'Inspected';
    if (route.route_stage === 'Finalized') stage = 'Finalized';
    if (route.route_stage === 'Completed') stage = 'Completed';

    return stage;
  };

  const assignTruckToRoute = async () => {
    await fetch(`${Configs.TCMC_URI}/api/routes`, {
        method: 'PUT',
        body: JSON.stringify({_id: route._id, truck_id: truck, route_stage: getRouteStage()}),
        headers: {'Content-Type': 'application/json', 'x-access-token': token}
    })
    .then(res => res.json())
    .then(json => {
        if (isSuccessStatusCode(json.status)) {
          show({message: json.message});
          navigation.navigate('DashboardScreen');
        } else {
          show({message: json.message});
        }
        })
        .catch((err) => show({message: err.message}));
  };

  return (
    <>
      <View style={styles.form}>
        <AppTitle title='Assign Truck' />
        <View style={styles.container}>
          {/* Truck */}
        <AppPicker
          label='Truck'
          name='truck'
          value={truck}
          list={trucksList.map(u => {return {_id: u._id, label: u.name, value: u._id}})}
          onChange={(itemValue) => setTruck(itemValue.toString())}
          validations={[]}
          errors={[]}
          setErrors={() => null}
        />
        </View>
      </View>
      <ModalButtons navigation={navigation} save={assignTruckToRoute} />
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
  container: {
      paddingHorizontal: 20,
      marginVertical: 20,
  },
  fieldContainer: {
    marginBottom: 10,
  },
  text: {
    fontWeight: 'bold',
    color: Colors.SMT_Secondary_1,
  },
  picker: {
    paddingLeft: 15,
    borderColor: Colors.SMT_Secondary_1_Light_1,
    borderWidth: 2,
    borderRadius: 3,
  },
});

export default AssignTruckModal;
