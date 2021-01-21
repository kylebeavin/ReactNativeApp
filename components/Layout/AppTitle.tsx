import React from 'react';
import {StyleSheet, View, Text} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

import Colors from '../../constants/Colors';

interface Props {
    title: string;
    help?: boolean;
    search?: boolean;
}

const AppTitle: React.FC<Props> = (props) => {
    const {title, help, search} = props;
    return (
      <View style={styles.titleContainer}>
        <View style={styles.titleView}>
          <Text style={styles.titleText}>{title}</Text>
        </View>

        { help &&
        <View style={styles.titleHelpContainer}>
          <Ionicons style={styles.titleHelpIcon} name="ios-help-circle" />
        </View>
        }

        { search &&
        <View style={styles.titleSearchContainer}>
          <Ionicons style={styles.titleSearchIcon} name="ios-search" />
        </View>
        }
      </View>
    );
}

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: "row",
    marginTop: 5,
    borderBottomWidth: 3,
    borderBottomColor: Colors.SMT_Secondary_1_Light_1,
  },
  titleView: {
    marginLeft: 10,
  },
  titleText: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 5,
  },
  titleHelpContainer: {
    marginLeft: 20,
  },
  titleHelpIcon: {
    fontSize: 30,
    color: Colors.TCMC_Navy,
  },
  titleSearchContainer: {
    flex: 1,
    flexDirection: "row",
    marginRight: 10,
    justifyContent: "flex-end",
    paddingBottom: 1,
  },
  titleSearchIcon: {
    paddingLeft: 4,
    width: 32,
    fontSize: 30,
    color: Colors.TCMC_Navy,
    backgroundColor: Colors.SMT_Secondary_1_Light_1,
    borderRadius: 150,
  },
});

export default AppTitle;