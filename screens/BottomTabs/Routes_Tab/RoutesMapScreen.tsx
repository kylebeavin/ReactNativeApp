import { useNavigation } from '@react-navigation/native';
import React, {useEffect, useRef, useState} from 'react';
import { StyleSheet, View, Text, ScrollView } from 'react-native';
import AppButton from '../../../components/Layout/AppButton';
import AppNavBtnGrp from '../../../components/Layout/AppNavBtnGrp';
import AppTitle from '../../../components/Layout/AppTitle';
import MapboxGL from '@react-native-mapbox-gl/maps'
import {IS_ANDROID} from '../../../utils/platform';
//const mapStyle = 'mapbox://styles/mapbox/streets-v11'
MapboxGL.setAccessToken("pk.eyJ1Ijoic3VyaTIwMTkiLCJhIjoiY2tqc3V4NDE1MGN4ajJ1bDU2ajBmcjdzMSJ9.2sZgl13QF0Ge2vI_frDhTg")

const RoutesMapScreen = () => {
 
const [permissions, setPermissions] = useState({isFetchingAndroidPermission: IS_ANDROID,
  isAndroidPermissionGranted: false})
   
   useEffect(()=>{
     const getPermissions = async ()=>{
    if (IS_ANDROID) {
      const isGranted = await MapboxGL.requestAndroidLocationPermissions();
      setPermissions({
        isAndroidPermissionGranted: isGranted,
        isFetchingAndroidPermission: false,
      });
    }
  }
  getPermissions()
   },[])
 
   return (
     <View>
       <AppTitle title="Routes" help search />
 
       <ScrollView
           style={styles.scrollView}
           contentContainerStyle={styles.contentContainer}
       >
 
       {/* <AppNavBtnGrp>
             <AppButton
               title="Routes"
               onPress={() => navigation.navigate("RoutesScreen")}
               outlined={true}
             />
             <AppButton
               title="Calendar"
               onPress={() => navigation.navigate("RoutesCalendarScreen")}
               outlined={true}
             />
             <View style={{marginRight: -10}}>
             <AppButton
               title="Map"
               onPress={() => navigation.navigate("RoutesMapScreen")}
               outlined={false}
             />
             </View>
       </AppNavBtnGrp> */}
        <Text>hello</Text>
       </ScrollView>
     </View>
   );
 }

const styles = StyleSheet.create({
    contentContainer: {
        // This is the scrollable part
      },
      scrollView: {
        height: "100%",
        width: "100%",
        paddingHorizontal: 10
      },
      mapWrapper:{
        width:'100%',
        height:'100%'
      }
})

export default RoutesMapScreen;