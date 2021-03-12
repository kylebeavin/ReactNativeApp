import {useNavigation} from '@react-navigation/native';
import React from 'react';
import {StyleSheet, View, Text} from 'react-native';
import Colors from '../../constants/Colors';

interface Props {
  entity: string;
  modal: string;
}

const AppEmptyCard: React.FC<Props> = ({entity, modal}) => {
  const navigation = useNavigation();

  return (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyContainerText}>
        Looks like you don't have any {entity} yet.
      </Text>

      <Text
        style={styles.emptyContainerLink}
        onPress={() => navigation.navigate('Modal', {modal: modal})}>
        Click here to make your first {entity.slice(0, -1)}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  emptyContainer: {
    flex: 0,
    justifyContent: 'center',
    marginTop: 20,
    marginBottom: 20,
    padding: 15,
    borderStyle: 'dashed',
    borderRadius: 1,
    borderWidth: 3,
    borderColor: Colors.SMT_Primary_2_Light_1,
    backgroundColor: Colors.SMT_Secondary_1_Light_1,
  },
  emptyContainerText: {
    fontSize: 20,
    textAlign: 'center',
    marginBottom: 20,
  },
  emptyContainerLink: {
    color: Colors.SMT_Secondary_2_Light_1,
    fontSize: 20,
    textAlign: 'center',
    fontWeight: 'bold',
  },
});

export default AppEmptyCard;
