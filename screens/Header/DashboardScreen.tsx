import React from 'react';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {StyleSheet, View, Text, ScrollView} from 'react-native';

import Colors from '../../constants/Colors';
import AppTitle from '../../components/Layout/AppTitle';

interface Props {
    key: any;
}

const DashboardScreen: React.FC<Props> = (props) => {
    return (
      <ScrollView>
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
              <Text style={{ textAlign: "center" }}>Close Percentage</Text>
              <Text>00%</Text>
            </View>
            <View style={styles.cardContentItem}>
              <Text style={{ textAlign: "center" }}>Demos Done</Text>
              <Text>00</Text>
            </View>
            <View style={styles.cardContentItem}>
              <Text style={{ textAlign: "center" }}>
                Average Time Per Smash
              </Text>
              <Text>00:00</Text>
            </View>
            <View style={styles.cardContentItem}>
              <Text style={{ textAlign: "center" }}>Smashes Per Hour</Text>
              <Text>00</Text>
            </View>
          </View>
        </View>
        {/* Date Picker */}
        <View style={styles.datePickerContainer}>
          <View style={styles.datePickerContainerItem}>
            <Text>Month</Text>
            <View
              style={[styles.datePickerContainerItemBox, { marginRight: 10 }]}
            >
              <Text>Month</Text>
            </View>
          </View>

          <View style={styles.datePickerContainerItem}>
            <Text>Year</Text>
            <View style={styles.datePickerContainerItemBox}>
              <Text>Year</Text>
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
                  { color: Colors.Success },
                ]}
                name="ios-checkmark-circle-outline"
              ></Ionicons>
              <Text style={{ textAlign: "center" }}>
                Something you're doing well at
              </Text>
            </View>
            <View style={styles.statusContentItem}>
              <Ionicons
                style={[styles.statusContentItemIcon, { color: Colors.Info }]}
                name="ios-alert"
              ></Ionicons>
              <Text style={{ textAlign: "center" }}>
                Something you can do better
              </Text>
            </View>
            <View style={styles.statusContentItem}>
              <Ionicons
                style={[
                  styles.statusContentItemIcon,
                  { color: Colors.Success },
                ]}
                name="ios-checkmark-circle-outline"
              ></Ionicons>
              <Text style={{ textAlign: "center" }}>
                Something you're doing well at
              </Text>
            </View>
            <View style={styles.statusContentItem}>
              <Ionicons
                style={[styles.statusContentItemIcon, { color: Colors.Info }]}
                name="ios-alert"
              ></Ionicons>
              <Text style={{ textAlign: "center" }}>
                Something you can do better
              </Text>
            </View>
          </View>
        </View>

        {/* Income Reports */}
        <View style={styles.incomeReportsContainer}>
          {/* <View style={styles.incomeReportsContainerTitle}>
            <Text style={styles.incomeReportsContainerTitleText}>
              Income Reports
            </Text>
          </View> */}
          <AppTitle title="Income Reports" />

          <View style={styles.incomeReportsContent}>
            <View style={[styles.incomeReportsContentItem, {backgroundColor: Colors.TCMC_LightGray}]}>
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
      </ScrollView>
    );
}

const styles = StyleSheet.create({
  //====== Card Styles==============
  card: {
    padding: 10,
    borderRadius: 5,
    borderWidth: 3,
    borderColor: Colors.Secondary,
  },
  cardBanner: {
    flex: 1,
    flexDirection: "row",
    marginBottom: 10,
    padding: 10,
    backgroundColor: Colors.Success,
  },
  cardBannerColumnOne: {
    //flex: 1,
  },
  cardBannerColumnTwo: {
    flex: 1,
    alignItems: "flex-end",
  },
  cardContent: {
    flex: 1,
    flexDirection: "row",
    flexWrap: "wrap",
  },
  cardContentItem: {
    padding: 10,
    width: "50%",
    justifyContent: "center",
    alignItems: "center",
  },
  cardTitle: {
    marginBottom: 10,
    fontSize: 20,
    fontWeight: "bold",
  },
  datePickerContainer: {
    flex: 1,
    flexDirection: "row",
    marginBottom: 10,
  },
  datePickerContainerItem: {
    flex: 1,
  },
  datePickerContainerItemBox: {
    padding: 10,
    borderRadius: 5,
    borderWidth: 3,
    borderColor: Colors.Secondary,
  },
  //====== Card Styles ==============

  //====== Status Rating Styles =====
  statusContainer: {
    marginBottom: 10,
  },
  statusContent: {
    flex: 1,
    flexDirection: "row",
    flexWrap: "wrap",
  },
  statusContentItem: {
    width: "50%",
    justifyContent: "center",
    alignItems: "center",
  },
  statusContentItemIcon: {
    fontSize: 80,
  },
  statusHeader: {
    paddingVertical: 10,
  },
  statusHeaderText: {
    textAlign: "center",
    fontSize: 20,
  },
  statusHeaderValue: {
    color: Colors.Success,
    fontWeight: "bold",
  },
  //====== Status Rating Styles =====

  //======== Income Reports =========
  incomeReportsContainer: {
    marginBottom: 10,
  },
  incomeReportsContent: {
    marginTop: 10,
    borderTopWidth: 3,
    borderTopColor: Colors.Secondary,
  },
  incomeReportsContentItem: {
    flex: 1,
    flexDirection: "row",
    marginBottom: 10,
    padding: 10,
    borderBottomWidth: 3,
    borderBottomColor: Colors.Secondary,
  },
  incomeReportColumnOne: {
    //flex: 1,
  },
  incomeReportColumnTwo: {
    flex: 1,
    alignItems: "flex-end",
  },
  //======== Income Reports =========
});

export default DashboardScreen;