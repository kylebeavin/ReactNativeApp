import AsyncStorage from '@react-native-async-storage/async-storage';
import {SMT_User} from '../types';
import { DriverRouteState } from '../types/routes';

const useAsyncStorage = () => {
  const setUserAsync = async (user: SMT_User) => {
    const jsonValue = JSON.stringify(user);
    await AsyncStorage.setItem('@smt_user', jsonValue);
  };

  const getUserAsync = async (): Promise<SMT_User> => {
    const jsonValue = await AsyncStorage.getItem('@smt_user');
    return jsonValue != null ? JSON.parse(jsonValue) : null;
  };

  const clearUserAsync = async (): Promise<boolean> => {
    let success = false;
    await AsyncStorage.removeItem('@smt_user', (err) => {
      if (!err) success = true;
    });

    return success;
  };

  const setDriverRouteStateAsync = async (routeState: DriverRouteState): Promise<boolean> => {
    let success = false;
    const jsonValue = JSON.stringify(routeState);
    
    await AsyncStorage.setItem('@routeState', jsonValue, (err) => {
      if (!err) success = true;
    });

    return success;
  };

  const getDriverRouteStateAsync = async (): Promise<DriverRouteState> => {
    const jsonValue = await AsyncStorage.getItem('@routeState');
    return jsonValue != null ? JSON.parse(jsonValue) : null;
  };

  const clearDriverRouteStateAsync = async () : Promise<boolean> => {
    let success = false;
    await AsyncStorage.removeItem('@routeState', (err) => {
      if (!err) success = true;
    });

    return success;
  }

  return {
    setUserAsync,
    getUserAsync,
    clearUserAsync,
    setDriverRouteStateAsync,
    getDriverRouteStateAsync,
    clearDriverRouteStateAsync,
  };
};

export default useAsyncStorage;
