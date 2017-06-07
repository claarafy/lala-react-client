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
      locationId: "",
      parkings: [],
      parkingId: ""
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
  _showPopup(parking) {
    this.setState({
      parkingId: parking._id
    })
    // console.log("clicked mark's parkingId", this.state.parkingId)
  }
  _getLocation(locationInfo) {
    // console.log("getting location infromation", locationInfo)
  }
/////////////////////////////////////////////////RENDER
  render() {
    console.log("this location's parkings are:", this.state.parkings)
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
          linePaint={{ "line-color": lineColor, "line-width": 3 }}>
          </GeoJSONLayer>
      )
    })
    const streetMarks = this.state.parkings.map((parking,i) => {
      var start = parking.startCoordinates
      return(
        <Layer
          type="symbol"
          key={i}
          id ={parking._id}
          layout={{ "icon-image": "marker-15" }}>
          <Feature
            coordinates={start}
            onClick={this._showPopup.bind(this, parking)}/>
        </Layer>
      )
    })

    const parkingPopups = this.state.parkings.map((parking,i) => {
      var start = parking.startCoordinates
      if (this.state.parkingId === parking._id) {
      return (
        <Popup
          key={i}
          id={parking._id}
          coordinates={start}
          offset={{
            'bottom-left': [12, -38],  'bottom': [0, -38], 'bottom-right': [-12, -38]
          }}>
          <p style={{fontSize:"5px"}}>{parking._id}<br/>{parking.streetName}</p>
        </Popup>
        )
      }
    })
    // console.log("Parking popups are", parkingPopups)
/////////////////////////////////////RENDER'S RETURN
    return (
      <div id="map">
        <ReactMapboxGl
          style="mapbox://styles/mapbox/light-v9"
          accessToken="pk.eyJ1IjoiY2xhYXJhZnkiLCJhIjoiY2ozZ2RjZHo1MDA0bjMzanl3eTdrbTV6bSJ9.gX0zPVpXPIFQYzrexV8XoA"
          containerStyle={{
            height: "70vh",
            width: "100vw"
          }}
          center={[-118.495196, 34.012806]}>
          {streetLines}
          {streetMarks}
          {parkingPopups}

          {/* GA Marker */}
           {/* <Layer
            type="symbol"
            id="marker"
            layout={{ "icon-image": "favicon.ico" }}>
            <Feature coordinates={[-118.495196, 34.012806]}/>
          </Layer> */}
        </ReactMapboxGl>

        <Location onSearchLocation={this._getLocation.bind(this)}/>
      </div>
    )
  }
}
class Location extends Component {
// /////////////////////////////////////////////////CONSTRUCTOR
  constructor(props) {
    super(props)
    this.state = {
      locations: [],
      locationId: ""
    }
  }
// /////////////////////////////////////////////////LIFECYCLE
  componenetDidMount() {

  }
/////////////////////////////////////////////////CUSTOM FUNCTIONS
  _searchLocation(evt){
    evt.preventDefault()

    const locationInfo = {
      name: this.refs.location.value
    }
    this.props.onSearchLocation(locationInfo)
  }
/////////////////////////////////////////////////RENDER
  render() {
    console.log("all the locations in db:", this.state.locations)
    return(
      <div id="location">
        <form id="location-form" onSubmit={this._searchLocation.bind(this)}>
          <input type="text" placeholder="Where to?" ref="location"/>
          <button type="submit">Search Location</button>
        </form>
      </div>
    )
  }
}

export default TheMap
