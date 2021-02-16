import {Picker} from '@react-native-picker/picker';
import {useNavigation} from '@react-navigation/native';
import React, {useState} from 'react';
import {StyleSheet, View, Text, ScrollView} from 'react-native';
import AppButton from '../../../components/Layout/AppButton';
import AppNavBtnGrp from '../../../components/Layout/AppNavBtnGrp';
import AppTitle from '../../../components/Layout/AppTitle';
import Colors from '../../../constants/Colors';
import {Services} from '../../../types/enums';

const RoutesCalendarScreen = () => {
  //#region Use State Variables
  const navigation = useNavigation();
  const [sortItem, setSortItem] = useState('');

  //#endregion

  return (
    <View>
      <AppTitle title="Routes" help search />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.contentContainer}
        >
        <AppNavBtnGrp>
          <View style={{marginRight: 60, marginTop: 12}}>
            <AppButton
              title="Back"
              onPress={() => navigation.goBack()}
              outlined={true}
              icon={{type: 'MaterialIcons', name: 'arrow-back'}}
            />
          </View>
          <View style={{marginRight: -10}}>
            <View style={{flex: 1}}>
              <Text style={{fontSize: 12}}>Calendar View</Text>
              <View style={styles.picker}>
                <Picker
                  style={{height: 30}}
                  selectedValue={sortItem}
                  mode="dropdown"
                  onValueChange={(itemValue, itemIndex) =>
                    setSortItem(itemValue.toString())
                  }>
                  {Object.values(Services).map((item, index) => {
                    return (
                      <Picker.Item
                        key={item.toString()}
                        label={item.toString()}
                        value={item.toString()}
                      />
                    );
                  })}
                </Picker>
              </View>
            </View>
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
  picker: {
    flex: 1,
    paddingLeft: 15,
    borderColor: Colors.SMT_Secondary_1_Light_1,
    borderWidth: 2,
    borderRadius: 3,
    height: 36,
    overflow: 'hidden',
  },
});

export default RoutesCalendarScreen;
