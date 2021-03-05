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
 //console.log(data)
  let {start_location, service_stop} = data.data[0]
  let addresses = [start_location, ...service_stop]
  console.log(addresses)
  let formattedAddressStrings = addresses.map(address=>{
    return address.split(' ').join("%20")
  })
  //let fetchUrls = addresses.map(address=>fetch(`mapboxBaseUrl${address}.json?access_token=${mapboxToken}`))
  // let urls = [`mapboxBaseUrl${start_location}.json?access_token=${mapboxToken}`]
  // let create urls
  console.log('here', formattedAddressStrings)
  console.log(`mapboxBaseUrl${formattedAddressStrings[0]}.json?access_token=${mapboxToken}`)
  const coordsStore:any = []
  fetch(`${mapboxBaseUrl}${formattedAddressStrings[0]}.json?access_token=${mapboxToken}`)
  .then(res=>res.json())
  .then(data=>console.log(data.features[0].center))
  .catch(err=>console.log(err))
  let requests = formattedAddressStrings.map(address=>fetch(`${mapboxBaseUrl}${address}.json?access_token=${mapboxToken}`))
  //const getAllPromises = Promise.all(fetchUrls)
  Promise.all(requests)
  .then(responses => {
    return Promise.all(responses.map(function (response) {
      return response.json();
  }
  ))
}
  ) 
  .then(data=>{
    data.forEach(curData=>{
      console.log(curData.features[0].center)
       coordsStore.push(curData.features[0].center)
      })
      console.log('hello',coordsStore)
  })
  return coordsStore
}
  return(
    <PermissionContext.Provider value={{permissions, getPermissions, getRouteAddresses}}>
      {props.children}
    </PermissionContext.Provider>
  )
}