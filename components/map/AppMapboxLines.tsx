import MapboxGL from '@react-native-mapbox-gl/maps';
import React from 'react';
import { StyleSheet } from 'react-native';
import Colors from '../../constants/Colors';
import Configs from '../../constants/Configs';
import { MapboxGeometry, MapboxPoint } from '../../types/mapbox';

interface Props {
    coordinates: GeoJSON.Geometry;
}

const AppMapboxLines: React.FC<Props> = ({coordinates}) => {

    return (
        <MapboxGL.ShapeSource id="routeSource" shape={coordinates}>
        <MapboxGL.LineLayer id="routeFill" style={styles.route} />
      </MapboxGL.ShapeSource>
    );
}

const styles = StyleSheet.create<any>({
    route: {
        lineColor: Colors.SMT_Secondary_2_Light_1,
        lineWidth: 3,
        lineOpacity: 0.84
    }
});

export default AppMapboxLines;