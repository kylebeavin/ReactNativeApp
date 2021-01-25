import React, { useRef, useState } from "react";
import { StyleSheet, View, Text, Image, TextInput } from "react-native";

import Colors from "../../constants/Colors";
import AppButton from "../../components/Layout/AppButton";
import Configs from "../../constants/Configs";
import useAsyncStorage from "../../hooks/useAsyncStorage";
import Layout from "../../constants/Layout";
import Ionicons from "react-native-vector-icons/Ionicons";

interface Props {
  isSignedIn: () => void;
}

const AuthScreen: React.FC<Props> = ({isSignedIn}) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const emailRef = useRef<TextInput>(null);
  const passwordRef = useRef<TextInput>(null);

  const signIn = async () => {
    // ToDo: Add Fields for user to sign in instead of being hard coded and auth header valu
    // let user = {
    //   _id: "5ff8c3303f6f737827204033",
    //   is_active: true,
    //   created: "2021-01-07T16:10:19.786Z",
    //   email: "kyle.beavin@fakemail.com",
    //   password: "$2b$08$RD1.U.Ul6Z1mT5d4lEAXZulrSWYgAHW5cJDRywNIQaIoMJdp6ynNq",
    //   token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjVmZjhjMzMwM2Y2ZjczNzgyNzIwNDAzMyIsImlhdCI6MTYxMDM4MjI3MH0.5GcoYe_72nHrUqWT1y_9DqZB-M-Hjd3nPplE6mbNL6k",
    //   image: "profileURL",
    //   first_name: "test",
    //   last_name: "user",
    //   role: "admin",
    //   group_id: "00"
    // }
    let user = {
      email: email,
      password: password,
    }

    await fetch(`${Configs.TCMC_URI}/api/login`, {
      method: "POST",
      body: JSON.stringify(user),
      headers: {"Content-type": "application/json; charset=UTF-8"}
    })
      .then(res => {
        console.log(res.status)
        return res.json()
      })
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
    isSignedIn();
  };

  return (
    <View style={styles.container}>
      <View style={styles.imageContainer}>
        <Image
          style={styles.image}
          source={require('../../assets/images/trashy_logo.jpg')}
        />
        <Text style={styles.title}>Smash My Trash</Text>
      </View>

      <View style={styles.form}>
        <View style={styles.fieldContainer}>
          <Text style={styles.text}>Email Address</Text>
          <TextInput
           style={styles.textInput}
           ref={emailRef}
           value={email}
           onChange={(text) => setEmail(text.nativeEvent.text)}
           returnKeyType="next"
           onSubmitEditing={() => passwordRef.current!.focus()}
           blurOnSubmit={false}
          />
        </View>
        <View style={[styles.fieldContainer, {marginBottom: 20}]}>
          <Text style={styles.text}>Password</Text>
          <TextInput
           style={styles.textInput}
           secureTextEntry={true}
           ref={passwordRef}
           value={password}
           onChange={(text) => setPassword(text.nativeEvent.text)}
          />
        </View>

        <View style={styles.buttonContainer}>
          <View style={styles.button}>
            <AppButton title="Log In" onPress={() => signIn()} />
          </View>
        </View>

      </View>

      <View style={styles.needHelpContainer}>
        <Text style={{marginLeft: 15}}>Need Help? <Text style={{color: Colors.SMT_Secondary_2_Light_1, borderBottomColor: Colors.SMT_Secondary_2_Light_1, textDecorationLine: "underline"}}>Contact Us</Text></Text>
        <View style={{flex: 1,alignItems: "flex-end"}}><Ionicons style={styles.helpIcon} name="ios-help-circle" /></View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  buttonContainer: {
    flex: 1,
    alignItems: "center",
  },
  button: {
    width: 100,
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: 10,
  },
  form: {
    flex: 1,
    width: '60%',
    alignContent: 'center',
  },
  fieldContainer: {
    marginBottom: 10,
  },
  helpIcon: {
    fontSize: 40,
    color: Colors.SMT_Secondary_1,
    marginTop: -20,
    marginRight: 20
  },
  image: {
    width: '70%',
    height: '60%',
    marginBottom: 5,
    borderRadius: 5,
    borderWidth: 3,
    borderColor: Colors.SMT_Secondary_1_Light_1,
  },
  imageContainer: {
    flex: 1,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  needHelpContainer: {
    width: "100%",
    flexDirection: "row",
  },
  title: {
    fontWeight: 'bold',
    fontSize: 35,
    color: 'black',
  },
  text: {
    fontWeight: 'bold',
    color: 'black',
  },
  textInput: {
    paddingLeft: 15,
    paddingVertical: 5,
    borderColor: Colors.SMT_Secondary_1_Light_1,
    borderWidth: 2,
    borderRadius: 3,
    backgroundColor: Colors.SMT_Tertiary_1,
  },
});

export default AuthScreen;
