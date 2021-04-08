import React from 'react';
import { StyleSheet, View } from 'react-native';

import CreateAccountModal from './creates/CreateAccountModal';
import UpdateAccountModal from './updates/UpdateAccountModal';
import CreateContactModal from './creates/CreateContactModal';
import UpdateContactModal from './updates/UpdateContactModal';
import CreateLocationModal from './creates/CreateLocationModal';
import UpdateLocationModal from './updates/UpdateLocationModal';
import CreateMeetingModal from './creates/CreateMeetingModal';
import UpdateMeetingModal from './updates/UpdateMeetingModal';
import CreateAgreementModal from './creates/CreateAgreementModal';
import CreateDemoModal from './creates/CreateDemoModal';
import CreateOrderModal from './creates/CreateOrderModal';
import UpdateAgreementModal from './updates/UpdateAgreementModal';
import UpdateOrderModal from './updates/UpdateOrderModal';
import UpdateDemoModal from './updates/UpdateDemoModal';
import CreateTruckModal from './creates/CreateTruckModal';
import CreateRouteModal from './creates/CreateRouteModal';
import CreateUserModal from './creates/CreateUserModal';
import CreatePreTripInspectionModal from './creates/CreatePreTripInspectionModal';
import CreateGroupModal from './creates/CreateGroupModal';
import UpdateRouteModal from './updates/UpdateRouteModal';
import AssignRouteModal from './routes/AssignRouteModal';
import UpdateOrderStatusModal from './orders/UpdateOrderStatusModal';
import StartOrderModal from './orders/StartOrderModal';
import CompleteOrderModal from './orders/CompleteOrderModal';
import AssignDriverModal from './routes/AssignDriverModal';
import AssignTruckModal from './routes/AssignTruckModal';

interface Props {
    navigation: any;
    route: any;
}

const Modal: React.FC<Props> = ({ route, navigation }) => {
  const renderSwitch = (modal: string, item: any) => {
    switch (modal) {
      //=== Create Modals ===//
      case 'CreateAccountModal':
        return <CreateAccountModal />;
      case 'CreateContactModal':
        return <CreateContactModal navigation={navigation} account={item} />;
      case 'CreateLocationModal':
        return <CreateLocationModal />;
      case 'CreateMeetingModal':
        return <CreateMeetingModal />;
      case 'CreateAgreementModal':
        return <CreateAgreementModal />;
      case 'CreateOrderModal':
        return <CreateOrderModal />;
      case 'CreateDemoModal':
        return <CreateDemoModal />;
      case 'CreateTruckModal':
        return <CreateTruckModal />;
      case 'CreateRouteModal':
        return <CreateRouteModal />;
      case 'CreateUserModal':
        return <CreateUserModal />;
      case 'CreatePreTripInspectionModal':
        return <CreatePreTripInspectionModal route={item} />;
      case 'CreateGroupModal':
        return <CreateGroupModal />;

      //=== Update Modals ===//
      case 'UpdateAccountModal':
        return <UpdateAccountModal navigation={navigation} account={item} />;
      case 'UpdateContactModal':
        return <UpdateContactModal navigation={navigation} contact={item} />;
      case 'UpdateLocationModal':
        return <UpdateLocationModal location={item} />;
      case 'UpdateMeetingModal': 
        return <UpdateMeetingModal meeting={item} />;
      case 'UpdateAgreementModal':
        return <UpdateAgreementModal />;
      case 'UpdateOrderModal':
        return <UpdateOrderModal order={item} />;
      case 'UpdateDemoModal':
        return <UpdateDemoModal />;
      case 'UpdateRouteModal':
        return <UpdateRouteModal route={item} />;

      //=== Route Modals ===//
      case 'AssignRouteModal':
        return <AssignRouteModal route={item} />;
      case 'AssignDriverModal':
        return <AssignDriverModal id={item} />;
      case 'AssignTruckModal':
        return <AssignTruckModal route={item} />;

      //=== Service Modals ===//
      case 'StartOrderModal':
        return <StartOrderModal order={item} />;
      case 'CompleteOrderModal':
        return <CompleteOrderModal order={item} />;
      case 'UpdateOrderStatusModal':
        return <UpdateOrderStatusModal order={item} />;

      default:
        return null;
    }
  };

  return (
    <View style={styles.overlay}>

      {/* Form Container*/}
      <View style={styles.formContainer}>

        {/* Form */}
        {renderSwitch(route.params.modal, route.params.item)}

      </View>
      
    </View>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  formContainer: {
    width: '100%',
  },
});

export default Modal;