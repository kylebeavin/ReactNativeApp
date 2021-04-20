import React, { useRef, useState } from 'react';
import { StyleSheet, View, Text, TextInput, TouchableOpacity } from 'react-native';
import { Calendar } from 'react-native-calendars';
import Colors from '../../constants/Colors';
import { formatDateString } from '../../utils/Helpers';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

interface Props {
    label: string;
    name: string;
    value: string;
    onChange: (name: string, value: string) => void;
    validations: any;
    errors: any;
    setErrors: any;
    containerStyle?: {};
}

const AppDatePicker: React.FC<Props> = ({
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
    const ref = useRef<any>(null);
    const [showCalendar, setShowCalendar] = useState(false);
  
    const validate = (validations: any) => {
      setErrors((prev: any) => ({
        ...prev,
        [name]: validations
          .map((errorsFor: any) => errorsFor(value))
          .filter((errorMsg: any) => errorMsg.length > 0),
      }));
    };

    return (
      <View
        style={[
          styles.fieldContainer,
          !containerStyle ? null : containerStyle,
        ]}>
        <Text style={styles.text} onPress={() => ref.current!.focus()}>
          {label}
        </Text>
        <View style={[styles.textInput, {flexDirection: 'row'}]}>
          <TextInput
            autoCapitalize="none"
            autoCorrect={false}
            style={{flex: 1, paddingLeft: 15, paddingVertical: 5}}
            ref={ref}
            value={value}
            onChange={(e) => onChange(e.nativeEvent.text, name)}
            blurOnSubmit={false}
            onFocus={() => setFocused(true)}
            onBlur={() => {
              setFocused(false);
              validate(validations);
            }}
          />
          <TouchableOpacity
            onPress={() => setShowCalendar(!showCalendar)}
            style={{justifyContent: 'center'}}>
            <MaterialCommunityIcons
              style={styles.icon}
              name="calendar"
              size={28}
            />
          </TouchableOpacity>
        </View>
        <View style={[focused ? styles.isFocused : null]}></View>
        <View style={errors.length > 0 ? styles.errorStyle : null}></View>

        <View style={errors.length > 0 ? {opacity: 1} : {opacity: 0}}>
          <Text
            style={{
              marginBottom: 6,
              fontSize: 10,
              color: Colors.SMT_Primary_1,
            }}>
            {errors.join(', ')}
          </Text>
        </View>
        {showCalendar ? (
          <View
            style={styles.calendarPopup}
            //   onPress={() => setShowCalendar(false)}
          >
            <Calendar
              style={{borderRadius: 4}}
              onDayPress={(day) => {
                onChange(formatDateString(day.dateString), name);
                setShowCalendar(false);
              }}
            />
          </View>
        ) : null}
        {showCalendar && <View style={{margin: 60}} />}
      </View>
    );
}

const styles = StyleSheet.create({
    fieldContainer: {
        flex: 1,
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
        borderColor: Colors.SMT_Secondary_1_Light_1,
        borderWidth: 2,
        borderRadius: 3,
        backgroundColor: Colors.SMT_Tertiary_1
      },
      calendarPopup: {
        position: 'absolute',
        top: 64,
        width: '100%',
        borderColor: Colors.SMT_Secondary_1_Light_1,
        borderWidth: 2,
        borderRadius: 3,
        backgroundColor: Colors.SMT_Tertiary_1,
        zIndex: 100,
      },
      icon: {
        color: Colors.SMT_Primary_2,
        textAlign: 'center',
        alignSelf: 'center',
        marginRight: 5,
      },
})

export default AppDatePicker;