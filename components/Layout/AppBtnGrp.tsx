import React, {useEffect, useState} from 'react';
import {
  StyleSheet,
  TouchableOpacity,
  View,
  Text,
} from 'react-native';
import Colors from '../../constants/Colors';

interface Props {
  state: any
}

const AppBtnGrp: React.FC<Props> = ({state}) => {
  const [btnArr, setBtnArr] = useState<string[]>([]);
  const [btnMap, setBtnMap] = useState<any>(btnArr);

  useEffect(() => {
    setBtnArr(Object.keys(state.btnObj));
  }, []);

  const updateBtn = (u: string) => {
    state.setBtnObj({...state.btnObj, ...{[u]: !state.btnObj[u]}});
  };

  return (
    <>
      {state.btnObj && (
        <View style={styles.container}>
          {btnArr.map((u, i) => {
            let first = i === 0 ? true : false;
            let last = i === btnArr.length - 1 ? true : false;
            return (
              <TouchableOpacity
                onPress={() => {
                  // setBtnMap({...btnMap, ...{[u]: !btnMap[u]}});
                  updateBtn(u);
                }}
                style={[
                  styles.button,
                  first && {borderTopLeftRadius: 5, borderBottomLeftRadius: 5},
                  last && {borderTopRightRadius: 5, borderBottomRightRadius: 5},
                  // btnMap[u] && {
                  //   backgroundColor: Colors.SMT_Secondary_2_Light_1,
                  // },
                  state.btnObj[u] && {
                    backgroundColor: Colors.SMT_Secondary_2_Light_1,
                  },
                ]}
                key={u}>
                <Text
                  style={[
                    styles.btnText,
                    // btnMap[u] && {color: Colors.SMT_Tertiary_1},
                    state.btnObj[u] && {
                      color: Colors.SMT_Tertiary_1,
                    },
                  ]}
                  numberOfLines={1}>
                  {u}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  button: {
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: Colors.SMT_Secondary_1_Light_1,
    marginBottom: 5,
    height: 40,
    minWidth: 40,
  },
  btnText: {
    color: 'black',
    fontWeight: 'bold',
  },
});

export default AppBtnGrp;
