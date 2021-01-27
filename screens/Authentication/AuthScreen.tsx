import React, { useContext, useRef, useState } from "react";
import { StyleSheet, View, Text, Image, TextInput } from "react-native";

import Colors from "../../constants/Colors";
import AppButton from "../../components/Layout/AppButton";
import Configs from "../../constants/Configs";
import useAsyncStorage from "../../hooks/useAsyncStorage";
import Layout from "../../constants/Layout";
import Ionicons from "react-native-vector-icons/Ionicons";
import AppContext from "../../providers/AppContext";

interface Props {
  isSignedIn: () => void;
}

const AuthScreen: React.FC<Props> = ({isSignedIn}) => {
  const [email, setEmail] = useState("kyle.beavin@tcmcllc.com");
  const [password, setPassword] = useState("password123");

  const {setAppState, setIsAuth,setToken,setGrpId} = useContext(AppContext);
  const emailRef = useRef<TextInput>(null);
  const passwordRef = useRef<TextInput>(null);

  const signIn = async () => {
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
        if (json.auth) {
          setToken(json.data.token);
          setGrpId(json.data.group_id);
          setIsAuth(true);
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
