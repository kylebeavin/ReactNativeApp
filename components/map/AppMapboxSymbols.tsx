import MapboxGL from '@react-native-mapbox-gl/maps';
import React from 'react';
import { StyleSheet } from 'react-native';

interface Props {
    coordinates: GeoJSON.Geometry;
}

const AppMapboxSymbols: React.FC<Props> = ({coordinates}) => {
    return (
        <MapboxGL.ShapeSource id="routeSource" shape={coordinates}>
        <MapboxGL.SymbolLayer
          id="arrows"
          style={styles.arrows}
          minZoomLevel={1}
          aboveLayerID="routeFill"
        />
      </MapboxGL.ShapeSource>
    );
}

const styles = StyleSheet.create<any>({
    arrows: {
        iconImage: require('../../assets/images/arrow2.png'),
        iconAllowOverlap: true,
        symbolPlacement: 'line',
    }
})

export default AppMapboxSymbols;