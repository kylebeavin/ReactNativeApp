import {Platform} from 'react-native';
import MapboxGL from '@react-native-mapbox-gl/maps';
export const IS_ANDROID = Platform.OS === 'android';
import React, {createContext, useState} from 'react'
export const permissionContext = createContext(null)

export const PermissionProvider = ()=>{
    const [permissions, setPermissions] = useState({
        isFetchingAndroidPermission: IS_ANDROID,
        isAndroidPermissionGranted: false,
      });
const getPermissions = async () => {
    if (IS_ANDROID) {
      const isGranted = await MapboxGL.requestAndroidLocationPermissions();
      setPermissions({
        isAndroidPermissionGranted: isGranted,
        isFetchingAndroidPermission: false,
      });
    }
  }
}