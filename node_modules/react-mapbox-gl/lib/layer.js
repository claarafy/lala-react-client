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
var React = require("react");
var PropTypes = require('prop-types');
var isEqual = require('deep-equal');
var diff_1 = require("./util/diff");
var uid_1 = require("./util/uid");
var Layer = (function (_super) {
    __extends(Layer, _super);
    function Layer() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.hover = [];
        _this.id = _this.props.id || "layer-" + uid_1.generateID();
        _this.source = __assign({ type: 'geojson' }, _this.props.sourceOptions, { data: {
                type: 'FeatureCollection',
                features: []
            } });
        _this.geometry = function (coordinates) {
            switch (_this.props.type) {
                case 'symbol':
                case 'circle': return {
                    type: 'Point',
                    coordinates: coordinates
                };
                case 'fill': return {
                    type: coordinates.length > 1 ? 'MultiPolygon' : 'Polygon',
                    coordinates: coordinates
                };
                case 'line': return {
                    type: 'LineString',
                    coordinates: coordinates
                };
                default: return {
                    type: 'Point',
                    coordinates: coordinates
                };
            }
        };
        _this.makeFeature = function (props, id) { return ({
            type: 'Feature',
            geometry: _this.geometry(props.coordinates),
            properties: __assign({}, props.properties, { id: id })
        }); };
        _this.onClick = function (evt) {
            var features = evt.features;
            var children = [].concat(_this.props.children);
            var map = _this.context.map;
            if (features) {
                features.forEach(function (feature) {
                    var id = feature.properties.id;
                    if (children) {
                        var child = children[id];
                        var onClick = child && child.props.onClick;
                        if (onClick) {
                            onClick(__assign({}, evt, { feature: feature, map: map }));
                        }
                    }
                });
            }
        };
        _this.onMouseMove = function (evt) {
            var children = [].concat(_this.props.children);
            var map = _this.context.map;
            var oldHover = _this.hover;
            var hover = [];
            var features = map.queryRenderedFeatures(evt.point, { layers: [_this.id] });
            if (features) {
                features.forEach(function (feature) {
                    var id = feature.properties.id;
                    if (children) {
                        var child = children[id];
                        hover.push(id);
                        var onMouseEnter = child && child.props.onMouseEnter;
                        if (onMouseEnter) {
                            onMouseEnter(__assign({}, evt, { feature: feature, map: map }));
                        }
                    }
                });
            }
            oldHover
                .filter(function (prevHoverId) { return hover.indexOf(prevHoverId) === -1; })
                .forEach(function (key) {
                var child = children[key];
                var onMouseLeave = child && child.props.onMouseLeave;
                if (onMouseLeave) {
                    onMouseLeave(__assign({}, evt, { map: map }));
                }
            });
            _this.hover = hover;
        };
        _this.initialize = function () {
            var _a = _this, id = _a.id, source = _a.source;
            var _b = _this.props, type = _b.type, layout = _b.layout, paint = _b.paint, layerOptions = _b.layerOptions, sourceId = _b.sourceId, before = _b.before;
            var map = _this.context.map;
            var layer = __assign({ id: id, source: sourceId || id, type: type,
                layout: layout,
                paint: paint }, layerOptions);
            if (!sourceId) {
                map.addSource(id, source);
            }
            map.addLayer(layer, before);
        };
        _this.onStyleDataChange = function () {
            if (!_this.context.map.getLayer(_this.id)) {
                _this.initialize();
                _this.forceUpdate();
            }
        };
        return _this;
    }
    Layer.prototype.componentWillMount = function () {
        var map = this.context.map;
        this.initialize();
        map.on('click', this.id, this.onClick);
        map.on('mousemove', this.onMouseMove);
        map.on('styledata', this.onStyleDataChange);
    };
    Layer.prototype.componentWillUnmount = function () {
        var map = this.context.map;
        var id = this.id;
        map.removeLayer(id);
        if (!this.props.sourceId) {
            map.removeSource(id);
        }
        map.off('click', this.onClick);
        map.off('mousemove', this.onMouseMove);
        map.off('styledata', this.onStyleDataChange);
    };
    Layer.prototype.componentWillReceiveProps = function (props) {
        var _this = this;
        var _a = this.props, paint = _a.paint, layout = _a.layout, before = _a.before, layerOptions = _a.layerOptions;
        var map = this.context.map;
        if (!isEqual(props.paint, paint)) {
            var paintDiff_1 = diff_1.default(paint, props.paint);
            Object.keys(paintDiff_1).forEach(function (key) {
                map.setPaintProperty(_this.id, key, paintDiff_1[key]);
            });
        }
        if (!isEqual(props.layout, layout)) {
            var layoutDiff_1 = diff_1.default(layout, props.layout);
            Object.keys(layoutDiff_1).forEach(function (key) {
                map.setLayoutProperty(_this.id, key, layoutDiff_1[key]);
            });
        }
        if ((props.layerOptions && layerOptions) && !isEqual(props.layerOptions.filter, layerOptions.filter)) {
            map.setFilter(this.id, props.layerOptions.filter);
        }
        if (before !== props.before) {
            map.moveLayer(this.id, props.before);
        }
    };
    Layer.prototype.render = function () {
        var _this = this;
        var map = this.context.map;
        var sourceId = this.props.sourceId;
        var children = this.props.children;
        if (!children) {
            children = [];
        }
        children = Array.isArray(children) ? children.reduce(function (arr, next) { return arr.concat(next); }, []) : [children];
        var features = children
            .map(function (_a, id) {
            var props = _a.props;
            return _this.makeFeature(props, id);
        })
            .filter(Boolean);
        var source = map.getSource(sourceId || this.id);
        if (source && !sourceId && source.setData) {
            source.setData({
                type: 'FeatureCollection',
                features: features
            });
        }
        return null;
    };
    return Layer;
}(React.Component));
Layer.contextTypes = {
    map: PropTypes.object
};
Layer.defaultProps = {
    type: 'symbol',
    layout: {},
    paint: {}
};
exports.default = Layer;
//# sourceMappingURL=layer.js.map