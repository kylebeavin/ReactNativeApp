import CheckBox from '@react-native-community/checkbox';
import React, {useRef, useState} from 'react';
import {StyleSheet, View, Text, TouchableWithoutFeedback} from 'react-native';
import Colors from '../../constants/Colors';

interface Props {
  label: string;
  name: string;
  value: boolean;
  onChange: (name: string, value: boolean) => void;
  validations: any;
  errors: any;
  setErrors: any;
  containerStyle?: {};
}

const AppCheckBox: React.FC<Props> = ({
  label,
  name,
  value,
  onChange,
  validations,
  errors,
  setErrors,
  containerStyle,
}) => {
  const [focused, setFocused] = useState(false);
  const ref = useRef(null);

  //   const validate = (validations: any) => {
  //     setErrors((prev: any) => ({
  //       ...prev,
  //       [name]: validations
  //         .map((errorsFor: any) => errorsFor(value))
  //         .filter((errorMsg: any) => errorMsg.length > 0),
  //     }));
  //   };

  return (
    <View style={!containerStyle ? null : containerStyle}>
      <Text style={styles.text}>{label}</Text>
      <TouchableWithoutFeedback
        onPress={() => {
          onChange(name, !value);
          ref.current!.focus();
        }}>
        <CheckBox
          ref={ref}
          disabled={false}
          value={value}
          onValueChange={(newValue) => onChange(name, newValue)}
        />
      </TouchableWithoutFeedback>

      {/* <View style={[focused ? styles.isFocused : null]}></View> */}
      <View style={errors.length > 0 ? styles.errorStyle : null}></View>

      <View style={errors.length > 0 ? {opacity: 1} : {opacity: 0}}>
        <Text style={{color: Colors.SMT_Primary_1}}>{errors.join(', ')}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  text: {
    fontWeight: 'bold',
    color: Colors.SMT_Secondary_1,
  },
  //   isFocused: {
  //     position: 'absolute',
  //     top: 27,
  //     left: 7,
  //     height: '25%',
  //     width: '5.5%',
  //     borderColor: Colors.SMT_Secondary_2_Light_2,
  //     borderWidth: 2,
  //     borderRadius: 2,
  //   },
  errorStyle: {
    position: 'absolute',
    bottom: 21.5,
    alignSelf: 'center',
    width: '98.6%',
    borderBottomColor: Colors.SMT_Primary_1,
    borderBottomWidth: 2,
  },
});

export default AppCheckBox;
