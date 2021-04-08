import * as React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';

import NotFoundScreen from '../screens/NotFoundScreen';
import {RootStackParamList} from '../types/navigation';
import BottomTabNavigator from './BottomTabNavigator';
import HeaderContainer from '../components/header/HeaderContainer';
import Colors from '../constants/Colors';
import {View, StatusBar} from 'react-native';
import Modal from '../screens/modal/Modal';

const Stack = createStackNavigator<RootStackParamList>();

export const navigationRef: React.RefObject<any> = React.createRef();
export const navigate = (name: string, params: {}) => {
  navigationRef.current?.navigate(name);
};

function Navigation() {
  return (
    <NavigationContainer ref={navigationRef}>
      <StatusBar translucent backgroundColor='transparent' />

      <View style={{flex: 1}}>
        <RootNavigator />
        <StatusBar translucent backgroundColor='transparent' />
      </View>
    </NavigationContainer>
  );
}

function RootNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{
        cardStyle: {backgroundColor: Colors.TCMC_White},
        header: ({scene, previous, navigation}) => {
          const {options} = scene.descriptor;
          const title =
            options.headerTitle !== undefined
              ? options.headerTitle
              : options.title !== undefined
              ? options.title
              : scene.route.name;

          return (
            <View>
              <HeaderContainer />
              <StatusBar translucent backgroundColor='transparent' />
            </View>
          );
        },
      }}>
      <Stack.Screen name='Root' component={BottomTabNavigator} />
      <Stack.Screen
        name='NotFound'
        component={NotFoundScreen}
        options={{title: 'Oops!'}}
      />
      <Stack.Screen
        name='Modal'
        component={Modal}
        options={{
          animationEnabled: true,
          cardStyle: {backgroundColor: 'rgba(0,0,0,0.55)'},
          cardOverlayEnabled: true,
          cardStyleInterpolator: ({current: {progress}}) => {
            return {
              cardStyle: {
                opacity: progress.interpolate({
                  inputRange: [0, 0.5, 0.9, 1],
                  outputRange: [0, 0.25, 0.7, 1],
                }),
              },
              overlayStyle: {
                opacity: progress.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0, 0.5],
                  extrapolate: 'clamp',
                }),
              },
            };
          },
        }}
      />
    </Stack.Navigator>
  );
}

export default Navigation;
