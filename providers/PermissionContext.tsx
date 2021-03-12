import {Platform} from 'react-native';
import MapboxGL from '@react-native-mapbox-gl/maps';
export const IS_ANDROID = Platform.OS === 'android';
import React, {createContext, useState, ReactNode} from 'react'
interface Ipermission {
  isFetchingAndroidPermission: boolean,
        isAndroidPermissionGranted: boolean,
}


export const  PermissionContext = createContext({permissions:{}, getPermissions:()=>{}})

export const Permission=(props:any)=>{

const [permissions, setPermissions] = useState({
        isFetchingAndroidPermission: IS_ANDROID,
        isAndroidPermissionGranted: false,
      });

const getPermissions = async ()=> {
    if (IS_ANDROID) {
      const isGranted = await MapboxGL.requestAndroidLocationPermissions();
      setPermissions({
        isAndroidPermissionGranted: isGranted,
        isFetchingAndroidPermission: false,
      });
     if(isGranted){
       return new Promise<{isAndroidPermissionGranted: boolean,
        isFetchingAndroidPermission: boolean}>((resolve) => {
        resolve({
          isAndroidPermissionGranted: true,
          isFetchingAndroidPermission: false,
        });
    });
     }
    }
  }

  return(
    <PermissionContext.Provider value={{permissions, getPermissions}}>
      {props.children}
    </PermissionContext.Provider>
  )
}