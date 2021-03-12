import {useNavigation} from '@react-navigation/native';
import React from 'react';
import {StyleSheet, View, Text, ScrollView} from 'react-native';
import AppButton from '../../../components/Layout/AppButton';
import AppNavBtnGrp from '../../../components/Layout/AppNavBtnGrp';
import AppTitle from '../../../components/Layout/AppTitle';

const RoutesMapScreen = () => {
  //#region Use State Variables
  const navigation = useNavigation();
  //#endregion

  return (
    <View>
      <AppTitle title='Routes' help search />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.contentContainer}>
        <AppNavBtnGrp>
          <AppButton
            title='Routes'
            onPress={() => navigation.navigate('RoutesScreen')}
            outlined={true}
          />
          <AppButton
            title='Calendar'
            onPress={() => navigation.navigate('RoutesCalendarScreen')}
            outlined={true}
          />
          <View style={{marginRight: -10}}>
            <AppButton
              title='Map'
              onPress={() => navigation.navigate('RoutesMapScreen')}
              outlined={false}
            />
          </View>
        </AppNavBtnGrp>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  contentContainer: {
    // This is the scrollable part
  },
  scrollView: {
    height: '100%',
    width: '100%',
    paddingHorizontal: 10,
  },
});

export default RoutesMapScreen;
