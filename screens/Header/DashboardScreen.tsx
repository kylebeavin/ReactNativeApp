import React, {useContext, useEffect, useState} from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {useNavigation} from '@react-navigation/native';
import {Picker} from '@react-native-picker/picker';

import Colors from '../../constants/Colors';
import AppTitle from '../../components/Layout/AppTitle';
import AppContext from '../../providers/AppContext';
import {Months, Services} from '../../types/enums';

interface Props {
  key: any;
}

const DashboardScreen: React.FC<Props> = () => {
  //#region Use State Variables
  const navigation = useNavigation();
  const {grpId, token} = useContext(AppContext);
  const [groupToggle, setGroupToggle] = useState(true);
  const [crmToggle, setCrmToggle] = useState(false);
  const [servicesToggle, setServicesToggle] = useState(false);
  const [routesToggle, setRoutesToggle] = useState(false);
  const [invoicesToggle, setInvoicesToggle] = useState(false);
  // Picker
  const [yearPickerArr, setYearPickerArr] = useState<Number[]>([]);
  const [monthPicker, setMonthPicker] = useState('');
  const [yearPicker, setYearPicker] = useState('');
  //#endregion

  useEffect(() => {
    const initializeYearPicker = () => {
      let yearArr = [];
      for (var i = 2010; i <= new Date().getFullYear(); i++) {
        yearArr.push(i);
      }

      setYearPickerArr(yearArr);
    };

    initializeYearPicker();
  }, []);

  return (
    <>
      <TouchableOpacity onPress={() => setGroupToggle(!groupToggle)}>
        <AppTitle title="Dashboard" />
      </TouchableOpacity>

      <ScrollView>
        {groupToggle ? (
          <View style={styles.container}>
            {/* Summary Card */}
            <View style={styles.card}>
              <Text style={styles.cardTitle}>30 Day Summary</Text>

              {/* Card Banner */}
              <View style={styles.cardBanner}>
                <View style={styles.cardBannerColumnOne}>
                  <Text>NET INCOME:</Text>
                </View>
                <View style={styles.cardBannerColumnTwo}>
                  <Text>$000000000.00</Text>
                </View>
              </View>

              {/* Card Content */}
              <View style={styles.cardContent}>
                <View style={styles.cardContentItem}>
                  <Text style={{textAlign: 'center'}}>Close Percentage</Text>
                  <Text>00%</Text>
                </View>
                <View style={styles.cardContentItem}>
                  <Text style={{textAlign: 'center'}}>Demos Done</Text>
                  <Text>00</Text>
                </View>
                <View style={styles.cardContentItem}>
                  <Text style={{textAlign: 'center'}}>
                    Average Time Per Smash
                  </Text>
                  <Text>00:00</Text>
                </View>
                <View style={styles.cardContentItem}>
                  <Text style={{textAlign: 'center'}}>Smashes Per Hour</Text>
                  <Text>00</Text>
                </View>
              </View>
            </View>

            {/* Date Picker */}
            <View style={{flexDirection: 'row'}}>
              <View style={{flex: 1, marginRight: 20}}>
                <Text style={{fontSize: 12}}>Month</Text>
                <View style={styles.picker}>
                  <Picker
                    style={{height: 30}}
                    selectedValue={monthPicker}
                    mode="dropdown"
                    onValueChange={(itemValue, itemIndex) =>
                      setMonthPicker(itemValue.toString())
                    }>
                    {Object.values(Months).map((item, index) => {
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
              <View style={{flex: 1}}>
                <Text style={{fontSize: 12}}>Year</Text>
                <View style={styles.picker}>
                  <Picker
                    style={{height: 30}}
                    selectedValue={yearPicker}
                    mode="dropdown"
                    onValueChange={(itemValue, itemIndex) =>
                      setYearPicker(itemValue.toString())
                    }>
                    {yearPickerArr.map((item, index) => {
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

            {/* Status Rating */}
            <View style={styles.statusContainer}>
              <AppTitle title="Status Rating" />

              {/* Status Header */}
              <View style={styles.statusHeader}>
                <Text style={styles.statusHeaderText}>
                  Status: <Text style={styles.statusHeaderValue}>On Track</Text>
                </Text>
              </View>
              {/* Status Content */}
              <View style={styles.statusContent}>
                <View style={styles.statusContentItem}>
                  <Ionicons
                    style={[
                      styles.statusContentItemIcon,
                      {color: Colors.SMT_Secondary_2_Light_2},
                    ]}
                    name="ios-checkmark-circle-outline"></Ionicons>
                  <Text style={{textAlign: 'center'}}>
                    Something you're doing well at
                  </Text>
                </View>
                <View style={styles.statusContentItem}>
                  <Ionicons
                    style={[styles.statusContentItemIcon, {color: Colors.SMT_Primary_1_Light_1}]}
                    name="ios-alert"></Ionicons>
                  <Text style={{textAlign: 'center'}}>
                    Something you can do better
                  </Text>
                </View>
                <View style={styles.statusContentItem}>
                  <Ionicons
                    style={[
                      styles.statusContentItemIcon,
                      {color: Colors.SMT_Secondary_2_Light_2},
                    ]}
                    name="ios-checkmark-circle-outline"></Ionicons>
                  <Text style={{textAlign: 'center'}}>
                    Something you're doing well at
                  </Text>
                </View>
                <View style={styles.statusContentItem}>
                  <Ionicons
                    style={[styles.statusContentItemIcon, {color: Colors.SMT_Primary_1_Light_1}]}
                    name="ios-alert"></Ionicons>
                  <Text style={{textAlign: 'center'}}>
                    Something you can do better
                  </Text>
                </View>
              </View>
            </View>

            {/* Income Reports */}
            <View style={styles.incomeReportsContainer}>
              <AppTitle title="Income Reports" />

              <View style={styles.incomeReportsContent}>
                <View
                  style={[
                    styles.incomeReportsContentItem,
                    {backgroundColor: Colors.SMT_Secondary_1_Light_1},
                  ]}>
                  <View style={styles.incomeReportColumnOne}>
                    <Text>AFTER EXPENSES</Text>
                  </View>
                  <View style={styles.incomeReportColumnTwo}>
                    <Text>$000000000.00</Text>
                  </View>
                </View>

                <View style={styles.incomeReportsContentItem}>
                  <View style={styles.incomeReportColumnOne}>
                    <Text>BEFORE EXPENSES</Text>
                  </View>
                  <View style={styles.incomeReportColumnTwo}>
                    <Text>$000000000.00</Text>
                  </View>
                </View>

                <View style={styles.incomeReportsContentItem}>
                  <View style={styles.incomeReportColumnOne}>
                    <Text>EXPENSE TOTAL</Text>
                  </View>
                  <View style={styles.incomeReportColumnTwo}>
                    <Text>$000000000.00</Text>
                  </View>
                </View>
              </View>
            </View>
          </View>
        ) : null}
        <TouchableOpacity onPress={() => setCrmToggle(!crmToggle)}>
          <AppTitle title="CRM Status" />
        </TouchableOpacity>
        {crmToggle ? (
          <View style={styles.container}>
            <Text>Hello World!</Text>
          </View>
        ) : null}
        <TouchableOpacity onPress={() => setServicesToggle(!servicesToggle)}>
          <AppTitle title="Services Status" />
        </TouchableOpacity>
        {servicesToggle ? (
          <View style={styles.container}>
            <Text>Hello World!</Text>
          </View>
        ) : null}
        <TouchableOpacity onPress={() => setRoutesToggle(!routesToggle)}>
          <AppTitle title="Routes Status" />
        </TouchableOpacity>
        {routesToggle ? (
          <View style={styles.container}>
            <Text>Hello World!</Text>
          </View>
        ) : null}
        <TouchableOpacity onPress={() => setInvoicesToggle(!invoicesToggle)}>
          <AppTitle title="Invoices Status" />
        </TouchableOpacity>
        {invoicesToggle ? (
          <View style={[styles.container, {marginBottom: 40}]}>
            <Text>Hello World!</Text>
          </View>
        ) : null}
      </ScrollView>
    </>
  );
};

const styles = StyleSheet.create({
  //====== Base Styles==============
  container: {
    paddingHorizontal: 10,
    paddingTop: 10,
  },
  //====== Base Styles==============

  //====== Card Styles==============
  card: {
    padding: 10,
    borderRadius: 3,
    borderWidth: 2,
    borderColor: Colors.SMT_Secondary_1_Light_1,
  },
  cardBanner: {
    flex: 1,
    flexDirection: 'row',
    marginBottom: 10,
    padding: 10,
    borderRadius: 2,
    backgroundColor: Colors.SMT_Secondary_2_Light_2,
  },
  cardBannerColumnOne: {
    //flex: 1,
  },
  cardBannerColumnTwo: {
    flex: 1,
    alignItems: 'flex-end',
  },
  cardContent: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  cardContentItem: {
    padding: 10,
    width: '50%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardTitle: {
    marginBottom: 10,
    fontSize: 20,
    fontWeight: 'bold',
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
  //====== Card Styles ==============

  //====== Status Rating Styles =====
  statusContainer: {
    marginBottom: 10,
  },
  statusContent: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  statusContentItem: {
    width: '50%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  statusContentItemIcon: {
    fontSize: 80,
  },
  statusHeader: {
    paddingVertical: 10,
  },
  statusHeaderText: {
    textAlign: 'center',
    fontSize: 20,
  },
  statusHeaderValue: {
    color: Colors.SMT_Secondary_2_Light_2,
    fontWeight: 'bold',
  },
  //====== Status Rating Styles =====

  //======== Income Reports =========
  incomeReportsContainer: {
    marginBottom: 10,
  },
  incomeReportsContent: {
    marginTop: 10,
    borderTopWidth: 3,
    borderTopColor: Colors.SMT_Secondary_1_Light_1,
  },
  incomeReportsContentItem: {
    flex: 1,
    flexDirection: 'row',
    marginBottom: 10,
    padding: 10,
    borderBottomWidth: 3,
    borderBottomColor: Colors.SMT_Secondary_1_Light_1,
  },
  incomeReportColumnOne: {
    //flex: 1,
  },
  incomeReportColumnTwo: {
    flex: 1,
    alignItems: 'flex-end',
  },
  //======== Income Reports =========
});

export default DashboardScreen;
