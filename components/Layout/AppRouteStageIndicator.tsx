import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Colors from '../../constants/Colors';
import { Route } from '../../types/routes';

interface Props {
    route: Route;
}
const AppRouteStageIndicator: React.FC<Props> = ({route}) => {

    const [built, setBuilt] = useState(false);
    const [routed, setRouted] = useState(false);
    const [assigned, setAssigned] = useState(false);
    const [inspected, setInspected] = useState(false);
    const [finalized, setFinalized] = useState(false);
    const [completed, setCompleted] = useState(false);

    useEffect(() => {
        setStage();
    }, []);

    const setStage = () => {
        console.log(route.inspection_id)
        // ToDo: This business logic will need reviewed multiple times as we define what the route promotion actually consists of.
        if (route.service_stop.length > 0 || route.route_stage === "Finalized" || route.route_stage === "Completed") setBuilt(true);
        if (route.service_stop.length > 0 || route.route_stage === "Routed" || route.route_stage === "Finalized" || route.route_stage === "Completed") setRouted(true);
        if (route.driver.length > 0 && route.truck_id.length > 0 || route.route_stage === "Finalized" || route.route_stage === "Completed") setAssigned(true);
        if (route.inspection_id != null || route.route_stage === "Finalized" || route.route_stage === "Completed") setInspected(true);
        if (route.route_stage === "Finalized" || route.route_stage === "Completed") setFinalized(true);
        if (route.route_stage === "Completed") setCompleted(true);
    };

    return (
      <View style={styles.container}>
        <Text style={styles.routeStage}>{route.route_stage}</Text>

        <View style={styles.row}>
          {/* Built */}
          <MaterialIcons
            style={built ? {color: 'limegreen'} : null}
            name="assignment"
            size={24}
            color={Colors.SMT_Secondary_1}
          />
          {/* Routed */}
          <MaterialIcons
            style={routed ? {color: 'limegreen'} : null}
            name="assignment-return"
            size={24}
            color={Colors.SMT_Secondary_1}
          />
          {/* Assigned */}
          <MaterialIcons
            style={assigned ? {color: 'limegreen'} : null}
            name="assignment-ind"
            size={24}
            color={Colors.SMT_Secondary_1}
          />
          {/* Inspected */}
          <MaterialCommunityIcons
            style={inspected ? {color: 'limegreen'} : null}
            name="clipboard-pulse"
            size={24}
            color={Colors.SMT_Secondary_1}
          />
          {/* Finalized */}
          <MaterialIcons
            style={finalized ? {color: 'limegreen'} : null}
            name="assignment-returned"
            size={24}
            color={Colors.SMT_Secondary_1}
          />
          {/* Completed */}
          <MaterialIcons
            style={completed ? {color: 'limegreen'} : null}
            name="assignment-turned-in"
            size={24}
            color={Colors.SMT_Secondary_1}
          />
        </View>
      </View>
    );
}

const styles = StyleSheet.create({
    container: {
        borderWidth: 3,
        borderColor: Colors.SMT_Secondary_1_Light_1,
        borderRadius: 2,
        marginBottom: 5,
        marginTop: 5,
        padding: 5,
        alignSelf: 'flex-start',
    },
    row: {
        flexDirection: 'row',
    },
    routeStage: {
        position: 'absolute',
        top: -10,
        left: 5,
        backgroundColor: 'white',
        fontSize: 10,
    },
})

export default AppRouteStageIndicator;