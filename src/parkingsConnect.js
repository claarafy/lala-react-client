import axios from 'axios'
// import jwt_decode from 'jwt-decode'

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
