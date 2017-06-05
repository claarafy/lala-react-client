//Map component
import React, {Component} from 'react'
import mapboxgl from 'mapbox-gl'
import ReactMapboxGl, {Layer, Feature, GeoJSONLayer} from "react-mapbox-gl"
import clientAuth from './clientAuth.js'
import parkingsConnect from './parkingsConnect.js'

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
/////////////////////////////////////////////////RENDER
  render() {
    console.log(this.state.parkings)

    const parkings = this.state.parkings.map((parking, i) => {
      return (
        <GeoJSONLayer
          key = {i}
          type = "line"
          source = {{
            "type": "geojson",
            data: {
              "type": "Feature",
              "geometry": {
                "type": "line",
                "coordinates": [
                  [34.013565, -118.495505],
                  [34.015107, -118.493584]
                ]
              }
            }
          }}
          layout= {{
            'line-join': 'round',
            'line-cap': 'round'
          }}
          paint ={{
            'line-color': '#FFFFFF',
            'line-width': 10
          }}>
        </GeoJSONLayer>
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
          center={[-118.482,34.026]}
          >

        <Layer
          type="symbol"
          id="marker"
          layout={{ "icon-image": "marker-15" }}>
          <Feature coordinates={[-118.482,34.026]}/>
        </Layer>
        {parkings}
        </ReactMapboxGl>
      </div>
  )
  }


}


export default TheMap
