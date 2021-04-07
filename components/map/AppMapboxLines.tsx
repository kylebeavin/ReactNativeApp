import MapboxGL from '@react-native-mapbox-gl/maps';
import React from 'react';
import { StyleSheet } from 'react-native';
import Colors from '../../constants/Colors';
import Configs from '../../constants/Configs';
import { MapboxGeometry, MapboxPoint } from '../../types/mapbox';

interface Props {
    geometry: any;
}

const AppMapboxLines: React.FC<Props> = ({geometry}) => {
    
    const lineStyle = {
      lineColor: Colors.SMT_Secondary_2_Light_1,
      lineWidth: 3,
      lineOpacity: 0.84,
    };

    return (
      <>
        <MapboxGL.ShapeSource id="routeSource" shape={geometry}>
          <MapboxGL.LineLayer id="routeFill" style={lineStyle} />
        </MapboxGL.ShapeSource>
      </>
    );
}

AppMapboxLines.defaultProps = {
    geometry: {
        type: "LineString",
        coordinates: []
    }
};

export default AppMapboxLines;