import React from 'react';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { useNavigation } from '@react-navigation/native';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import Colors from '../../constants/Colors';

interface Props {
    item: any;
}

const AppEditBtn: React.FC<Props> = ({item}) => {
    const navigation = useNavigation();
    return (
      <View>
        {/* Edit Button */}
        <View style={styles.editButtonContainer}>
          <TouchableOpacity
            style={{ paddingHorizontal: 10, paddingVertical: 5 }}
            onPress={() =>
              navigation.navigate("Modal", {
                modal: "UpdateAccountModal",
                item,
              })
            }
          >
            <MaterialCommunityIcons
              style={styles.editButtonIcon}
              name="pencil"
            />
            <Text style={styles.editButtonText}>Edit</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
}

const styles = StyleSheet.create({
  //==== Edit Button =====
  editButtonContainer: {
    position: "absolute",
    right: 10,
    top: 5,
    zIndex: 100,
  },
  editButtonIcon: {
    fontSize: 30,
    color: Colors.SMT_Primary_2,
  },
  editButtonText: {
    color: Colors.SMT_Primary_2,
  },
});

export default AppEditBtn;