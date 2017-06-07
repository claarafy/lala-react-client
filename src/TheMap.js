//Map component
import React, {Component} from 'react'
import mapboxgl from 'mapbox-gl'
import './App.css'
import ReactMapboxGl, {Source, Layer, Feature, GeoJSONLayer, Popup, Marker} from "react-mapbox-gl"
import clientAuth from './clientAuth.js'
import parkingsConnect from './parkingsConnect.js'
import maki from 'maki'

class TheMap extends Component {
/////////////////////////////////////////////////CONSTRUCTOR
  constructor() {
    super()
    this.state = {
      parkings: []
    }
  }
/////////////////////////////////////////////////LIFECYCLE
  componentDidMount() {
    parkingsConnect.getParkings().then((res) => {
      this.setState({
        parkings: res.data
      })
    })
  }
/////////////////////////////////////////////////CUSTOM FUNCTIONS
  _showPopup() {
    console.log("show popup?")
  }
/////////////////////////////////////////////////RENDER
  render() {
    console.log(this.state.parkings)
    const streetLines = this.state.parkings.map((parking, i) => {
      var start = parking.startCoordinates
      var end = parking.endCoordinates
      var lineColor = "#00FFFF"
      if (parking.noParking == true) {
        lineColor = "#DC143C"
      }
      return (
          <GeoJSONLayer
          key = {i}
          data={{
                "type": "Feature",
                "properties": {
                  "description": "Street Park!"
                },
                "geometry":{
                  "type":"LineString",
                  "coordinates": [
                    start,
                    end
                  ]
                }
              }}
          lineLayout= {{ "line-cap": "round", "line-join": "round" }}
          linePaint={{ "line-color": lineColor, "line-width": 3 }}
          />
      )
    })

    return (
      <div id="map">
        <ReactMapboxGl
          style="mapbox://styles/mapbox/light-v9"
          accessToken="pk.eyJ1IjoiY2xhYXJhZnkiLCJhIjoiY2ozZ2RjZHo1MDA0bjMzanl3eTdrbTV6bSJ9.gX0zPVpXPIFQYzrexV8XoA"
          containerStyle={{
            height: "90vh",
            width: "100vw"
          }}
          center={[-118.495196, 34.012806]}>
        {streetLines}
        {/* <GeoJSONLayer
          data={{
                "type": "Feature",
                "properties": {},
                "geometry":{
                  "type":"LineString",
                  "coordinates": [
                    [-118.495537,34.013633],
                    [-118.493619,34.015078]
                  ]
                }
              }}
          lineLayout= {{ "line-cap": "round", "line-join": "round" }}
          linePaint={{ "line-color": "#00FFFF", "line-width": 2 }}
        /> */}
        <Marker
          coordinates={[-118.495196, 34.012806]}
          anchor="bottom"
          onClick = {this._showPopup.bind(this)}
          >
        </Marker>

        {/* <Layer
          type="symbol"
          id="marker"
          layout={{ "icon-image": "marker-15" }}>
          <Feature coordinates={[-118.495196, 34.012806]}/>
        </Layer>

        <Layer
          type="symbol"
          id="marker-2"
          layout={{ "icon-image": "marker-15" }}>
          <Feature coordinates={[-118.495537,34.013633]}/>
        </Layer>

        <Layer
          type="symbol"
          id="marker-3"
          layout={{ "icon-image": "marker-15" }}>
          <Feature coordinates={[-118.493619,34.015078]}/>
        </Layer> */}

        </ReactMapboxGl>
      </div>
    )
  }

}


export default TheMap
