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
import AccountsScreen from "../screens/CRM_Tab/AccountsScreen";
import SmashScreen from "../screens/ServicesScreen";
import MaintainScreen from "../screens/RoutesScreen";
import InvoiceScreen from "../screens/InvoicesScreen";
import ReportScreen from "../screens/ReportsScreen";
import MeetingsScreen from "../screens/CRM_Tab/MeetingsScreen";
import MapScreen from "../screens/CRM_Tab/MapScreen";

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
        cardStyle: { backgroundColor: Colors.TCMC_White, padding: 10 },
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
        cardStyle: { backgroundColor: Colors.TCMC_White, padding: 10 },
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
        cardStyle: { backgroundColor: Colors.TCMC_White, paddingHorizontal: 10 },
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
        cardStyle: { backgroundColor: Colors.TCMC_White, paddingHorizontal: 10 },
      }}
    >
      <ServicesStack.Screen name="ServicesScreen" component={SmashScreen} />
    </ServicesStack.Navigator>
  );
}

function RoutesNavigator() {
  return (
    <RoutesStack.Navigator
      screenOptions={{
        headerShown: false,
        cardStyle: { backgroundColor: Colors.TCMC_White, paddingHorizontal: 10 },
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
        cardStyle: { backgroundColor: Colors.TCMC_White, paddingHorizontal: 10 },
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
        cardStyle: { backgroundColor: Colors.TCMC_White, paddingHorizontal: 10 },
      }}
    >
      <ReportsStack.Screen name="ReportsScreen" component={ReportScreen} />
    </ReportsStack.Navigator>
  );
}
