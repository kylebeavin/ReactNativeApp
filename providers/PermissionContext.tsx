import {Platform} from 'react-native';
import MapboxGL from '@react-native-mapbox-gl/maps';
export const IS_ANDROID = Platform.OS === 'android';
import React, {createContext, useState, ReactNode} from 'react'


const routesUrl = 'https://smt-backend-dev.herokuapp.com/api/routesBy' 

const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYwMTA2ZDAxNzIzMWNiMDNhMWFiMmFiNCIsImlhdCI6MTYxNDk2MTI4MiwiZXhwIjoxNjE1MDExNjgyfQ.gHdm_NS3otZrDditWiquTQYQTzgpflDn2QNkrg4e_9s"
const mapboxToken = "pk.eyJ1Ijoic3VyaTIwMjEiLCJhIjoiY2tsd2l4bmxsMGpiYTJxbzB0NDQ5OW02MyJ9.ZLKmHBS2koQxLD754TEujA"
const mapboxBaseUrl = "https://api.mapbox.com/geocoding/v5/mapbox.places/"
export const  PermissionContext = createContext({permissions:{}, getPermissions:()=>{},getRouteAddresses:()=>{}})

export const Permission=(props:any)=>{

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
const getRouteAddresses = async ()=>{
  let response = await fetch(routesUrl,{
    method:'POST',
    headers:{
      'Content-Type': 'application/json',
      'x-access-token': token
    },
    body:JSON.stringify({driver:"6011c4f4f556150022792a54"})
    
  })
  const data = await response.json()
  console.log(data)
  let {start_location, service_stops} = data.data[0]
  let urls = [`mapboxBaseUrl${start_location}.json?access_token=${mapboxToken}`]
  
  
  return data
}
  return(
    <PermissionContext.Provider value={{permissions, getPermissions, getRouteAddresses}}>
      {props.children}
    </PermissionContext.Provider>
  )
}