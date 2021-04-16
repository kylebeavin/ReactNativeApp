import React, { useEffect, useRef, useState } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import {Picker} from '@react-native-picker/picker';
import Colors from '../../constants/Colors';

interface Props {
  label: string;
  name: string;
  value: string;
  list: {_id: string, label: string, value: string}[];
  onChange: (name: string, value: string) => void;
  validations: any;
  errors: any;
  setErrors: any;
  containerStyle?: {};
  labelStyle?: {};
  disabled?: boolean;
  mode?: any;
}

const AppPicker: React.FC<Props> = ({label, name, value, list, onChange, validations, errors, setErrors, containerStyle, labelStyle, disabled, mode}) => {
    const [focused, setFocused] = useState(false);
    const ref = useRef<any>(null);
  
    const validate = (validations: any) => {
      setErrors((prev: any) => ({
        ...prev,
        [name]: validations
          .map((errorsFor: any) => errorsFor(value))
          .filter((errorMsg: any) => errorMsg.length > 0),
      }));
    };

    return (
        <View style={[styles.fieldContainer, !containerStyle ? null : containerStyle]}>
        <Text style={[styles.text, labelStyle && labelStyle]} >{label}</Text>
        <View style={styles.picker}>
          <Picker
           ref={ref}
            selectedValue={value}
            onValueChange={(itemValue, ItemIndex) => onChange(itemValue.toString(), name)}
            enabled={disabled ? false : true}
            mode={mode ? mode : 'dialog'}
          >
            {list?.map((item, index) => {
              return (
                <Picker.Item
                  key={item._id}
                  label={item.label}
                  value={item._id}
                />
              );
            })}
          </Picker>
        </View>
        <View
        style={focused ? styles.isFocused : null}></View>
      <View style={errors.length > 0 ? styles.errorStyle : null}></View>

      <View style={errors.length > 0 ? {opacity: 1} : {opacity: 0}}>
        <Text style={{marginBottom: 6, fontSize: 10, color: Colors.SMT_Primary_1}}>{errors.join(', ')}</Text>
      </View>
      </View>
    );
}

const styles = StyleSheet.create({
    fieldContainer: {
        flex: 1,
      },
      text: {
        fontWeight: 'bold',
        color: Colors.SMT_Secondary_1,
      },
      picker: {
        height: 42,
        paddingLeft: 15,
        borderColor: Colors.SMT_Secondary_1_Light_1,
        borderWidth: 2,
        borderRadius: 3,
      },
      isFocused: {
        position: 'absolute',
        top: 21,
        height: '50%',
        width: '100%',
        borderColor: Colors.SMT_Secondary_2_Light_2,
        borderWidth: 2,
        borderRadius: 3,
      },
      errorStyle: {
        position: 'absolute',
        bottom: 21.5,
        alignSelf: 'center',
        width: '98.6%',
        borderBottomColor: Colors.SMT_Primary_1,
        borderBottomWidth: 2,
      },
})

export default AppPicker;