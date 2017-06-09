//Map component
import React, {Component} from 'react'
import mapboxgl from 'mapbox-gl'
import './App.css'
import ReactMapboxGl, {Source, Layer, Feature, GeoJSONLayer, Popup, Marker} from "react-mapbox-gl"
import clientAuth from './clientAuth.js'
import parkingsConnect from './parkingsConnect.js'

class TheMap extends Component {
/////////////////////////////////////////////////CONSTRUCTOR
  constructor() {
    super()
    this.state = {
      setCoordinates: [-118.495196, 34.012806], //Santa Monica
      locations: [],
      locationId: null,
      parkings: [],
      parkingId: "",
      adminId: "5939c72d2e357d000445ad0b",
      currentUser: null,
      loggedIn: false,
      zoom: [0],
      editing: "",
      view: 'hidden',



      timeAvailableFrom: "am",
      timeAvailableTo: "pm",
      meterParking: "true",
      noParking: "true",
      cleaningDaySelect: "Monday",
      cleaningFrom: "am",
      cleaningTo: "am"
    }
  }
/////////////////////////////////////////////////LIFECYCLE
  componentDidMount() {
    parkingsConnect.getLocations().then((res) => {
      this.setState({
        locations: res.data
      })
    })
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
  _addParking(evt) {
    evt.preventDefault()
    console.log(evt)
    var meterParking
    var noParking
    if (this.state.meterParking === "true") {
      meterParking = true
    } else {
      meterParking = false
    }
    if (this.state.noParking === "true") {
      noParking = true
    } else {
      noParking = false
    }
    const newParking = {
      streetName: this.refs.streetName.value,
      startCoordinates: [this.refs.startCoordLng.value, this.refs.startCoordLat.value],
      endCoordinates: [this.refs.endCoordLng.value, this.refs.endCoordLat.value],
      timeLimit: this.refs.timeLimit.value,
      availableTimeStart: this.refs.availableTimeStart.value,
      availableTimeEnd: this.refs.availableTimeEnd.value,
      meterParking: meterParking,
      streetCleaningDay: this.state.cleaningDaySelect,
      streetCleaningTimeStart: this.refs.streetCleaningTimeStart.value,
      streetCleaningTimeEnd: this.refs.streetCleaningTimeEnd.value,
      noParking: noParking
    }
    parkingsConnect.addParking(this.state.locationId, newParking).then((res)=> {
      console.log("response", res)
      this.setState({
        parkings: [
          ...this.state.parkings,
          res.data.location.parkings
        ]
      })
      console.log("after creating a new parking spot", this.state.parkings)
    })
  }

  _handleTimeAvailableFromChange(evt) {
    console.log("evt", evt.target.value)
    this.setState({
      timeAvailableFrom: evt.target.value
    }, () => {
      console.log("currentState",this.state.timeAvailableFrom)
    })
  }


  _handleTimeAvailableToChange(evt) {
    this.setState({
      timeAvailableTo: evt.target.value
    })
    console.log(this.state.timeAvailableTo)
  }
  _handleMeterChange(evt) {
    this.setState({
      meterParking: evt.target.value
    })
    console.log(this.state.meterParking)
  }
  _handleNoParkingChange(evt) {
    this.setState({
      noParking: evt.target.value
    })
    console.log(this.state.noParking)
  }
  _handleCleaningDayChange(evt) {
    this.setState({
      cleaningDaySelect: evt.target.value
    })
    console.log(this.state.cleaningDaySelect)
  }
  _handleCleaningFromChange(evt) {
    this.setState({
      cleaningFrom: evt.target.value
    })
    console.log(this.state.cleaningFrom)
  }
  _handleCleaningToChange(evt){
    this.setState({
      cleaningTo: evt.target.value
    })
    console.log(this.state.cleaningTo)
  }

/////////////////////////////////////////////////RENDER

  render() {
    console.log("there are this many parkings!", this.state.parkings)
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
    const currentLocation = this.state.locations.map((location) => {
      if(location._id === this.state.locationId) {
        return location.name
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


        <div id="new-parking">
          <form id="new-parking-form" onSubmit={this._addParking.bind(this)} noValidate>
            <p>Add New Parking:</p>
            <p>Location is: {currentLocation}</p>
            <input type="text" placeholder="Street Name" ref="streetName" />
            Start Coordinates:
            <input type="number" placeholder="Start longitude" ref="startCoordLng"/> <input type="number" placeholder="Start latitude" ref="startCoordLat"/>
            End Coordinates:
            <input type="number" placeholder="End Longitude" ref="endCoordLng"/> <input type="number" placeholder="End Latitude" ref="endCoordLat"/>
            Duration:
            <input type="number"  placeholder="How long can you park here?" ref="timeLimit"/>
            Time Availability:
            <input type="number" placeholder="From..." ref="availableTimeStart" />
              <div className="radio">
                <input type="radio" name="availiable-from" value="am"
                  checked={this.state.timeAvailableFrom === 'am'} onChange={this._handleTimeAvailableFromChange.bind(this)}/>A.M.
                <input type="radio" name="availiable-from" value="pm"
                  checked={this.state.timeAvailableFrom === 'pm'} onChange={this._handleTimeAvailableFromChange.bind(this)}/>P.M.
              </div>
            <input type="number" placeholder="To..." ref="availableTimeEnd" />
              <div className="radio">
                <input type="radio" name="availiable-to" value="am"
                checked={this.state.timeAvailableTo === 'am'} onChange={this._handleTimeAvailableToChange.bind(this)} />A.M.
                <input type="radio" name="availiable-to" value="pm"
                checked={this.state.timeAvailableTo === 'pm'} onChange={this._handleTimeAvailableToChange.bind(this)} />P.M. <br/>
              </div>
            Meter Parking: <br/>
              <div className="radio">
                <input type="radio" name="meter-parking" value="true"
                  checked={this.state.meterParking === "true"} onChange={this._handleMeterChange.bind(this)} />Available
                <input type="radio" name="meter-parking" value="false"
                  checked={this.state.meterParking === "false"} onChange={this._handleMeterChange.bind(this)} />Not Available <br/>
              </div>
            No Parking Anytime: <br/>
              <div className="radio">
                <input type="radio" name="no-parking" value="true"
                checked={this.state.noParking === "true"} onChange ={this._handleNoParkingChange.bind(this)}/>True
                <input type="radio" name="no-parking" value="false"
                checked={this.state.noParking === "false"} onChange={this._handleNoParkingChange.bind(this)}/>False <br/>
              </div>
            Street Cleaning:
            <select value={this.state.cleaningDaySelect} onChange={this._handleCleaningDayChange.bind(this)}>
              <option value="Monday">Monday</option>
              <option value="Tuesday">Tuesday</option>
              <option value="Wednesday">Wednesday</option>
              <option value="Thursday">Thursday</option>
              <option value="Friday">Friday</option>
              <option value="Saturday">Saturday</option>
              <option value="Sunday">Sunday</option>
            </select>
            <input type="number" placeholder="From..." ref="streetCleaningTimeStart" />
              <div className="radio">
                <input type="radio" name="cleaning-from" value="am"
                checked={this.state.cleaningFrom === "am"} onChange={this._handleCleaningFromChange.bind(this)}/>A.M.
                <input type="radio" name="cleaning-from" value="pm"
                checked={this.state.cleaningFrom === "pm"} onChange={this._handleCleaningFromChange.bind(this)}/>P.M.<br/>
              </div>
            <input type="number" placeholder="To..." ref="streetCleaningTimeEnd" />
              <div className="radio">
                <input type="radio" name="cleaning-to" value="am"
                checked={this.state.cleaningTo === "am"} onChange={this._handleCleaningToChange.bind(this)}/>A.M.
                <input type="radio" name="cleaning-to" value="pm"
                checked={this.state.cleaningTo === "pm"} onChange={this._handleCleaningToChange.bind(this)}/>P.M. <br/>
              </div>
            <button type="submit">Add New Parking</button>
          </form>
        </div>
      </div>

    )
  }
}


export default TheMap
