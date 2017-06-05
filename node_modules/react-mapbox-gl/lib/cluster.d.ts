/// <reference types="react" />
import * as React from 'react';
import * as MapboxGL from 'mapbox-gl';
import { Props as MarkerProps } from './marker';
import * as GeoJSON from 'geojson';
export interface Props {
    ClusterMarkerFactory(coordinates: GeoJSON.Position, pointCount: number): JSX.Element;
    clusterThreshold?: number;
    radius?: number;
    maxZoom?: number;
    minZoom?: number;
    extent?: number;
    nodeSize?: number;
    log?: boolean;
    children?: Array<React.Component<MarkerProps, void>>;
}
export interface State {
    superC: any;
    clusterPoints: any[];
}
export interface Context {
    map: MapboxGL.Map;
}
export default class Cluster extends React.Component<Props, State> {
    context: Context;
    static contextTypes: {
        map: any;
    };
    static defaultProps: {
        clusterThreshold: number;
        radius: number;
        minZoom: number;
        maxZoom: number;
        extent: number;
        nodeSize: number;
        log: boolean;
    };
    state: {
        superC: any;
        clusterPoints: never[];
    };
    componentWillMount(): void;
    private mapChange;
    private feature(coordinates);
    private childrenToFeatures;
    render(): JSX.Element;
}
