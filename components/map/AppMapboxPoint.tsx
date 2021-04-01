import MapboxGL from '@react-native-mapbox-gl/maps';
import React from 'react';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Colors from '../../constants/Colors';
import { MapboxPoint } from '../../types/mapbox';

interface Props {
    id: string;
    point: MapboxPoint;
    color?: string;
    size?: number
}

const AppMapboxPoint: React.FC<Props> = ({id, color, point, size}) => {
    return (
        <MapboxGL.PointAnnotation
          id={id}
          coordinate={point}>
          <FontAwesome name="map-marker" size={size} color={color} />
        </MapboxGL.PointAnnotation>
    );
}

AppMapboxPoint.defaultProps = {
    color: Colors.SMT_Primary_1,
    size: 30,
};

export default AppMapboxPoint;