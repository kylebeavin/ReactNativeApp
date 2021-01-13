//import { Ionicons, FontAwesome5 } from '@expo/vector-icons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import React from 'react';
import {StyleSheet, View, Text, ScrollView, TouchableOpacity } from 'react-native';
import Colors from '../../constants/Colors';

interface Props {
    title: string;
    setSettingsMenu: (name: string) => void;
    isVisible?: boolean;
}

const SettingsMenu: React.FC<Props> = (props) => {
    return (
        <ScrollView style={[styles.settingsListContainer, props.isVisible ? {display: 'flex'} : {display: 'none'}]}>
            {/* Title Component */}
            <View style={styles.settingsListTitle}>
                <Text style={styles.settingsListTitleText}>{props.title}</Text>
            </View>

            {/* Settings Router */}
            <View style={styles.settingsItemsContainer} >
                <TouchableOpacity style={styles.settingsItem} onPress={() => props.setSettingsMenu("Account")}>
                    <Ionicons style={styles.settingsItemIcon} name="md-person"/>
                    <Text style={styles.settingsItemText}>Account Settings</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.settingsItem} onPress={() => props.setSettingsMenu("CRM")}>
                    <Ionicons style={styles.settingsItemIcon} name="md-people"/>
                    <Text style={styles.settingsItemText}>CRM Settings</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.settingsItem}>
                    <FontAwesome5 style={styles.settingsItemIcon} name="truck-monster"/>
                    <Text style={styles.settingsItemText}>Service Settings</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.settingsItem}>
                    <FontAwesome5 style={styles.settingsItemIcon} name="map-marked-alt"/>
                    <Text style={styles.settingsItemText}>Route Settings</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.settingsItem}>
                    <FontAwesome5 style={styles.settingsItemIcon} name="file-invoice-dollar"/>
                    <Text style={styles.settingsItemText}>Invoice Settings</Text>
                </TouchableOpacity>
            </View>
        </ScrollView>
    );
}

const setMenu = (name: string) => {
    console.log("on click")
    // props.setSettingsMenu("Account")
}

const styles = StyleSheet.create({
    settingsListContainer: {
        flex: 1,
    },

    //===== Title Component =====
    settingsListTitle: {
        borderBottomWidth: 3,
        borderBottomColor: Colors.TCMC_LightGray,
    },
    settingsListTitleText: {
        marginLeft: 20,
        fontSize: 20,
        fontWeight: "bold",
        marginBottom: 10,

    },
    //===== Title Component =====

    //===== Settings Items ======
    settingsItemsContainer: {
        flex: 1,
        // borderBottomColor: Colors.TCMC_LightGray,
        // borderBottomWidth: 3,
    },
    settingsItem: {
        flex: 1,
        flexDirection: 'row',
        paddingVertical: 10, 
        borderBottomColor: Colors.TCMC_LightGray,
        borderBottomWidth: 3,
    },
    settingsItemIcon: {
        marginHorizontal: 50,
        fontSize: 40,
        color: Colors.Secondary,
    },
    settingsItemText: {
        fontSize: 20,
        textAlignVertical: 'center',
    },
    //===== Settings Items ====== 
})

export default SettingsMenu;