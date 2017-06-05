"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
var MapboxGl = require("mapbox-gl");
var React = require("react");
var PropTypes = require('prop-types');
var isEqual = require('deep-equal');
var events = {
    onResize: 'resize',
    onDblClick: 'dblclick',
    onClick: 'click',
    onMouseMove: 'mousemove',
    onMoveStart: 'mousestart',
    onMove: 'move',
    onMoveEnd: 'moveend',
    onMouseUp: 'mouseup',
    onDragStart: 'dragstart',
    onDrag: 'drag',
    onDragEnd: 'dragend',
    onZoomStart: 'zoomstart',
    onZoom: 'zoom',
    onZoomEnd: 'zoomend',
    onPitch: 'pitch',
    onPitchStart: 'pitchstart',
    onPitchEnd: 'pitchend'
};
var defaultZoom = [11];
var defaultMovingMethod = 'flyTo';
var defaultCenter = [-0.2416815, 51.5285582];
var ReactMapboxGl = (function (_super) {
    __extends(ReactMapboxGl, _super);
    function ReactMapboxGl() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.state = {
            map: undefined
        };
        _this.getChildContext = function () { return ({
            map: _this.state.map
        }); };
        _this.calcCenter = function (bounds) { return ([(bounds[0][0] + bounds[1][0]) / 2, (bounds[0][1] + bounds[1][1]) / 2]); };
        _this.setRef = function (x) {
            _this.container = x;
        };
        return _this;
    }
    ReactMapboxGl.prototype.componentDidMount = function () {
        var _this = this;
        var _a = this.props, style = _a.style, hash = _a.hash, preserveDrawingBuffer = _a.preserveDrawingBuffer, accessToken = _a.accessToken, onStyleLoad = _a.onStyleLoad, center = _a.center, pitch = _a.pitch, zoom = _a.zoom, minZoom = _a.minZoom, maxZoom = _a.maxZoom, maxBounds = _a.maxBounds, fitBounds = _a.fitBounds, fitBoundsOptions = _a.fitBoundsOptions, bearing = _a.bearing, scrollZoom = _a.scrollZoom, attributionControl = _a.attributionControl, logoPosition = _a.logoPosition, interactive = _a.interactive, dragRotate = _a.dragRotate, renderWorldCopies = _a.renderWorldCopies;
        MapboxGl.accessToken = accessToken;
        var opts = {
            preserveDrawingBuffer: preserveDrawingBuffer,
            hash: hash,
            zoom: zoom ? zoom[0] : defaultZoom[0],
            minZoom: minZoom,
            maxZoom: maxZoom,
            maxBounds: maxBounds,
            bearing: bearing,
            container: this.container,
            center: fitBounds && center === defaultCenter ? this.calcCenter(fitBounds) : center,
            pitch: pitch,
            style: style,
            scrollZoom: scrollZoom,
            attributionControl: attributionControl,
            interactive: interactive,
            dragRotate: dragRotate,
            renderWorldCopies: renderWorldCopies
        };
        var map = new MapboxGl.Map(__assign({}, opts, { logoPosition: logoPosition }));
        if (fitBounds) {
            map.fitBounds(fitBounds, fitBoundsOptions);
        }
        map.on('load', function (evt) {
            _this.setState({ map: map });
            if (onStyleLoad) {
                onStyleLoad(map, evt);
            }
        });
        Object.keys(events).forEach(function (event, index) {
            var propEvent = _this.props[event];
            if (propEvent) {
                map.on(events[event], function (evt) {
                    propEvent(map, evt);
                });
            }
        });
    };
    ReactMapboxGl.prototype.componentWillUnmount = function () {
        var map = this.state.map;
        if (map) {
            map.off();
            setTimeout(function () {
                map.remove();
            });
        }
    };
    ReactMapboxGl.prototype.componentWillReceiveProps = function (nextProps) {
        var map = this.state.map;
        if (!map) {
            return null;
        }
        var center = map.getCenter();
        var zoom = map.getZoom();
        var bearing = map.getBearing();
        var pitch = map.getPitch();
        var didZoomUpdate = (this.props.zoom !== nextProps.zoom &&
            (nextProps.zoom && nextProps.zoom[0]) !== zoom);
        var didCenterUpdate = (this.props.center !== nextProps.center &&
            ((nextProps.center && nextProps.center[0]) !== center.lng ||
                (nextProps.center && nextProps.center[1]) !== center.lat));
        var didBearingUpdate = (this.props.bearing !== nextProps.bearing &&
            nextProps.bearing !== bearing);
        var didPitchUpdate = (this.props.pitch !== nextProps.pitch &&
            nextProps.pitch !== pitch);
        if (nextProps.fitBounds) {
            var fitBounds = this.props.fitBounds;
            var didFitBoundsUpdate = (fitBounds !== nextProps.fitBounds ||
                nextProps.fitBounds.length !== (fitBounds && fitBounds.length) ||
                !!fitBounds.filter(function (c, i) {
                    var nc = nextProps.fitBounds && nextProps.fitBounds[i];
                    return c[0] !== (nc && nc[0]) || c[1] !== (nc && nc[1]);
                })[0]);
            if (didFitBoundsUpdate) {
                map.fitBounds(nextProps.fitBounds, nextProps.fitBoundsOptions);
            }
        }
        if (didZoomUpdate || didCenterUpdate || didBearingUpdate || didPitchUpdate) {
            var mm = this.props.movingMethod || defaultMovingMethod;
            map[mm]({
                zoom: (didZoomUpdate && nextProps.zoom) ? nextProps.zoom[0] : zoom,
                center: didCenterUpdate ? nextProps.center : center,
                bearing: didBearingUpdate ? nextProps.bearing : bearing,
                pitch: didPitchUpdate ? nextProps.pitch : pitch
            });
        }
        if (!isEqual(this.props.style, nextProps.style)) {
            map.setStyle(nextProps.style);
        }
        return null;
    };
    ReactMapboxGl.prototype.render = function () {
        var _a = this.props, containerStyle = _a.containerStyle, children = _a.children;
        var map = this.state.map;
        return (React.createElement("div", { ref: this.setRef, style: containerStyle }, map && children));
    };
    return ReactMapboxGl;
}(React.Component));
ReactMapboxGl.defaultProps = {
    hash: false,
    onStyleLoad: function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        return args;
    },
    preserveDrawingBuffer: false,
    center: defaultCenter,
    zoom: defaultZoom,
    minZoom: 0,
    maxZoom: 20,
    bearing: 0,
    scrollZoom: true,
    movingMethod: defaultMovingMethod,
    pitch: 0,
    logoPosition: 'bottom-left',
    interactive: true,
    dragRotate: true,
    renderWorldCopies: true
};
ReactMapboxGl.childContextTypes = {
    map: PropTypes.object
};
exports.default = ReactMapboxGl;
//# sourceMappingURL=map.js.map