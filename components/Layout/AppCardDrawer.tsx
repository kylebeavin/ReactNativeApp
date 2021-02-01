import React from 'react';
import { View,StyleSheet,Text, Linking } from 'react-native';
import Colors from '../../constants/Colors';
import { Account, Contact } from '../../types/crm';
import AppAddNew from './AppAddNew';
import AppButton from './AppButton';

interface Props {
    navigation: any;
    isVisible: boolean;
    contacts: Contact[];
    account: Account;
}

const AppCardDrawer: React.FC<Props> = ({navigation, isVisible, contacts, account}) => {

  const openMailTo = (email: string) => {
    Linking.canOpenURL("mailto:").then(data => data ? Linking.openURL(`mailto:${email}`): null);
  };

  const openPhoneTo = (phone: string) => {
    Linking.canOpenURL("tel:").then(data => data ? Linking.openURL(`tel:${phone}`): null);
  };

  const getContactsList = () => {
    if (contacts.length > 0) {
    return contacts.map((item, index) => (
      <View style={styles.contactCard} key={item._id}>
        <View>
          <Text style={{ fontWeight: "bold" }}>{item.first_name}</Text>
          <Text>Role Here</Text>
        </View>
        <View style={styles.buttonContainer}>
          <View style={styles.contactButton}>
            <AppButton icon={{type: "MaterialCommunityIcons", name: "pencil"}} onPress={() => navigation.navigate("Modal", {modal: "UpdateContactModal", item})} backgroundColor={Colors.SMT_Secondary_2} outlined />
          </View>
          <View style={styles.contactButton}>
            <AppButton icon={{type: "MaterialCommunityIcons", name: "email"}} onPress={() => openMailTo(item.email)} backgroundColor={Colors.SMT_Secondary_2} />
          </View>
          <View style={styles.contactButton}>
            <AppButton icon={{type: "MaterialCommunityIcons", name: "phone"}} onPress={() => openPhoneTo(item.phone)} backgroundColor={Colors.SMT_Secondary_2} />
          </View>
        </View>
      </View>
    ));
    }
  };

  return (
    <View style={styles.drawerMargin}>
      <View style={isVisible ? styles.drawerContainer : { display: "none" }}>
        {isVisible ? getContactsList() : null}
        
        {/* ToDo: Need to be able to pass in optional id's something like - optionalIds={{accountId: accountId}} */}
        {isVisible ? <AppAddNew title="CONTACT" modal="CreateContactModal" item={account} backgroundColor={Colors.SMT_Secondary_2_Light_1}/> : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
    drawerMargin: {
        marginBottom: 10,
    },
    drawerContainer: {
        position: 'relative',
        top: -2,
        flex: 1,
        justifyContent: 'center',
        alignSelf: 'center',
        width: '99%',
        marginBottom: 10,
        paddingTop: 10,
        paddingHorizontal: 10,
        backgroundColor: Colors.SMT_Secondary_2_Light_2,
        borderRadius: 3,
        borderWidth: 2,
        borderColor: Colors.SMT_Secondary_2_Light_1,
        borderTopWidth: 0,
        zIndex: 1,
    },
    contactCard: {
        flexDirection: "row",
        backgroundColor: Colors.SMT_Tertiary_1,
        marginBottom: 10,
        borderWidth: 1,
        borderColor: Colors.SMT_Secondary_2_Light_1,
        borderRadius: 3,
        padding: 5,
    },
    contactButton: {
      marginLeft: 10,
    },
    buttonContainer: {
        flex: 1,
        flexDirection: "row",
        justifyContent: "flex-end",
    }
})

export default AppCardDrawer;