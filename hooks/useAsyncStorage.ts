import AsyncStorage from "@react-native-async-storage/async-storage";
import { navigationRef } from "../navigation";
import { SMT_User } from "../types";

const useAsyncStorage = () => {

  const setUserAsync = async (user: SMT_User) => {
        const jsonValue = JSON.stringify(user);
        await AsyncStorage.setItem('@smt_user', jsonValue);
  };

  const getUserAsync = async () : Promise<SMT_User> => {
    const jsonValue = await AsyncStorage.getItem("@smt_user");
    return jsonValue != null ? JSON.parse(jsonValue) : null;
  };

  const clearUserAsync = async () : Promise<boolean> => {
    let success = false;
    await AsyncStorage.removeItem("@smt_user", (err) => {
      if (!err) success = true;
    });  
    
    return success;
  }

  return {
    setUserAsync,
    getUserAsync,
    clearUserAsync,
  };
};

export default useAsyncStorage;
