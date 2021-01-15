import React, {useEffect, useReducer, useState} from 'react';
import { ScrollView, StyleSheet, View, Text, ActivityIndicator } from 'react-native';

import Configs from '../../../constants/Configs';
import AppButton from '../../../components/Layout/AppButton';
import Colors from '../../../constants/Colors';
import AppTitle from '../../../components/Layout/AppTitle';
import AppNavBtnGrp from '../../../components/Layout/AppNavBtnGrp';
import LinkConfig from '../../../navigation/LinkingConfiguration';
import AppAddNew from '../../../components/Layout/AppAddNew';
import {Location} from '../../../types/index';
import AppEmptyCard from '../../../components/Layout/AppEmptyCard';
import { useIsFocused } from '@react-navigation/native';
import useAsyncStorage from '../../../hooks/useAsyncStorage';
import { getRequestHeadersAsync } from '../../../utils/Helpers';

interface Props {
    navigation: any;
}

const MapScreen: React.FC<Props> = ({navigation}) => {
  const [isLoading, setLoading] = useState(true);
  const [locations, setLocations] = useState<Location[]>([]);
  const isFocused = useIsFocused();

  useEffect(() => {
    getLocations();
  }, [isFocused]);

  const getLocations = async () => {
    let grpId = await useAsyncStorage().getUserAsync().then(user => user.group_id)
    
    await fetch(`${Configs.TCMC_URI}/api/locationsBy`, {
      headers: await getRequestHeadersAsync().then(header => header),
      method: "POST",
      body: JSON.stringify({group_id: grpId}),
    })
    .then(res => res.json())
    .then(json => {
      if (json.data){
        setLocations(json.data)
      }
    })
    .catch((err) => console.log(err))
    .finally(() => setLoading(false));
  }

  return (
    <View style={styles.screen}>
      <AppTitle title="CRM" help search />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.contentContainer}>
        <AppNavBtnGrp>
          <AppButton
            title="CLIENTS"
            onPress={() => navigation.navigate('AccountsScreen')}
            outlined={true}
          />
          <AppButton
            title="MEETINGS"
            onPress={() => navigation.navigate('MeetingsScreen')}
            outlined={true}
          />
          <View style={{marginRight: -10}}>
            <AppButton
              title="MAP"
              onPress={() => navigation.navigate('MapScreen')}
              outlined={false}
            />
          </View>
        </AppNavBtnGrp>

        {locations.length === 0 ? null : (
          <AppAddNew title="LOCATION" modal="CreateLocationModal" />
        )}

        {isLoading ? (
          <ActivityIndicator color={Colors.SMT_Primary_2} animating={true} />
        ) : (
          <View>
            {/* Map Card */}
            {locations.length === 0 ? null : (
              <View
                style={{
                  borderColor: Colors.SMT_Secondary_1,
                  marginBottom: 10,
                  borderRadius: 3,
                  backgroundColor: Colors.SMT_Secondary_1_Light_1,
                  borderWidth: 2,
                  height: 300,
                  justifyContent: 'center',
                }}>
                <Text
                  style={{
                    color: Colors.SMT_Tertiary_1,
                    textAlign: 'center',
                    fontWeight: 'bold',
                  }}>
                  MAP PLACEHOLDER
                </Text>
              </View>
            )}

            {/* Locations List */}
            {locations.length === 0 ? (
              <AppEmptyCard entity="locations" modal="CreateLocationModal" />
            ) : (
              locations.map((u, i) => {
                return (
                  <View style={styles.card} key={i}>
                    <View style={styles.column1}>
                      <Text style={{fontWeight: 'bold'}}>
                        {u.location_name}
                      </Text>
                      <Text>{u.address_city + ', ' + u.address_state}</Text>
                    </View>

                    <View style={styles.column2}>
                      <AppButton
                        title="Details"
                        backgroundColor={Colors.SMT_Secondary_2}
                        onPress={() =>
                          navigation.navigate('Modal', {
                            modal: 'UpdateLocationModal',
                            item: u,
                          })
                        }
                      />
                    </View>
                  </View>
                );
              })
            )}
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    backgroundColor: Colors.SMT_Tertiary_1,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: Colors.SMT_Secondary_2_Light_1,
    borderRadius: 3,
    padding: 5,
  },
  column1: {},
  container: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    marginBottom: 20,
  },
  contentContainer: {
    // This is the scrollable part
  },
  column2: {
    flex: 1,
    alignItems: "flex-end",
  },
  screen: {
    marginBottom: 36,
  },
  scrollView: {
    height: "100%",
    width: "100%",
    paddingHorizontal: 10,
  },
  status: {},
  statusValid: {
    color: Colors.Success,
  },
  statusInvalid: {
    color: Colors.Info,
  },
});

export default MapScreen;