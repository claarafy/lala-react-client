import axios from 'axios'
import jwt_decode from 'jwt-decode'
import clientAuth from './clientAuth'


axios.defaults.baseURL = 'http://localhost:3001'

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
  getParkings: (locationId) => {
    console.log("get Parkings reached with location id", locationId)
    return axios({
      url: `/api/locations/${locationId}`,
      method: 'get'
    })
  },
  deleteParking: (locationId, parkingId) => {
    console.log("location id received:",locationId, "parking id received", parkingId)
    return axios({
      url:`/api/locations/${locationId}/parkings/${parkingId}`,
      method: 'delete'
    })
  }
}


export default parkingsConnect
