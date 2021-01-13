import AsyncStorage from "@react-native-async-storage/async-storage";
import { GoogleUser, SMT_User } from "../types";

const useAsyncStorage = () => {

  const setUserAsync = async (user: SMT_User) => {
        const jsonValue = JSON.stringify(user);
        await AsyncStorage.setItem('@google_user', jsonValue);
  };

  const getUserAsync = async () : Promise<SMT_User> => {
    const jsonValue = await AsyncStorage.getItem("@google_user");
    return jsonValue != null ? JSON.parse(jsonValue) : null;
  };

  // ToDo: clearUserAsync()

  return { 
      setUserAsync,
       getUserAsync
  };
};

export default useAsyncStorage;
