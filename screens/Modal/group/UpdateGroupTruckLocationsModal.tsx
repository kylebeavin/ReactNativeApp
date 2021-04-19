import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack/lib/typescript/src/types';
import React, { useContext, useEffect, useState } from 'react';
import {ScrollView, StyleSheet, Text, View} from 'react-native';
import AppButton from '../../../components/layout/AppButton';
import AppTextInput from '../../../components/layout/AppTextInput';
import AppTitle from '../../../components/layout/AppTitle';
import Colors from '../../../constants/Colors';
import Configs from '../../../constants/Configs';
import Layout from '../../../constants/Layout';
import AppContext from '../../../providers/AppContext';
import { ToastContext } from '../../../providers/ToastProvider';
import { isSuccessStatusCode } from '../../../utils/Helpers';
import ModalButtons from '../ModalButtons';


const UpdateGroupTruckLocationsModal = () => {
  //#region Use State Variables
  const navigation = useNavigation<StackNavigationProp<any>>();
  const {grpId, token} = useContext(AppContext);
  const {show} = useContext(ToastContext);

  // State
  const [newLocation, setNewLocation] = useState('');
  const [locations, setLocations] = useState<string[]>([]);
  //#endregion

  useEffect(() => {
    getTruckLocations();
  }, []);

  const getTruckLocations = async () => {
    await fetch(`${Configs.TCMC_URI}/api/groupsBy`, {
      method: 'POST',
      headers: {'Content-Type': 'application/json', 'x-access-token': token},
      body: JSON.stringify({_id: grpId})
    })
    .then(res => res.json())
    .then(json => {
      if (isSuccessStatusCode(json.status)) {
        setLocations(json.data[0].truck_location);
      } else {
        show({message: json.message});
      }
    })
    .catch(err => show({message: err.message}));
  };
  
  const updateTruckLocations = async () => {
    await fetch(`${Configs.TCMC_URI}/api/groups`, {
      method: 'PUT',
      headers: {'Content-Type': 'application/json', 'x-access-token': token},
      body: JSON.stringify({_id: grpId, truck_location: locations})
    })
    .then(res => res.json())
    .then(json => {
      if (isSuccessStatusCode(json.status)) {
        show({message: json.message});
        navigation.pop();
      } else {
        show({message: json.message});
      }
    })
    .catch(err => show({message: err.message}));
  };

  const arrayRemove = (arr: string[], value: string) => { 
    return arr.filter((ele) => {
      return ele != value;
    });
  }

  return (
    <View>
      <ScrollView style={styles.form}>
        <AppTitle title="Edit Truck Locations" />
        {/* Add New Location */}
        <View style={styles.newContainer}>
          <View style={styles.inputContainer}>
            <AppTextInput
              label="Add New Location"
              name="truck_location"
              value={newLocation}
              onChange={(val) => setNewLocation(val)}
              validations={[]}
              errors={[]}
              setErrors={() => null}
            />
            <View style={styles.btnContainer}>
              <AppButton
                title=''
                icon={{type: 'MaterialIcons', name: 'arrow-circle-down'}}
                onPress={() => {
                  newLocation.length === 0 ? null : setLocations([...locations, newLocation])
                  setNewLocation('');
                }}
              />
            </View>
          </View>
        </View>
        <View style={{paddingHorizontal: 10}}>
          {locations.map((u, i) => {
            return (
              <View
                key={i}
                style={[
                  styles.inputContainer,
                  {
                    marginBottom: 5,
                    borderBottomWidth: 2,
                    borderBottomColor: Colors.SMT_Secondary_1_Light_1,
                  },
                ]}>
                <Text style={{flex: 1, flexWrap: 'wrap'}}>{u}</Text>
                <View style={{}}>
                  <AppButton
                    title=""
                    backgroundColor={Colors.SMT_Primary_1_Dark_1}
                    icon={{type: 'MaterialIcons', name: 'delete-forever'}}
                    onPress={() => setLocations(arrayRemove(locations, u))}
                  />
                </View>
              </View>
            );
          })}
        </View>
      </ScrollView>
      <ModalButtons navigation={navigation} save={updateTruckLocations} />
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
  newContainer: {
    paddingHorizontal: 10,
    borderBottomWidth: 2,
    borderBottomColor: Colors.SMT_Secondary_1,
    marginBottom: 10
  },
  inputContainer: {
    flexDirection: 'row',
  },
  btnContainer: {
    marginTop: 22,
    marginLeft: 10,
  },
});

export default UpdateGroupTruckLocationsModal;
