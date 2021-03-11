import React, { useContext, useEffect, useState } from 'react';
import { StyleSheet, Text, View, FlatList} from 'react-native';
import { useNavigation } from '@react-navigation/native';

import AppContext from '../../providers/AppContext';
import Colors from '../../constants/Colors';
import { TouchableOpacity } from 'react-native-gesture-handler';
import Configs from '../../constants/Configs';
import { ToastContext } from '../../providers/ToastProvider';
import { Group } from '../../types';

interface Props {
    text: string;
}

const CenterHeader: React.FC<Props> = (props) => {
    const {grpArr, setGrpId, grpId, token} = useContext(AppContext);
    const {show} = useContext(ToastContext);
    const [grpName, setGrpName] = useState("");
    const [groupsList, setGroupsList] = useState<Group[]>([]);
    const [toggle, setToggle] = useState(false);
    const navigation = useNavigation();

    useEffect(() => {
      getGroupsList();
    }, []);

    const getGroupsList = async () => {
      await fetch(`${Configs.TCMC_URI}/api/groupsBy`, {
        method: 'POST',
        body: JSON.stringify({_id: grpArr}),
        headers: {'Content-Type': 'application/json', 'x-access-token': token}
      })
        .then((res) => {
          console.log(res.status);
          return res.json();
        })
          .then((data) => {
            setGrpName(data.data.filter((group: Group) => group._id === grpId)[0].name)
            setGroupsList(data.data);
          })
          .catch((err) => show({message: err.message}));
    };
    
    return (
      <View style={styles.container}>
        <View style={[styles.touchableBackground, !toggle ? null : {opacity: .6, borderBottomEndRadius: 0, borderBottomStartRadius: 0}]}>
          <TouchableOpacity
            style={[styles.picker, !toggle ? null : styles.open]}
            onPress={grpArr.length === 1 ? () => null : () => setToggle(!toggle)}>
            <Text style={styles.itemTextStyle}>{grpName}</Text>
          </TouchableOpacity>
        </View>

        {!toggle ? null : (
          <View style={styles.itemContainer}>
              <FlatList
                data={groupsList}
                keyExtractor={item => item.name}
                renderItem={(item: any) => {
                    return (
                      <TouchableOpacity
                        onPress={() => {
                            setToggle(!toggle);
                            setGrpId(item.item._id);
                            setGrpName(item.item.name);
                            navigation.navigate("DashboardScreen");
                        }}
                        style={styles.itemWrapper}
                      >
                        <Text style={styles.itemTextStyle}>{item.item.name}</Text>
                      </TouchableOpacity>
                    );
                }}
              />
          </View>
        )}

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
    backgroundColor: Colors.SMT_Primary_1_Dark_1,
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
    backgroundColor: Colors.SMT_Primary_1_Dark_1,
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
    backgroundColor: Colors.SMT_Primary_1_Dark_1,
    borderRadius: 5,
    height: 40,
    zIndex: 2,
  },
});

export default CenterHeader;