import axios from 'axios'
import jwt_decode from 'jwt-decode'
import clientAuth from './clientAuth'


axios.defaults.baseURL = 'https://floating-sands-94866.herokuapp.com'


const parkingsConnect = {
  getLocations: () => {
    return axios({
      url:'/api/locations',
      method: 'get'
    })
  },

  addLocation: (locationInfo) => {
    console.log(locationInfo)
    return axios({
      url: '/api/locations',
      method: 'post',
      data: locationInfo
    })
  },

  addParking: (locationId, newParkingInfo) => {
    console.log("location id is", locationId, "new parking", newParkingInfo)
    return axios({
      url: `/api/locations/${locationId}/parkings`,
      method: 'post',
      data: newParkingInfo
    })
  },

  getParkings: (locationId) => {
    console.log("get Parkings reached with location id", locationId)
    return axios({
      url: `/api/locations/${locationId}`,
      method: 'get'
    })
  },

  deleteParking: (locationId, parkingId) => {
    console.log("deleting => location id received:",locationId, "parking id received", parkingId)
    return axios({
      url:`/api/locations/${locationId}/parkings/${parkingId}`,
      method: 'delete'
    })
  },

  editParking: (locationId, parkingId, editParkingInfo) => {
    console.log("editing => location id received:",locationId, "parking id received", parkingId, "new parking info:", editParkingInfo)
    return axios({
      url: `/api/locations/${locationId}/parkings/${parkingId}`,
      method: 'patch',
      data: editParkingInfo
    })
  }
}


export default parkingsConnect
