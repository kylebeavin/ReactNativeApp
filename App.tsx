import 'react-native-gesture-handler';
import React, { useEffect,useState } from "react";
import { StatusBar } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";

import useAsyncStorage from "./hooks/useAsyncStorage";
import useCachedResources from "./hooks/useCachedResources";
import Navigation from "./navigation";
import AuthScreen from "./screens/Authentication/AuthScreen";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Configs from "./constants/Configs";

export default function App() {
  const [isAuth, setIsAuth] = useState(false);
  const isLoadingComplete = useCachedResources();

  useEffect(() => {
    // Clear User from Device
    // AsyncStorage.clear()

    // Set My User for Testing
    AsyncStorage.setItem('@google_user', JSON.stringify({
      _id: "5ff8c3303f6f737827204033",
      is_active: true,
      created: "2021-01-07T16:10:19.786Z",
      email: "kyle.beavin@fakemail.com",
      password: "$2b$08$RD1.U.Ul6Z1mT5d4lEAXZulrSWYgAHW5cJDRywNIQaIoMJdp6ynNq",
      token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjVmZjhjMzMwM2Y2ZjczNzgyNzIwNDAzMyIsImlhdCI6MTYxMDM4MjI3MH0.5GcoYe_72nHrUqWT1y_9DqZB-M-Hjd3nPplE6mbNL6k",
      image: "profileURL",
      first_name: "test",
      last_name: "user",
      role: "admin",
      group_id: "00"
    }))

    isSignedIn()
  }, []);

  const isSignedIn = async () => {
    await useAsyncStorage().getUserAsync()
            .then((user) => {
              // ToDo: Need to validate token by calling the server
              if (user !== null)
                user.token === null ? setIsAuth(false) : setIsAuth(true);
            });
  };

  if (!isLoadingComplete) {
    return null;
  }

  if (!isAuth) {
    return <AuthScreen isSignedIn={() => isSignedIn()} />;

  } else {
    return (
      <SafeAreaProvider>
        <Navigation />
        <StatusBar translucent backgroundColor="transparent" />
      </SafeAreaProvider>
    );
  }
}