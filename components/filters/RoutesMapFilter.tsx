import { useNavigation } from '@react-navigation/native';
import React, { useState } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import Colors from '../../constants/Colors';
import Layout from '../../constants/Layout';
import ModalButtons from '../../screens/modal/ModalButtons';
import AppBtnGrp from '../layout/AppBtnGrp';
import AppCheckBox from '../layout/AppCheckBox';
import AppTitle from '../layout/AppTitle';

interface Props {
  initializer: any;
    callback: any;
    closeFilter: any;
}

const RoutesMapFilter: React.FC<Props> = ({initializer, callback, closeFilter}) => {
    const navigation = useNavigation();
    const [btnObj, setBtnObj] = useState<{[index: string]: boolean}>(initializer.route_stage);
    const [isActive, setIsActive] = useState(initializer.is_active);

    return (
      <>
        <View
          style={[
            StyleSheet.absoluteFill,
            {
              padding: 20,
              justifyContent: 'center',
              alignItems: 'center',
              zIndex: 100,
            },
          ]}>
          <View
            style={[
              StyleSheet.absoluteFill,
              {backgroundColor: 'black', opacity: 0.5},
            ]}></View>
          <View style={styles.popup}>
            <AppTitle title="Route Map Filter" />
            <View style={{paddingHorizontal: 10, marginTop: 5}}>
              <View style={styles.fieldContainer}>
                <Text>Route Stage:</Text>
                <AppBtnGrp state={{btnObj, setBtnObj}} />
              </View>
              <AppCheckBox
                label="Is Active"
                name="is_active"
                value={isActive}
                errors={[]}
                onChange={(name, val) => setIsActive(val)}
                setErrors={null}
                validations={null}
              />
            </View>
          </View>
          <View style={styles.modalButtons} >
            <ModalButtons
              navigation={navigation}
              save={() => {
                  callback({route_stage: btnObj, is_active: isActive});
                  closeFilter(false);
              }}
            />
          </View>
        </View>
      </>
    );
}

const styles = StyleSheet.create({
    fieldContainer: {
        marginBottom: 10,
    },
        //====== Modal =====//
        container: {
            paddingHorizontal: 10,
            paddingVertical: 10,
          },
          popup: {
            width: '100%',
            // position: 'absolute',
            maxHeight: Layout.window.height / 1.5,
            marginBottom: 20,
            borderRadius: 4,
            borderColor: Colors.SMT_Secondary_1_Light_1,
            borderWidth: 1,
            backgroundColor: Colors.SMT_Tertiary_1,
          },
          modalButtons: {
            // flex: 1,
            // position: 'absolute',
          },
          modalCard: {
            backgroundColor: Colors.SMT_Tertiary_1,
            marginBottom: 3,
            borderWidth: 1,
            borderColor: Colors.SMT_Secondary_1_Light_1,
            borderRadius: 3,
            paddingVertical: 3,
            paddingHorizontal: 5,
          },
          //====== Modal =====//
})

export default RoutesMapFilter;