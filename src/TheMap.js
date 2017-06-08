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
      zoom: [0],
      editing: "",
      view: 'hidden',

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

  _deleteParking(parkingId) {
    console.log("I'm gonna delete this parking sign in location", this.state.locationId, "parking id is",  parkingId)
    parkingsConnect.deleteParking(this.state.locationId, parkingId).then((res) => {
      this.setState({
        parkings: this.state.parkings.filter((parking) => {
          return parking._id !== parkingId
        })
      })
    })
  }
  _setEditing(parkingId){
    this.setState({
      editing: parkingId
    })
  }
  _editParking(evt){
    evt.preventDefault()
    console.log("edit parking reached")
    console.log("I'm going to edit this parking sing in location", this.state.locationId, "parking id is", this.state.editing)
    const editParkingInfo = {
      timeLimit: this.refs.timeLimit.value
    }
    parkingsConnect.editParking(this.state.locationId, this.state.editing, editParkingInfo).then((res) => {
      const parkingIndex = this.state.parkings.findIndex((parking) => {
        return parking._id === this.state.editing
      })
     this.setState({
       parkings: [
         ...this.state.parkings.slice(0, parkingIndex),
         res.data.parking,
         ...this.state.parkings.slice(parkingIndex + 1)
       ]
     })
    })
  }
/////////////////////////////////////////////////RENDER
  render() {
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
            <p style={{fontSize:"5px"}} id="parking-info">{parking.streetName}<br/>Park for {parking.timeLimit} hours</p>
            <button onClick={this._setEditing.bind(this, parking._id)}>Edit</button>
            {this.state.editing && (
              <form  className="edit-parking">
                Time Limit: <input type="number" placeholder="How long can you park here now?" ref="timeLimit"/>
                <button onClick={this._editParking.bind(this)}>Update</button>
              </form>
              )}
            <button onClick={this._deleteParking.bind(this, parking._id)}>Delete</button>
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
