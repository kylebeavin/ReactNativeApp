import React, {useRef, useState} from 'react';
import {StyleSheet, View, Text, TextInput} from 'react-native';
import Colors from '../../constants/Colors';

interface Props {
  label: string;
  name: string;
  value: string;
  onChange: (name: string, value: string) => void;
  validations: any;
  errors: any;
  setErrors: any;
  multiline?: boolean;
}

const AppTextInput: React.FC<Props> = ({label,name,value,onChange,validations,errors,setErrors,multiline}) => {
  const [focused, setFocused] = useState(false);
  const ref = useRef(null);
  
  const validate = (validations: any) => {
    setErrors((prev:any) => ({
      ...prev,
      [name]: validations
        .map((errorsFor: any) => errorsFor(value))
        .filter((errorMsg: any) => errorMsg.length > 0),
    }));
  };

  return (
    <View style={styles.fieldContainer}>
      <Text style={styles.text} onPress={() => ref.current!.focus()}>{label}</Text>
      <TextInput
        autoCapitalize="none"
        autoCorrect={false}
        style={styles.textInput}
        ref={ref}
        value={value}
        onChange={(e) => onChange(e.nativeEvent.text, name)}
        blurOnSubmit={false}
        onFocus={() => setFocused(true)}
        onBlur={() => {
          setFocused(false);
          validate(validations);
        }}

        multiline={!multiline ? false : true}
      />

      <View style={[focused ? styles.isFocused : null, multiline ? {borderBottomColor: 'transparent'}: null]}></View>
      <View style={errors.length > 0 ? styles.errorStyle : null}></View>

      <View style={errors.length > 0 ? {opacity: 1} : {opacity: 0}}>
        <Text style={{color: Colors.SMT_Primary_1}}>{errors.join(', ')}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  fieldContainer: {
    //marginBottom: 10,
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
  text: {
    fontWeight: 'bold',
    color: Colors.SMT_Secondary_1,
  },
  textInput: {
    paddingLeft: 15,
    paddingVertical: 5,
    borderColor: Colors.SMT_Secondary_1_Light_1,
    borderWidth: 2,
    borderRadius: 3,
  },
});

export default AppTextInput;
