import React, { useContext, useState } from 'react';
import { StyleSheet, Text, View, FlatList} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Picker } from '@react-native-picker/picker';

import AppContext from '../../providers/AppContext';
import Colors from '../../constants/Colors';
import AppButton from '../Layout/AppButton';
import { TouchableOpacity } from 'react-native-gesture-handler';

interface Props {
    text: string;
}

const CenterHeader: React.FC<Props> = (props) => {
    const {grpArr, setGrpId, grpId} = useContext(AppContext);
    const [toggle, setToggle] = useState(false);
    const navigation = useNavigation();
    
    return (
      <View style={styles.container}>
        <View style={[styles.touchableBackground, !toggle ? null : {opacity: .6, borderBottomEndRadius: 0, borderBottomStartRadius: 0}]}>
          <TouchableOpacity
            style={[styles.picker, !toggle ? null : styles.open]}
            onPress={() => setToggle(!toggle)}>
            <Text style={styles.itemTextStyle}>{grpId}</Text>
          </TouchableOpacity>
        </View>

        {!toggle ? null : (
          <View style={styles.itemContainer}>
              <FlatList
                data={grpArr}
                keyExtractor={item => item}
                renderItem={(item) => {
                    return (
                      <TouchableOpacity
                        onPress={() => {
                            setToggle(!toggle);
                            setGrpId(item.item);
                            navigation.navigate("DashboardScreen");
                        }}
                        style={styles.itemWrapper}
                      >
                        <Text style={styles.itemTextStyle}>{item.item}</Text>
                      </TouchableOpacity>
                    );
                }}
              />
          </View>
        )}

        {/* <Picker 
              selectedValue={grpId}
              style={styles.picker}
              itemStyle={{color: 'blue'}}
              onValueChange={(itemValue, itemIndex) => {
                  setGrpId(itemValue);
                  navigation.navigate("DashboardScreen");
              }}
            >
              {grpArr.map((item: string) => {
                return (
                  <Picker.Item
                    key={item}
                    label={item}
                    value={item}
                  />
                );
              })}
            </Picker> */}

        {/* <AppButton title="Franchise Name" backgroundColor={Colors.SMT_Primary_1} onPress={() => console.log("Franchise")} /> */}
      </View>
    );
}

const styles = StyleSheet.create({
  container: {
    height: '100%',
    width: '100%',
    marginTop: 5,
    paddingHorizontal: 20,
    justifyContent: 'center',
  },
  picker: {
    backgroundColor: Colors.SMT_Primary_1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 5,
    borderWidth: 1,
    borderColor: Colors.SMT_Tertiary_1,
    padding: 10,
    marginBottom: 5,
    height: 40,
    zIndex: 3,
  },
  itemContainer: {
    backgroundColor: Colors.SMT_Primary_1,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: Colors.SMT_Tertiary_1,
    borderTopEndRadius: 0,
    borderTopStartRadius: 0,
    position: 'absolute',
    width: '100%',
    top: 55,
    left: 20,
    zIndex: 1,
    opacity: .9,
  },
  itemTextStyle: {
    color: Colors.SMT_Tertiary_1,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  itemWrapper: {
    padding: 10,
  },
  open: {
      opacity: .9,
      borderBottomEndRadius: 0,
      borderBottomStartRadius: 0,
      borderBottomColor: "rgba(255, 132, 118, 0.5)",
  },
  touchableBackground: {
    backgroundColor: Colors.SMT_Primary_1,
    borderRadius: 5,
    height: 40,
    zIndex: 2,
  },
});

export default CenterHeader;