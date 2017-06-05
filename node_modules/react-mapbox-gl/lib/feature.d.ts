/// <reference types="react" />
import { Component } from 'react';
import * as GeoJSON from 'geojson';
export interface Props {
    coordinates: GeoJSON.Position;
    properties?: any;
    onClick?: React.MouseEventHandler<HTMLElement>;
    onMouseEnter?: React.MouseEventHandler<HTMLElement>;
    onMouseLeave?: React.MouseEventHandler<HTMLElement>;
}
declare class Feature extends Component<Props, void> {
    render(): null;
}
export default Feature;
