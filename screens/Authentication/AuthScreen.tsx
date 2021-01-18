import React from "react";
import { StyleSheet, View, Text, Image } from "react-native";

import Colors from "../../constants/Colors";
import AppButton from "../../components/Layout/AppButton";
import Configs from "../../constants/Configs";
import useAsyncStorage from "../../hooks/useAsyncStorage";

interface Props {
  isSignedIn: () => void;
}

const AuthScreen: React.FC<Props> = (props) => {

  const signIn = async (props: Props) => {
    // ToDo: Add Fields for user to sign in instead of being hard coded and auth header valu
    let user = {
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
    }
    await fetch(`${Configs.TCMC_URI}/api/login`, {
      method: "POST",
      body: JSON.stringify(user),
      headers: {"Content-type": "application/json; charset=UTF-8"}
    })
      .then(res => res.json())
      .then(json => {
        console.log(json)
        if (json.token) {
          console.log(json.data)
          useAsyncStorage().setUserAsync({
            _id: json.data._id,
            is_active: json.data.is_active,
            created: json.data.created,
            email: json.data.email,
            password: json.data.password,
            token: json.data.token,
            image: json.data.image,
            first_name: json.data.first_name,
            last_name: json.data.last_name,
            role: json.data.role,
            group_id: json.data.group_id,
          });
        }

        return json
      })
      .catch(err => console.log(err));
    props.isSignedIn();
  };

  return (
    <View style={styles.container}>
      <View style={styles.imageContainer}>
        <Image
          style={styles.image}
          source={require("../../assets/images/trashy_logo.jpg")}
        />
        <Text style={styles.title}>Smash My Trash</Text>
      </View>

      <View style={styles.buttonContainer}>
        <AppButton
          title="Sign In with Button"
          onPress={() => signIn(props)}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  buttonContainer: {
    flex: 1,
    marginBottom: 10,
  },
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: Colors.TCMC_LightGray,
  },
  image: {
    width: "55%",
    height: "55%",
    marginBottom: 10,
    borderRadius: 5,
    borderWidth: 3,
    borderColor: Colors.Secondary,
  },
  imageContainer: {
    flex: 1,
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
    marginVertical: 50,
  },
  title: {
    fontSize: 28,
    color: Colors.TCMC_Navy,
  },
});

export default AuthScreen;
