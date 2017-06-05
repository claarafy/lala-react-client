/// <reference types="react" />
import * as React from 'react';
import * as MapboxGL from 'mapbox-gl';
import { Sources } from './util/types';
export declare type Paint = any;
export declare type Layout = any;
export interface Props {
    id?: string;
    type?: 'symbol' | 'line' | 'fill' | 'circle' | 'raster';
    sourceId?: string;
    before?: string;
    sourceOptions?: Sources;
    paint?: Paint;
    layout?: Layout;
    layerOptions?: MapboxGL.Layer;
    children?: JSX.Element;
}
export interface Context {
    map: MapboxGL.Map;
}
export default class Layer extends React.Component<Props, void> {
    context: Context;
    static contextTypes: {
        map: any;
    };
    static defaultProps: {
        type: string;
        layout: {};
        paint: {};
    };
    private hover;
    private id;
    private source;
    private geometry;
    private makeFeature;
    private onClick;
    private onMouseMove;
    private initialize;
    private onStyleDataChange;
    componentWillMount(): void;
    componentWillUnmount(): void;
    componentWillReceiveProps(props: Props): void;
    render(): null;
}
