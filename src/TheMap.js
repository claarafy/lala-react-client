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
      setCoordinates: [-118.495196, 34.012806], //Santa Monica
      locationId: null,
      parkings: [],
      parkingId: "",
      adminId: "5934ee473dbbf65bc674b457",
      currentUser: null,
      loggedIn: false,
      zoom: [0]
    }
  }
/////////////////////////////////////////////////LIFECYCLE
  componentDidMount() {
    // parkingsConnect.getParkings().then((res) => {
    //   this.setState({
    //     parkings: res.data
    //   })
    // })
  }
/////////////////////////////////////////////////CUSTOM FUNCTIONS
  _showPopup(parking) {
    this.setState({
      parkingId: parking._id
    })
  }

  _searchLocation(evt) {
    evt.preventDefault()
    const locationInfo = {
      name: this.refs.location.value,
      coordinates: []
    }
    console.log(locationInfo)

    parkingsConnect.addLocation(locationInfo).then((res)=> {
      console.log(res.data.location)
      this.setState({
        setCoordinates: res.data.location.coordinates,
        zoom: [13],
        locationId: res.data.location._id
      })
      parkingsConnect.getParkings(this.state.locationId).then((res) => {
        console.log("getting all parkings to this location", res.data.parkings)
        this.setState({
          parkings: res.data.parkings
        })
      })
    })
  }
/////////////////////////////////////////////////RENDER
  render() {
    // console.log("this location's parkings are:", this.state.parkings)
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
          <div className="parking-popups">
            <p style={{fontSize:"5px"}}>{parking._id}<br/>{parking.streetName}</p>
          </div>
        </Popup>
        )
      }
    })
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
          center={this.state.setCoordinates}
          zoom={this.state.zoom}>
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

        <div id="location">
          <form id="location-form" onSubmit={this._searchLocation.bind(this)}>
            <input type="text" placeholder="Where to?" ref="location"/>
            <button type="submit">Search Location</button>
          </form>
        </div>
      </div>
    )
  }
}


export default TheMap
