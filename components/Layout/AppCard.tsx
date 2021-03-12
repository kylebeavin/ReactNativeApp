import {useNavigation} from '@react-navigation/native';
import React, {useState} from 'react';
import {StyleSheet, View, Text} from 'react-native';

import Colors from '../../constants/Colors';
import {Account} from '../../types/crm';
import AppButton from './AppButton';
import AppCardDrawer from './AppCardDrawer';
import AppEditBtn from './AppEditBtn';

interface Props {
  item: Account;
  index: number;
  onToggleCardDrawer?: (item: any, index: number) => Promise<void>;
}

const AppCard: React.FC<Props> = ({item, index, onToggleCardDrawer}) => {
  const navigation = useNavigation();

  return (
    <View style={{paddingHorizontal: 20}}>
      <View style={styles.card}>
        {/* Edit Button */}
        <AppEditBtn item={item} modal='UpdateAccountModal' />

        {/* Card Title */}
        <View>
          <Text style={styles.cardTitleText}>{item.account_name}</Text>
        </View>

        {/* Status */}
        <View style={styles.statusContainer}>
          <Text>
            Status:
            <Text
              style={[
                item.stage === 'Lead'
                  ? styles.statusValid
                  : styles.statusInvalid,
              ]}>
              {' '}
              {item.stage}
            </Text>
          </Text>
        </View>

        {/* Assigned To */}
        <View style={styles.assignedToContainer}>
          <Text>Assigned to: </Text>

          <Text>{item.owner_name}</Text>
        </View>

        {/* Notes */}
        <View style={styles.notesContainer}>
          <Text>Notes: </Text>
          <Text numberOfLines={1}>
            {item.notes === null || item.notes === [''] ? ' ...' : item.notes}
          </Text>
        </View>

        {/* Card Buttons */}
        <View style={styles.cardButtonsContainer}>
          <View style={styles.cardButton}>
            <AppButton
              title='Service'
              onPress={() => console.log('Expand')}
              outlined
            />
          </View>
          <View style={styles.cardButton}>
            <AppButton title='Demo' onPress={() => console.log('Demo')} />
          </View>
          <View
            style={{...styles.cardButton, ...{marginLeft: 10, marginRight: 0}}}>
            <AppButton
              title={item.drawerIsVisible ? 'Hide' : 'Contacts'}
              icon={{type: 'MaterialIcons', name: 'people'}}
              onPress={() =>
                onToggleCardDrawer === undefined
                  ? null
                  : onToggleCardDrawer(item, index)
              }
              backgroundColor={Colors.SMT_Secondary_2}
              outlined={!item.drawerIsVisible}
            />
          </View>
        </View>
      </View>

      <AppCardDrawer
        navigation={navigation}
        isVisible={item.drawerIsVisible}
        contacts={item.contacts}
        account={item}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  //== Base Card Styles ==
  card: {
    flex: 1,
    borderWidth: 1,
    borderColor: Colors.SMT_Secondary_1,
    backgroundColor: Colors.SMT_Tertiary_1,
    borderRadius: 3,
    padding: 20,
    zIndex: 2,
  },
  cardTitleText: {
    marginBottom: 10,
    fontSize: 20,
    fontWeight: 'bold',
  },

  //=== Status Styles ====
  statusContainer: {
    marginBottom: 10,
  },
  statusValid: {
    color: Colors.Success,
  },
  statusInvalid: {
    color: Colors.Info,
  },

  //==== Assigned To =====
  assignedToContainer: {
    marginBottom: 10,
    flexDirection: 'row',
  },

  //======= Notes ========
  notesContainer: {
    width: 210,
    marginBottom: 10,
    flexDirection: 'row',
  },

  //=== Card Buttons =====
  cardButtonsContainer: {
    flex: 1,
    flexDirection: 'row',
  },
  cardButton: {
    flex: 1,
    height: '100%',
    width: '100%',
    marginRight: 10,
    justifyContent: 'center',
  },
});

export default AppCard;
