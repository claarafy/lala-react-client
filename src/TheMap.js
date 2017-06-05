//Map component
import React, {Component} from 'react'
import clientAuth from './clientAuth.js'
import mapboxgl from 'mapbox-gl'
import ReactMapboxGl, {Layer, Feature} from "react-mapbox-gl"

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

  }
/////////////////////////////////////////////////CUSTOM FUNCTIONS
  render() {
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
        </ReactMapboxGl>
      </div>
  )
  }
/////////////////////////////////////////////////RENDER

}


export default TheMap
