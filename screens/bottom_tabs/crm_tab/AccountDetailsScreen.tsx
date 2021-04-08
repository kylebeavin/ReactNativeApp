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
import AppAddNew from '../../../components/layout/AppAddNew';
import AppButton from '../../../components/layout/AppButton';
import AppEditBtn from '../../../components/layout/AppEditBtn';
import AppNavBtnGrp from '../../../components/layout/AppNavBtnGrp';
import AppTitle from '../../../components/layout/AppTitle';
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
  const model: Account = route.params.model;

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
      method: 'POST',
      body: JSON.stringify({account_id: model._id}),
      headers: {'Content-Type': 'application/json', 'x-access-token': token}
    })
    .then((res) => res.json())
    .then((json) => setContactsList(json.data))
    .catch((err) => show({message: err.message}));
  };

  return (
    <View style={{marginBottom: 50}}>
      <AppTitle title='Account Detail' />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.contentContainer}>
        <AppNavBtnGrp>
          <View style={{marginRight: 60, marginTop: 12, paddingLeft: 10}}>
            <AppButton
              title='Back'
              onPress={() => navigation.goBack()}
              outlined={true}
              icon={{type: 'MaterialIcons', name: 'arrow-back'}}
            />
          </View>
          <View style={{paddingTop: 5}}>
            <AppEditBtn item={model} modal='UpdateAccountModal' />
          </View>
        </AppNavBtnGrp>

        <View style={{paddingLeft: 10}}>
          <Text style={{fontWeight: 'bold'}}>{model.account_name}</Text>
          <Text>Group: {model.group_id}</Text>
          <Text>Coords: {model.geo_location}</Text>
          <Text>Email: {model.email}</Text>
          <Text>Stage: {model.stage.toString()}</Text>
          <Text>Owner: {model.owner_name}</Text>
          <Text>Owner Id: {model.owner_id}</Text>
          <Text>Active: {model.is_active ? 'Yes' : 'No'}</Text>
          <Text>Demo: {model.demo ? 'Yes' : 'No'}</Text>
          <Text>National: {model.national ? 'Yes' : 'No'}</Text>
          <Text>Referral: {model.referral ? 'Yes' : 'No'}</Text>
          <Text>Referral Group Id: {model.referral_group_id}</Text>
          <Text>Hauling: {model.hauling_contract ? 'Yes' : 'No'}</Text>
          <Text>Hauling Expiry: {model.hauling_expiration}</Text>
          <Text>Address: {model.address_street}</Text>
          <Text>City: {model.address_city}</Text>
          <Text>State: {model.address_state}</Text>
          <Text>Zip: {model.address_zip}</Text>
          <Text>Conversion: {getDateStringsFromDate(model.conversion).date}</Text>
          <Text>Created On: {getDateStringsFromDate(model.createdAt).date} {getDateStringsFromDate(model.createdAt).time}</Text>
          <Text>Updated On: {getDateStringsFromDate(model.updatedAt).date} {getDateStringsFromDate(model.updatedAt).time}</Text>
        </View>

        <TouchableOpacity onPress={() => setStatusToggle(!statusToggle)}>
          <AppTitle title='Status' />
        </TouchableOpacity>
        {!statusToggle ? null : (
          <View style={{paddingLeft: 10}}>
              <Text>Hello World!</Text>
          </View>
        )}

        <TouchableOpacity onPress={() => setContactToggle(!contactToggle)}>
          <AppTitle title='Contacts' />
        </TouchableOpacity>
        {!contactToggle ? null : (
          <View style={{paddingLeft: 10, paddingTop: 10, alignItems: 'center'}}>
            <AppAddNew title='CONTACT' modal='CreateContactModal' />
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
          <AppTitle title='Notes' />
        </TouchableOpacity>
        {!notesToggle ? null : (
          <View style={{paddingLeft: 10}}>
            {model.notes ? model.notes.map((item: string) => {
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
