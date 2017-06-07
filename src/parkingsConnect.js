import axios from 'axios'
import jwt_decode from 'jwt-decode'
import clientAuth from './clientAuth'

axios.defaults.baseURL = 'http://localhost:3001'

const parkingsConnect = {
  getParkings: () => {
    return axios({
      url: '/api/parkings',
      method: 'get'
    })
  }
}


export default parkingsConnect
