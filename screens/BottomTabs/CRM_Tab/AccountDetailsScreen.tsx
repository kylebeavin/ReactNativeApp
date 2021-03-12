import {useNavigation} from '@react-navigation/native';
import React, {useContext, useEffect, useState} from 'react';
import {
  StyleSheet,
  View,
  ScrollView,
  TouchableOpacity,
  Text,
  Linking,
} from 'react-native';
import AppButton from '../../../components/Layout/AppButton';
import AppEditBtn from '../../../components/Layout/AppEditBtn';
import AppNavBtnGrp from '../../../components/Layout/AppNavBtnGrp';
import AppTitle from '../../../components/Layout/AppTitle';
import Colors from '../../../constants/Colors';
import Configs from '../../../constants/Configs';
import AppContext from '../../../providers/AppContext';
import { ToastContext } from '../../../providers/ToastProvider';
import { Account, Contact } from '../../../types/crm';
import {getDateStringsFromDate} from '../../../utils/Helpers';

interface Props {
  route: any;
}

const AccountDetailsScreen: React.FC<Props> = ({route}) => {
  const item: Account = route.params.item;

  //#region Use State Variables
  const navigation = useNavigation();
  const {grpId, token} = useContext(AppContext);
  const {show} = useContext(ToastContext);
  const [contactsList, setContactsList] = useState<Contact[]>([])

  // Toggles
  const [statusToggle, setStatusToggle] = useState(false);
  const [contactToggle, setContactToggle] = useState(false);
  const [notesToggle, setNotesToggle] = useState(false);
  //#endregion

  useEffect(() => {
    getContactsList();
  }, []);

  const getContactsList = async () => {

    await fetch(`${Configs.TCMC_URI}/api/contactsBy`, {
      method: "POST",
      body: JSON.stringify({account_id: item._id}),
      headers: {"Content-Type": "application/json", "x-access-token": token}
    })
    .then((res) => res.json())
    .then((json) => setContactsList(json.data))
    .catch((err) => show({message: err.message}));
  };

  return (
    <View style={{marginBottom: 50}}>
      <AppTitle title="Account Detail" help search />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.contentContainer}>
        <AppNavBtnGrp>
          <View style={{marginRight: 60, marginTop: 12, paddingLeft: 10}}>
            <AppButton
              title="Back"
              onPress={() => navigation.goBack()}
              outlined={true}
              icon={{type: 'MaterialIcons', name: 'arrow-back'}}
            />
          </View>
          <View style={{paddingTop: 5}}>
            <AppEditBtn item={item} modal="UpdateAccountModal" />
          </View>
        </AppNavBtnGrp>

        <View style={{paddingLeft: 10}}>
          <Text style={{fontWeight: 'bold'}}>{item.account_name}</Text>
          <Text>Group: {item.group_id}</Text>
          <Text>Coords: {item.geo_location}</Text>
          <Text>Email: {item.email}</Text>
          <Text>Stage: {item.stage.toString()}</Text>
          <Text>Owner: {item.owner_name}</Text>
          <Text>Owner Id: {item.owner_id}</Text>
          <Text>Active: {item.is_active ? 'Yes' : 'No'}</Text>
          <Text>Demo: {item.demo ? 'Yes' : 'No'}</Text>
          <Text>National: {item.national ? 'Yes' : 'No'}</Text>
          <Text>Referral: {item.referral ? 'Yes' : 'No'}</Text>
          <Text>Referral Group Id: {item.referral_group_id}</Text>
          <Text>Hauling: {item.hauling_contract ? 'Yes' : 'No'}</Text>
          <Text>Hauling Expiry: {item.hauling_expiration}</Text>
          <Text>Address: {item.address_street}</Text>
          <Text>City: {item.address_city}</Text>
          <Text>State: {item.address_state}</Text>
          <Text>Zip: {item.address_zip}</Text>
          <Text>Conversion: {getDateStringsFromDate(item.conversion).date}</Text>
          <Text>Created On: {getDateStringsFromDate(item.createdAt).date} {getDateStringsFromDate(item.createdAt).time}</Text>
          <Text>Updated On: {getDateStringsFromDate(item.updatedAt).date} {getDateStringsFromDate(item.updatedAt).time}</Text>
        </View>

        <TouchableOpacity onPress={() => setStatusToggle(!statusToggle)}>
          <AppTitle title="Status" />
        </TouchableOpacity>
        {!statusToggle ? null : (
          <View style={{paddingLeft: 10}}>
              <Text>Hello World!</Text>
          </View>
        )}

        <TouchableOpacity onPress={() => setContactToggle(!contactToggle)}>
          <AppTitle title="Contacts" />
        </TouchableOpacity>
        {!contactToggle ? null : (
          <View style={{paddingLeft: 10, paddingTop: 10, alignItems: 'center'}}>
            {contactsList.map((item: Contact) => {
              return (
                <View style={{marginBottom: 10}} key={item._id}>
                  <Text
                    style={styles.link}
                    onPress={() => Linking.openURL(item.first_name)}>
                    {item.first_name}
                  </Text>
                </View>
              );
            })}
          </View>
        )}

        <TouchableOpacity onPress={() => setNotesToggle(!notesToggle)}>
          <AppTitle title="Notes" />
        </TouchableOpacity>
        {!notesToggle ? null : (
          <View style={{paddingLeft: 10}}>
            {item.notes ? item.notes.map((item: string) => {
              return (
                <View key={item}>
                  <Text
                    style={styles.link}
                    onPress={() => null}>
                    {item}
                  </Text>
                </View>
              );
            }): <Text>No Notes</Text>}
          </View>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  contentContainer: {
    // This is the scrollable part
  },
  scrollView: {
    height: '100%',
    width: '100%',
  },
  link: {
    color: Colors.SMT_Secondary_2_Light_1,
  },
  thumbnail: {
    height: 200,
    width: 200,
    borderRadius: 4,
  },
});

export default AccountDetailsScreen;
