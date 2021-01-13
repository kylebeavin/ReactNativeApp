import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { TouchableOpacity } from 'react-native';
import { StyleSheet, Text, View } from 'react-native';
import { Avatar } from "react-native-elements";

import Colors from '../../constants/Colors';

interface Props {
    text: string;
}

const RightHeader: React.FC<Props> = (props) => {
    const navigation = useNavigation();

    return (
      <View style={styles.container}>
        <TouchableOpacity onPress={() => navigation.navigate("Dashboard")}>
          <Avatar
          size={55}
            rounded
            containerStyle={styles.avatar}
            icon={{ name: "ios-images", type: "ionicon", size: 40, color: Colors.SMT_Primary_1 }}
          />
          <Text style={styles.text}>{props.text}</Text>
        </TouchableOpacity>
      </View>
    );
}

const styles = StyleSheet.create({
    container: {
        height: "100%",
        width: "100%",
        justifyContent: 'center',
    },
    avatar: {
        marginTop: 2,
        marginBottom: 2,
        borderRadius: 140,
        backgroundColor: Colors.SMT_Secondary_1_Light_1,
        alignSelf: 'center',
    },
    text: {
        textAlign: 'center',
        color: Colors.SMT_Tertiary_1,
        fontSize: 11,
    },
})

export default RightHeader;