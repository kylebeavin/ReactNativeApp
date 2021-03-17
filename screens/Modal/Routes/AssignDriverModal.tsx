import { Picker } from '@react-native-picker/picker';
import { useNavigation } from '@react-navigation/native';
import React, { useContext, useEffect, useState } from 'react';
import {Route, ScrollView, StyleSheet, Text, View} from 'react-native';
import AppTitle from '../../../components/Layout/AppTitle';
import Colors from '../../../constants/Colors';
import Configs from '../../../constants/Configs';
import Layout from '../../../constants/Layout';
import useDates from '../../../hooks/useDates';
import AppContext from '../../../providers/AppContext';
import { ToastContext } from '../../../providers/ToastProvider';
import { formatDate, isSuccessStatusCode } from '../../../utils/Helpers';
import ModalButtons from '../ModalButtons';

interface Props {
  id: string;
}

const AssignDriverModal: React.FC<Props> = ({id}) => {
  //#region Use State Variables
  const navigation = useNavigation();
  const {grpId, token} = useContext(AppContext);
  const {show} = useContext(ToastContext);
  const {addDays} = useDates();

  const [route, setRoute] = useState('');

  const [routesList, setRoutesList] = useState<Route[]>([]);
  //#endregion

  useEffect(() => {
    getRoutes();
  }, []);
  
  const getRoutes = async () => {
    await fetch(`${Configs.TCMC_URI}/api/routesBy`, {
        method: 'POST',
        body: JSON.stringify({group_id: grpId, time: {$gte: formatDate(new Date()), $lt: formatDate(addDays(new Date(), 1))}, driver: {$in:[null,'']}}),
        headers: {'Content-Type': 'application/json', 'x-access-token': token}
    })
    .then(res => res.json())
    .then(json => {
        if (isSuccessStatusCode(json.status)) {
            setRoutesList(json.data);
          } else {
            show({message: json.message});
          }
        })
        .catch((err) => show({message: err.message}));
  };

  const assignDriverToRoute = async () => {
    await fetch(`${Configs.TCMC_URI}/api/routes`, {
        method: 'PUT',
        body: JSON.stringify({_id: route, driver: id}),
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
        <AppTitle title='Assign Driver' />
        <View style={styles.container}>
          {/* Route */}
          <View style={styles.fieldContainer}>
            <Text style={styles.text}>Route</Text>
            <View style={styles.picker}>
              <Picker
                selectedValue={route}
                onValueChange={(itemValue) => setRoute(itemValue.toString())}>
                {routesList.map((item: Route) => {
                  return (
                    <Picker.Item
                      key={item._id}
                      label={item.route_id}
                      value={item._id}
                    />
                  );
                })}
              </Picker>
            </View>
          </View>
        </View>
      </View>
      <ModalButtons navigation={navigation} save={assignDriverToRoute} />
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

export default AssignDriverModal;
