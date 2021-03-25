import React from 'react';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';

import Colors from '../../constants/Colors';

interface Props {
    navigation: any;
    save: () => void;
}

const ModalButtons: React.FC<Props> = (props) => {

    const saveForm = (save: () => void) => {
        save();
    }

    return (
        <View style={styles.buttonContainer}>

          <TouchableOpacity onPress={() => props.navigation.pop()} >
            <View style={[styles.buttonIconContainer, { backgroundColor: Colors.SMT_Primary_1 }]} >
              <MaterialIcons name='close' color={Colors.SMT_Tertiary_1} size={40} />
            </View>
            <Text style={styles.buttonText}>CANCEL</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => saveForm(props.save)}>
            <View style={[styles.buttonIconContainer, { backgroundColor: Colors.SMT_Secondary_2_Light_1 }]} >
              <MaterialIcons name='check' color={Colors.SMT_Tertiary_1} size={40} />
            </View>
            <Text style={styles.buttonText}>SAVE</Text>
          </TouchableOpacity>

        </View>
    );
}

const styles = StyleSheet.create({
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
      },
      buttonText: {
        color: Colors.SMT_Tertiary_1,
        textAlign: 'center',
        fontWeight: 'bold',
        fontSize: 16
      },
      buttonIconContainer: {
        height: 66,
        width: 66,
        marginBottom: 10,
        borderRadius: 66/2,
        alignItems: 'center',
        justifyContent: 'center',
      },
})

export default ModalButtons;