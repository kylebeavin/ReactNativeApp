import * as React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createStackNavigator } from "@react-navigation/stack";

import AppTabBar from "../components/Footer/AppTabBar";
import {
  BottomTabParamList,
  DashboardParamList,
  InvoicesParamList,
  RoutesParamList,
  ReportsParamList,
  CRM_ParamList,
  SettingsParamList,
  ServicesParamList,
} from "../types/navigation";
import Colors from "../constants/Colors";
import DashboardScreen from "../screens/Header/DashboardScreen";
import SettingsScreen from "../screens/Header/SettingsScreen";
import AccountsScreen from "../screens/BottomTabs/CRM_Tab/AccountsScreen";
import OrdersCalendarScreen from "../screens/BottomTabs/Services_Tab/OrdersCalendarScreen";
import MaintainScreen from "../screens/BottomTabs/Routes_Tab/RoutesScreen";
import InvoiceScreen from "../screens/BottomTabs/Invoices_Tab/InvoicesScreen";
import ReportScreen from "../screens/BottomTabs/Reports_Tab/ReportsScreen";
import MeetingsScreen from "../screens/BottomTabs/CRM_Tab/MeetingsScreen";
import MapScreen from "../screens/BottomTabs/CRM_Tab/MapScreen";
import OrdersScreen from "../screens/BottomTabs/Services_Tab/OrdersScreen";
import OrdersMapScreen from "../screens/BottomTabs/Services_Tab/OrdersMapScreen";

const BottomTab = createBottomTabNavigator<BottomTabParamList>();
const DashboardStack = createStackNavigator<DashboardParamList>();
const SettingsStack = createStackNavigator<SettingsParamList>();
const InvoicesStack = createStackNavigator<InvoicesParamList>();
const ReportsStack = createStackNavigator<ReportsParamList>();
const RoutesStack = createStackNavigator<RoutesParamList>();
const CRM_Stack = createStackNavigator<CRM_ParamList>();
const ServicesStack = createStackNavigator<ServicesParamList>();

export default function BottomTabNavigator() {
  return (
    <BottomTab.Navigator tabBar={props => <AppTabBar {...props} />} >
      <BottomTab.Screen name="Dashboard" component={DashboardNavigator} />
      <BottomTab.Screen name="Settings" component={SettingsNavigator} />
      <BottomTab.Screen name="CRM" component={CRM_Navigator} />
      <BottomTab.Screen name="Services" component={ServicesNavigator} />
      <BottomTab.Screen name="Routes" component={RoutesNavigator} />
      <BottomTab.Screen name="Invoices" component={InvoicesNavigator} />
      <BottomTab.Screen name="Reports" component={ReportsNavigator} />
    </BottomTab.Navigator>
  );
}

function DashboardNavigator() {
  return (
    <DashboardStack.Navigator
      screenOptions={{
        headerShown: false,
        cardStyle: { backgroundColor: Colors.TCMC_White},
      }}
    >
      <DashboardStack.Screen
        name="DashboardScreen"
        component={DashboardScreen}
      />
    </DashboardStack.Navigator>
  );
}

function SettingsNavigator() {
  return (
    <SettingsStack.Navigator
      screenOptions={{
        headerShown: false,
        cardStyle: { backgroundColor: Colors.TCMC_White},
      }}
    >
      <SettingsStack.Screen name="SettingsScreen" component={SettingsScreen} />
    </SettingsStack.Navigator>
  );
}

function CRM_Navigator() {
  return (
    <CRM_Stack.Navigator
      screenOptions={{
        headerShown: false,
        cardStyle: { backgroundColor: Colors.TCMC_White},
      }}
    >
      <CRM_Stack.Screen name="AccountsScreen" component={AccountsScreen} />
      <CRM_Stack.Screen name="MeetingsScreen" component={MeetingsScreen} />
      <CRM_Stack.Screen name="MapScreen" component={MapScreen} />
    </CRM_Stack.Navigator>
  );
}

function ServicesNavigator() {
  return (
    <ServicesStack.Navigator
      screenOptions={{
        headerShown: false,
        cardStyle: { backgroundColor: Colors.TCMC_White},
      }}
    >
      <ServicesStack.Screen name="OrdersScreen" component={OrdersScreen} />
      <ServicesStack.Screen name="OrdersCalendarScreen" component={OrdersCalendarScreen} />
      <ServicesStack.Screen name="OrdersMapScreen" component={OrdersMapScreen} />
    </ServicesStack.Navigator>
  );
}

function RoutesNavigator() {
  return (
    <RoutesStack.Navigator
      screenOptions={{
        headerShown: false,
        cardStyle: { backgroundColor: Colors.TCMC_White},
      }}
    >
      <RoutesStack.Screen name="RoutesScreen" component={MaintainScreen} />
    </RoutesStack.Navigator>
  );
}

function InvoicesNavigator() {
  return (
    <InvoicesStack.Navigator
      screenOptions={{
        headerShown: false,
        cardStyle: { backgroundColor: Colors.TCMC_White},
      }}
    >
      <InvoicesStack.Screen name="InvoicesScreen" component={InvoiceScreen} />
    </InvoicesStack.Navigator>
  );
}

function ReportsNavigator() {
  return (
    <ReportsStack.Navigator
      screenOptions={{
        headerShown: false,
        cardStyle: { backgroundColor: Colors.TCMC_White},
      }}
    >
      <ReportsStack.Screen name="ReportsScreen" component={ReportScreen} />
    </ReportsStack.Navigator>
  );
}
