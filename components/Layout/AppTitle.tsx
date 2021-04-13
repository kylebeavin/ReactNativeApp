import React, { Dispatch, SetStateAction, useState } from 'react';
import {StyleSheet, View, Text, TouchableOpacity} from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Ionicons from 'react-native-vector-icons/Ionicons';

import Colors from '../../constants/Colors';
import RoutesMapFilter from '../filters/RoutesMapFilter';

interface Props {
  title: string;
  help?: boolean;
  search?: boolean;
  filter?: string;
  filterInitializer?: any;
  filterCallback?: Dispatch<SetStateAction<any>>;
}

const AppTitle: React.FC<Props> = ({title, help, search, filter, filterInitializer, filterCallback}) => {
  //#region Use State Variables
  const [showHelp, setShowHelp] = useState(false);
  const [showFilter, setShowFilter] = useState(false);
  //#endregion

  const renderFilter = () => {
    switch (filter) {
      case 'RoutesMapFilter': 
        return <RoutesMapFilter initializer={filterInitializer} callback={filterCallback} closeFilter={setShowFilter} />
      default: 
        return null;
    }
  };

  return (
    <>
      <View style={styles.titleContainer}>
        <View style={styles.titleView}>
          <Text style={styles.titleText}>{title}</Text>
        </View>

        {help && (
          <TouchableOpacity
            onPress={() => setShowHelp(!showHelp)}
            style={styles.titleHelpContainer}>
            <Ionicons style={styles.titleHelpIcon} name="ios-help-circle" />
          </TouchableOpacity>
        )}

        {search && (
          <TouchableOpacity style={styles.titleSearchContainer}>
            <Ionicons style={styles.titleSearchIcon} name="ios-search" />
          </TouchableOpacity>
        )}

        {filter && (
          <TouchableOpacity
            onPress={() => setShowFilter(!showFilter)}
            style={styles.titleFilterContainer}>
            <FontAwesome style={styles.titleFilterIcon} name="filter" />
          </TouchableOpacity>
        )}
      </View>

      {showHelp ? (
        <View style={{position: 'absolute'}}>
          <View style={styles.tooltip}>
            <Text style={{color: 'white'}}>Hello tooltip</Text>
          </View>
        </View>
      ) : null}

      {showFilter ? renderFilter() : null}
    </>
  );
};

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: 'row',
    marginTop: 5,
    borderBottomWidth: 3,
    borderBottomColor: Colors.SMT_Secondary_1,
  },
  titleView: {
    marginLeft: 10,
  },
  titleText: {
    fontSize: 20,
    fontWeight: 'bold',
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
    flexDirection: 'row',
    marginRight: 10,
    justifyContent: 'flex-end',
    paddingBottom: 1,
  },
  titleSearchIcon: {
    paddingTop: 6,
    paddingLeft: 6,
    width: 32,
    fontSize: 20,
    color: Colors.TCMC_Navy,
    backgroundColor: Colors.SMT_Secondary_1_Light_1,
    borderRadius: 150,
  },
  titleFilterContainer: {
    flex: 1,
    flexDirection: 'row',
    marginRight: 10,
    justifyContent: 'flex-end',
    paddingBottom: 1,
  },
  titleFilterIcon: {
    paddingTop: 7,
    paddingLeft: 8,
    width: 32,
    fontSize: 20,
    color: Colors.TCMC_Navy,
    backgroundColor: Colors.SMT_Secondary_1_Light_1,
    borderRadius: 150,
  },
  tooltip: {
    backgroundColor: Colors.SMT_Primary_2_Light_1,
    padding: 10,
    borderRadius: 4,
    borderWidth: 3,
    borderColor: Colors.SMT_Primary_1_Dark_1
  },


});

export default AppTitle;
