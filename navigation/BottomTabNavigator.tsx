import * as React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';

import AppTabBar from '../components/footer/AppTabBar';
import {
  BottomTabParamList,
  DashboardParamList,
  InvoicesParamList,
  RoutesParamList,
  ReportsParamList,
  CRM_ParamList,
  SettingsParamList,
  OrdersParamList,
} from '../types/navigation';
import Colors from '../constants/Colors';
import DashboardScreen from '../screens/header/DashboardScreen';
import SettingsScreen from '../screens/header/SettingsScreen';
import CrmScreen from '../screens/bottom_tabs/crm_tab/CrmScreen';
import OrdersCalendarScreen from '../screens/bottom_tabs/orders_tab/OrdersCalendarScreen';
import RoutesScreen from '../screens/bottom_tabs/routes_tab/RoutesScreen';
import InvoiceScreen from '../screens/bottom_tabs/invoices_tab/InvoicesScreen';
import ReportScreen from '../screens/bottom_tabs/reports_tab/ReportsScreen';
import CrmCalendarScreen from '../screens/bottom_tabs/crm_tab/CrmCalendarScreen';
import CrmMapScreen from '../screens/bottom_tabs/crm_tab/CrmMapScreen';
import OrdersScreen from '../screens/bottom_tabs/orders_tab/OrdersScreen';
import OrdersMapScreen from '../screens/bottom_tabs/orders_tab/OrdersMapScreen';
import RoutesMapScreen from '../screens/bottom_tabs/routes_tab/RoutesMapScreen';
import RoutesCalendarScreen from '../screens/bottom_tabs/routes_tab/RoutesCalendarScreen';
import RouteDetailsScreen from '../screens/bottom_tabs/routes_tab/RouteDetailsScreen';
import TruckDetailsScreen from '../screens/bottom_tabs/routes_tab/TruckDetailsScreen';
import OrderDetailsScreen from '../screens/bottom_tabs/orders_tab/OrderDetailsScreen';
import MeetingDetailsScreen from '../screens/bottom_tabs/crm_tab/MeetingDetailsScreen';
import AccountDetailsScreen from '../screens/bottom_tabs/crm_tab/AccountDetailsScreen';
import RouteNavigationScreen from '../screens/bottom_tabs/routes_tab/RouteNavigationScreen';
import PreTripInspectionDetailsScreen from '../screens/bottom_tabs/routes_tab/PreTripInspectionDetailsScreen';
import AgreementDetailsScreen from '../screens/bottom_tabs/orders_tab/AgreementDetailsScreen';

const BottomTab = createBottomTabNavigator<BottomTabParamList>();
const DashboardStack = createStackNavigator<DashboardParamList>();
const SettingsStack = createStackNavigator<SettingsParamList>();
const InvoicesStack = createStackNavigator<InvoicesParamList>();
const ReportsStack = createStackNavigator<ReportsParamList>();
const RoutesStack = createStackNavigator<RoutesParamList>();
const CRM_Stack = createStackNavigator<CRM_ParamList>();
const OrdersStack = createStackNavigator<OrdersParamList>();

export default function BottomTabNavigator() {
  return (
    <BottomTab.Navigator tabBar={props => <AppTabBar {...props} />} >
      <BottomTab.Screen name='Dashboard' component={DashboardNavigator} />
      <BottomTab.Screen name='Settings' component={SettingsNavigator} />
      <BottomTab.Screen name='CRM' component={CRM_Navigator} />
      <BottomTab.Screen name='Orders' component={OrdersNavigator} />
      <BottomTab.Screen name='Routes' component={RoutesNavigator} />
      <BottomTab.Screen name='Invoices' component={InvoicesNavigator} />
      <BottomTab.Screen name='Reports' component={ReportsNavigator} />
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
        name='DashboardScreen'
        component={DashboardScreen}
      />
      <DashboardStack.Screen name='RouteNavigationScreen' component={RouteNavigationScreen} />
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
      <SettingsStack.Screen name='SettingsScreen' component={SettingsScreen} />
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
      <CRM_Stack.Screen name='CrmScreen' component={CrmScreen} />
      <CRM_Stack.Screen name='CrmCalendarScreen' component={CrmCalendarScreen} />
      <CRM_Stack.Screen name='CrmMapScreen' component={CrmMapScreen} />
      <CRM_Stack.Screen name='AccountDetailsScreen' component={AccountDetailsScreen} />
      <CRM_Stack.Screen name='MeetingDetailsScreen' component={MeetingDetailsScreen} />
    </CRM_Stack.Navigator>
  );
}

function OrdersNavigator() {
  return (
    <OrdersStack.Navigator
      screenOptions={{
        headerShown: false,
        cardStyle: { backgroundColor: Colors.TCMC_White},
      }}
    >
      <OrdersStack.Screen name='OrdersScreen' component={OrdersScreen} />
      <OrdersStack.Screen name='OrdersCalendarScreen' component={OrdersCalendarScreen} />
      <OrdersStack.Screen name='OrdersMapScreen' component={OrdersMapScreen} />
      <OrdersStack.Screen name='OrderDetailsScreen' component={OrderDetailsScreen} />
      <OrdersStack.Screen name='AgreementDetailsScreen' component={AgreementDetailsScreen} />
    </OrdersStack.Navigator>
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
      <RoutesStack.Screen name='RoutesScreen' component={RoutesScreen} />
      <RoutesStack.Screen name='RoutesCalendarScreen' component={RoutesCalendarScreen} />
      <RoutesStack.Screen name='RoutesMapScreen' component={RoutesMapScreen} />
      <RoutesStack.Screen name='RouteDetailsScreen' component={RouteDetailsScreen} />
      <RoutesStack.Screen name='TruckDetailsScreen' component={TruckDetailsScreen} />
      <RoutesStack.Screen name='PreTripInspectionDetailsScreen' component={PreTripInspectionDetailsScreen} />
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
      <InvoicesStack.Screen name='InvoicesScreen' component={InvoiceScreen} />
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
      <ReportsStack.Screen name='ReportsScreen' component={ReportScreen} />
    </ReportsStack.Navigator>
  );
}
