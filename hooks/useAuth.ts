import React, { useState } from "react";
import {} from "react-native";
//import * as Google from "expo-google-app-auth";
import useAsyncStorage from "./useAsyncStorage";
import Configs from "../constants/Configs";

const useAuth = () => {
  const config = {
    // iosClientId: `<YOUR_IOS_CLIENT_ID>`,
    androidClientId: Configs.OAUTH2_GOOGLE_ANDROID_KEY,
    // iosStandaloneAppClientId: `<YOUR_IOS_CLIENT_ID>`,
    // androidStandaloneAppClientId: `<YOUR_ANDROID_CLIENT_ID>`,
    scopes: ["profile", "email"],
  };
  let [isSignedIn, setIsSignedIn] = useState({
    signedIn: false,
    accessToken: "",
    idToken: "",
    refreshToken: "",
    user: {},
  });

  // const signInAsync = async () => {
  //   const result = await Google.logInAsync(config);

  //   if (result.type === "success") {
  //     var googleUser = {
  //       signedIn: true,
  //       accessToken: result.accessToken!,
  //       idToken: result.idToken!,
  //       refreshToken: result.refreshToken!,
  //       user: result.user,
  //     };

  //     await useAsyncStorage().setUserAsync(googleUser);
  //   }
  // };

  // const signOutAsync = async (token: string) => {
  //   await Google.logOutAsync({
  //     accessToken: token,
  //     androidClientId: config.androidClientId,
  //   });

  //   var googleUser = {
  //     signedIn: false,
  //     accessToken: "",
  //     idToken: "",
  //     refreshToken: "",
  //     user: {},
  //   };

  //   useAsyncStorage().setUserAsync(googleUser);

  //   return isSignedIn;
  // };

  // return {
  //   signInAsync,
  //   signOutAsync,
  // };
};

export default useAuth;