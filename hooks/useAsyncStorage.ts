import AsyncStorage from "@react-native-async-storage/async-storage";
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

  // ToDo: clearUserAsync()

  return { 
      setUserAsync,
       getUserAsync
  };
};

export default useAsyncStorage;
