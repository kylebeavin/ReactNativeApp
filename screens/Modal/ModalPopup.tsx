import React, {
  Dispatch,
  SetStateAction,
  useContext,
  useEffect,
  useState,
} from 'react';
import {
  StyleSheet,
  View,
  ScrollView,
  Text,
  TouchableOpacity,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import Layout from '../../constants/Layout';
import Colors from '../../constants/Colors';
import AppTitle from '../../components/layout/AppTitle';
import UpdateOrderStatusModal from './orders/UpdateOrderStatusModal';
import CreateAccountModal from './creates/CreateAccountModal';
import CreateAgreementModal from './creates/CreateAgreementModal';
import CreateContactModal from './creates/CreateContactModal';
import CreateDemoModal from './creates/CreateDemoModal';
import CreateGroupModal from './creates/CreateGroupModal';
import CreateLocationModal from './creates/CreateLocationModal';
import CreateMeetingModal from './creates/CreateMeetingModal';
import CreateOrderModal from './creates/CreateOrderModal';
import CreatePreTripInspectionModal from './creates/CreatePreTripInspectionModal';
import CreateRouteModal from './creates/CreateRouteModal';
import CreateTruckModal from './creates/CreateTruckModal';
import CreateUserModal from './creates/CreateUserModal';
import CompleteOrderModal from './orders/CompleteOrderModal';
import StartOrderModal from './orders/StartOrderModal';
import AssignDriverModal from './routes/AssignDriverModal';
import AssignRouteModal from './routes/AssignRouteModal';
import AssignTruckModal from './routes/AssignTruckModal';
import UpdateAccountModal from './updates/UpdateAccountModal';
import UpdateAgreementModal from './updates/UpdateAgreementModal';
import UpdateContactModal from './updates/UpdateContactModal';
import UpdateDemoModal from './updates/UpdateDemoModal';
import UpdateLocationModal from './updates/UpdateLocationModal';
import UpdateMeetingModal from './updates/UpdateMeetingModal';
import UpdateOrderModal from './updates/UpdateOrderModal';
import UpdateRouteModal from './updates/UpdateRouteModal';

interface Props {
  modals: string[];
}

const ModalPopup: React.FC<Props> = ({modals}) => {
  const navigation = useNavigation();
  const [showModal, setShowModal] = useState(false);
  const [modal, setModal] = useState('');

  const renderSwitch = (item: any) => {
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
    <>
      {!showModal ? (
        <ScrollView style={styles.form}>
          <AppTitle title="Add New" />
          <View style={{paddingTop: 10, paddingHorizontal: 10}}>
            {modals &&
              modals.map((u: any, i) => {
                return (
                  <TouchableOpacity
                    style={styles.card}
                    key={u}
                    onPress={() => {
                      setModal(u);
                      setShowModal(true);
                    }}>
                    <View style={{flexDirection: 'row'}}>
                      <View style={{flex: 1}}>
                        <Text numberOfLines={1} style={styles.titleText}>
                          {u}
                        </Text>
                        <Text numberOfLines={1} style={styles.titleText}>
                          {u.name}
                        </Text>
                      </View>
                    </View>
                  </TouchableOpacity>
                );
              })}
          </View>
        </ScrollView>
      ) : (
        renderSwitch(null)
      )}
    </>
  );
};

const styles = StyleSheet.create({
  form: {
    maxHeight: Layout.window.height / 1.5,
    marginBottom: 20,
    borderRadius: 4,
    backgroundColor: Colors.SMT_Tertiary_1,
  },
  //=== Card ===//
  card: {
    backgroundColor: Colors.SMT_Tertiary_1,
    marginBottom: 3,
    borderWidth: 1,
    borderColor: Colors.SMT_Secondary_1_Light_1,
    borderRadius: 3,
    paddingVertical: 3,
    paddingHorizontal: 5,
  },
  title: {
    marginBottom: 10,
  },
  titleText: {
    fontWeight: 'bold',
  },
});

export default ModalPopup;
