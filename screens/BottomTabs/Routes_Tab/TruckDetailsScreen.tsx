import { useNavigation } from '@react-navigation/native';
import React, { useState } from 'react';
import {StyleSheet, View, ScrollView, TouchableOpacity, Text} from 'react-native';
import AppButton from '../../../components/Layout/AppButton';
import AppNavBtnGrp from '../../../components/Layout/AppNavBtnGrp';
import AppTitle from '../../../components/Layout/AppTitle';
import { Truck } from '../../../types/routes';

interface Props {
    route: any;
}

const RouteDetailsScreen : React.FC<Props> = ({route}) => {
    const truck: Truck = route.params.truck;
    console.log(truck);
    //#region Use State Variables
    const navigation = useNavigation()
    
    // Toggles
    const [inspectionsToggle, setInspectionsToggle] = useState(false);
    //#endregion

  return (
    <View>
      <AppTitle title="Truck Detail" help search />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.contentContainer}>

      <AppNavBtnGrp>
        
        <View style={{marginRight: 60, marginTop: 12,paddingLeft: 10}}>
          <AppButton
            title="Back"
            onPress={() => navigation.goBack()}
            outlined={true}
            icon={{type: 'MaterialIcons', name: 'arrow-back'}}
          />
        </View>
        <View style={{marginRight: -10}}>
            {/* Placeholder */}
        </View>
      </AppNavBtnGrp>

      <View style={{paddingLeft: 10}}>
          <Text>_id: {truck._id}</Text>
          <Text>body_subtype: {truck.body_subtype}</Text>
          <Text>body_type: {truck.body_type}</Text>
          <Text>color: {truck.color}</Text>
          <Text>documents: {truck.documents}</Text>
          <Text>group_id: {truck.group_id}</Text>
          <Text>hours: {truck.hours}</Text>
          <Text>is_active: {truck.is_active}</Text>
          <Text>license_number: {truck.license_number}</Text>
          <Text>msrp: {truck.msrp}</Text>
          <Text>name: {truck.name}</Text>
          <Text>odo: {truck.odo}</Text>
          <Text>operator: {truck.operator}</Text>
          <Text>ownership: {truck.ownership}</Text>
          <Text>pictures: {truck.pictures}</Text>
          <Text>service_history: {truck.service_history}</Text>
          <Text>service_status: {truck.service_status}</Text>
          <Text>trim: {truck.trim}</Text>
          <Text>registration: {truck.registration}</Text>
          <Text>vehicle_make: {truck.vehicle_make}</Text>
          <Text>vehicle_model: {truck.vehicle_model}</Text>
          <Text>vehicle_type: {truck.vehicle_type}</Text>
          <Text>vin: {truck.vin}</Text>
          <Text>year: {truck.year}</Text>


      </View>

      <TouchableOpacity onPress={() => setInspectionsToggle(!inspectionsToggle)}>
        <AppTitle title="Inspections" />
      </TouchableOpacity>
      {!inspectionsToggle ? null : <View style={{paddingLeft: 10, marginBottom: 50}}><Text>Hello World!</Text></View>}
      
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
    contentContainer: {
        // This is the scrollable part
      },
      scrollView: {
        height: '100%',
        width: '100%',
      },
});

export default RouteDetailsScreen;
