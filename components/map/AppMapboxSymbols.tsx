import MapboxGL from '@react-native-mapbox-gl/maps';
import React from 'react';
import { StyleSheet } from 'react-native';

interface Props {
    coordinates: any;
}

const AppMapboxSymbols: React.FC<Props> = ({coordinates}) => {

    const arrowStyles: any = {
        iconImage: require('../../assets/images/arrow2.png'),
        iconAllowOverlap: true,
        symbolPlacement: 'line',
    }

    return (
        <MapboxGL.ShapeSource id="routeSource" shape={coordinates}>
        <MapboxGL.SymbolLayer
          id="arrows"
          style={arrowStyles}
          minZoomLevel={1}
          aboveLayerID="routeFill"
        />
      </MapboxGL.ShapeSource>
    );
}

export default AppMapboxSymbols;