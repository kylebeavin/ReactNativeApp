import React from 'react';
import { StyleSheet, View} from 'react-native';

import Colors from '../../constants/Colors';
import AppButton from '../Layout/AppButton';

interface Props {
    text: string;
}

const CenterHeader: React.FC<Props> = (props) => {
    return (
        <View style={styles.container}>
            <AppButton title="Franchise Name" backgroundColor={Colors.SMT_Primary_1} onPress={() => console.log("Franchise")} />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        height: "100%",
        width: "100%",
        marginTop: 5,
        paddingHorizontal: 20,
        justifyContent: "center",
    },
});

export default CenterHeader;