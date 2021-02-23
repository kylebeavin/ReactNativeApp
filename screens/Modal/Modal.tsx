import React from 'react';
import { StyleSheet, View } from 'react-native';

import CreateAccountModal from './Creates/CreateAccountModal';
import UpdateAccountModal from './Updates/UpdateAccountModal';
import CreateContactModal from './Creates/CreateContactModal';
import UpdateContactModal from './Updates/UpdateContactModal';
import CreateLocationModal from './Creates/CreateLocationModal';
import UpdateLocationModal from './Updates/UpdateLocationModal';
import CreateMeetingModal from './Creates/CreateMeetingModal';
import UpdateMeetingModal from './Updates/UpdateMeetingModal';
import CreateAgreementModal from './Creates/CreateAgreementModal';
import CreateDemoModal from './Creates/CreateDemoModal';
import CreateOrderModal from './Creates/CreateOrderModal';
import UpdateAgreementModal from './Updates/UpdateAgreementModal';
import UpdateOrderModal from './Updates/UpdateOrderModal';
import UpdateDemoModal from './Updates/UpdateDemoModal';
import CreateTruckModal from './Creates/CreateTruckModal';
import CreateRouteModal from './Creates/CreateRouteModal';
import CreateDriverModal from './Creates/CreateDriverModal';
import CreatePreTripInspectionModal from './Creates/CreatePreTripInspectionModal';
import CreateGroupModal from './Creates/CreateGroupModal';
import UpdateRouteModal from './Updates/UpdateRouteModal';
import AssignRouteModal from './Routes/AssignRouteModal';

interface Props {
    navigation: any;
    route: any;
}

const Modal: React.FC<Props> = ({ route, navigation }) => {
  const renderSwitch = (modal: string, item: any) => {
    switch (modal) {
      //=== Create Modals ===//
      case "CreateAccountModal":
        return <CreateAccountModal />;
      case "CreateContactModal":
        return <CreateContactModal navigation={navigation} account={item} />;
      case "CreateLocationModal":
        return <CreateLocationModal />;
      case "CreateMeetingModal":
        return <CreateMeetingModal />;
      case "CreateAgreementModal":
        return <CreateAgreementModal />;
      case "CreateOrderModal":
        return <CreateOrderModal />;
      case "CreateDemoModal":
        return <CreateDemoModal />;
      case "CreateTruckModal":
        return <CreateTruckModal />;
      case "CreateRouteModal":
        return <CreateRouteModal />;
      case "CreateDriverModal":
        return <CreateDriverModal />;
      case "CreatePreTripInspectionModal":
        return <CreatePreTripInspectionModal />;
      case "CreateGroupModal":
        return <CreateGroupModal />;

      //=== Update Modals ===//
      case "UpdateAccountModal":
        return <UpdateAccountModal navigation={navigation} account={item} />;
      case "UpdateContactModal":
        return <UpdateContactModal navigation={navigation} contact={item} />;
      case "UpdateLocationModal":
        return <UpdateLocationModal location={item} />;
      case "UpdateMeetingModal": 
        return <UpdateMeetingModal meeting={item} />;
      case "UpdateAgreementModal":
        return <UpdateAgreementModal />;
      case "UpdateOrderModal":
        return <UpdateOrderModal order={item} />;
      case "UpdateDemoModal":
        return <UpdateDemoModal />;
      case "UpdateRouteModal":
        return <UpdateRouteModal route={item} />;

      //=== Route Modals ===//
      case "AssignRouteModal":
        return <AssignRouteModal route={item} />

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
    alignItems: "center",
    justifyContent: "center",
  },
  formContainer: {
    width: "100%",
  },
});

export default Modal;