//for User auth
import axios from 'axios'
import jwt_decode from 'jwt-decode'

axios.defaults.baseURL = 'http://localhost:3001'

const clientAuth = {
  signup: (userInfo) => {
    return axios({ //returns a promise, later you can do something like clientAuth.signup.then()
      url: '/api/users',
      method:'post',
      data: userInfo
    })
    .then((res) => {
      console.log(res)
    })
  },

  login: (credentials) => {
    return axios({
      url: '/api/users/login',
      method: 'post',
      data: credentials
    })
    .then((res) => { //only runs when you log in
      console.log(res)
      //set the token
      if(res.data.token) { //from the response object
        localStorage.setItem('token', res.data.token)
        axios.defaults.headers.common['x-access-token'] = localStorage.getItem('token') //apply to all requests with the token included (needed because some of the routes are authorized)
        console.log("Decoded token", jwt_decode(res.data.token))
        return jwt_decode(res.data.token) //decode the token
      } else {
        return false
      }
    })
  },

  getCurrentUser: () => {
    const token = localStorage.getItem('token')
    return token ? jwt_decode(token) : null //if there is a user give me the decoded user
  },

  logout: () => {
    return new Promise((resolve) => {
      localStorage.clear()
      delete axios.defaults.headers.common['x-access-token']
      resolve("bye!")
    })
  }
}


export default clientAuth
