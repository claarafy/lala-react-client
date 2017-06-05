/// <reference types="react" />
import * as MapboxGl from 'mapbox-gl';
import * as React from 'react';
export declare type MapEvent = (map: MapboxGl.Map, evt: React.SyntheticEvent<any>) => void;
export interface Events {
    onStyleLoad?: MapEvent;
    onResize?: MapEvent;
    onDblClick?: MapEvent;
    onClick?: MapEvent;
    onMouseMove?: MapEvent;
    onMoveStart?: MapEvent;
    onMove?: MapEvent;
    onMoveEnd?: MapEvent;
    onMouseUp?: MapEvent;
    onDragStart?: MapEvent;
    onDragEnd?: MapEvent;
    onDrag?: MapEvent;
    onZoomStart?: MapEvent;
    onZoom?: MapEvent;
    onZoomEnd?: MapEvent;
    onPitch?: MapEvent;
    onPitchStart?: MapEvent;
    onPitchEnd?: MapEvent;
}
export interface FitBoundsOptions {
    linear?: boolean;
    easing?: (time: number) => number;
    padding?: number;
    offset?: MapboxGl.Point | number[];
    maxZoom?: number;
}
export declare type FitBounds = number[][];
export interface Props {
    style: string | MapboxGl.Style;
    accessToken: string;
    center?: number[];
    zoom?: number[];
    minZoom?: number;
    maxZoom?: number;
    maxBounds?: MapboxGl.LngLatBounds | FitBounds;
    fitBounds?: FitBounds;
    fitBoundsOptions?: FitBoundsOptions;
    bearing?: number;
    pitch?: number;
    containerStyle?: React.CSSProperties;
    hash?: boolean;
    preserveDrawingBuffer?: boolean;
    scrollZoom?: boolean;
    interactive?: boolean;
    dragRotate?: boolean;
    movingMethod?: 'jumpTo' | 'easeTo' | 'flyTo';
    attributionControl?: boolean;
    logoPosition?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
    children?: JSX.Element;
    renderWorldCopies?: boolean;
}
export interface State {
    map?: MapboxGl.Map;
}
export default class ReactMapboxGl extends React.Component<Props & Events, State> {
    static defaultProps: {
        hash: boolean;
        onStyleLoad: (...args: any[]) => any[];
        preserveDrawingBuffer: boolean;
        center: number[];
        zoom: number[];
        minZoom: number;
        maxZoom: number;
        bearing: number;
        scrollZoom: boolean;
        movingMethod: string;
        pitch: number;
        logoPosition: string;
        interactive: boolean;
        dragRotate: boolean;
        renderWorldCopies: boolean;
    };
    static childContextTypes: {
        map: any;
    };
    state: {
        map: undefined;
    };
    getChildContext: () => {
        map: undefined;
    };
    private container;
    private calcCenter;
    componentDidMount(): void;
    componentWillUnmount(): void;
    componentWillReceiveProps(nextProps: Props): null;
    private setRef;
    render(): JSX.Element;
}
