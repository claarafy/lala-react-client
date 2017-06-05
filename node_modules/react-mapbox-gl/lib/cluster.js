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
Object.defineProperty(exports, "__esModule", { value: true });
var React = require("react");
var PropTypes = require('prop-types');
var supercluster = require('supercluster');
var bbox = require("@turf/bbox");
var helpers_1 = require("@turf/helpers");
var Cluster = (function (_super) {
    __extends(Cluster, _super);
    function Cluster() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.state = {
            superC: supercluster({
                radius: _this.props.radius,
                maxZoom: _this.props.maxZoom,
                minZoom: _this.props.minZoom,
                extent: _this.props.extent,
                nodeSize: _this.props.nodeSize,
                log: _this.props.log
            }),
            clusterPoints: []
        };
        _this.mapChange = function () {
            var map = _this.context.map;
            var _a = _this.state, superC = _a.superC, clusterPoints = _a.clusterPoints;
            var zoom = map.getZoom();
            var canvas = map.getCanvas();
            var w = canvas.width;
            var h = canvas.height;
            var upLeft = map.unproject([0, 0]).toArray();
            var upRight = map.unproject([w, 0]).toArray();
            var downRight = map.unproject([w, h]).toArray();
            var downLeft = map.unproject([0, h]).toArray();
            var newPoints = superC.getClusters(bbox(helpers_1.polygon([[upLeft, upRight, downRight, downLeft, upLeft]])), Math.round(zoom));
            if (newPoints.length !== clusterPoints.length) {
                _this.setState({ clusterPoints: newPoints });
            }
        };
        _this.childrenToFeatures = function (children) { return (children.map(function (child) { return _this.feature(child && child.props.coordinates); })); };
        return _this;
    }
    Cluster.prototype.componentWillMount = function () {
        var map = this.context.map;
        var superC = this.state.superC;
        var children = this.props.children;
        if (children) {
            var features = this.childrenToFeatures(children);
            superC.load(features);
        }
        map.on('move', this.mapChange);
        map.on('zoom', this.mapChange);
        this.mapChange();
    };
    Cluster.prototype.feature = function (coordinates) {
        return {
            type: 'Feature',
            geometry: {
                type: 'point',
                coordinates: coordinates
            },
            properties: {
                point_count: 1
            }
        };
    };
    Cluster.prototype.render = function () {
        var _a = this.props, children = _a.children, ClusterMarkerFactory = _a.ClusterMarkerFactory, clusterThreshold = _a.clusterThreshold;
        var clusterPoints = this.state.clusterPoints;
        if (clusterThreshold !== undefined && (clusterPoints.length <= clusterThreshold)) {
            return (React.createElement("div", null, children));
        }
        return (React.createElement("div", null, clusterPoints.map(function (_a) {
            var geometry = _a.geometry, properties = _a.properties;
            return (ClusterMarkerFactory(geometry.coordinates, properties.point_count));
        })));
    };
    return Cluster;
}(React.Component));
Cluster.contextTypes = {
    map: PropTypes.object
};
Cluster.defaultProps = {
    clusterThreshold: 1,
    radius: 60,
    minZoom: 0,
    maxZoom: 16,
    extent: 512,
    nodeSize: 64,
    log: false
};
exports.default = Cluster;
//# sourceMappingURL=cluster.js.map