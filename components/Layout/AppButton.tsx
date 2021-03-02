import React from 'react';
import {StyleSheet, Text, TouchableOpacity} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

import Colors from '../../constants/Colors';

interface Props {
  title?: string;
  onPress: () => void;
  backgroundColor?: string;
  color?: string;
  outlined?: boolean;
  icon?: {type: string; name: string};
}

// When you circle back to custom button look into this => https://www.erikverweij.dev/blog/making-your-components-extensible-with-typescript/

const AppButton: React.FC<Props> = (props) => {
  const {title, onPress, backgroundColor, color, outlined, icon} = props;

  const isBtnOutlined = outlined === true && {
    backgroundColor: 'transparent',
    borderColor: backgroundColor,
    borderWidth: 2,
  };
  const isTxtOutlined = outlined === true && {color: backgroundColor};

  return (
    <TouchableOpacity
      onPress={onPress}
      style={{
        ...styles.container,
        backgroundColor,
        ...isBtnOutlined,
      }}>
      {/* {icon && <Ionicons style={{...styles.icon, ...isTxtOutlined}} name={icon} size={16}></Ionicons>} */}
      {icon ? (
        icon.type === 'MaterialIcons' ? (
          <MaterialIcons
            style={{...styles.icon, ...isTxtOutlined}}
            name={icon.name}
            size={title === undefined ? 28 : 16}
          />
        ) : icon.type === 'MaterialCommunityIcons' ? (
          <MaterialCommunityIcons
            style={{...styles.icon, ...isTxtOutlined}}
            name={icon.name}
            size={title === undefined ? 28 : 16}
          />
        ) : (
          <Ionicons
            style={{...styles.icon, ...isTxtOutlined}}
            name={icon.name}
            size={title === undefined ? 28 : 16}
          />
        )
      ) : null}

      <Text
        numberOfLines={1}
        style={{
          ...styles.text,
          color,
          ...isTxtOutlined,
        }}>
        {title}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 5,
    borderWidth: 1,
    borderColor: Colors.SMT_Tertiary_1,
    padding: 10,
    marginBottom: 5,
    height: 40,
  },
  text: {
    fontWeight: 'bold',
  },
  icon: {
    color: Colors.SMT_Tertiary_1,
    marginRight: 5,
  },
});

AppButton.defaultProps = {
  backgroundColor: Colors.SMT_Secondary_2_Dark_1,
  color: Colors.SMT_Tertiary_1,
};

export default AppButton;
